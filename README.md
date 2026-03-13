# Poke-Albo Documentación

Este es el repositorio para el proyecto **Poke-Albo**, un juego de batalla Pokémon en tiempo real.

## Ejecución

El proyecto está dockerizado y se puede ejecutar usando Docker Compose:

`docker compose --env-file .env.prod up --build -d`

### It's alive!!! 🎉🎉🥳
El proyecto puede correr ingresando a http://107.175.35.124/
Porfavor escribe al desarrollador para obtener las credenciales de acceso


**Nota para Windows:** Debido a un bug de Docker Compose, es posible que sea necesario ejecutar `$env:DOCKER_BUILDKIT=0` antes de correr el comando docker compose.

Luego se podra ingresar a cualquiera de los 2 frontends (react o flutter)
**Frontend React**: `http://localhost:5000`
**Frontend Flutter**: `http://localhost:5001`

---

## Características
Reglas del juego:
- **Matchmaking:** Los jugadores ingresarán un nickname. Al confirmarlo recibirán una asignación aleatoria de 3 Pokémones y entran a un lobby en espera de un contrincante. La batalla inicia automáticamente al encontrar un contrincante. Los pokemones no se deben repetir entre combatientes. Si ese fuera el caso, se crea un nuevo hall, a la espera de otro combatiente sin pokemones repetidos (edge case)
- **Combate por Turnos:** Solo un jugador puede atacar a la vez. El primer jugador en atacar sera aquel cuyo primer pokemon tenga la mayor velocidad.
- **Condiciones de Victoria:** Un jugador gana al derrotar a todos los Pokémon del oponente o si este huye del combate.
- **Configuración Dinámica:** El endpoint de la API se puede modificar en runtime para apuntar a diferentes servicios de datos.
- **Historial:** Se puede obtener el historial de batallas según el nombre del usuario.

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

Al levantar el Docker compose, los siguientes servicios se levantan

### Servicios Levantados

| Servicio | URL / Protocolo |
| :--- | :--- |
| **Frontend React** | http://localhost:5000 |
| **Frontend Flutter** | http://localhost:5001 |
| **Mongo Express** | http://localhost:8081 |
| **Backend API 1** | http://localhost:3001 |
| **Backend API 2** | http://localhost:3002 |
| **Battle Service** | ws://localhost:3003 y http://localhost:3003 |


## Ejecución en Modo Desarrollo

Levantar únicamente los servicios de base de datos con Docker:
`docker compose --env-file .env.prod up mongo mongo-init mongo-express --build`

Levantar los servicios restantes desde el root usando npm:
- `npm run dev -w backend -- -3001`
- `npm run dev -w backend -- -3002`
- `npm run dev -w battle-service`
- `npm run dev -w frontend`
- `npm run dev:flutter`

Adicinonalmente es necesario compilar el proyecto de `shared`
Ese proyecto es una librería con DTOs (http rest & web sockets models) que son compartidos entre el frontend (React) y backend. El objetivo es evitar redefinir los mismos modelos entre esos proyectos. Como ventaja adicional, los proyectos siempre usaran los mismos modelos, forzando a ajustarlos en caso de que alguno de los DTOs cambie.

Es necesario compilarla para que los demas proyectos funcionen:
`npm run build -w shared`

---

# Arquitectura

## Backend
Durante el desarrollo, se observo que la api https://pokemon-api-92034153384.us-central1.run.app/ , presentaba algunas intermitencias (endpoint not found)
Para solventarlo se creeó este servicio API REST que expone los endpoints de listar/detalles de pokemones en el mismo formato especificado en el docuemnto de requerimientos. (Los datos se obtuvieron de scrappear https://pokeapi.co/ )
Se creó este backend con 2 propósitos:
- Evitar dependencia de apis externas al proyecto.
- Agregar pequeña logica para que si el enpoint es impar, los pokemones regresan su nombre con el sufijo "_API2", y asi poder distinguir entre las 2 instancias del backend.

Los endpoints son solo /list y /list/:id

Este es un helper api, muy sencillo, por lo que no se agrego ninguna arquitectura compleja.

## Battle Service
El battle service es un servicio que se encarga de gestionar las batallas pokemon en tiempo real. Se utiliza arquitectura por capas, separando la logica de negocio de la logica de persistencia de datos y la de presentacion.

### Capa de Infrastructura

#### Datos
En la capa de persistencia se utiliza mongoDB para persistir los datos de las batallas. Mongo DB se utiliza con change stream y de esta manera la BD es el source of truth de todo el sistema. Con esta estrategia se evita la gestion de estados en memoria, lo que hace que el servicio sea mas robusto y escalable horizontalmente.

#### Conectividad
Gestionar las conexiones de websocket: nuevas conecciones, envío y recepcion de mensajes con los clientes conectados

### Capa de negocio
En la capa de negocio se agregaron repositories (abstracciones) y usecases. En ellos se maneja la logica del negocio: Crear salas de espera, crear batallas, gestionar eventos de batalla, etc.

### Capa de presentacion
En la capa de presentacion se encuentra la logica de presentacion, que se encarga transformar los eventos de dominio en mensajes de websocket y viceversa.

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

## Infraestructura y Dockerizacion
El proyecto está completamente dockerizado.

La base de datos es mongoDB con change streams habilitado, para soportar el realtime desde la BD. Para activar change streams es necesario habilitar replica set, y para ello configurar una keyfile para el replica set, asi como la ejecucion de mongo-init para inicializar el replica set. Para dichos procesos se crearon los servicios de docker: `key-gen` y `mongo-init`.

El proyecto una vez levantado, consta de la siguiente infraestructura:

<img height="530" alt="Dibujo sin título" src="https://github.com/user-attachments/assets/c75d7afd-a63b-4f84-b21e-1dc4584ee99c" />

La dockerizacion crea dos instancias del backend, cada una en un puerto diferente, a fin de poder probar la funcionalidad de cambio de endpoint en runtime.

### Variables de entorno
Los archivos .env.xxx con las variables de entorno se agregaron al repositorio. Esto se hizo por ser un proyecto demo, pero **NUNCA** deberían de agregarse en un proyecto "real"

### Dashboard Mongo

Se agrega un servicio de `mongo-express` para administrar la base de datos via dashboard web.

<img width="2556" height="1093" alt="Screenshot 2026-03-12 121151" src="https://github.com/user-attachments/assets/7c3fed4c-49d1-434a-a83e-48724d60b714" />
