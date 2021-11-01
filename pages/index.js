import useProductos from '../hooks/useBusinesses';
import Layout from '../components/layout/Layout';
import BusinessDetails from '../components/layout/BusinessDetails';

export default function Home() {
  const { businesses } = useProductos('created');

  return (
    <div>
      <Layout>
        <div className='business-list'>
          <div className='container'>
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
