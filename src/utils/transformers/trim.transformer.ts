import { Transform, TransformFnParams } from 'class-transformer';

export function Trim() {
  return Transform((params: TransformFnParams) => {
    if (typeof params.value === 'string') {
      return params.value.trim();
    }
    return params.value;
  });
}
