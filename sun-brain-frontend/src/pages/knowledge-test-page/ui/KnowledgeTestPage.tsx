import { Footer } from '@widgets/footer';
import { Header } from '@widgets/header';
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
