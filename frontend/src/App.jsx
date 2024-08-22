import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from './components/Header';
import GameList from './components/UserList';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <BrowserRouter>
          <Header />
        </BrowserRouter>

        <GameList />
      </div>
    </QueryClientProvider>
  );
};

export default App;
