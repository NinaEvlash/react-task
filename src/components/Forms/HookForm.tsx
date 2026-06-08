import * as yup from 'yup';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler, Resolver, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addSubmission } from '../../store/formsSlice';
import { fileToBase64 } from '../../utils/fileToBase64';
import { formSchema } from '../../validation/formSchema';
import { CountryAutocomplete } from '../Autocomplete/Autocomplete';

type FormValues = yup.InferType<typeof formSchema>;

type Props = {
  onClose: () => void;
};

export const HookForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  const countryList = useSelector((state: RootState) => state.countries.countries);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    setFocus,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema) as Resolver<FormValues, unknown, FormValues>,
    mode: 'onChange',
  });

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

  const watchImage = watch('image');

  const password = watch('password') || '';

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const fileValue = data.image;
    const file = fileValue instanceof FileList ? fileValue[0] : fileValue;

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
        password: data.password,
        confirmPassword: data.confirmPassword,
        country: data.country,
      }),
    );

    reset();
    onClose();
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
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
              className="file-input"
              id="image"
              type="file"
              accept=".png,.jpg,.jpeg"
              {...register('image')}
            />

            <p>
              {watchImage instanceof FileList
                ? watchImage?.[0]?.name
                : watchImage?.name || 'No file selected'}
            </p>
          </div>

          <p className="error">{errors.image?.message}</p>
        </div>

        <div className="form-field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input id="password" type="password" className="input" {...register('password')} />
          <ul className="password-strength">
            <li className={hasUppercase ? 'valid' : 'invalid'}>Uppercase letter</li>

            <li className={hasLowercase ? 'valid' : 'invalid'}>Lowercase letter</li>

            <li className={hasNumber ? 'valid' : 'invalid'}>Number</li>

            <li className={hasSpecial ? 'valid' : 'invalid'}>Special character</li>
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
              <>
                <CountryAutocomplete
                  countries={countryList}
                  value={field.value}
                  onChange={field.onChange}
                />
                <input type="hidden" name="country" value={field.value} readOnly />
              </>
            )}
          />

          <p className="error">{errors.country?.message}</p>
        </div>
      </div>

      <button className="button" type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};
