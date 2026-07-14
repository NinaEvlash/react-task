import { NextResponse } from 'next/server';

import type { Pokemon } from '../../../types/apiTypes';

type ExportRequest = {
  items: Pokemon[];
};

function isExportRequest(value: unknown): value is ExportRequest {
  return (
    typeof value === 'object' &&
    value !== null &&
    'items' in value &&
    Array.isArray(value.items)
  );
}

export async function POST(req: Request): Promise<NextResponse> {
  const body: unknown = await req.json();

  if (!isExportRequest(body)) {
    return new NextResponse('Invalid request body', {
      status: 400,
    });
  }

  const { items } = body;

  const headers = ['Name', 'Description', 'Details URL'];

  const rows = items.map((item) => [
    item.name,
    item.description,
    `/details/${item.name}`,
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="items.csv"',
    },
  });
}
