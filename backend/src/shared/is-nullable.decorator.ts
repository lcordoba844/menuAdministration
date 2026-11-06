import { IsDefined, ValidateIf, ValidationOptions } from 'class-validator';

/**
 * Allows null values.
 */
export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyKey): void => {
    ValidateIf(
      (_object: unknown, value: unknown): boolean => value !== null,
      options,
    )(target, propertyKey);
    IsDefined(options)(target, propertyKey);
  };
}
