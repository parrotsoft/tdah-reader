# Lector TDAH para Microsoft Edge

Extensión Manifest V3 que crea un entorno de lectura despejado y destaca las letras iniciales de cada palabra (una pista visual o *bionic reading*). La técnica es configurable: de 1 a 5 letras, texto ampliado y guía visual por párrafo.

## Instalar en Edge

1. Abre `edge://extensions`.
2. Activa **Modo de desarrollador**.
3. Elige **Cargar descomprimida** y selecciona esta carpeta.
4. Abre un artículo HTTP/HTTPS y pulsa el icono de **Lector TDAH**.

No se envía contenido de las páginas a ningún servicio: el texto se procesa localmente en la pestaña. La extensión no se ejecuta en páginas internas del navegador, tiendas de extensiones ni documentos PDF, por limitaciones del navegador.

## Arquitectura

- `content.js`: identifica el contenido principal, genera un clon seguro para leer y aplica las pistas visuales sin alterar la página original.
- `popup.*`: interruptor y preferencias, almacenadas con `chrome.storage.sync`.
- `manifest.json`: configuración de Edge/Chromium Manifest V3.
