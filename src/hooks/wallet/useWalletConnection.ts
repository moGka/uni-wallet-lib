import { useAccount, useConnect, useDisconnect, useChains, useChainId } from 'wagmi'
import type { WalletState } from '../../types'

export function useWalletConnection(): WalletState & 
{ connect: (connectorId?: string) => void,
   disconnect: () => void 
} {
  const { address, connector, isConnected, isConnecting, isReconnecting } = useAccount()
  const chainId = useChainId()
  const chains = useChains()
  const { connect: wagmiConnect, connectors } = useConnect()
  const {disconnect: wagmiDisconnect} = useDisconnect()

  // 根据当前chainId找到对应的chain对象
  const currentChain = chains.find(chain => chain.id === chainId)

  const connect = (connectorId?: string) => {
    if (connectorId) {
      const targetConnector = connectors.find(c => c.id === connectorId)
      if (targetConnector) {
        wagmiConnect({connector: targetConnector})
      }
    } else {
      const availableConnector = connectors[0]
      if (availableConnector) {
        wagmiConnect({ connector: availableConnector })
      }
    }
  }

  const disconnect = () => {
    wagmiDisconnect()
  }

  return {
    isConnected,
    isConnecting,
    isReconnecting,
    address,
    connector: connector ? {
      id: connector.id,
      name: connector.name,
      type: connector.type
    } : undefined,
    chain: currentChain,
    chains,
    connect,
    disconnect
  }
}