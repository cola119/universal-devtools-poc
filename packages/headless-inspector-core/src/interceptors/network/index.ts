import { EvEmitter } from '../../evemitter';
import { EventValueMap } from '../../types';
import { createFetchApiHandler } from './fetch';
import { createXHRHandler } from './xhr';

export const interceptNetwork = (emitter: EvEmitter<EventValueMap>): void => {
  if (window.fetch) {
    const handler = createFetchApiHandler(emitter);
    window.fetch = new Proxy(window.fetch, handler);
  }
  if (window.XMLHttpRequest) {
    const handler = createXHRHandler(emitter);

    window.XMLHttpRequest.prototype.open = new Proxy(
      window.XMLHttpRequest.prototype.open,
      handler.open
    );
    window.XMLHttpRequest.prototype.send = new Proxy(
      window.XMLHttpRequest.prototype.send,
      handler.send
    );
    window.XMLHttpRequest = new Proxy(
      window.XMLHttpRequest,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler.construct as any
    );
  }
};
