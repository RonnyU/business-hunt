/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Field, InputSubmit } from '../../components/ui/Form';
import Button from '../../components/ui/Button';
import { async } from '@firebase/util';

const BusinessContainer = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const BusinessOwner = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`;

const Business = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const [business, setBusiness] = useState({});
  const [totalLikes, setTotalLikes] = useState(0);
  const [comment, setComment] = useState({});
  const [error, setError] = useState(false);

  const { firebaseClass, user } = useContext(FirebaseContext);

  useEffect(() => {
    if (id) {
      const getBusiness = async () => {
        const queryResult = firebaseClass.getBusiness(id);

        queryResult.then((businessResult) => {
          if (businessResult === 0) {
            setError(true);
          } else {
            setBusiness(businessResult);
            setTotalLikes(businessResult.likes);
          }
        });

        //console.log(businessResult);
      };
      getBusiness();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const {
    comments,
    company,
    created,
    description,
    name,
    likes,
    url,
    urlImage,
    createdBy,
    likesGivenBy,
  } = business;

  const handleLikes = () => {
    if (!user) {
      return router.push('/login');
    }

    if (likesGivenBy.includes(user.uid) || totalLikes > likes) return;

    setTotalLikes(likes + 1);
    //update db
    firebaseClass.updateLikes(id, user.uid);

    //update state
    setBusiness({
      ...business,
      likes: totalLikes,
    });
  };

  // comments functions

  const hanldeCommentChange = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  const addComment = (e) => {
    e.preventDefault();

    if (!user) {
      return router.push('/login');
    }

    //add extra info to the comment
    comment.userId = user.uid;
    comment.userName = user.displayName;

    const newComments = [...comments, comment];
    //update db
    firebaseClass.updateComments(id, newComments);

    setBusiness({
      ...business,
      comments: newComments,
    });

    e.target.reset();
  };

  const isOwner = (id) => {
    if (createdBy.id == id) {
      return true;
    }
  };

  const CanDelete = () => {
    if (!user) return false;

    if (createdBy.id === user.uid) {
      return true;
    }
  };

  const DeleteBusiness = async () => {
    if (!user) {
      return router.push('/login');
    }

    if (createdBy.id !== user.uid) {
      return router.push('/');
    }

    try {
      firebaseClass.deleteDocument(id);
      return router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  if (Object.keys(business).length === 0 && !error) return 'Loading';

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div className='container'>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {name}
            </h1>
            <BusinessContainer>
              <div>
                <p>Published {formatDistanceToNow(new Date(created))} ago</p>
                <p>
                  By {createdBy.name} from {company}
                </p>
                <img src={urlImage} alt={`Image of ${name}`} />
                <p>{description}</p>

                {user && (
                  <>
                    <h2>Add a comment</h2>
                    <form onSubmit={addComment}>
                      <Field>
                        <input
                          type='text'
                          name='message'
                          onChange={hanldeCommentChange}
                        />
                      </Field>

                      <InputSubmit type='submit' value='Add Comment' />
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comments
                </h2>
                {comments.length === 0 ? (
                  'There are no comments to display'
                ) : (
                  <ul>
                    {comments.map((comment, i) => (
                      <li
                        key={`${comments.userId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comment.message}</p>
                        <p>
                          Written by {''}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {comment.userName}
                          </span>
                        </p>
                        {isOwner(comment.userId) && (
                          <BusinessOwner>Owner</BusinessOwner>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <aside>
                <Button target='_blank' bgColor='true' href={url}>
                  Visit website
                </Button>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {totalLikes} Likes
                  </p>

                  {user && <Button onClick={handleLikes}>Like</Button>}
                </div>
              </aside>
            </BusinessContainer>

            {CanDelete() && (
              <Button onClick={DeleteBusiness}>Delete Business</Button>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Business;
