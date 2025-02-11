import { QueryClientProvider } from "@tanstack/react-query";
import TimeSeriesLogChart from "./components/chart/TimeSeriesLogChart/TimeSeriesLogChart";
import "./App.css";
import { queryClient } from "./services/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TimeSeriesLogChart />
    </QueryClientProvider>
  );
}

export default App;
