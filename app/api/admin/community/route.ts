import { NextResponse } from 'next/server';
import { readData, writeData } from '@/services/db';

export async function GET() {
  const data = await readData<any>('community');
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const newData = await request.json();
  await writeData('community', newData);
  return NextResponse.json({ success: true });
}
