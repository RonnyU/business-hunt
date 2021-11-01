import React, { useEffect, useContext, useState } from 'react';
import { FirebaseContext } from '../firebase';

const useProductos = (sort) => {
  const [businesses, setBusinesses] = useState([]);

  const { firebaseClass } = useContext(FirebaseContext);

  useEffect(() => {
    const getBusinesses = async () => {
      const Qresult = firebaseClass.getBusinesses(sort);

      Qresult.then((result) => {
        setBusinesses(result);
      });
    };

    getBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    businesses,
  };
};

export default useProductos;
