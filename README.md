# usePersistentState

## How to use

```typescript
const [state, setState] = usePersistentState(initialState, componentID);
```

### Use state

Everything here is exactly how useState works, except for what will be explained in the next section:

### Component ID

Component ID is the tag that your state will be stored under in localStorage. Other than this, `usePersistentState` acts exactly like `useState` in react.

## Supported Data Types

All data that is serialisable is available for use in usePersistentState. The only addition to this is Dates. Dates can't be included inside of objects for now. In future I may add the option of including SuperJSON as a transformer.
