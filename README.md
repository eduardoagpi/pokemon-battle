# Poke-Albo Documentación

Este es el repositorio para el proyecto **Poke-Albo**, un juego de batalla Pokémon en tiempo real.

---

## Características

- **Sistema de Matchmaking:** Los jugadores indican un nickname, reciben una asignación aleatoria de 3 Pokémon y entran a un lobby. La batalla inicia automáticamente al encontrar un contrincante.
- **Combate por Turnos:** Solo un jugador puede atacar a la vez. El orden de inicio se determina por la velocidad del primer Pokémon de cada equipo.
- **Condiciones de Victoria:** Un jugador gana al derrotar a todos los Pokémon del oponente o si este huye del combate.
- **Configuración Dinámica:** El endpoint de la API se puede modificar en runtime para apuntar a diferentes servicios de datos.
- **Historial:** Se puede obtener el historial de batallas según el nombre del usuario.

---

## Ejecución

El proyecto está dockerizado y se puede ejecutar usando Docker Compose:

`docker compose --env-file .env.prod up --build -d`

**Nota para Windows:** Debido a un bug de Docker Compose, es posible que sea necesario ejecutar `$env:DOCKER_BUILDKIT=0` antes de correr el comando docker compose.

### Servicios Levantados

| Servicio | URL / Protocolo |
| :--- | :--- |
| **Frontend React** | http://localhost:5000 |
| **Frontend Flutter** | http://localhost:5001 |
| **Mongo Express** | http://localhost:8081 |
| **Backend API 1** | http://localhost:3001 |
| **Backend API 2** | http://localhost:3002 |
| **Battle Service** | ws://localhost:3003 y http://localhost:3003 |

---

## Demo

### React Clients


https://github.com/user-attachments/assets/4c490707-6181-40bc-829d-d0a6bdf24003



### Mixed Clients (React & Flutter)


https://github.com/user-attachments/assets/a9908132-ec7a-4037-981f-8f3eca2b324a



*Nota: La API de Pokémon es configurable. Si el puerto es par, los nombres de los Pokémon tendrán el sufijo "_API2".*

---

## Estructura del Proyecto

El proyecto consta de 5 servicios:
- **Backend:** API para listar y obtener detalles de Pokémon.
- **Battle Service:** Servicio para gestionar batallas en tiempo real con soporte WebSocket.
- **Frontend Web:** Desarrollado en React con Vite.
- **Frontend Flutter:** Frontend móvil/web en Flutter.
- **MongoDB:** Base de datos con soporte de Change Streams y Mongo Express para administración.

---

## Ejecución en Modo Desarrollo

Levantar únicamente los servicios de base de datos con Docker:
`docker compose --env-file .env.prod up mongo mongo-init mongo-express --build`

Levantar los servicios restantes desde el root usando npm:
- `npm run dev -w backend -- -3001`
- `npm run dev -w backend -- -3002`
- `npm run dev -w battle-service`
- `npm run dev -w frontend`
- `npm run dev:flutter`

### Workspace Shared
Es una librería compartida de DTOs entre frontend (React) y backend. Para compilarla:
`npm run build -w shared`

---

# Arquitectura

## Backend
El backend es una API REST para exponer los endpoints de listar/detalles de pokemones. (Los datos se obtuvieron de scrappear https://pokeapi.co/ )
Se creo este backend con 2 propósitos:
- Evitar dependencia de apis externas al proyecto.
- Agregar pequeña logica para que si el enpoint es impar, los pokemones regresan su nombre con el sufijo "_API2", y asi poder distinguir entre las 2 instancias del backend.

Los endpoints son solo /list y /list/:id

Este es un helper api, muy sencillo, por lo que no se agrego ninguna arquitectura compleja.

## Battle Service
El battle service es un servicio que se encarga de gestionar las batallas pokemon en tiempo real. Se utiliza arquitectura por capas, separando la logica de negocio de la logica de persistencia de datos y la de presentacion.

### Capa de datos
En la capa de persistencia se utiliza mongoDB para persistir los datos de las batallas. Mongo DB se utiliza con change stream y de esta manera la BD es el source of truth de todo el sistema. Con esta estrategia se evita la gestion de estados en memoria, lo que hace que el servicio sea mas robusto y escalable horizontalmente.

### Capa de negocio
En la capa de negocio se agregaron repositories (abstracciones) y usecases. En ellos se maneja la logica del negocio: Crear salas de espera, crear batallas, gestionar eventos de batalla, etc.

### Capa de presentacion
En la capa de presentacion se encuentra la logica de presentacion, que se encarga transformar los eventos de dominio en mensajes de websocket y viceversa. Ademas se encarga de gestionar las conexiones de websocket.

## Frontend (web)
El frontend es una aplicacion react SPA que se encarga de mostrar la interfaz de usuario. La arquitectura elegida fue con el siguiente stack:
- React Query (para gestion del estado del servidor. Llamadas a la API)
- ReactContexts (para gestion del estado del cliente.)
- React Hooks. Con logica de negocio para realizar acciones relacionadas al negocio (getPokemonList, handleBattleState, getBattleHistory, etc...)
- ViewControllers, para ser el puente entre el estado de la app y la vista. Se encargan de exponer 2 atributos: state y actions. Y así, permitir que las views sean lo mas tontas posibles.
- Views, son componentes react que se encargan de mostrar la interfaz de usuario. Son vistas puras sin logica, y unicamente se encargan de renderizar el estado recibido desde el viewcontroller y llamar a las acciones en consecuencia a las acciones del usuario.

## Frontend (flutter)
El frontend flutter genera una SPA y utiliza una clean architecture estricta, con el patron de presentacion BLoC

### Capa de dominio
- Entidades
- Repositories (abstracciones)
- UseCases

### Capa de datos
- Repositories (implementaciones)
- DataSources (remotos y locales)

### Capa de presentacion
- BLoCs
- Views

### Infraestructura y Dockerizacion
El proyecto está completamente dockerizado.
La base de datos es mongoDB, pero antes de levantarla, se requiere configurar una keyfile para el replica set, asi como la ejecucion de mongo-init para inicializar el replica set. Para dichos procesos se crearon los servicios key-gen y mongo-init.

Se agrega un servicio de mongo-express para administrar la base de datos via dashboard web.

### Foto de mongo express

La dockerizacion crea dos instancias del backend, cada una en un puerto diferente, a fin de poder probar la funcionalidad de cambio de endpoint en runtime.

El proyecto una vez levantado, consta de la siguiente infraestructura:
