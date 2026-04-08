#!/usr/bin/env bash
# Crea backend/.env.* a partir de los .example si aún no existen.
# Docker Compose exige que los ficheros referenciados en env_file existan;
# este script evita tener que copiarlos a mano antes del primer arranque.
#
# Si APP_KEY está vacía, genera una clave (formato Laravel base64:) sin sobrescribir
# valores ya definidos.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKEND="$REPO_ROOT/backend"

ensure_env() {
  local target="$1"
  local example="$2"
  if [[ ! -f "$example" ]]; then
    echo "Error: no existe el fichero de plantilla: $example" >&2
    exit 1
  fi
  if [[ ! -f "$target" ]]; then
    echo "Creando $target desde $example" >&2
    cp "$example" "$target"
  fi
}

# Rellena APP_KEY solo si falta o está vacía (no toca claves ya fijadas).
ensure_app_key() {
  local f="$1"
  [[ -f "$f" ]] || return 0

  local line val
  line=$(grep -E '^APP_KEY=' "$f" | head -1 || true)
  val="${line#APP_KEY=}"
  val=$(printf '%s' "$val" | tr -d '\r' | sed -e 's/^["'\'']//' -e 's/["'\'']$//')
  if [[ -n "${val// /}" ]]; then
    return 0
  fi

  local k="base64:$(openssl rand -base64 32 | tr -d '\n')"
  if grep -q '^APP_KEY=' "$f"; then
    awk -v newkey="$k" '
      BEGIN { replaced = 0 }
      /^APP_KEY=/ { print "APP_KEY=" newkey; replaced = 1; next }
      { print }
      END {
        if (!replaced) print "APP_KEY=" newkey
      }
    ' "$f" > "${f}.tmp"
    mv "${f}.tmp" "$f"
  else
    echo "APP_KEY=${k}" >> "$f"
  fi
  echo "APP_KEY generada en $f" >&2
}

ensure_env "$BACKEND/.env.staging" "$BACKEND/.env.staging.example"
ensure_env "$BACKEND/.env.production" "$BACKEND/.env.production.example"
# Stack base (deploy/docker-compose.yml) usa backend/.env
ensure_env "$BACKEND/.env" "$BACKEND/.env.example"

ensure_app_key "$BACKEND/.env"
ensure_app_key "$BACKEND/.env.staging"
ensure_app_key "$BACKEND/.env.production"
