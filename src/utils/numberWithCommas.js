export function numberWithCommas(x) {
  if (!(x === undefined || x === null)) {
    // 소숫점은 콤마 안찍기위해서 분리
    const [integer, decimal] = x.toString().split(".");
    const addedCommasIntegar = integer
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // 소숫점이 존재하는경우
    if (decimal) {
      return `${addedCommasIntegar}.${decimal.slice(0, 3).padEnd(3, "0")}`;
    }
    // 존재하지 않는경우
    return `${addedCommasIntegar}`;
  }
  return null;
}
