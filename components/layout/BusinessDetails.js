/* eslint-disable @next/next/no-img-element */
import React from 'react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import Link from 'next/link';

const Business = styled.li`
  padding: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e1e1;
`;

const BusinessDescription = styled.div`
  flex: 0 1 600px;
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 2rem;
`;

const Title = styled.a`
  font-size: 2rem;
  font-weight: bold;
  margin: 0;

  &:hover {
    cursor: pointer;
  }
`;

const TextDesc = styled.p`
  font-size: 1.6rem;
  margin: 0;
  color: #888;
`;

const Comments = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    border: 1px solid #e1e1e1;
    padding: 0.3rem 1rem;
    margin-right: 2rem;
  }
  img {
    width: 2rem;
    margin-right: 2rem;
  }
  p {
    font-size: 1.6rem;
    margin-right: 1rem;
    font-weight: 700;

    &:last-of-type {
      margin: 0;
    }
  }
`;

const CompanyImage = styled.img`
  width: 200px;
`;

const Likes = styled.div`
  flex: 0 0 auto;
  text-align: center;
  border: 1px solid #e1e1e1;
  padding: 1rem 3rem;

  div {
    font-size: 2rem;
  }

  p {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }
`;

const BusinessDetails = ({ business }) => {
  const {
    id,
    comments,
    company,
    created,
    description,
    name,
    likes,
    url,
    urlImage,
  } = business;

  console.log(urlImage);
  return (
    <Business>
      <BusinessDescription>
        <div>
          <CompanyImage src={urlImage} alt={name} />
        </div>

        <div>
          <Link href='/businesses/[id]' as={`/businesses/${id}`} passHref>
            <Title>{name}</Title>
          </Link>
          <TextDesc>{description}</TextDesc>

          <Comments>
            <div>
              <img
                src='/static/img/comentario.png'
                alt='Contador de comentarios'
              />
              <p>{comments.length} Comments</p>
            </div>
          </Comments>
          <p>Published {formatDistanceToNow(new Date(created))} ago</p>
        </div>
      </BusinessDescription>

      <Likes>
        <div>&#9650;</div>
        <p>{likes}</p>
      </Likes>
    </Business>
  );
};

export default BusinessDetails;
