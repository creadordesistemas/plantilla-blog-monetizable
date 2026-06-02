import { NextResponse } from 'next/server';
import { readData, writeData } from '@/services/db';

export async function GET() {
  try {
    const settings = await readData('settings');
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Error al cargar settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSettings = await request.json();
    await writeData('settings', newSettings);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar settings' }, { status: 500 });
  }
}
