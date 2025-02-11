const demo2Url = "https://api.coinmarketscore.io/api/v2";

export const getDemo2ChartInfo = async (cc_idx = 21) => {
  const response = await fetch(`${demo2Url}/demo-user/${cc_idx}/chart`, {
    method: "GET",
  });

  return await response.json();
};
