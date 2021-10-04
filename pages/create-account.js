import React, { useState } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';

import firebaseClass from '../firebase';

//validation
import useValidation from '../hooks/useValidation';
import validateCreateAccount from '../validation/validateCreateAccount';

export default function CreateAccount() {
  const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
  };

  const [authError, setAuthError] = useState(false);

  const { values, error, handleSubmit, handleChange, handleBlur } =
    useValidation(INITIAL_STATE, validateCreateAccount, createAccount);

  const { name, email, password } = values;

  async function createAccount() {
    try {
      await firebaseClass.register(name, email, password);
      Router.push('/');
    } catch (error) {
      console.error('Error when trying to create the user', error.message);
      setAuthError(error.message);
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
            Create Account
          </h1>
          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <label htmlFor='name'>Name</label>
              <input
                type='text'
                id='name'
                placeholder='Your Name'
                name='name'
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
            {error.name && <Error>{error.name}</Error>}

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
            <InputSubmit type='submit' value='Create Account' />
          </Form>
        </>
      </Layout>
    </div>
  );
}
