export function validateQuery(query?: string): string {
  return (query ?? '').trim().toLowerCase().replaceAll(/\s+/g, ' ');
}
