import { Footer } from '@widgets/Footer';
import { Header } from '@widgets/Header';
import { Outlet } from 'react-router-dom';

export const KnowledgeTestPage = () => {
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
