import * as yup from 'yup';
import { countryList } from '../data/countries';

const genders = ['male', 'female', 'other'] as const;

const FILE_MAX_SIZE = 1024;

export const formSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .test('first-letter-uppercase', 'Name must start with a capital letter', (value) => {
      if (!value) {
        return true;
      }

      return value.startsWith(value[0].toUpperCase());
    }),

  age: yup
    .number()
    .transform((value: number, originalValue: unknown) => {
      if (originalValue === '') {
        return undefined;
      }

      return value;
    })
    .typeError('Age must be a number')
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer'),

  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .test('email-validation', 'Invalid email', (value) => {
      if (!value) {
        return false;
      }

      const parts = value.split('@');

      if (parts.length !== 2) {
        return false;
      }

      const [local, domain] = parts;

      if (!local) {
        return false;
      }

      if (!domain.includes('.')) {
        return false;
      }

      return true;
    }),

  gender: yup.mixed<(typeof genders)[number]>().oneOf(genders).required('Select gender'),

  terms: yup.boolean().oneOf([true], 'You must accept terms').required(),

  image: yup
    .mixed<File | FileList>()
    .required('Image is required')
    .test('required', 'Image is required', (value) => {
      const file = value instanceof FileList ? value[0] : value;

      return file instanceof File && file.name.trim() !== '';
    })
    .test('fileType', 'Only PNG/JPEG', (value) => {
      const file = value instanceof FileList ? value[0] : value;

      if (!(file instanceof File)) {
        return false;
      }

      return ['image/png', 'image/jpeg'].includes(file.type);
    })
    .test('fileSize', 'Max 2MB', (value) => {
      const file = value instanceof FileList ? value[0] : value;

      if (!(file instanceof File)) {
        return false;
      }

      return file.size <= 2 * FILE_MAX_SIZE * FILE_MAX_SIZE;
    }),

  password: yup.string().required('Password is required'),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  country: yup
    .string()
    .required('Country is required')
    .oneOf(countryList, 'Country must exist in the list'),
});
