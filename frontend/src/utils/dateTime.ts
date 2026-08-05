const LOCAL_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/;

const pad = (value: number) => value.toString().padStart(2, '0');

export const formatDateTimeLocalInput = (date: Date): string => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

export const addToCurrentLocalDateTime = ({ hours = 0, days = 0 }: { hours?: number; days?: number }): string => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  date.setDate(date.getDate() + days);
  return formatDateTimeLocalInput(date);
};

export const parseTaskDateTime = (value?: string | null): Date | null => {
  if (!value) return null;

  const localMatch = value.match(LOCAL_DATE_TIME_PATTERN);
  const hasTimeZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);

  if (localMatch && !hasTimeZone) {
    const [, year, month, day, hour, minute, second = '0'] = localMatch;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toDateTimeLocalInput = (value?: string | null): string => {
  const date = parseTaskDateTime(value);
  return date ? formatDateTimeLocalInput(date) : '';
};

export const toLocalDateTimeApiValue = (value: string): string | null => {
  if (!value) return null;
  return value.length === 16 ? `${value}:00` : value;
};
