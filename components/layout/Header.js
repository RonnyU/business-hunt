import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { css, jsx } from '@emotion/react';
import Search from '../ui/search';
import Nav from './Nav';
import Link from 'next/link';
import Button from '../ui/Button';
import { FirebaseContext } from '../../firebase';

const HeaderContainer = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;

  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Logo = styled.p`
  color: var(--orange);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: 'Roboto Slab', serif;
  margin-right: 2rem;
`;

const Header = () => {
  const { user, firebaseClass } = useContext(FirebaseContext);
  return (
    <header
      css={css`
        border-bottom: 2px solid var(--gray3);
        padding: 1rem 0;
      `}
    >
      <HeaderContainer>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <Link href='/' passHref>
            <Logo>B</Logo>
          </Link>

          <Search />
          <Nav />
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          {user ? (
            <>
              <p
                css={css`
                  margin-right: 2rem;
                `}
              >
                Hola: {user.displayName}
              </p>

              <Button bgColor='true' onClick={() => firebaseClass.logout()}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href='/login' passHref>
                <Button bgColor='true'>Login</Button>
              </Link>

              <Link href='/create-account' passHref>
                <Button> Create Account</Button>
              </Link>
            </>
          )}
        </div>
      </HeaderContainer>
    </header>
  );
};

export default Header;
