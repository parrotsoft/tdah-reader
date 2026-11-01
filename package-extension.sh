#!/usr/bin/env bash
# Empaqueta la extensión para Chrome Web Store.
# Uso: ./package-extension.sh [--bump patch|minor|major] [--output directorio]
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="$ROOT_DIR/manifest.json"
OUTPUT_DIR="$ROOT_DIR/dist"
BUMP=""

usage() {
  cat <<'EOF'
Uso: ./package-extension.sh [opciones]

Opciones:
  --bump patch|minor|major  Incrementa la versión de manifest.json antes de crear el ZIP.
  --output DIRECTORIO       Directorio de salida (por defecto: ./dist).
  -h, --help                Muestra esta ayuda.

Ejemplos:
  ./package-extension.sh
  ./package-extension.sh --bump patch
  ./package-extension.sh --bump minor --output releases
EOF
}

while (($#)); do
  case "$1" in
    --bump)
      [[ ${2:-} =~ ^(patch|minor|major)$ ]] || { echo "Error: --bump acepta patch, minor o major." >&2; exit 1; }
      BUMP="$2"; shift 2 ;;
    --output)
      [[ -n ${2:-} ]] || { echo "Error: falta el directorio de salida." >&2; exit 1; }
      OUTPUT_DIR="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Error: opción desconocida: $1" >&2; usage >&2; exit 1 ;;
  esac
done

command -v node >/dev/null || { echo "Error: se requiere Node.js." >&2; exit 1; }
command -v zip >/dev/null || { echo "Error: se requiere el comando zip." >&2; exit 1; }
[[ -f "$MANIFEST" ]] || { echo "Error: no se encontró manifest.json." >&2; exit 1; }

if [[ -n "$BUMP" ]]; then
  node - "$MANIFEST" "$BUMP" <<'NODE'
const fs = require('fs');
const [manifestPath, bump] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(manifest.version || '');
if (!match) throw new Error('La versión debe tener el formato mayor.menor.parche (por ejemplo, 1.0.0).');
let [major, minor, patch] = match.slice(1).map(Number);
if (bump === 'major') [major, minor, patch] = [major + 1, 0, 0];
if (bump === 'minor') [minor, patch] = [minor + 1, 0];
if (bump === 'patch') patch += 1;
manifest.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Versión actualizada a ${manifest.version}`);
NODE
fi

VERSION="$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version)" "$MANIFEST")"
mkdir -p "$OUTPUT_DIR"
ZIP_PATH="$OUTPUT_DIR/lector-tdah-v${VERSION}.zip"
rm -f "$ZIP_PATH"

# Se incluyen únicamente los archivos que Edge/Chrome necesita; el ZIP se abre en su raíz.
(
  cd "$ROOT_DIR"
  zip -q -X "$ZIP_PATH" \
    manifest.json content.js popup.html popup.css \
    icons/icon-16.png icons/icon-32.png icons/icon-48.png icons/icon-128.png
)

echo "Paquete creado: $ZIP_PATH"
echo "Versión: $VERSION"
