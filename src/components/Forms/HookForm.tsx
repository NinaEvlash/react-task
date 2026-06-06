import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addSubmission } from '../../store/formsSlice';
import { fileToBase64 } from '../../utils/fileToBase64';
import { formSchema } from '../../validation/formSchema';

type FormValues = yup.InferType<typeof formSchema>;

type Props = {
  onClose: () => void;
};

export const HookForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema) as Resolver<FormValues, unknown, FormValues>,
  });

  const file = watch('image');

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const file = data.image?.[0];

    if (!file) return;

    const imageBase64 = await fileToBase64(file);

    dispatch(
      addSubmission({
        id: crypto.randomUUID(),
        type: 'rhf',
        name: data.name,
        email: data.email,
        age: data.age,
        gender: data.gender as 'male' | 'female' | 'other',
        terms: data.terms,
        image: imageBase64,
      }),
    );

    onClose();
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name" className="label">
        Name
      </label>
      <input id="name" className="input" {...register('name')} />
      <p className="error">{errors.name?.message}</p>

      <label htmlFor="email" className="label">
        Email
      </label>
      <input id="email" className="input" {...register('email')} />
      <p className="error">{errors.email?.message}</p>

      <label htmlFor="age" className="label">
        Age
      </label>
      <input
        className="input"
        type="number"
        {...register('age', {
          valueAsNumber: true,
        })}
      />
      <p className="error">{errors.age?.message}</p>

      <label htmlFor="gender" className="label">
        Gender
      </label>
      <select id="gender" className="input" {...register('gender')}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="terms" className="label">
        <input id="terms" type="checkbox" {...register('terms')} />I agree to the terms and
        conditions
      </label>
      <p className="error">{errors.terms?.message}</p>

      <label htmlFor="image" className="file-label">
        Upload photo
      </label>

      <input
        className="file-input"
        id="image"
        type="file"
        accept=".png,.jpg,.jpeg"
        {...register('image')}
      />

      <p>{file?.[0]?.name || 'No file selected'}</p>
      <p className="error">{errors.image?.message}</p>

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
