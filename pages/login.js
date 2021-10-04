import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';

import firebaseClass from '../firebase';

//validation
import useValidation from '../hooks/useValidation';
import validateLogin from '../validation/validateLogin';

export default function Login() {
  const INITIAL_STATE = {
    email: '',
    password: '',
  };

  const [authError, setAuthError] = useState(false);

  const { values, error, handleSubmit, handleChange, handleBlur } =
    useValidation(INITIAL_STATE, validateLogin, Login);

  const { email, password } = values;

  async function Login() {
    try {
      const user = await firebaseClass.login(email, password);
      //console.log(user);
      Router.push('/');
    } catch (error) {
      console.error('Error when trying to create the user', error.message);
      if (error.code == 'auth/user-not-found') {
        setAuthError('The user or password is invalid');
      } else {
        setAuthError(error.message);
      }
    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Login
          </h1>
          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                placeholder='Your Email'
                name='email'
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            {error.email && <Error>{error.email}</Error>}

            <Field>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                placeholder='Your Password'
                name='password'
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
            {error.password && <Error>{error.password}</Error>}

            {authError && <Error>{authError}</Error>}
            <InputSubmit type='submit' value='Login' />
          </Form>
        </>
      </Layout>
    </div>
  );
}
