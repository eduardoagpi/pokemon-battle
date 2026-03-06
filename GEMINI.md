# Poke-Albo - Guía de Proyecto para Inteligencia Artificial (GEMINI.md)

Este archivo sirve como contexto y libro de reglas para el desarrollo de la aplicación **Poke-Albo**. Cuando asistas en este proyecto, siempre debes apegarte a las directrices descritas aquí.

## 🏗️ 1. Arquitectura del Sistema

El proyecto está diseñado como un **Monorepo** gestionado a través de **NPM Workspaces**. 

La arquitectura sigue el modelo Cliente-Servidor (Fullstack) con un fuerte enfoque en compartir contratos de datos a través de un paquete interno.

### Componentes Principales:
1. **Frontend (`packages/frontend`)**:
   - **Tecnología**: React (crudo) + Vite.
   - **Lenguaje**: TypeScript.
   - **Rol**: Aplicación cliente SPA (Single Page Application). Consume la API del backend.
2. **Backend (`packages/backend`)**:
   - **Tecnología**: Node.js + Express.
   - **Lenguaje**: TypeScript.
   - **Rol**: Servidor API RESTful. Maneja la lógica de negocio, reglas de validación y acceso a base de datos (por definir). Se ejecuta usando `tsx` en desarrollo.
3. **Shared (`packages/shared`)**:
   - **Tecnología**: TypeScript puro.
   - **Rol**: Librería central interna. Contiene DTOs (Data Transfer Objects), interfaces, enums y funciones de utilidad puras compartidas entre Frontend y Backend. Garantiza que ambos lados hablen el mismo "idioma".

---

## 📜 2. Reglas de Codificación (Coding Guidelines)

Para mantener la consistencia en el código base, todo el código nuevo debe cumplir con lo siguiente:

### Estándares Globales:
- **ESModules (ESM) Siempre**: Todo el monorepo utiliza `"type": "module"`. Las importaciones de Node deben usar sintaxis `import/export`, nunca `require`.
- **TypeScript Estricto**: Todo el código debe estar fuertemente tipado. Evitar el uso de `any` a menos que sea estrictamente necesario.
- **Importaciones de Paquetes Internos**: 
  - Para importar código compartido, usar siempre: `import { ... } from '@poke-albo/shared';`.
  - Si el paquete `shared` se modifica, debe compilarse (`npm run build -w @poke-albo/shared`) para que TypeScript en los otros proyectos detecte los tipos correctamente.

### Estándares del Frontend:
- Usar _Functional Components_ y React Hooks.
- Mantener los componentes pequeños y modulares.
- Las llamadas a la API deben tiparse usando las interfaces exportadas desde `@poke-albo/shared`.

### Estándares del Backend:
- Estructurar en Controladores (Controllers), Servicios (Services) y Rutas (Routes) a medida que crezca.
- Responder JSON en la API y tipar los parámetros y respuestas de Express (ej. `req: Request`, `res: Response`).

---

## 💼 3. Reglas de Negocio (Business Rules)

*(Nota: Esta sección debe ser expandida a medida que los requerimientos del producto se definan, pero estos son los lineamientos base)*

1. **Única Fuente de Verdad para Datos**: Las entidades (ej. Usuarios, Pokémons, Transacciones) deben tener su interfaz TypeScript definida **únicamente** en `packages/shared`. Ni el backend ni el frontend deben re-declarar estas formas de datos.
2. **Validación**: Toda validación de entrada crítica debe ocurrir en el Backend. El Frontend puede implementar validaciones para mejorar la experiencia de usuario (UX), pero no reemplaza la seguridad del servidor.

---

## 📂 4. Estructura de Directorios

```text
poke-albo/
├── package.json         (Define scripts raíz y NPM workspaces)
└── packages/
    ├── frontend/
    │   ├── src/         (Código fuente de React)
    │   ├── index.html   (Punto de entrada HTML)
    │   ├── vite.config.ts
    │   └── package.json
    ├── backend/
    │   ├── src/         (Código fuente de la API / Express)
    │   ├── tsconfig.json
    │   └── package.json
    └── shared/
        ├── src/         (Tipos, Interfaces, Funciones comunes)
        ├── tsconfig.json
        └── package.json
```
