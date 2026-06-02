-- Añadir columna para foto de perfil en la tabla members
-- Por ahora se usarán avatares con iniciales generados automáticamente.
-- Cuando se implemente la subida de imágenes, este campo almacenará la URL.

ALTER TABLE members ADD COLUMN IF NOT EXISTS avatar_url text;
