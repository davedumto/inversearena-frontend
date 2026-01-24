import { useState, useCallback } from 'react';

/**
 * Wallet connection status
 */
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * Wallet hook return type
 */
export interface UseWalletReturn {
  /** Current connection status */
  status: WalletStatus;
  /** Connected wallet address (null if not connected) */
  address: string | null;
  /** Error message (null if no error) */
  error: string | null;
  /** Derived boolean for convenience */
  isConnected: boolean;
  /** Connect to wallet */
  connect: () => Promise<void>;
  /** Disconnect from wallet */
  disconnect: () => void;
}

/**
 * Mock wallet adapter for development
 * Replace this with actual Stellar wallet SDK integration later
 */
const mockWalletAdapter = {
  async connect(): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Simulate random success/failure (90% success rate)
    if (Math.random() < 0.9) {
      // Generate a mock Stellar address (starts with G, 56 characters)
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      let address = 'G';
      for (let i = 0; i < 55; i++) {
        address += chars[Math.floor(Math.random() * chars.length)];
      }
      return address;
    } else {
      throw new Error('User rejected the connection');
    }
  },
  
  disconnect(): void {
    // Cleanup logic would go here
  }
};

/**
 * Reusable wallet hook for managing wallet connection state
 * 
 * @example
 * ```tsx
 * const { status, address, isConnected, connect, disconnect } = useWallet();
 * 
 * if (isConnected) {
 *   return <div>Connected: {address}</div>;
 * }
 * 
 * return <button onClick={connect}>Connect Wallet</button>;
 * ```
 */
export function useWallet(): UseWalletReturn {
  const [status, setStatus] = useState<WalletStatus>('disconnected');
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    try {
      setStatus('connecting');
      setError(null);
      
      const walletAddress = await mockWalletAdapter.connect();
      
      setAddress(walletAddress);
      setStatus('connected');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      setStatus('error');
      setAddress(null);
    }
  }, []);

  const disconnect = useCallback(() => {
    mockWalletAdapter.disconnect();
    setStatus('disconnected');
    setAddress(null);
    setError(null);
  }, []);

  return {
    status,
    address,
    error,
    isConnected: status === 'connected',
    connect,
    disconnect,
  };
}
