const demo2Url = "https://api.coinmarketscore.io/api/v2";

const getDemo2ChartInfo = async (cc_idx = 21) => {
  const response = await fetch(`${demo2Url}/demo1/${cc_idx}/chart`, {
    method: "GET",
  });
  return await response.json();
};

const getChartAllInfo = async (cc_idx = 21) => {
  const response = await fetch(`${demo2Url}/demo2/${cc_idx}/chart`, {
    method: "GET",
  });
  return await response.json();
};
export { getDemo2ChartInfo, getChartAllInfo };
