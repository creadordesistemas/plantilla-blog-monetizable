const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer variables de .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2].trim();
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

async function testQueryColumns() {
  console.log("=== COSULTANDO COLUMNAS DE LA TABLA settings EN SUPABASE ===");
  
  // En Supabase, a veces podemos usar RPC o consultar directamente si tenemos permisos.
  // Intentemos hacer una inserción mínima de solo el ID para ver si la columna ID existe.
  const { data: idInsert, error: idError } = await supabaseAdmin
    .from('settings')
    .upsert({ id: 1 });

  console.log("Upsert solo ID:", idError ? "Error: " + JSON.stringify(idError) : "Éxito!");

  // También podemos intentar usar la API de REST de postgrest para inspeccionar la definición de la tabla (OpenAPI)
  // Pero lo más sencillo es hacer una petición a la base de datos para ver qué columnas acepta.
  // Si pudimos insertar ID:1, veamos si podemos seleccionarlo.
  if (!idError) {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('*');
    console.log("Datos después del upsert de ID:", data);
    if (data && data.length > 0) {
      console.log("Columnas existentes en la base de datos:", Object.keys(data[0]));
    }
    
    // Limpiamos el registro de prueba
    await supabaseAdmin.from('settings').delete().eq('id', 1);
  }
}

testQueryColumns();
