import React, { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Router from 'next/router';

const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`;

const ButtonSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url('/static/img/buscar.png');
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 1px;
  background-color: white;
  border: none;
  text-indent: -9999px;

  &:hover {
    cursor: pointer;
  }
`;

const Search = () => {
  const [research, setResearch] = useState('');

  const searchBusiness = (e) => {
    e.preventDefault();

    if (research.trim() === '') return;

    Router.push({
      pathname: '/search',
      query: { q: research },
    });
  };
  return (
    <form
      css={css`
        position: relative;
      `}
      onSubmit={searchBusiness}
    >
      <InputText
        type='text'
        placeholder='Search Business'
        onChange={(e) => setResearch(e.target.value)}
      />
      <ButtonSubmit type='submit'>Search</ButtonSubmit>
    </form>
  );
};

export default Search;
