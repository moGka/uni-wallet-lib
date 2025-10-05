import { mainnet } from 'wagmi/chains'
import type { Chain } from 'viem'

export const supportedChains: readonly [Chain, ...Chain[]] = [
  mainnet
] as const

export const defaultChain = mainnet

export const chainIcons: Record<number, string> = {
  [mainnet.id]: '🔷',
}

export const getChainIcon = (chainId: number): string => {
  return chainIcons[chainId] || '⛓️'
}