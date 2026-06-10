type UserDisplayInput = {
  email?: string | null;
  fallback?: string;
  name?: string | null;
};

export function getUserDisplayName({
  email,
  fallback = "Account",
  name,
}: UserDisplayInput) {
  return name?.trim() || email || fallback;
}

export function getUserInitials({
  email,
  fallback = "Account",
  name,
}: UserDisplayInput) {
export function getUserInitials({
  email,
  fallback = "Account",
  name,
}: UserDisplayInput) {
  const source = name?.trim() || email?.split("@")[0] || fallback;
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "AC";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
}
