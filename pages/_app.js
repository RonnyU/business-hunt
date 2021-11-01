import '../styles/globals.css';
import App from 'next/app';
import firebaseClass, { FirebaseContext } from '../firebase';
import useAuth from '../hooks/useAuth';

function MyApp({ Component, pageProps }) {
  const user = useAuth();
  //console.log(user);
  return (
    <FirebaseContext.Provider value={{ firebaseClass, user }}>
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
}

export default MyApp;
