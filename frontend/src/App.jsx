import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './components/Header';
import Footer from './components/Footer';
import MainHome from './pages/Home';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div id="wrapper">
        <BrowserRouter>
          <Header />
        </BrowserRouter>

        <MainHome />
      </div>

      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
