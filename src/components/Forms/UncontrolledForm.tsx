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
      age: formData.get('age') ? Number(formData.get('age')) : 0,
      gender: formData.get('gender') as 'male' | 'female' | 'other',
      terms: formData.get('terms') !== null,
    };

    dispatch(addSubmission(data));
    onClose();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="name" className="label">
        Name
      </label>
      <input id="name" className="input" name="name" />

      <label htmlFor="email" className="label">
        Email
      </label>
      <input id="email" className="input" name="email" />

      <label htmlFor="age" className="label">
        Age
      </label>
      <input id="age" className="input" name="age" type="number" />

      <label htmlFor="gender" className="label">
        Gender
      </label>
      <select id="gender" className="input" name="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <label htmlFor="terms" className="label">
        <input id="terms" type="checkbox" name="terms" />I agree to the terms and conditions
      </label>

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
