import React from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWalletConfig, type WalletConfigOptions } from '../config/wagmi'
import { customLightTheme, customDarkTheme } from '../config/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

export interface WalletProviderProps extends WalletConfigOptions {
  children: React.ReactNode
  theme?: 'light' | 'dark' | 'auto'
  queryClient?: QueryClient
}

const defaultQueryClient = new QueryClient ({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

export function WalletProvider({
  children,
  theme = 'auto',
  queryClient = defaultQueryClient,
  ...configOptions
}: WalletProviderProps): React.ReactElement {

  const { config: wagmiConfig } = React.useMemo(
    () => createWalletConfig(configOptions),
    [
      configOptions.appName, 
      configOptions.projectId,
      configOptions.alchemyApiKey,
      configOptions.infuraApiKey
    ]
  )

  const rainbowKitTheme = React.useMemo(() => {
    return customDarkTheme
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider
          theme={rainbowKitTheme}
          modalSize="compact"
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}