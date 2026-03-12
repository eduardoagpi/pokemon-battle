# Poke-Albo Documentación

Este es el repository para el proyecto Poke-Albo, un juego de batalla Pokémon real-time.

## Características
- Los peleadores deberan indicar un nickname. Entonces recibirán una asignación aleatoria de 3 pokemones para la batalla y entrarán a un lobby en espera de un contrincante. Cuando se encuentra un contrincante, la batalla inicia.
- Las batallas pokemon, ocurren turno por turno, en los cuales solo un jugador puede atacar. Comienza el jugador cuyo primer pokemon sea el más rápido.
- El jugador gana cuando logra derrotar a todos los pokemones del oponente, o bien si el oponente huye del combate.
- Se pude modificar el endpoint de la api, en runtime, para apuntar a diferentes endpoints de la api de pokemones.
- Se pude obtener el historial de batallas, segun el nombre del usuario.

# Demo

Nota. La api de pokemones es configurable. Si el puerto es par, los nombres de pokemones tendran el sufijo "_API2".

# Estructura del Proyecto
El proyecto consta de 5 Servicios:
- Backend (API para listar pokemones y obtener detalles de pokemon)
- Battle Service (web service con websocket support para gestionar las batallas real-time)
- Frontend web (Frontend en react, con vite)
- Frontend flutter (Frontend en flutter)
- Mongo DB (Base de datos con soporte de change stream para notificaciones en tiempo real. Se incluye tambien mongo express para administrar la base de datos via dashboard web)

# Ejecución

## Modo Despliegue
El proyecto se encuentra dockerizado, por lo que se puede ejecutar usando docker compose:

docker compose --env-file .env.prod up --build -d
(En windows se encontró que debido a un bug de docker compose, quizas es necesario ejecutar esto antes de correr docker compose: '$env:DOCKER_BUILDKIT=0')

Despues de ejecutar docker compose, se levantaran los siguientes servicios:
### Frontends:
- Frontend web: http://localhost:5000
- Frontend flutter: http://localhost:5001
- Mongo Express: http://localhost:8081
### Servicios:
- Backend API1: http://localhost:3001
- Backend API2: http://localhost:3002
- Battle Service: ws://localhost:3003 y http://localhost:3003

## Modo Desarrollo
En el modo desarrollo, solo es necesario levantar con docker, los servicios de mongo
`docker compose --env-file .env.prod up mongo mongo-init mongo-express --build`

Los demas servicios se levantaran usando npm run dev desde el root del proyecto, segun lo requiera el desarrollador.
`npm run dev -w backend -- -3001`
`npm run dev -w backend -- -3002`
`npm run dev -w battle-service`
`npm run dev -w frontend`
`npm run dev:flutter`

El workspace de shared no se ejecuta de forma independiente, ya que es una libreria que se utiliza en los otros servicios. Dicha libreria es para usar los mismos DTOs entre frontend (react) y backend, y forzar el ajuste del codigo de ambos servicios cuando se realizan cambios en los DTOs.
Para compilar el workspace de shared (necesario para desarrollar en otros modulos) se debe usar el comando:
`npm run build -w shared`.

### Organizacion del proyecto
El proyecto es un monorepo organizado en workspaces, por lo que se puede ejecutar usando npm run dev desde el root del proyecto, segun lo requiera el desarrollador (con los comandos especificados en la seccion de "Modo Desarrollo").

- El proyecto flutter se encuentra en el root
- Los proyectos backend, battle-service, frontend y shared se encuentran en la carpeta packages

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