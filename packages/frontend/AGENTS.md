## Architecture

### ViewController Patern

Components follow a strict separation of concerns:
- **Views**: Dumb components, that make pure rendering. Recives `uiState` and `actions` from ViewController.
- **ViewControllers** (`ViewNameViewController.ts`): Smart components that handle logic and state, passing data to views. Returns `{uiState, actions}`. Function naming is `useViewNameViewController(){...}`
- **Ui Types** (`XxxUi.ts`): Typescript types for the uiState.    

Example structure:
```
src/component/UserProfile/
├── UserProfile.tsx                     # Componente tonto
├── UserProfileViewController.tsx       # Controlador inteligente
└── UserProfileUi.ts                    # Tipos de UI
```

### Data Layer

**API Layer** (`src/data/api/`):

- `axios.ts`: Configured Axios instance with auth interceptor
- Models: DTOs matching API request/responses using the interfaces exported from `@poke-albo/shared`.  
- `cacheKeys.ts`: React Query cache key constants

ReactQuery is used for data fetching and remote state management.

### State Management

State Management is handled using reactQuery for remote state and Context API for local state.
