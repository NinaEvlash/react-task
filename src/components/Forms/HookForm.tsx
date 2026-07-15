import type * as yup from 'yup';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { SubmitHandler } from 'react-hook-form';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { addSubmission } from '../../store/formsSlice';
import { fileToBase64 } from '../../utils/fileToBase64';
import { formSchema } from '../../validation/formSchema';
import { getPasswordStrength } from '../../utils/getPasswordStrength';
import { FormFields } from './FormFields';

export type FormValues = yup.InferType<typeof formSchema>;

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
    formState: { errors, isValid },
    setFocus,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);

  const watchImage = useWatch({
    control,
    name: 'image',
  });

  const password = useWatch({
    control,
    name: 'password',
  });

  const passwordStrength = getPasswordStrength(password);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const fileValue = data.image;
    const file = fileValue instanceof FileList ? fileValue[0] : fileValue;

    const imageBase64 = await fileToBase64(file);

    dispatch(
      addSubmission({
        id: crypto.randomUUID(),
        type: 'rhf',
        name: data.name,
        email: data.email,
        age: data.age,
        gender: data.gender,
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
    <form
      className="form"
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
    >
      <FormFields
        register={register}
        control={control}
        errors={errors}
        passwordStrength={passwordStrength}
        countryList={countryList}
        selectedFileName={
          watchImage instanceof FileList && watchImage.length > 0 ? watchImage[0].name : ''
        }
      />

      <button className="button" type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};
