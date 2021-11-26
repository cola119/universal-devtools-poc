import { EvEmitter } from '../../evemitter';
import { ConsoleType, EventValueMap } from '../../types';

export const consoleHandlerFactory = (
  emitter: EvEmitter<EventValueMap>
): (<T extends ConsoleType>(type: T) => ProxyHandler<Console[T]>) => {
  const createHandler = <T extends ConsoleType>(
    type: T
  ): ProxyHandler<Console[T]> => ({
    apply: function (target, thisArg, argumentsList) {
      const timestamp = Date.now();
      emitter.emit('consoleAPIHasBeenCalled', {
        argumentsList,
        type,
        timestamp,
      });
      return Reflect.apply(target, thisArg, argumentsList);
    },
  });

  return createHandler;
};

export const interceptConsole = (emitter: EvEmitter<EventValueMap>): void => {
  const createHandler = consoleHandlerFactory(emitter);
  console.log = new Proxy(console.log, createHandler('log'));
  console.error = new Proxy(console.error, createHandler('error'));
  console.warn = new Proxy(console.warn, createHandler('warn'));
  console.info = new Proxy(console.info, createHandler('info'));
};
