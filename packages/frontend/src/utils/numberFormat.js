/**
 * Format numbers the same way as power in bag: compact K/M for large values.
 * e.g. 125000 -> 125K, 1250000 -> 1.25M
 * @param {number} value
 * @returns {string}
 */
export function formatCompactNumber(value) {
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return String(value ?? 0)
  if (n >= 1000000) {
    return (n / 1000000).toFixed(2) + 'M'
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(0) + 'K'
  }
  return n.toString()
}
