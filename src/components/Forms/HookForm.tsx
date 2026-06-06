import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addSubmission } from '../../store/formsSlice';

type FormValues = {
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
};

type Props = {
  onClose: () => void;
};

export const HookForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    dispatch(
      addSubmission({
        id: crypto.randomUUID(),
        type: 'rhf',
        ...data,
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
      <input id="age" className="input" type="number" {...register('age')} />
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

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
