import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MainHome, Games, GameDetails, Signup, Login, Profile, Contact, SiteMap, LegalNotice, PrivacyPolice } from './pages';
import { Header, Footer } from './components';

import { initializeTarteAuCitron } from './services/tarteaucitron/main';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tarteaucitronjs@latest/tarteaucitron.js';
    script.async = true;
    script.onload = () => {
      initializeTarteAuCitron();
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div id="wrapper">
          <Header />
          <Routes>
            <Route path="/" element={<MainHome />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/site-map" element={<SiteMap />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/privacy-police" element={<PrivacyPolice />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
