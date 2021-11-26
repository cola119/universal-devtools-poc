import { ProtocolMapping } from 'devtools-protocol/types/protocol-mapping';

export class CDPClient {
  private listenerMap: Map<
    keyof ProtocolMapping.Commands,
    (
      ...params: ProtocolMapping.Commands[keyof ProtocolMapping.Commands]['paramsType']
    ) =>
      | void
      | ProtocolMapping.Commands[keyof ProtocolMapping.Commands]['returnType']
  >;
  private constructor(private socket: WebSocket) {
    this.listenerMap = new Map();
    socket.addEventListener('message', this._onmesageListener.bind(this));
    socket.addEventListener('error', (e) => {
      console.error(e);
    });
  }
  static async init(wsUrl: string): Promise<CDPClient> {
    const socket = new WebSocket(wsUrl);
    socket.onclose = (e) => {
      console.log('close', e);
    };

    await new Promise((resolve, reject) => {
      socket.onopen = resolve;
      socket.onerror = reject;
    });
    const _this = new CDPClient(socket);
    return _this;
  }

  on<T extends keyof ProtocolMapping.Commands>(
    method: T,
    listener: (
      ...params: ProtocolMapping.Commands[T]['paramsType']
    ) => undefined | ProtocolMapping.Commands[T]['returnType']
  ): void {
    this.listenerMap.set(method, listener);
  }

  private _onmesageListener(msg: MessageEvent<string>): void {
    const message = JSON.parse(msg.data) as {
      id: string;
      method: keyof ProtocolMapping.Commands;
      params: Record<string, unknown>;
    };
    const listener = this.listenerMap.get(message.method);
    if (!listener) {
      const response = {
        id: message.id,
        method: message.method,
        result: {},
      };
      this.response(response);
      return;
    }
    const res = listener(message.params);
    const response = {
      id: message.id,
      method: message.method,
      result: !res ? undefined : res,
    };
    this.response(response);
  }

  emit<T extends keyof ProtocolMapping.Events>(
    method: T,
    params: ProtocolMapping.Events[T] extends [infer U] ? U : undefined
  ): void {
    this.socket.send(
      JSON.stringify({
        method,
        params,
      })
    );
  }

  private response<T extends keyof ProtocolMapping.Commands>(response: {
    id: string;
    method: T;
    result: ProtocolMapping.Commands[T]['returnType'];
  }): void {
    this.socket.send(JSON.stringify(response));
  }
}
