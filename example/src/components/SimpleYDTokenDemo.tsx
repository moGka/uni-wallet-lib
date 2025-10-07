import { useSimpleYDToken } from 'uni-wallet-lib'
import { useState } from 'react'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'

const SimpleYDTokenDemo = () => {
  const { address: userAddress } = useAccount()
  const [spenderAddress, setSpenderAddress] = useState<Address>('0x0a42F4f8Cb23460BDeD2e18475920Bdb6df5641d')
  const [transferTo, setTransferTo] = useState<Address>()
  const [transferAmount, setTransferAmount] = useState('')
  const [approveAmount, setApproveAmount] = useState('')

  const {
    totalSupply,
    balance,
    allowance,
    transferReceipt,
    approveReceipt,
    refetchBalance,
    refetchAllowance,
    transfer,
    approve,
  } = useSimpleYDToken({
    spenderAddress,
    enabled: !!userAddress,
  })

  const handleTransfer = async () => {
    if (!transferTo || !transferAmount) {
      alert('请输入接收地址和转账金额')
      return
    }
    try {
      await transfer(transferTo, transferAmount)
      alert('转账交易已提交，等待确认...')
      setTimeout(() => refetchBalance(), 3000)
    } catch (error: any) {
      alert(`转账失败: ${error.message}`)
    }
  }

  const handleApprove = async () => {
    if (!spenderAddress || !approveAmount) {
      alert('请输入授权地址和授权金额')
      return
    }
    try {
      await approve(spenderAddress, approveAmount)
      alert('授权交易已提交，等待确认...')
      setTimeout(() => refetchAllowance(), 3000)
    } catch (error: any) {
      alert(`授权失败: ${error.message}`)
    }
  }

  const formatBalance = (value: bigint | undefined) => {
    if (!value) return '0'
    return (Number(value) / 1e18).toFixed(4)
  }

  return (
    <div style={{
      maxWidth: '1000px',
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
        🪙 SimpleYDToken Demo
      </h1>

      {!userAddress && (
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '16px',
          padding: '32px'
        }}>
          <p>👆 请先连接钱包</p>
        </div>
      )}

      {userAddress && (
        <>
          {/* Token 基本信息 */}
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
              📊 代币信息
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
              <InfoRow label="总供应量" value={`${formatBalance(totalSupply)} YD`} />
              <InfoRow label="我的余额" value={`${formatBalance(balance)} YD`} />
              <InfoRow
                label="授权额度"
                value={`${formatBalance(allowance)} YD`}
                sublabel={`授权给: ${spenderAddress.slice(0, 6)}...${spenderAddress.slice(-4)}`}
              />
            </div>
          </div>

          {/* 转账功能 */}
          <div style={{
            background: '#f0fdf4',
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
              💸 转账
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  接收地址:
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value as Address)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  转账数量 (YD):
                </label>
                <input
                  type="text"
                  placeholder="100"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                onClick={handleTransfer}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {transferReceipt.isLoading ? '⏳ 交易确认中...' : '💸 发送转账'}
              </button>

              {transferReceipt.isSuccess && (
                <div style={{ color: '#10b981', fontSize: '14px' }}>
                  ✅ 转账成功! 交易哈希: {transferReceipt.data?.transactionHash.slice(0, 10)}...
                </div>
              )}
            </div>
          </div>

          {/* 授权功能 */}
          <div style={{
            background: '#fef3c7',
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
              🔑 授权
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  授权地址 (Spender):
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={spenderAddress}
                  onChange={(e) => setSpenderAddress(e.target.value as Address)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  授权数量 (YD):
                </label>
                <input
                  type="text"
                  placeholder="1000"
                  value={approveAmount}
                  onChange={(e) => setApproveAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                onClick={handleApprove}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {approveReceipt.isLoading ? '⏳ 交易确认中...' : '🔑 授权'}
              </button>

              {approveReceipt.isSuccess && (
                <div style={{ color: '#f59e0b', fontSize: '14px' }}>
                  ✅ 授权成功! 交易哈希: {approveReceipt.data?.transactionHash.slice(0, 10)}...
                </div>
              )}
            </div>
          </div>

          {/* 刷新按钮 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => refetchBalance()}
              style={{
                background: '#6366f1',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🔄 刷新余额
            </button>
            <button
              onClick={() => refetchAllowance()}
              style={{
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🔄 刷新授权
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// 信息行组件
const InfoRow = ({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb'
  }}>
    <div>
      <span style={{ fontWeight: '500', color: '#6b7280' }}>{label}:</span>
      {sublabel && (
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          {sublabel}
        </div>
      )}
    </div>
    <span style={{ color: '#111827', fontWeight: '600' }}>{value}</span>
  </div>
)

export default SimpleYDTokenDemo
