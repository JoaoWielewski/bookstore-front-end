/* eslint-disable react/no-unescaped-entities */
'use client';

import './styles.css';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import FormContainer from '@/components/FormContainer/FormContainer';
import Input from '@/components/Input/Input';
import FormButton from '@/components/FormButton/FormButton';
import { useState } from 'react';
import FormLoading from '@/components/FormLoading/FormLoading';

type UserLoginType = {
  email: string,
  password: string,
}

const fetchUserByEmail = async (email: string) => {

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + `/users/${email}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch user by email: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    return undefined;
  }

};

const fetchUser = async (data: UserLoginType) => {
  const params = {
    email: data.email,
    password: data.password,
  };

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + '/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch user: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    return undefined;
  }
};

function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status} = useSession();

  const schema = yup.object().shape({
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  const { register, handleSubmit, formState: { errors }} = useForm<UserLoginType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    if (await fetchUserByEmail(data.email)) {

      if (await fetchUser(data)) {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        const searchParams = new URLSearchParams(document.location.search);
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect as string);
      } else {
        const passwordErrorP = document.querySelector('.password-error') as HTMLElement;
        passwordErrorP.innerHTML = "Password is wrong";
      }

    } else {
      const emailErrorP = document.querySelector('.email-error') as HTMLElement;
      emailErrorP.innerHTML = "This email doesn't have an account";
    }
    setLoading(false);
  });

  function resetEmailError() {
    const emailErrorP = document.querySelector('.email-error') as HTMLElement;
    emailErrorP.innerHTML = '';
  }

  function resetPasswordError() {
    const passwordErrorP = document.querySelector('.password-error') as HTMLElement;
    passwordErrorP.innerHTML = '';
  }


  return (
    <>
    {!session ?
    <FormContainer title="Log into your account">
      <form onSubmit={onSubmit}>
        <Input type="text" title="Email" error={errors.email?.message?.toString()} disabled={loading} register={register('email')} onChangeFunction={resetEmailError} optionalErrorReference="email"></Input>
        <Input type="password" title="Password" error={errors.password?.message?.toString()} disabled={loading} register={register('password')} onChangeFunction={resetPasswordError} optionalErrorReference="password"></Input>
        {!loading ?
         <FormButton title="Log In" disabled={loading}></FormButton> :
         <FormLoading></FormLoading>
        }
        <p className="create-account">
          Don't have an account? <Link href="/signup" className="create-account-link">Create an account</Link>
        </p>
        <p className="create-account">
          <Link href="/forgot_password" className="create-account-link">Forgot password?</Link>
        </p>
      </form>
    </FormContainer> : <div></div>}
    </>
  );
}

export default Login;
