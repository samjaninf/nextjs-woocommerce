import { useRouter } from 'next/router';
import { useEffect, ComponentType, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '../../utils/gql/GQL_QUERIES';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.component';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    
    const { data, loading, error } = useQuery(GET_CURRENT_USER, {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    });

    useEffect(() => {
      if (!loading) {
        setIsChecking(false);
        
        // If there's an error or no customer data, user is not authenticated
        if (error || !data?.customer) {
          router.push('/logg-inn');
        }
      }
    }, [data, loading, error, router]);

    // Show loading while checking authentication
    if (loading || isChecking) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      );
    }

    // If no customer data, don't render the component
    if (!data?.customer) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
