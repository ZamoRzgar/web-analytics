/**
 * Date utility functions for analytics time frame calculations
 */

import { subDays, startOfDay, endOfDay, format } from 'date-fns'

/**
 * Get the start and end dates for a relative time frame
 * @param days Number of days to look back
 * @returns Object with start and end dates
 */
export function getRelativeTimeFrame(days: number = 30) {
  const end = new Date()
  const start = subDays(end, days)
  
  return {
    start: startOfDay(start),
    end: endOfDay(end)
  }
}

/**
 * Format a date for display
 * @param date Date to format
 * @param formatString Optional format string
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatString: string = 'MMM d, yyyy') {
  return format(date, formatString)
}

/**
 * Format a date range for display
 * @param start Start date
 * @param end End date
 * @returns Formatted date range string
 */
export function formatDateRange(start: Date, end: Date) {
  return `${formatDate(start)} - ${formatDate(end)}`
}

/**
 * Get an array of dates between start and end
 * @param start Start date
 * @param end End date
 * @returns Array of dates
 */
export function getDatesBetween(start: Date, end: Date) {
  const dates = []
  let currentDate = new Date(start)
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

/**
 * Get a friendly description of a time period
 * @param days Number of days
 * @returns Description string
 */
export function getTimePeriodDescription(days: number) {
  if (days === 7) return 'Last 7 days'
  if (days === 14) return 'Last 14 days'
  if (days === 30) return 'Last 30 days'
  if (days === 90) return 'Last 3 months'
  return `Last ${days} days`
}
