# Editor personal de escritura

Aplicación personal para analizar y revisar textos en español con asistencia de modelos de lenguaje. El objetivo es mejorar claridad, ritmo, precisión, naturalidad y voz sin convertir el texto en una prosa genérica ni optimizarlo para evadir detectores de IA.

## Estado

Primera implementación funcional. Incluye editor de hasta 1.500 palabras, perfiles de estilo, análisis estructurado, reescritura conservadora, comparación, explicación de cambios, reescritura de fragmentos, exportación y almacenamiento local opcional.

## Arquitectura

- Frontend: React + TypeScript + Vite.
- Backend: Cloudflare Pages Functions.
- Proveedor inicial: NVIDIA NIM, modelo `z-ai/glm-5.2`.
- La API key vive sólo en el backend mediante un Secret de Cloudflare.
- El historial, cuando está activado, se guarda sólo en el navegador.
- No se usa base de datos ni almacenamiento remoto de textos.
- Los adaptadores de proveedor están separados de la lógica editorial para facilitar futuras integraciones.

Cloudflare Pages Functions ejecuta código server-side en la red de Cloudflare y permite acceder a secrets desde `context.env`; los secrets están destinados a API keys y tokens. Ver la documentación oficial: https://developers.cloudflare.com/pages/functions/ y https://developers.cloudflare.com/pages/functions/bindings/.

NVIDIA documenta el endpoint compatible con OpenAI para GLM-5.2 en `https://integrate.api.nvidia.com/v1/chat/completions`. El proyecto usa salida estructurada mediante `response_format` y valida adicionalmente la respuesta antes de mostrarla como revisión. Referencia: https://docs.api.nvidia.com/nim/reference/z-ai-glm-5.2-infer.

## Desarrollo local

Requisitos:

- Node.js 20+.
- Una NVIDIA API key con acceso al modelo configurado.

Instalación:

```bash
npm install
```

Crear `.dev.vars` en la raíz:

```text
NVIDIA_API_KEY="tu_clave_aqui"
NVIDIA_MODEL="z-ai/glm-5.2"
```

Nunca publiques ese archivo ni pegues una API key real en el repositorio.

Para desarrollar sólo el frontend:

```bash
npm run dev
```

Para probar frontend + Pages Functions:

```bash
npm run pages:dev
```

## Variables / secrets

`NVIDIA_API_KEY` — secret obligatorio para llamar a NVIDIA.

`NVIDIA_MODEL` — modelo, por defecto `z-ai/glm-5.2`.

Para una instancia personal pública, se recomienda proteger el proyecto con **Cloudflare Access** antes de exponerlo ampliamente. La API de modelos no se expone al navegador.

En producción, crear `NVIDIA_API_KEY` como **Secret**, no como variable pública. Cloudflare indica que los secrets se almacenan cifrados y sólo son accesibles programáticamente desde las Functions.

## Privacidad

La aplicación no guarda deliberadamente el texto en un servidor propio. El texto sí atraviesa la Pages Function y se envía al proveedor de modelos configurado cuando el usuario solicita un análisis o una reescritura. Por eso no debe interpretarse “sin almacenamiento local remoto” como “el texto nunca sale del dispositivo”.

El historial local se puede desactivar. Al hacerlo, las versiones dejan de guardarse en `localStorage`.

No se envían textos automáticamente a Pangram ni a otros detectores de IA.

Si vas a procesar información clínica o cualquier otra información altamente sensible, verificá primero las condiciones de privacidad, tratamiento y retención del proveedor del modelo que hayas configurado. La aplicación no garantiza por sí sola una política de retención del proveedor externo.

## Reutilización del Space original

El proyecto original de Lynote fue publicado bajo MIT. Se conserva en `original/` como referencia histórica y para preservar su procedencia. La primera versión reutiliza sólo conceptos de protección/preservación y la idea de edición conservadora; la interfaz Gradio y el marketing original no forman parte del producto nuevo.

Proyecto original: https://huggingface.co/spaces/Lynote/free-ai-humanizer

### Attribution

This project incorporates selected ideas and rule-based text protection concepts from Lynote's `free-ai-humanizer`, licensed under the MIT License.

Original project: https://huggingface.co/spaces/Lynote/free-ai-humanizer

## Pruebas

Ejecutar:

```bash
npm test
```

La carpeta `tests/fixtures/edge-cases.md` contiene casos para Markdown, URLs, citas, nombres propios, código, español rioplatense e información clínica sensible de prueba. Las pruebas automáticas cubren texto vacío, límite de 1.500 palabras y preservación de URLs/cifras.

Las pruebas de API reales deben hacerse con una key de prueba y nunca con datos clínicos reales.

## Licencia

MIT. Ver `LICENSE`.
