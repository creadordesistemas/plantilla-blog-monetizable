/**
 * Servicio para notificar e indexar URLs en Google usando Google Indexing API y OAuth 2.0.
 */

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface IndexingResponse {
  urlNotificationMetadata?: {
    latestUpdate?: {
      url: string;
      type: string;
      notifyTime: string;
    };
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * Obtiene un nuevo Access Token a partir del Refresh Token guardado en variables de entorno.
 */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Faltan variables de entorno para Google Indexing (CLIENT_ID, CLIENT_SECRET o REFRESH_TOKEN)');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al renovar el token de Google: ${response.status} - ${errorData}`);
  }

  const data = (await response.json()) as AccessTokenResponse;
  return data.access_token;
}

/**
 * Envía una URL a Google Indexing API para que sea indexada o actualizada.
 * @param targetUrl URL canónica del artículo del blog
 */
export async function indexUrl(targetUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log(`[Google Indexing] Iniciando solicitud de indexación para: ${targetUrl}`);
    
    // 1. Obtener Access Token
    const accessToken = await getAccessToken();

    // 2. Llamar a la Indexing API
    const response = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url: targetUrl,
        type: 'URL_UPDATED',
      }),
      cache: 'no-store',
    });

    const data = (await response.json()) as IndexingResponse;

    if (!response.ok || data.error) {
      const errMsg = data.error?.message || `HTTP ${response.status}`;
      console.error(`[Google Indexing] Error en la API de Indexación para ${targetUrl}:`, data.error || data);
      return {
        success: false,
        message: `Error de Google Indexing API: ${errMsg}`,
      };
    }

    console.log(`[Google Indexing] Indexación solicitada con éxito para: ${targetUrl}`);
    return {
      success: true,
      message: 'Indexación solicitada con éxito a Google.',
    };
  } catch (error: any) {
    console.error(`[Google Indexing] Excepción al intentar indexar ${targetUrl}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error interno desconocido',
    };
  }
}
