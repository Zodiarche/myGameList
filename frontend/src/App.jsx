import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './components/Header';
import Footer from './components/Footer';
import MainHome from './pages/Home';
import Games from './pages/Games';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GameDetails from './pages/GameDetails';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div id="wrapper">
          <Header />

          <Routes>
            <Route path="/" element={<MainHome />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/contact" element={<Contact />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
