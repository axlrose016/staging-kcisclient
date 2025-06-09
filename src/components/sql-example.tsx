// pages/index.tsx
//import { createDatabase } from '@/db/offline/sqlJs';
import { useEffect } from 'react';

const SqlPage = () => {
  useEffect(() => {
    //createDatabase();
  }, []);

  return (
    <div>
      <h1>Welcome to the Next.js app!</h1>
      <p>The database is being initialized.</p>
    </div>
  );
};

export default SqlPage;
