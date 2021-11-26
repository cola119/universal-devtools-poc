export type EvEmitter<EventValueMap extends Record<string, unknown>> = {
  on: <Key extends keyof EventValueMap>(
    key: Key,
    handler: (v: EventValueMap[Key]) => void
  ) => void;
  emit: <Key extends keyof EventValueMap>(
    key: Key,
    value: EventValueMap[Key]
  ) => void;
};

let preventInfiniteEmit = false;

export const evemitter = <
  EventValueMap extends Record<string, unknown>
>(): EvEmitter<EventValueMap> => {
  const map = new Map();

  return {
    on: (key, handler) => {
      map.set(key, handler);
    },
    emit: (key, value) => {
      if (map.has(key) && !preventInfiniteEmit) {
        const h = map.get(key);
        preventInfiniteEmit = true;
        h(value);
        preventInfiniteEmit = false;
      }
    },
  };
};
