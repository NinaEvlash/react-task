import { Suspense } from 'react';
import Home from '../../components/Home/Home';
import Spinner from '@/components/Spinner/Spinner';

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <Home />
    </Suspense>
  );
}