export function formatMediumDate(
  date?: Date | string | null,
  fallback = "Not available",
) {
  if (!date) return fallback;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatMonthYearDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function toUTCDate(date: string) {
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
