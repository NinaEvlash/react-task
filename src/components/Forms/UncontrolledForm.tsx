import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSubmission } from '../../store/formsSlice';
import type { Submission } from '../../store/formsSlice';
import './Form.css';
import { fileToBase64 } from '../../utils/fileToBase64';
import { validateImage } from '../../utils/validateImage';

type Props = {
  onClose: () => void;
};

export const UncontrolledForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  const [fileName, setFileName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const file = formData.get('image');

    if (!(file instanceof File) || file.size === 0) {
      alert('Please select an image');
      return;
    }

    const error = validateImage(file);

    if (error) {
      alert(error);
      return;
    }

    const imageBase64 = await fileToBase64(file);

    const data: Submission = {
      id: crypto.randomUUID(),
      type: 'uncontrolled',
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      age: formData.get('age') ? Number(formData.get('age')) : 0,
      gender: formData.get('gender') as 'male' | 'female' | 'other',
      terms: formData.get('terms') !== null,
      image: '',
    };

    dispatch(
      addSubmission({
        ...data,
        image: imageBase64,
      }),
    );
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

      <label htmlFor="image" className="file-label">
        Upload photo
      </label>
      <input
        id="image"
        name="image"
        type="file"
        accept=".png,.jpg,.jpeg"
        className="file-input"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
      />

      <p className="selected-file">{fileName || 'No file selected'}</p>

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
