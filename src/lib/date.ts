export function toLocalIsoDateTime(dateString: string): string {
  if (!dateString) return '';
  const trimmed = dateString.trim();
  if (!trimmed) return '';

  const datePart = trimmed.split('T')[0];
  if (!datePart) return '';

  return `${datePart}T00:00:00`;
}

export function toDateInputValue(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}
