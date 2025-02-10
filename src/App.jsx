import { useState } from "react";
import "./App.css";
import Tabs from "./tabs/Tabs";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import TimeSeriesLogChart from "./components/chart/TimeSeriesLogChart/TimeSeriesLogChart";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs />
    </QueryClientProvider>
  );
}

export default App;
