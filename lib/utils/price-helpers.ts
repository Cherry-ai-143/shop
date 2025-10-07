export const getLowestPrice = (prices: Record<string, number>) => {
  return Math.min(...Object.values(prices))
}

export const getLowestPricePlatform = (prices: Record<string, number>) => {
  return Object.entries(prices).reduce((a, b) => (prices[a[0]] <= prices[b[0]] ? a : b))[0]
}
