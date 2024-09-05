import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './components/Header';
import GameList from './components/UserList';
import Footer from './components/Footer';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div id="wrapper">
        <BrowserRouter>
          <Header />
        </BrowserRouter>

        <GameList />
      </div>

      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
