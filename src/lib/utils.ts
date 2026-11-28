export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const firstInitial = words[0]?.[0] ?? "";
  const lastInitial = words.length > 1 ? (words.at(-1)?.[0] ?? "") : "";
  return (firstInitial + lastInitial).toUpperCase();
}
