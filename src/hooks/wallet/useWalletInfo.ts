import { useAccount, useBalance, useChains } from 'wagmi'
import { formatEther } from 'viem'

export function useWalletInfo() {
  const { address, connector, isConnected } = useAccount()
  const chain = useChains()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: address,
  })

  const formattedBalance = balance ? {
    value: balance.value,
    formatted: formatEther(balance.value),
    symbol: balance.symbol,
    decimals: balance.decimals
  } : undefined

  return {
    address,
    isConnected,
    connector: connector ? {
      id: connector.id,
      name: connector.name,
      type: connector.type,
      icon: connector.icon
    } : undefined,
    chain: chain ? {

    } : undefined,
    balance: formattedBalance,
    isBalanceLoading
  }
}