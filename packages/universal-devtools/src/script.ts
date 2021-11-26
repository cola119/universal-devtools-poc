import { withCDP } from 'headless-inspector-cdp';
import {
  createInspector,
  interceptConsole,
  interceptNetwork,
} from 'headless-inspector-core';

class UnviersalDevTools {
  constructor(private wsUrl: string) {}

  async start() {
    const inspector = createInspector();
    interceptConsole(inspector);
    interceptNetwork(inspector);
    return await withCDP(inspector, this.wsUrl);
  }
}

export default UnviersalDevTools;
