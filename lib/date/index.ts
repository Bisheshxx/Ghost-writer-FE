export function formatMediumDate(
  date?: Date | string | null,
  fallback = "Not available",
) {
  if (!date) return fallback;

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return fallback;

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(d);
}

export function formatMonthYearDate(
  date?: Date | string | null,
  fallback = "Not available",
) {
  if (!date) return fallback;

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return fallback;

  return d.toLocaleDateString("en-US", {
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
