import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSubmission } from '../../store/formsSlice';
import type { Submission } from '../../store/formsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import './Form.css';
import { fileToBase64 } from '../../utils/fileToBase64';
import { validateImage } from '../../utils/validateImage';
import { CountryAutocomplete } from '../Autocomplete/Autocomplete';

type Props = {
  onClose: () => void;
};

export const UncontrolledForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const [country, setCountry] = useState('');
  const countryList = useSelector((state: RootState) => state.countries.countries);

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
      password: formData.get('password') as string,
      country: formData.get('country') as string,
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
      <div className="form-section">
        <div className="form-field">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input id="name" className="input" name="name" />
        </div>

        <div className="form-field">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" className="input" name="email" />
        </div>

        <div className="form-field">
          <label htmlFor="age" className="label">
            Age
          </label>
          <input id="age" className="input" name="age" type="number" />
        </div>

        <div className="form-field">
          <label htmlFor="gender" className="label">
            Gender
          </label>
          <select id="gender" className="input" name="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="terms" className="label">
            <input id="terms" type="checkbox" name="terms" />I agree to the terms and conditions
          </label>
        </div>

        <div className="form-field">
          <div className="file-row">
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
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="password" className="label">
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
          />

          <ul className="password-strength">
            <li className={hasUppercase ? 'valid' : 'invalid'}>Uppercase letter</li>

            <li className={hasLowercase ? 'valid' : 'invalid'}>Lowercase letter</li>

            <li className={hasNumber ? 'valid' : 'invalid'}>Number</li>

            <li className={hasSpecial ? 'valid' : 'invalid'}>Special character</li>
          </ul>
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword" className="label">
            Confirm password
          </label>

          <input id="confirmPassword" name="confirmPassword" type="password" className="input" />
        </div>

        <div className="form-field">
          <label htmlFor="country" className="label">
            Country
          </label>
          <CountryAutocomplete countries={countryList} value={country} onChange={setCountry} />

          <input type="hidden" name="country" value={country} />
        </div>
      </div>

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
