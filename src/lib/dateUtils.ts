/**
 * Date & Time Utilities for Tool Rental Record Book
 * Configured for Asia/Kolkata timezone (Kerala, India)
 */

export const TIMEZONE = 'Asia/Kolkata';

/**
 * Formats ISO string into clean 12-hour reader friendly date string
 * Example: "08 Sep 2026 • 10:30 AM"
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid date';

  const dateStr = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: TIMEZONE,
  });

  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE,
  });

  return `${dateStr} • ${timeStr.toUpperCase()}`;
}

/**
 * Formats ISO string into short date string
 * Example: "08 Sep 2026"
 */
export function formatDateOnly(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: TIMEZONE,
  });
}

/**
 * Formats time portion only
 * Example: "10:30 AM"
 */
export function formatTimeOnly(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE,
  }).toUpperCase();
}

/**
 * Calculates human-readable duration between start date and end date (or current time)
 * Example outputs: "45m", "3h 25m", "1d 4h", "2d 6h 30m"
 */
export function calculateDuration(
  startInput: string | Date,
  endInput?: string | Date | null
): { totalMinutes: number; totalHours: number; totalDays: number; formatted: string } {
  const startDate = typeof startInput === 'string' ? new Date(startInput) : startInput;
  const endDate = endInput
    ? typeof endInput === 'string'
      ? new Date(endInput)
      : endInput
    : new Date();

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return { totalMinutes: 0, totalHours: 0, totalDays: 0, formatted: '0m' };
  }

  const diffMs = Math.max(0, endDate.getTime() - startDate.getTime());
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const days = Math.floor(totalMinutes / (60 * 24));
  const remainingHours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const remainingMins = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (remainingHours > 0 || (days > 0 && remainingMins > 0)) parts.push(`${remainingHours}h`);
  if (remainingMins > 0 || parts.length === 0) parts.push(`${remainingMins}m`);

  return {
    totalMinutes,
    totalHours,
    totalDays,
    formatted: parts.join(' '),
  };
}

/**
 * Checks if active rental is overdue relative to expected return date
 */
export function getOverdueInfo(
  expectedReturnInput?: string | Date | null,
  status?: string
): { isOverdue: boolean; lateText: string } {
  if (status !== 'ACTIVE' || !expectedReturnInput) {
    return { isOverdue: false, lateText: '' };
  }

  const expectedDate =
    typeof expectedReturnInput === 'string' ? new Date(expectedReturnInput) : expectedReturnInput;
  const now = new Date();

  if (isNaN(expectedDate.getTime()) || now <= expectedDate) {
    return { isOverdue: false, lateText: '' };
  }

  const duration = calculateDuration(expectedDate, now);
  return {
    isOverdue: true,
    lateText: `${duration.formatted} late`,
  };
}

/**
 * Helper to get ISO string for local datetime input defaults (HTML datetime-local)
 */
export function toDatetimeLocalValue(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}
