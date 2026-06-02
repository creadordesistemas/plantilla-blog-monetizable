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

async function getSchema() {
  console.log("=== DESCARGANDO ESQUEMA DE SUPABASE DESDE POSTGREST ===");
  const url = `${supabaseUrl}/rest/v1/`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const schema = await response.json();
    console.log("Esquema descargado correctamente.");
    
    const tables = schema.definitions;
    if (!tables) {
      console.error("No se encontraron definiciones de tablas en el esquema.");
      return;
    }
    
    for (const tableName of Object.keys(tables)) {
      console.log(`\nTabla: '${tableName}'`);
      const properties = tables[tableName].properties;
      if (properties) {
        console.log("Columnas y Tipos:");
        for (const colName of Object.keys(properties)) {
          const colInfo = properties[colName];
          console.log(`  - ${colName} (${colInfo.type}${colInfo.format ? ', ' + colInfo.format : ''})`);
        }
      } else {
        console.log("  Sin columnas de propiedades definidas.");
      }
    }
    
  } catch (error) {
    console.error("Error al obtener el esquema:", error);
  }
}

getSchema();
