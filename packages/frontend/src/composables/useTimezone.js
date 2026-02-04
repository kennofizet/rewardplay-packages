/**
 * Composable for using timezone in RewardPlay package components
 * This ensures timezone usage is scoped to the package and doesn't affect the parent project
 */
import { inject, computed } from 'vue'
import {
  formatDateInTimezone,
  getCurrentDateInTimezone,
  isTodayInTimezone,
  toLocaleDateStringInTimezone,
  toLocaleTimeStringInTimezone,
  toLocaleStringInTimezone
} from '../utils/timezone'

/**
 * Use timezone composable
 * @returns {Object} Timezone utilities
 */
export function useTimezone() {
  // Get timezone from provide/inject (scoped to RewardPlay package)
  const zoneTimezone = inject('zoneTimezone', null)
  
  // Get timezone value (reactive)
  const timezone = computed(() => {
    return zoneTimezone?.value || 'UTC'
  })
  
  /**
   * Format a date using the package's timezone
   * @param {Date|string|number} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  const formatDate = (date, options = {}) => {
    return formatDateInTimezone(date, timezone.value, options)
  }
  
  /**
   * Get current date in package's timezone
   * @returns {Date} Current date in timezone
   */
  const getCurrentDate = () => {
    return getCurrentDateInTimezone(timezone.value)
  }
  
  /**
   * Check if date is today in package's timezone
   * @param {Date|string|number} date - Date to check
   * @returns {boolean}
   */
  const isToday = (date) => {
    return isTodayInTimezone(date, timezone.value)
  }
  
  /**
   * Format date to locale date string
   * @param {Date|string|number} date - Date to format
   * @returns {string} Locale date string
   */
  const toLocaleDateString = (date) => {
    return toLocaleDateStringInTimezone(date, timezone.value)
  }
  
  /**
   * Format date to locale time string
   * @param {Date|string|number} date - Date to format
   * @returns {string} Locale time string
   */
  const toLocaleTimeString = (date) => {
    return toLocaleTimeStringInTimezone(date, timezone.value)
  }
  
  /**
   * Format date to full locale string
   * @param {Date|string|number} date - Date to format
   * @returns {string} Full locale date/time string
   */
  const toLocaleString = (date) => {
    return toLocaleStringInTimezone(date, timezone.value)
  }
  
  /**
   * Get current date as locale date string
   * @returns {string} Current date string
   */
  const getTodayString = () => {
    return toLocaleDateString(new Date())
  }
  
  return {
    timezone, // Reactive timezone value
    formatDate,
    getCurrentDate,
    isToday,
    toLocaleDateString,
    toLocaleTimeString,
    toLocaleString,
    getTodayString
  }
}
