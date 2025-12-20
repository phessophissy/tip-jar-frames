import { http, createConfig, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { farcasterFrame } from '@farcaster/miniapp-wagmi-connector';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    // Farcaster frame connector - prioritized when in a frame
    farcasterFrame(),
    // Fallback connectors for non-frame contexts
    injected(),
    coinbaseWallet({
      appName: 'Tip Jar Frames',
    }),
  ],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }),
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
