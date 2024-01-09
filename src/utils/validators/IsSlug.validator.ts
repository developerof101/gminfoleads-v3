import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isSlug', async: false })
class IsSlugConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (typeof value !== 'string') {
      return false;
    }

    // Check if the string is all in lowercase
    if (value !== value.toLowerCase()) {
      return false;
    }

    // Check if the string contains only hyphens as separators
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
      return false;
    }

    // Check if the string contains special characters like ñ or *
    if (/[ñ*]/.test(value)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid slug with lowercase letters and hyphens as separators, and no special characters like ñ or *.`;
  }
}

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSlugConstraint,
    });
  };
}
