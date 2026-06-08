import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ValidationError } from 'yup';
import { addSubmission } from '../../store/formsSlice';
import type { Submission } from '../../store/formsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import './Form.css';
import { fileToBase64 } from '../../utils/fileToBase64';
import { CountryAutocomplete } from '../Autocomplete/Autocomplete';
import { formSchema } from '../../validation/formSchema';

type Props = {
  onClose: () => void;
};

export const UncontrolledForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();
  const firstInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const formRef = useRef<HTMLFormElement>(null);

  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const [country, setCountry] = useState('');
  const countryList = useSelector((state: RootState) => state.countries.countries);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const values = {
      name: formData.get('name'),
      email: formData.get('email'),
      age: Number(formData.get('age')),
      gender: formData.get('gender'),
      terms: formData.get('terms') !== null,
      password,
      confirmPassword: formData.get('confirmPassword'),
      country,
      image: formData.get('image'),
    };

    try {
      await formSchema.validate(values, { abortEarly: false });
      setErrors({});
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationErrors: Record<string, string> = {};

        error.inner.forEach((err) => {
          if (err.path && !validationErrors[err.path]) {
            validationErrors[err.path] = err.message;
          }
        });

        setErrors(validationErrors);
        return;
      }
    }

    const file = formData.get('image');

    if (!(file instanceof File)) {
      setErrors((prev) => ({
        ...prev,
        image: 'Image is required',
      }));
      return;
    }

    const imageBase64 = await fileToBase64(file);

    const data: Submission = {
      id: crypto.randomUUID(),
      type: 'uncontrolled',
      name: values.name as string,
      email: values.email as string,
      age: Number(values.age),
      gender: values.gender as 'male' | 'female' | 'other',
      terms: values.terms as boolean,
      image: imageBase64,
      password,
      confirmPassword: values.confirmPassword as string,
      country,
    };

    dispatch(addSubmission(data));

    formRef.current?.reset();
    setFileName('');
    setPassword('');
    setCountry('');

    onClose();
  };

  return (
    <form ref={formRef} className="form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-field">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input id="name" className="input" name="name" ref={firstInputRef} />
          <p className="error">{errors.name}</p>
        </div>

        <div className="form-field">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input id="email" className="input" name="email" />
          <p className="error">{errors.email}</p>
        </div>

        <div className="form-field">
          <label htmlFor="age" className="label">
            Age
          </label>
          <input id="age" className="input" name="age" type="number" />
          <p className="error">{errors.age}</p>
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
          <p className="error">{errors.gender}</p>
        </div>

        <div className="form-field">
          <label htmlFor="terms" className="label">
            <input id="terms" type="checkbox" name="terms" />I agree to the terms and conditions
          </label>
          <p className="error">{errors.terms}</p>
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
          <p className="error">{errors.image}</p>
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
          <p className="error">{errors.password}</p>
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword" className="label">
            Confirm password
          </label>

          <input id="confirmPassword" name="confirmPassword" type="password" className="input" />
          <p className="error">{errors.confirmPassword}</p>
        </div>

        <div className="form-field">
          <label htmlFor="country" className="label">
            Country
          </label>
          <CountryAutocomplete countries={countryList} value={country} onChange={setCountry} />

          <input type="hidden" name="country" value={country} />
          <p className="error">{errors.country}</p>
        </div>
      </div>

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
