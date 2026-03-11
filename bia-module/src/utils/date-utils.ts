/**
 * Utility functions for consistent date formatting across the application
 * to prevent hydration errors between server and client rendering
 */

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatTimeWithTimezone = (date: Date = new Date(), timezone: string = 'Asia/Kolkata'): string => {
  return date.toLocaleString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
