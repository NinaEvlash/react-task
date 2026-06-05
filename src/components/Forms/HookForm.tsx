import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { addSubmission } from '../../store/formsSlice';

type FormValues = {
  name: string;
  email: string;
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
      <label className="label">Name</label>
      <input className="input" {...register('name')} />
      <p className="error">{errors.name?.message}</p>

      <label className="label">Email</label>
      <input className="input" {...register('email')} />
      <p className="error">{errors.email?.message}</p>

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
