import { JSONSchema } from 'class-validator-jsonschema';
import { getMetadataSchema } from 'class-validator-jsonschema/build/decorators';
import { SchemaObject } from 'openapi3-ts';

interface Presence {
  nullable?: boolean;
  omittable?: boolean;
}

const rules = new WeakMap<object, Map<string, Presence>>();

/** Registers schema rules applied after the library converts validation metadata. */
export function registerPresenceSchema(
  target: object,
  propertyKey: string | symbol,
  allowance: keyof Presence,
): void {
  if (typeof propertyKey !== 'string') {
    return;
  }

  let properties = rules.get(target);
  if (!properties) {
    properties = new Map();
    rules.set(target, properties);

    const existing = getMetadataSchema(target, target.constructor.name);
    JSONSchema((generated, options) => {
      const schema =
        typeof existing === 'function'
          ? existing(generated, options)
          : { ...generated, ...existing };
      if ('$ref' in schema) {
        return schema;
      }

      const required = new Set(schema.required ?? []);
      for (const [name, presence] of rules.get(target) ?? []) {
        const original = schema.properties?.[name];
        if (!original) {
          continue;
        }
        const property = { ...original } as SchemaObject & { $ref?: string };
        property.nullable = presence.nullable === true;

        if (
          property.not &&
          !('$ref' in property.not) &&
          property.not.type === 'null' &&
          Object.keys(property.not).length === 1
        ) {
          if (presence.nullable) {
            delete property.not;
          } else {
            property.not = { enum: [null] };
          }
        }
        if (
          presence.nullable &&
          property.enum &&
          !property.enum.includes(null)
        ) {
          property.enum = [...(property.enum as unknown[]), null];
        }

        if ('$ref' in original) {
          const reference = { $ref: original.$ref };
          delete property.$ref;
          if (presence.nullable) {
            property.anyOf = [reference, { nullable: true, enum: [null] }];
          } else {
            property.allOf = [...(property.allOf ?? []), reference];
          }
        }

        if (presence.omittable) {
          required.delete(name);
        } else {
          required.add(name);
        }
        // The property exists above; preserve all other generated properties.
        schema.properties = { ...schema.properties, [name]: property };
      }

      if (required.size > 0) {
        schema.required = [...required];
      } else {
        delete schema.required;
      }
      return schema;
    })(target.constructor);
  }

  properties.set(propertyKey, {
    ...properties.get(propertyKey),
    [allowance]: true,
  });
}
