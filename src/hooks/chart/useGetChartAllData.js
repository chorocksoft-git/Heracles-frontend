import { useQuery } from "@tanstack/react-query";
import { getChartAllInfo } from "../../services/api/chart";

export const useGetChartAllData = ({ cc_idx }) => {
  return useQuery({
    queryKey: [cc_idx, "chart", "all"],
    queryFn: () => getChartAllInfo(cc_idx),
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: true,
  });
};
