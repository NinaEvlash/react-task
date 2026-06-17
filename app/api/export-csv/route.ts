import { NextResponse } from 'next/server';
import type { Pokemon } from '../../../types/apiTypes';

export async function POST(req: Request) {
  const { items } = await req.json();

  const headers = ['Name', 'Description', 'Details URL'];

  const rows = items.map((item: Pokemon) => [
    item.name,
    item.description,
    `/details/${item.name}`,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.join(','))
    .join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="items.csv"',
    },
  });
}