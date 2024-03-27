import { useLocalStorage } from '@solana/wallet-adapter-react';
import { FC, ReactNode, createContext, useContext, useState } from 'react';

export interface AutoConnectContextState {
    autoConnect: boolean;
    setAutoConnect(autoConnect: boolean): void;
    address: string | null;
    setAddress: (address: string | null) => void;
}

export const AutoConnectContext = createContext<AutoConnectContextState>({} as AutoConnectContextState);

export function useAutoConnect(): AutoConnectContextState {
    return useContext(AutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // TODO: fix auto connect to actual reconnect on refresh/other.
    // TODO: make switch/slider settings
    const [autoConnect, setAutoConnect] = useLocalStorage('autoConnect', true);
    const [address, setAddress] = useState<string | null>(null);

    return (
        <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect, address, setAddress}}>
            {children}
        </AutoConnectContext.Provider>
    );
};