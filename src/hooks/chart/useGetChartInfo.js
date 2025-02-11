import { useQuery } from "@tanstack/react-query";
import { getDemo2ChartInfo } from "../../services/api/chart";

export const useGetCharInfo = ({ cc_idx }) => {
  return useQuery({
    queryKey: [cc_idx, "chart", "single"],
    queryFn: () => getDemo2ChartInfo(cc_idx),
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: true,
  });
};
