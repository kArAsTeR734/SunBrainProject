import Header from '@/widgets/Header';
import Footer from '@/widgets/Footer';
import Promo from '../Promo';
import Help from '../Help';
import Advantages from '../Advantages';

export const Home = () => {
  return (
    <>
      <Header />
      <Promo />
      <Advantages />
      <Help />
      <Footer />
    </>
  );
};
