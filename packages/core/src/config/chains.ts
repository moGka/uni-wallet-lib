import { mainnet, goerli, sepolia, polygon, arbitrum, optimism, base } from 'wagmi/chains'
import type { Chain } from 'viem'

export const supportedChains: readonly [Chain, ...Chain[]] = [
  mainnet,
  goerli,
  sepolia,
  polygon,
  arbitrum,
  optimism,
  base
] as const

export const defaultChain = mainnet

export const chainIcons: Record<number, string> = {
  [mainnet.id]: '🔷',
  [goerli.id]: '🔷',
  [sepolia.id]: '🔷',
  [polygon.id]: '💜',
  [arbitrum.id]: '🔵',
  [optimism.id]: '🔴',
  [base.id]: '🔵'
}

export const getChainIcon = (chainId: number): string => {
  return chainIcons[chainId] || '⛓️'
}