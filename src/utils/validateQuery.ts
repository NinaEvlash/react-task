export function validateQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
}
