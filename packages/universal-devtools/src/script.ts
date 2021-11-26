import { withCDP } from 'headless-inspector-cdp';
import {
  createInspector,
  interceptConsole,
  interceptNetwork,
} from 'headless-inspector-core';

const enableInspector = async (wsUrl: string) => {
  const inspector = createInspector();
  interceptConsole(inspector);
  interceptNetwork(inspector);
  await withCDP(inspector, wsUrl);
};

const main = async () => {
  await enableInspector('ws://localhost:9222');
  console.log('Headless Inspector has been enabled');
};

window.addEventListener('load', () => {
  main();
});
