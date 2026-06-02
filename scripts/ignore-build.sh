#!/bin/bash

# Vercel expone la rama actual en la variable VERCEL_GIT_COMMIT_REF
echo "Branch actual detectada: $VERCEL_GIT_COMMIT_REF"

if [ "$VERCEL_GIT_COMMIT_REF" = "demo" ]; then
  # Si la rama es 'demo', salimos con 1 para indicarle a Vercel que proceda con el build.
  echo "✓ Rama 'demo' confirmada. Iniciando despliegue en Vercel..."
  exit 1
else
  # Para cualquier otra rama (incluyendo main/master), salimos con 0 para cancelar la build.
  echo "🛑 Rama '$VERCEL_GIT_COMMIT_REF' no es 'demo'. Cancelando despliegue de Vercel de forma segura."
  exit 0
fi
