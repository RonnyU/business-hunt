import useProductos from '../hooks/useBusinesses';
import Layout from '../components/layout/Layout';
import BusinessDetails from '../components/layout/BusinessDetails';

export default function Popular() {
  const { businesses } = useProductos('likes');
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
