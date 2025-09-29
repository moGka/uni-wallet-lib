import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import './WalletButton.module.css'

export interface WalletButtonProps {
  label?: string,
  showBalance?: boolean,
  showChainName?: boolean,
  className?: string,
  size?: 'small' | 'medium' | 'large'
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  label = '连接钱包',
  showBalance = true,
  showChainName = true,
  className = '',
  size = 'medium'
}: WalletButtonProps) => {


  return (
    <div className={`wallet-button wallet-button--${size} ${className}`}>
      <ConnectButton.Custom>
        {
          ({
            account,
            chain: currentChain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted
          }) => {
            const ready = mounted && authenticationStatus !== 'loading'
            const connected = ready && account && currentChain && (!authenticationStatus || authenticationStatus === 'authenticated')
            return (
              <div className='wallet-button__container'>
                {(() => {
                  if (!connected) {
                    return(
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="wallet-button__connect"
                      >
                        {label}
                      </button>
                    )
                  }

                  return(
                    <div className="wallet-button__connected">
                      {showChainName && (
                        <button
                          onClick={openChainModal}
                          className="wallet-button__chain"
                          type="button"
                        >
                          {currentChain.iconUrl && (
                            <div className="wallet-button__chain-icon">
                              <img
                                alt={currentChain.name ?? 'Chain icon'}
                                src={currentChain.iconUrl}
                                className="wallet-button__icon"
                              />
                            </div>
                          )}
                          {currentChain.name}
                        </button>
                      )}

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="wallet-button__account"
                      >
                        {showBalance && account.displayBalance && (
                          <span className="wallet-button__balance">
                            {account.displayBalance}
                          </span>
                        )}
                        <span className="wallet-button__address">
                          {account.displayName}
                        </span>
                      </button>
                    </div>
                  )
                })()}
              </div>
            )
          }
        }
      </ConnectButton.Custom>
    </div>
  )
}