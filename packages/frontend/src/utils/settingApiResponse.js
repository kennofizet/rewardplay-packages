/**
 * Parse paginated list from RewardPlay API response (res.data.datas[key]).
 * Returns { list, pagination } so list pages can assign in one place.
 *
 * @param {Object} res - Axios response (res.data.datas[key] expected)
 * @param {string} dataKey - Key under res.data.datas (e.g. 'events', 'shop_items')
 * @returns {{ list: Array, pagination: Object|null }}
 */
export function parsePaginatedResponse(res, dataKey) {
  const data = res?.data?.datas?.[dataKey]
  if (!data) {
    return { list: [], pagination: null }
  }
  const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])
  const pagination =
    data.current_page != null
      ? { current_page: data.current_page, last_page: data.last_page, total: data.total }
      : null
  return { list, pagination }
}

/**
 * Format date/datetime string for display in setting list pages.
 *
 * @param {string|null|undefined} val - ISO date string or null
 * @returns {string}
 */
export function formatDateDisplay(val) {
  if (!val) return '—'
  try {
    return new Date(val).toLocaleDateString()
  } catch (e) {
    return String(val)
  }
}
