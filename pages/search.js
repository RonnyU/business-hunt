import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import useProductos from '../hooks/useBusinesses';
import BusinessDetails from '../components/layout/BusinessDetails';

export default function Search() {
  const router = useRouter();
  const {
    query: { q },
  } = router;

  const { businesses } = useProductos('created');
  const [result, setResult] = useState([]);

  useEffect(() => {
    const searched = q.toLocaleLowerCase();

    const filter = businesses.filter((business) => {
      return (
        business.name.toLocaleLowerCase().includes(searched) ||
        business.company.toLocaleLowerCase().includes(searched)
      );
    });

    //console.log(filter);
    setResult(filter);
  }, [q, businesses]);

  return (
    <div>
      <Layout>
        <div className='business-list'>
          <div className='container'>
            <ul className='bg-white'>
              {result.map((business) => (
                <BusinessDetails key={business.id} business={business} />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
