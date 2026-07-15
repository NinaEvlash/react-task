import { useState, useRef, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ValidationError } from 'yup';

import { addSubmission } from '../../store/formsSlice';
import type { Submission } from '../../store/formsSlice';
import type { RootState } from '../../store/store';

import './Form.css';

import { fileToBase64 } from '../../utils/fileToBase64';
import { formSchema } from '../../validation/formSchema';
import { getPasswordStrength } from '../../utils/getPasswordStrength';

import { UncontrolledFields } from './UncontrolledFields';

type Props = {
  onClose: () => void;
};

type FormValues = {
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  image: File;
};

const getStringValue = (value: FormDataEntryValue | null): string => {
  return typeof value === 'string' ? value : '';
};

export const UncontrolledForm = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  const firstInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [fileName, setFileName] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const countryList = useSelector((state: RootState) => state.countries.countries);

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const getFormValues = (formData: FormData): FormValues => {
    const image = formData.get('image');
    const gender = formData.get('gender');

    return {
      name: getStringValue(formData.get('name')),
      email: getStringValue(formData.get('email')),
      age: Number(formData.get('age') ?? 0),
      gender: gender === 'male' || gender === 'female' || gender === 'other' ? gender : 'other',
      terms: formData.get('terms') !== null,
      password,
      confirmPassword: getStringValue(formData.get('confirmPassword')),
      country,
      image: image instanceof File ? image : new File([], ''),
    };
  };

  const validateForm = async (values: FormValues) => {
    try {
      await formSchema.validate(values, {
        abortEarly: false,
      });

      setErrors({});

      return true;
    } catch (error) {
      if (error instanceof ValidationError) {
        const validationErrors: Record<string, string> = {};

        error.inner.forEach((validationError) => {
          if (validationError.path && !validationErrors[validationError.path]) {
            validationErrors[validationError.path] = validationError.message;
          }
        });

        setErrors(validationErrors);
      }

      return false;
    }
  };

  const saveSubmission = async (values: FormValues) => {
    const imageBase64 = await fileToBase64(values.image);

    const data: Submission = {
      id: crypto.randomUUID(),
      type: 'uncontrolled',
      name: values.name,
      email: values.email,
      age: values.age,
      gender: values.gender,
      terms: values.terms,
      image: imageBase64,
      password: values.password,
      confirmPassword: values.confirmPassword,
      country: values.country,
    };

    dispatch(addSubmission(data));
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;

    if (!(formElement instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(formElement);
    const values = getFormValues(formData);

    const isValid = await validateForm(values);

    if (!isValid) {
      return;
    }

    if (!(values.image instanceof File) || values.image.size === 0) {
      setErrors((previous) => ({
        ...previous,
        image: 'Image is required',
      }));

      return;
    }

    await saveSubmission(values);

    formElement.reset();

    setFileName('');
    setPassword('');
    setCountry('');

    onClose();
  };

  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    void handleSubmit(event);
  };

  return (
    <form ref={formRef} className="form" onSubmit={handleFormSubmit}>
      <UncontrolledFields
        errors={errors}
        fileName={fileName}
        passwordStrength={passwordStrength}
        countryList={countryList}
        country={country}
        onCountryChange={setCountry}
        onPasswordChange={setPassword}
        onFileChange={setFileName}
      />

      <button className="button" type="submit">
        Submit
      </button>
    </form>
  );
};
