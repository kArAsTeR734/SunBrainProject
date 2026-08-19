import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ['./src/**'],
    rules: {
      'fsd/forbidden-imports': 'off',
      // `pluralize` treats the uncountable word "Homework" as plural and
      // suggests renaming it to the identical singular name.
      'fsd/inconsistent-naming': 'off',
      // A slice with one current consumer can still be a meaningful,
      // independently evolving business unit.
      'fsd/insignificant-slice': 'warn',
    },
  },
  {
    files: ['./src/shared/**'],
    rules: {
      'fsd/public-api': 'off',
    },
  },
  {
    files: ['./src/app/store/**'],
    rules: {
      // `store` is the intentional Redux composition root of the app layer.
      'fsd/segments-by-purpose': 'off',
    },
  },
]);
