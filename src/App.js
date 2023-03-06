import Data from "./Data";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Data />
    </QueryClientProvider>
  );
}
export default App;
