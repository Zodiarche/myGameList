import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "./components/Header";
import GameList from "./components/UserList";

const queryClient = new QueryClient();


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Header />
        <GameList />
      </div>
    </QueryClientProvider>
  );
};

export default App;

