import * as yup from 'yup';

export const formSchema = yup.object({
  name: yup.string().required('Name is required'),

  age: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .typeError('Age must be a number')
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be an integer'),

  email: yup.string().email('Invalid email').required('Email is required'),

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
});
