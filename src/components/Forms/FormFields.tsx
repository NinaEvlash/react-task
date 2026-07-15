import { Controller } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

import type { FormValues } from './HookForm';
import { CountryAutocomplete } from '../Autocomplete/Autocomplete';

type PasswordStrength = {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

type Props = {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;

  errors: FieldErrors<FormValues>;

  passwordStrength: PasswordStrength;

  countryList: string[];

  selectedFileName: string;
};

export const FormFields = ({
  register,
  control,
  errors,
  passwordStrength,
  countryList,
  selectedFileName,
}: Props) => {
  return (
    <div className="form-section">
      <div className="form-field">
        <label htmlFor="name" className="label">
          Name
        </label>

        <input id="name" className="input" {...register('name')} />

        <p className="error">{errors.name?.message}</p>
      </div>

      <div className="form-field">
        <label htmlFor="email" className="label">
          Email
        </label>

        <input id="email" className="input" {...register('email')} />

        <p className="error">{errors.email?.message}</p>
      </div>

      <div className="form-field">
        <label htmlFor="age" className="label">
          Age
        </label>

        <input
          id="age"
          className="input"
          type="number"
          {...register('age', {
            valueAsNumber: true,
          })}
        />

        <p className="error">{errors.age?.message}</p>
      </div>

      <div className="form-field">
        <label htmlFor="gender" className="label">
          Gender
        </label>

        <select id="gender" className="input" {...register('gender')}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <p className="error">{errors.gender?.message}</p>
      </div>

      <div className="form-field">
        <label htmlFor="terms" className="label">
          <input id="terms" type="checkbox" {...register('terms')} />I agree to the terms and
          conditions
        </label>

        <p className="error">{errors.terms?.message}</p>
      </div>

      <div className="form-field">
        <div className="file-row">
          <label htmlFor="image" className="file-label">
            Upload photo
          </label>

          <input
            id="image"
            type="file"
            accept=".png,.jpg,.jpeg"
            className="file-input"
            {...register('image')}
          />

          <p className="selected-file">{selectedFileName || 'No file selected'}</p>
        </div>

        <p className="error">{errors.image?.message}</p>
      </div>

      <div className="form-field">
        <label htmlFor="password" className="label">
          Password
        </label>

        <input id="password" type="password" className="input" {...register('password')} />

        <ul className="password-strength">
          <li className={passwordStrength.hasUppercase ? 'valid' : 'invalid'}>Uppercase letter</li>

          <li className={passwordStrength.hasLowercase ? 'valid' : 'invalid'}>Lowercase letter</li>

          <li className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>Number</li>

          <li className={passwordStrength.hasSpecial ? 'valid' : 'invalid'}>Special character</li>
        </ul>

        <p className="error">{errors.password?.message}</p>
      </div>

      <div className="form-field">
        <label htmlFor="confirmPassword" className="label">
          Confirm password
        </label>

        <input
          id="confirmPassword"
          type="password"
          className="input"
          {...register('confirmPassword')}
        />

        <p className="error">{errors.confirmPassword?.message}</p>
      </div>

      <div className="form-field">
        <label htmlFor="country" className="label">
          Country
        </label>

        <Controller
          name="country"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <CountryAutocomplete
              countries={countryList}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <p className="error">{errors.country?.message}</p>
      </div>
    </div>
  );
};
