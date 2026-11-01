# Lector TDAH para Microsoft Edge

Extensión Manifest V3 que crea un entorno de lectura despejado y destaca las letras iniciales de cada palabra (una pista visual o *bionic reading*). La técnica es configurable: de 1 a 5 letras, texto ampliado y guía visual por párrafo.

## Instalar en Edge

1. Abre `edge://extensions`.
2. Activa **Modo de desarrollador**.
3. Elige **Cargar descomprimida** y selecciona esta carpeta.
4. Abre un artículo HTTP/HTTPS y pulsa el icono de **Lector TDAH**.

No se envía contenido de las páginas a ningún servicio: el texto se procesa localmente en la pestaña. La extensión no se ejecuta en páginas internas del navegador, tiendas de extensiones ni documentos PDF, por limitaciones del navegador.

## Empaquetar para Chrome Web Store

El ZIP debe contener `manifest.json` en su raíz. El script incluido prepara exactamente ese archivo:

```sh
./package-extension.sh
```

Se guardará como `dist/lector-tdah-v1.0.0.zip` (con la versión que tenga el manifiesto). Para publicar una actualización en Chrome Web Store, la versión debe ser mayor que la ya publicada; incrementa el parche y crea el ZIP en un paso:

```sh
./package-extension.sh --bump patch
```

También admite `--bump minor` y `--bump major`. Revisa y confirma el cambio de `manifest.json` antes de subir el ZIP.

## Arquitectura

- `content.js`: identifica el contenido principal, genera un clon seguro para leer y aplica las pistas visuales sin alterar la página original.
- `popup.*`: interruptor y preferencias, almacenadas con `chrome.storage.sync`.
- `icons/`: identidad visual de la extensión en las resoluciones requeridas por Edge.
- `manifest.json`: configuración de Edge/Chromium Manifest V3.
