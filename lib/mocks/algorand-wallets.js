// Generic mock for Algorand wallet connectors that might be missing
export class LiquidAuthClient {
  constructor() { console.warn("LiquidAuthClient is mocked."); }
}

export class PeraWalletConnect {
  constructor() { console.warn("PeraWalletConnect is mocked."); }
}

export default {
  LiquidAuthClient,
  PeraWalletConnect
};
