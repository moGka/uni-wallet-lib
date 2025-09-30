import { useWalletConnection, useWalletInfo, useNetworkSwitch } from 'uni-wallet-lib'
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import { WalletButton as ConnectButton} from 'uni-wallet-lib'
import { useState } from 'react'
import { mainnet, sepolia, polygon, arbitrum, optimism, base } from 'viem/chains'

const WalletDemo = () => {
  const { isConnected, address, disconnect } = useWalletConnection()
  const { balance, ensName, chainId, chain } = useWalletInfo()
  const { switchToNetwork, isPending } = useNetworkSwitch()
  const [selectedChainId, setSelectedChainId] = useState<number>(mainnet.id)

  const supportedChains = [
    { id: mainnet.id, name: 'Ethereum Mainnet' },
    { id: sepolia.id, name: 'Sepolia Testnet' },
    { id: polygon.id, name: 'Polygon' },
    { id: arbitrum.id, name: 'Arbitrum One' },
    { id: optimism.id, name: 'Optimism' },
    { id: base.id, name: 'Base' },
  ]

  const handleSwitchChain = () => {
    switchToNetwork({ chainId: selectedChainId })
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '32px',
        fontSize: '32px',
        fontWeight: 'bold'
      }}>
        🦄 uni-wallet-lib Demo
      </h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '32px'
      }}>
        <ConnectButton />
      </div>

      {isConnected && (
        <div style={{
          background: '#f8fafc',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{ 
            color: '#374151',
            marginBottom: '16px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            💼 Wallet Information
          </h2>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{ fontWeight: '500', color: '#6b7280' }}>Address:</span>
              <span style={{ fontFamily: 'monospace', color: '#111827' }}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            
            {ensName && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{ fontWeight: '500', color: '#6b7280' }}>ENS Name:</span>
                <span style={{ color: '#111827' }}>{ensName}</span>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{ fontWeight: '500', color: '#6b7280' }}>Network:</span>
              <span style={{ color: '#111827' }}>{chain?.name || 'Unknown'}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{ fontWeight: '500', color: '#6b7280' }}>Chain ID:</span>
              <span style={{ color: '#111827' }}>{chainId}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0'
            }}>
              <span style={{ fontWeight: '500', color: '#6b7280' }}>Balance:</span>
              <span style={{ color: '#111827' }}>
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      )}

      {isConnected && (
        <div style={{
          background: '#f0f9ff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h2 style={{
            color: '#374151',
            marginBottom: '16px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            🔄 Network Switching
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              Select Network:
            </label>
            <select
              value={selectedChainId}
              onChange={(e) => setSelectedChainId(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              {supportedChains.map(chain => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleSwitchChain}
            disabled={isPending || selectedChainId === chainId}
            style={{
              background: selectedChainId === chainId ? '#d1d5db' : '#3b82f6',
              color: selectedChainId === chainId ? '#6b7280' : 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: selectedChainId === chainId ? 'not-allowed' : 'pointer',
              width: '100%'
            }}
          >
            {isPending ? '⏳ Switching...' : 
             selectedChainId === chainId ? '✅ Current Network' : '🔄 Switch Network'}
          </button>
        </div>
      )}

      {isConnected && (
        <div style={{
          background: '#fef2f2',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h2 style={{
            color: '#374151',
            marginBottom: '16px',
            fontSize: '20px',
            fontWeight: '600'
          }}>
            ⚠️ Disconnect Wallet
          </h2>
          
          <button
            onClick={disconnect}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🔌 Disconnect
          </button>
        </div>
      )}

      {!isConnected && (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '16px',
          padding: '32px'
        }}>
          <p>👆 Connect your wallet to see detailed information and test features</p>
        </div>
      )}
    </div>
  )
}

export default WalletDemo