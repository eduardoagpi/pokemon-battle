# Poke-Albo Monorepo

¡Bienvenido al monorepo fullstack de Poke-Albo! Este proyecto está estructurado utilizando **NPM Workspaces** y está escrito completamente en TypeScript usando **ESModules**.

## 🏗️ Estructura del Proyecto

El código está dividido en tres paquetes principales dentro de la carpeta `packages/`:

```text
poke-albo/
├── package.json         # Archivo raíz que define los NPM Workspaces
├── README.md            # Este archivo
└── packages/
    ├── frontend/        # Aplicación SPA cliente
    │   └── Vite + React + TypeScript
    ├── backend/         # API del servidor
    │   └── Node + Express + TypeScript
    └── shared/          # Código común entre Node y React
        └── DTOs, interfaces, constantes, utilidades
```

### Paquetes

- **`@poke-albo/frontend`**: Una aplicación React generada con Vite. Lista para un desarrollo ágil de la interfaz visual.
- **`@poke-albo/backend`**: Un servidor Express listo para exponer endpoints. Transpilado y ejecutado usando `tsx` para una recarga en caliente veloz.
- **`@poke-albo/shared`**: Paquete utilitario. Cualquier tipo de dato o lógica de negocio compartida debe vivir aquí. Backend y Frontend lo importan usando sus dependencias de NPM.

---

## 🚀 Comandos Principales

Puedes correr la mayoría de los comandos desde la **raíz del proyecto** gracias a la configuración de los workspaces.

### Instalación

Antes de empezar, asegúrate de estar en la ruta raíz del repositorio e instala todas las dependencias:

```bash
npm install
```
*Esto instalará las dependencias de todos los proyectos (`frontend`, `backend` y `shared`) y creará los enlaces simbólicos o symlinks.*

### Iniciar Desarrollo (Frontend + Backend)

Para correr tanto la API de Express como la interfaz de React al mismo tiempo con _hot-reloading_:

```bash
npm run dev
```

### Compilar el código compartido (`shared`)

Si modificas el código de `packages/shared`, es recomendable compilarlo para que tanto frontend como backend detecten correctamente los últimos cambios o tipos nuevos:

```bash
npm run build -w @poke-albo/shared
```

*(Opcional: puedes compilar todos los proyectos corriendo `npm run build` en la raíz).*

---

## 💻 Comandos Específicos por Paquete

Si deseas correr scripts en un workspace en particular sin moverte de carpeta usa la bandera `-w`:

### En el Backend (`packages/backend`)

- `npm run dev -w @poke-albo/backend`: Inicia solo el servidor de desarrollo del backend.
- `npm run build -w @poke-albo/backend`: Compila el backend a la carpeta `dist/`.

### En el Frontend (`packages/frontend`)

- `npm run dev -w frontend`: Inicia solo la aplicación web en Vite.
- `npm run build -w frontend`: Compila el frontend a producción mediante Vite.
- `npm run preview -w frontend`: Sirve localmente la versión ya compilada a producción del frontend.


## Docker

### Modo Development
En el modo desarrollo, solo es necesario levantar mongo db:

1.
docker compose --env-file .env.prod up mongo mongo-init mongo-express --build

2. 
Los demas servicios se levantaran usando npm run dev desde el root del proyecto
$ npm run dev -w backend -- -3001
$ npm run dev -w backend -- -3002
$ npm run dev -w battle-service
$ npm run dev -w frontend

$ (cd flutter_app && flutter run -d chrome)


### Modo despliegue
docker compose --env-file .env.dev up --build -d