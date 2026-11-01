# Política de Privacidad — Lector TDAH

**Última actualización:** 1 de noviembre de 2026

Esta política describe cómo la extensión **Lector TDAH** ("la extensión") trata tu información. En resumen: **la extensión no recopila, no almacena, no transmite y no vende ningún dato personal.** Todo el procesamiento ocurre localmente en tu navegador.

---

## 1. Datos que la extensión accede

### 1.1 Preferencias de lectura (almacenamiento local/sincronizado)

La extensión guarda **únicamente** la configuración que eliges en su popup mediante `chrome.storage.sync`:

- Número de letras resaltadas al inicio de cada palabra (1–5)
- Texto ampliado (activado/desactivado)
- Guía visual por párrafo (activado/desactivado)

Estos valores son **tus propias preferencias de uso**, no datos personales. Se almacenan en tu navegador y, si tienes la sincronización de Chrome activada, se sincronizan únicamente entre **tus propios dispositivos** autenticados con tu cuenta de Google, sujetos a la [Política de Privacidad de Google](https://policies.google.com/privacy). No se envían a ningún servidor nuestro.

### 1.2 Contenido de las páginas web

El script de contenido analiza el texto de la página **solo en tu dispositivo**, en la pestaña en la que activas el modo lector, para construir una vista de lectura despejada y resaltar las letras iniciales de cada palabra.

- **No se copia, no se guarda y no se envía** el contenido de las páginas a ningún servidor.
- No se envía a servicios de terceros (ni análisis, ni traducción, ni IA en la nube).
- El procesamiento es 100 % local y se elimina al cerrar el modo lector o la pestaña.

---

## 2. Datos que la extensión NO recopila

La extensión **no**:

- Recopila datos personales, nombre, correo ni información de contacto
- Registra el historial de navegación ni las URLs visitadas
- Lee el contenido de otras pestañas ni de tu actividad fuera del modo lector
- Utiliza cookies, píxeles de seguimiento, herramientas de analítica ni publicidad
- Comparte, vende ni cede datos a terceros
- Crea perfiles de usuario
- Ejecuta código remoto

---

## 3. Permisos y su uso

| Permiso | Uso |
|---|---|
| `storage` | Guardar tus preferencias de lectura (`chrome.storage.sync`). |
| `activeTab` | Acceso temporal a la pestaña activa **solo cuando haces clic en el icono** de la extensión, para leer el estado del modo lector y activarlo o desactivarlo. Se revoca automáticamente al cerrar la pestaña o dejar de usar la extensión. |
| Host (`http://*/*`, `https://*/*`) | Inyectar el script de contenido en la página que estás leyendo para aplicar el modo lector. No implica envío de datos. |

No se solicitan permisos adicionales (no hay `tabs`, `cookies`, `webRequest`, acceso a formularios ni a datos de navegación).

---

## 4. Servicios de terceros

La extensión **no se conecta a ningún servicio de terceros**. No hay peticiones de red de ningún tipo: ni a servidores propios, ni externos. La única comunicación posible es la sincronización de preferencias realizada por el propio navegador mediante `chrome.storage.sync`, gestionada por Google bajo su política de privacidad.

---

## 5. Seguridad

Las preferencias se almacenan mediante las API seguras de Chrome (`chrome.storage.sync`). Dado que la extensión no transmite información ni recibe datos de terceros, no existen canales de comunicación que requieran protección adicional por nuestra parte.

---

## 6. Privacidad de los menores

La extensión no está dirigida a recopilar información de ningún usuario, incluidos menores de edad, y no recopila ningún dato. Su uso es compatible con la lectura asistida en entornos educativos.

---

## 7. Cambios en esta política

Cualquier cambio relevante en esta política se publicará en este mismo archivo con la fecha de actualización actualizada. Los cambios sustanciales se notificarán mediante una actualización de la extensión.

---

## 8. Contacto

Si tienes preguntas sobre esta política de privacidad, abre un issue en el repositorio del proyecto o contacta con el desarrollador a través de la ficha de la extensión en la Chrome Web Store.
