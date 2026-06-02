import { NextResponse } from 'next/server';
import { readData } from '@/services/db';

export async function GET() {
  try {
    const config = await readData<any>('newsletter_config');
    const apiKey = config?.apiKeyBrevo || process.env.BREVO_API_KEY;
    const listId = config?.listaBrevoId;

    if (!apiKey || !listId) {
      return NextResponse.json({ uniqueSubscribers: 0, configured: false });
    }

    const response = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey
      }
    });

    if (!response.ok) {
      // Si la API key es inválida o la lista no existe, devolvemos 0 de forma segura
      return NextResponse.json({ uniqueSubscribers: 0, configured: true, error: 'Brevo API Error' });
    }

    const data = await response.json();
    return NextResponse.json({
      uniqueSubscribers: data.uniqueSubscribers || 0,
      configured: true
    });
  } catch (error: any) {
    return NextResponse.json({ uniqueSubscribers: 0, error: error.message });
  }
}
