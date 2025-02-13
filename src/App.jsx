import { QueryClientProvider } from "@tanstack/react-query";
import Tabs from "./tabs/Tabs";
import { queryClient } from "./services/queryClient";
import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs />
      {/* <TimeSeriesLogChart /> */}
    </QueryClientProvider>
  );
}

export default App;
