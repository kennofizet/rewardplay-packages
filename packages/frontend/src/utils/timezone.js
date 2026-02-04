/**
 * Timezone utilities for RewardPlay package
 * These functions use the package's timezone without affecting the parent project's timezone settings
 */

/**
 * Format a date using the RewardPlay package's timezone
 * @param {Date|string|number} date - Date to format
 * @param {string} timezone - Timezone string (e.g., 'America/New_York')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDateInTimezone(date, timezone, options = {}) {
  if (!date) return ''
  
  const dateObj = date instanceof Date ? date : new Date(date)
  if (isNaN(dateObj.getTime())) return ''
  
  // Use Intl.DateTimeFormat with specific timezone - this doesn't affect global settings
  const defaultOptions = {
    timeZone: timezone || 'UTC',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj)
}

/**
 * Get current date/time in the specified timezone
 * @param {string} timezone - Timezone string (e.g., 'America/New_York')
 * @returns {Date} Date object representing current time in that timezone
 */
export function getCurrentDateInTimezone(timezone) {
  const now = new Date()
  // Convert to timezone string, then back to Date
  // This gives us the "local" time representation in that timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  const parts = formatter.formatToParts(now)
  const dateStr = `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}-${parts.find(p => p.type === 'day').value}T${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}:${parts.find(p => p.type === 'second').value}`
  
  return new Date(dateStr)
}

/**
 * Check if a date is today in the specified timezone
 * @param {Date|string|number} date - Date to check
 * @param {string} timezone - Timezone string
 * @returns {boolean}
 */
export function isTodayInTimezone(date, timezone) {
  if (!date) return false
  
  const dateObj = date instanceof Date ? date : new Date(date)
  if (isNaN(dateObj.getTime())) return false
  
  const today = getCurrentDateInTimezone(timezone)
  const checkDate = new Date(
    dateObj.toLocaleString('en-US', { timeZone: timezone })
  )
  
  return (
    today.getFullYear() === checkDate.getFullYear() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getDate() === checkDate.getDate()
  )
}

/**
 * Format date to locale date string in timezone
 * @param {Date|string|number} date - Date to format
 * @param {string} timezone - Timezone string
 * @returns {string} Locale date string (e.g., "1/28/2026")
 */
export function toLocaleDateStringInTimezone(date, timezone) {
  return formatDateInTimezone(date, timezone, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

/**
 * Format date to locale time string in timezone
 * @param {Date|string|number} date - Date to format
 * @param {string} timezone - Timezone string
 * @returns {string} Locale time string
 */
export function toLocaleTimeStringInTimezone(date, timezone) {
  return formatDateInTimezone(date, timezone, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

/**
 * Format date to full locale string in timezone
 * @param {Date|string|number} date - Date to format
 * @param {string} timezone - Timezone string
 * @returns {string} Full locale date/time string
 */
export function toLocaleStringInTimezone(date, timezone) {
  return formatDateInTimezone(date, timezone, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}
