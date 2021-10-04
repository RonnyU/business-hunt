import React, { useEffect, useContext, useState } from 'react';
import Layout from '../components/layout/Layout';
import { FirebaseContext } from '../firebase';
import BusinessDetails from '../components/layout/BusinessDetails';

export default function Home() {
  const [businesses, setBusinesses] = useState([]);

  const { firebaseClass } = useContext(FirebaseContext);

  useEffect(() => {
    const getBusinesses = async () => {
      // const db = firebaseClass.returnDb();

      // const querySnapshot = await getDocs(collection(db, 'business'));
      // const temp = querySnapshot.docs.map((doc) => {
      //   return {
      //     id: doc.id,
      //     ...doc.data(),
      //   };
      // });

      const Qresult = firebaseClass.getBusinesses();

      Qresult.then((result) => {
        setBusinesses(result);
      });
    };

    getBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {businesses.map((business) => (
                <BusinessDetails key={business.id} business={business} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
