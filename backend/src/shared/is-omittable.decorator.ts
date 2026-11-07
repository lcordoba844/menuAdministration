import { IsDefined, ValidateIf, ValidationOptions } from 'class-validator';

import { registerPresenceSchema } from '@/shared/presence-schema';

/**
 * Allows undefined values.
 */
export function IsOmittable(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyKey): void => {
    ValidateIf(
      (_object: unknown, value: unknown): boolean => value !== undefined,
      options,
    )(target, propertyKey);
    IsDefined(options)(target, propertyKey);
    registerPresenceSchema(target, propertyKey, 'omittable');
  };
}
