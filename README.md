# Wiki de Seguridad en Microsoft Azure

Aplicación React (Vite) con una wiki basada en el laboratorio TI3062 (Caso B · Transportes Valle Azul).

## Ejecutar

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # genera la carpeta dist/
```

## Estructura

- `src/content.js`: todo el contenido (artículos como bloques). Para agregar un artículo, añade un objeto a una sección.
- `src/App.jsx`: layout, buscador, navegación por hash (`#/rbac`) y render de bloques.
- `src/styles.css`: estilos con modo claro/oscuro automático.

## Tipos de bloque

`h`, `p`, `ul`, `code`, `callout` (info | warn | ok) y `table`.
