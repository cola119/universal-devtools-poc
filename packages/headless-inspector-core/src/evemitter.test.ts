import { evemitter } from './evemitter';

describe('evemitter', () => {
  it('should dispatch the handler related to the given key', () => {
    const emitter = evemitter();
    emitter.on('key', (value) => {
      expect(value).toBe(true);
    });
    emitter.emit('key', true);
    emitter.emit('key2', false);
  });

  it('should dispatch the latests handler related to the given key', () => {
    const emitter = evemitter();
    emitter.on('key', (value) => {
      expect(value).toBe(true);
    });
    emitter.emit('key', true);
    emitter.on('key', (value) => {
      expect(value).toBe(false);
    });
    emitter.emit('key', false);
  });
});
