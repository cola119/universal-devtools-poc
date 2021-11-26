import { evemitter } from '../../evemitter';
import { EventValueMap } from '../../types';
import { consoleHandlerFactory } from '.';

describe('consoleHandlerFactory', () => {
  it('should intercept conosle api and emit consoleAPIHasBeenCalled event', () => {
    const emitter = evemitter<EventValueMap>();
    const createHandler = consoleHandlerFactory(emitter);
    const log = new Proxy(console.log, createHandler('log'));
    emitter.on(
      'consoleAPIHasBeenCalled',
      ({ argumentsList, type, timestamp }) => {
        expect(type).toBe('log');
        expect(argumentsList).toStrictEqual(['for test', 1, 2, true]);
        expect(timestamp).toBeDefined();
      }
    );
    log('for test', 1, 2, true);
  });

  it('should intercept conosle api only once even if it is called in the event listener function', () => {
    const emitter = evemitter<EventValueMap>();
    const createHandler = consoleHandlerFactory(emitter);
    const log = new Proxy(console.log, createHandler('log'));

    let counter = 0;
    emitter.on('consoleAPIHasBeenCalled', () => {
      log('');
      counter++;
      expect(counter).toBe(1);
      log('');
    });
    log('test');
  });
});
