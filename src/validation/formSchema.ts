import * as yup from 'yup';

export const formSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .test('first-letter-uppercase', 'Name must start with a capital letter', (value) => {
      if (!value) return true;

      return value[0] === value[0].toUpperCase();
    }),

  age: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
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
      if (!value) return false;

      const parts = value.split('@');

      if (parts.length !== 2) return false;

      const [local, domain] = parts;

      if (!local) return false;

      if (!domain.includes('.')) return false;

      return true;
    }),

  gender: yup.string().required('Select gender'),

  terms: yup.boolean().oneOf([true], 'You must accept terms').required(),

  image: yup
    .mixed<FileList>()
    .test('required', 'Image is required', (files) => {
      return !!files?.length;
    })
    .test('fileType', 'Only PNG/JPEG', (files) => {
      const file = files?.[0];
      if (!file) return true;

      return ['image/png', 'image/jpeg'].includes(file.type);
    })
    .test('fileSize', 'Max 2MB', (files) => {
      const file = files?.[0];
      if (!file) return true;

      return file.size <= 2 * 1024 * 1024;
    }),
  password: yup.string().required('Password is required'),

  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});
