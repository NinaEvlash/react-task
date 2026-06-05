import { useDispatch } from 'react-redux';
import { addSubmission } from '../../store/formsSlice';
import type { FormData } from '../../store/formsSlice';
import './Form.css';

type Props = {
  onClose: () => void;
};

export const UncontrolledForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: FormData = {
      id: crypto.randomUUID(),
      type: 'uncontrolled',
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };

    dispatch(addSubmission(data));
    onClose();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="label">Name</label>
      <input className="input" name="name" />

      <label className="label">Email</label>
      <input className="input" name="email" />

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
