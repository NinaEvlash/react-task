import { CountryAutocomplete } from '../Autocomplete/Autocomplete';

type PasswordStrength = {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

type Props = {
  errors: Record<string, string>;

  fileName: string;

  passwordStrength: PasswordStrength;

  countryList: string[];

  country: string;

  onCountryChange: (value: string) => void;

  onPasswordChange: (value: string) => void;

  onFileChange: (value: string) => void;
};

export const UncontrolledFields = ({
  errors,
  fileName,
  passwordStrength,
  countryList,
  country,
  onCountryChange,
  onPasswordChange,
  onFileChange,
}: Props) => {
  return (
    <div className="form-section">
      <div className="form-field">
        <label htmlFor="name" className="label">
          Name
        </label>

        <input id="name" className="input" name="name" />

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
            onChange={(event) => {
              onFileChange(event.target.files?.[0]?.name ?? '');
            }}
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
          onChange={(event) => {
            onPasswordChange(event.target.value);
          }}
        />

        <ul className="password-strength">
          <li className={passwordStrength.hasUppercase ? 'valid' : 'invalid'}>Uppercase letter</li>

          <li className={passwordStrength.hasLowercase ? 'valid' : 'invalid'}>Lowercase letter</li>

          <li className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>Number</li>

          <li className={passwordStrength.hasSpecial ? 'valid' : 'invalid'}>Special character</li>
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

        <CountryAutocomplete countries={countryList} value={country} onChange={onCountryChange} />

        <input type="hidden" name="country" value={country} />

        <p className="error">{errors.country}</p>
      </div>
    </div>
  );
};
