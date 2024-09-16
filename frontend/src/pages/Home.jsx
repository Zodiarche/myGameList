import TopGameList from '../components/TopGameList';
import LandingPage from '../components/Home/LandingPage';

const MainHome = () => {
  return (
    <>
      <main id="home">
        <LandingPage />
        <TopGameList />
      </main>
    </>
  );
};

export default MainHome;
