'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';

interface FarcasterContextType {
  isSDKLoaded: boolean;
  context: FrameContext | null;
  isInFrame: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isSDKLoaded: false,
  context: null,
  isInFrame: false,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Get context from Farcaster
        const ctx = await sdk.context;
        setContext(ctx);
        
        // Signal that the app is ready
        sdk.actions.ready();
        
        setIsSDKLoaded(true);
        console.log('Farcaster SDK initialized', ctx);
      } catch (error) {
        console.log('Not in Farcaster frame context', error);
        setIsSDKLoaded(true);
      }
    };

    initSDK();
  }, []);

  const isInFrame = !!context;

  return (
    <FarcasterContext.Provider value={{ isSDKLoaded, context, isInFrame }}>
      {children}
    </FarcasterContext.Provider>
  );
}
