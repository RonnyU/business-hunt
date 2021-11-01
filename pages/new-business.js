import React, { useState, useContext } from 'react';
import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';
import Error404 from '../components/layout/404';

import { FirebaseContext } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

//validation
import useValidation from '../hooks/useValidation';
import validateCreateBusiness from '../validation/validateCreateBusiness';

export default function NewBusiness() {
  const INITIAL_STATE = {
    name: '',
    company: '',
    image: '',
    url: '',
    description: '',
  };

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [urlImage, setUrlImage] = useState('');

  const { values, error, handleSubmit, handleChange, handleBlur } =
    useValidation(INITIAL_STATE, validateCreateBusiness, createBusiness);

  const { name, company, image, url, description } = values;

  // hook routing
  const router = useRouter();

  //context with firebase methods

  const { user, firebaseClass } = useContext(FirebaseContext);

  async function createBusiness() {
    if (!user) {
      return router.push('/login');
    }

    const business = {
      name,
      company,
      url,
      urlImage,
      description,
      likes: 0,
      comments: [],
      created: Date.now(),
      createdBy: {
        id: user.uid,
        name: user.displayName,
      },
      likesGivenBy: [],
    };

    try {
      const docRef = await firebaseClass.saveBusiness(business);
      //console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error when trying to create the business', error.message);
    }

    return router.push('/');
  }

  const handleUpload = async (e) => {
    setUploading(true);

    const file = e.target.files[0];

    const storage = firebaseClass.returnStorage();

    const storageRef = ref(storage, 'business/' + file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progressTemp =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progressTemp + '% done');
        setProgress(progressTemp);

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          // case 'running':
          //   console.log('Upload is running');
          //   break;
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            console.log("User doesn't have permission to access the object");
            break;
          case 'storage/canceled':
            console.log('User canceled the upload');
            break;

          case 'storage/unknown':
            console.log('Unknown error occurred, inspect error.serverResponse');
            break;
        }
      },
      () => {
        // Handle successful uploads on complete

        setUploading(false);
        setProgress(0);

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setUrlImage(downloadURL);
        });
      }
    );
  };

  return (
    <div>
      <Layout>
        {!user ? (
          <Error404 />
        ) : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              New Business
            </h1>
            <Form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend>General Information</legend>

                <Field>
                  <label htmlFor='name'>Name</label>
                  <input
                    type='text'
                    id='name'
                    placeholder='Name of the product'
                    name='name'
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>
                {error.name && <Error>{error.name}</Error>}

                <Field>
                  <label htmlFor='company'>Company</label>
                  <input
                    type='text'
                    id='company'
                    placeholder='Company Name'
                    name='company'
                    value={company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>
                {error.company && <Error>{error.company}</Error>}

                <Field>
                  <label htmlFor='image'>Image</label>
                  <input
                    accept='image/*'
                    onChange={handleUpload}
                    type='file'
                    id='image'
                    name='image'
                  />
                </Field>

                <Field>
                  <label htmlFor='url'>Url</label>
                  <input
                    type='url'
                    id='url'
                    name='url'
                    placeholder='URL of your business'
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>
                {error.url && <Error>{error.url}</Error>}
              </fieldset>

              <fieldset>
                <legend>About your Business</legend>

                <Field>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    id='description'
                    name='description'
                    value={description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>
                {error.description && <Error>{error.description}</Error>}
              </fieldset>

              <InputSubmit
                type='submit'
                value='Create Business'
                disabled={uploading}
              />
            </Form>
          </>
        )}
      </Layout>
    </div>
  );
}
