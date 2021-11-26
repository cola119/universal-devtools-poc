import { HeadlessInspector } from 'headless-inspector-core';
import { CDPClient } from './client';
import { attachDOMEvents } from './events/dom';
import { attachNetworkEvents } from './events/network';
import { attachRuntimeEvents } from './events/runtime';

export const withCDP = async (
  interceptor: HeadlessInspector,
  wsUrl: string
): Promise<void> => {
  const client = await CDPClient.init(wsUrl);
  attachRuntimeEvents(client, interceptor);
  attachNetworkEvents(client, interceptor);
  attachDOMEvents(client);
};
