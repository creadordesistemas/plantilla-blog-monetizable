import { NextResponse } from 'next/server';
import { readData, writeData } from '@/services/db';

export async function GET() {
  try {
    const config = await readData<any>('newsletter_config');
    // Si no tiene registros, devolvemos los valores por defecto
    const defaultData = {
      apiKeyBrevo: '',
      listaBrevoId: '',
      newsletterActiva: false,
      ...config
    };
    return NextResponse.json(defaultData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al cargar la configuración de newsletter' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newConfig = await request.json();
    await writeData('newsletter_config', newConfig);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al guardar la configuración de newsletter' }, { status: 500 });
  }
}
