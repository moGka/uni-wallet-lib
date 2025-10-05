# Wagmi v2 合约交互快速入门指南

## 目录
1. [核心概念](#核心概念)
2. [读取合约数据](#读取合约数据)
3. [写入合约数据](#写入合约数据)
4. [监听合约事件](#监听合约事件)
5. [高级用法](#高级用法)

---

## 核心概念

### 基础配置

Wagmi 需要配置支持的链和传输层：

```ts
import { http, createConfig } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})
```

### 什么是 Connectors（连接器）？

**Connector** 是钱包连接器，代表一种连接钱包的方式。每种钱包类型需要不同的连接器。

#### 常见的 Connectors：

**1. `injected()` - 注入式钱包**
```ts
import { injected } from 'wagmi/connectors'

injected() // 自动检测浏览器扩展钱包
```
支持的钱包：
- MetaMask
- Brave Wallet
- Trust Wallet
- Rabby
- 任何注入 `window.ethereum` 的钱包

**2. `walletConnect()` - WalletConnect 协议**
```ts
import { walletConnect } from 'wagmi/connectors'

walletConnect({
  projectId: 'YOUR_PROJECT_ID' // 从 walletconnect.com 获取
})
```
支持的钱包：
- Rainbow
- Trust Wallet (移动端)
- Argent
- imToken
- 200+ 支持 WalletConnect 的钱包

**3. `coinbaseWallet()` - Coinbase 钱包**
```ts
import { coinbaseWallet } from 'wagmi/connectors'

coinbaseWallet({
  appName: 'My App'
})
```

**4. `metaMask()` - 专用 MetaMask 连接器**
```ts
import { metaMask } from 'wagmi/connectors'

metaMask() // 仅连接 MetaMask
```

**5. `safe()` - Gnosis Safe**
```ts
import { safe } from 'wagmi/connectors'

safe() // 用于多签钱包
```

#### 手动配置 Connectors

使用 `createConfig` 手动配置：

```ts
import { createConfig, http } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),                              // 浏览器钱包
    walletConnect({ projectId: 'abc123' }),  // WalletConnect
    coinbaseWallet({ appName: 'My App' }),   // Coinbase
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})
```

#### 使用 RainbowKit 自动配置（推荐）

使用 `getDefaultConfig` 自动包含常用连接器：

```ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, base } from 'wagmi/chains'

const config = getDefaultConfig({
  appName: 'My App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})

// 自动包含以下 connectors：
// - injected()
// - walletConnect({ projectId })
// - coinbaseWallet({ appName })
// - safe()
```

#### 在组件中使用 Connectors

```tsx
import { useConnect } from 'wagmi'

function ConnectButton() {
  const { connectors, connect } = useConnect()

  return (
    <>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {/* 显示: MetaMask, WalletConnect, Coinbase Wallet 等 */}
        </button>
      ))}
    </>
  )
}
```

### 合约配置

定义合约的基本信息（地址和 ABI）：

```ts
export const contractConfig = {
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: [
    {
      type: 'function',
      name: 'balanceOf',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ type: 'uint256' }],
    },
    // ... 更多 ABI 定义
  ],
} as const
```

---

## 读取合约数据

### 1. 基础读取 - `useReadContract`

读取单个合约函数的数据：

```tsx
import { useReadContract } from 'wagmi'

function TokenBalance() {
  const { data, isPending, error } = useReadContract({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: contractConfig.abi,
    functionName: 'balanceOf',
    args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
  })

  if (isPending) return <div>加载中...</div>
  if (error) return <div>错误: {error.message}</div>

  return <div>余额: {data?.toString()}</div>
}
```

### 2. 批量读取 - `useReadContracts`

一次调用多个合约函数：

```tsx
import { useReadContracts } from 'wagmi'

function MultiRead() {
  const { data } = useReadContracts({
    contracts: [
      {
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
        abi: contractConfig.abi,
        functionName: 'balanceOf',
        args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
      },
      {
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
        abi: contractConfig.abi,
        functionName: 'totalSupply',
      },
    ],
  })

  const [balance, totalSupply] = data || []

  return (
    <>
      <div>余额: {balance?.result?.toString()}</div>
      <div>总供应量: {totalSupply?.result?.toString()}</div>
    </>
  )
}
```

### 3. 条件查询

只在条件满足时执行查询：

```tsx
const { data: balance } = useReadContract({
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: contractConfig.abi,
  functionName: 'balanceOf',
  args: [userAddress],
  query: {
    enabled: !!userAddress, // 只在有地址时查询
  },
})
```

### 4. 自动刷新数据

监听新区块并自动刷新：

```tsx
import { useEffect } from 'react'
import { useBlockNumber, useReadContract } from 'wagmi'

function AutoRefresh() {
  const { data: balance, refetch } = useReadContract({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: contractConfig.abi,
    functionName: 'balanceOf',
    args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
  })

  const { data: blockNumber } = useBlockNumber({ watch: true })

  useEffect(() => {
    refetch() // 每个新区块都刷新
    // 或者每 5 个区块刷新一次：
    // if (blockNumber % 5n === 0n) refetch()
  }, [blockNumber, refetch])

  return <div>余额: {balance?.toString()}</div>
}
```

---

## 写入合约数据

### 1. 基础写入 - `useWriteContract`

执行合约的写入操作：

```tsx
import { useWriteContract } from 'wagmi'

function TransferToken() {
  const { writeContract, isPending, data: hash } = useWriteContract()

  const handleTransfer = () => {
    writeContract({
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      abi: contractConfig.abi,
      functionName: 'transfer',
      args: [
        '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', // 接收地址
        100n, // 转账数量
      ],
    })
  }

  return (
    <>
      <button onClick={handleTransfer} disabled={isPending}>
        {isPending ? '发送中...' : '转账'}
      </button>
      {hash && <div>交易哈希: {hash}</div>}
    </>
  )
}
```

### 2. 表单提交示例

```tsx
import { useWriteContract } from 'wagmi'

function MintNFT() {
  const { writeContract, data: hash } = useWriteContract()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const tokenId = formData.get('tokenId') as string

    writeContract({
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi: contractConfig.abi,
      functionName: 'mint',
      args: [BigInt(tokenId)],
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="tokenId" placeholder="输入 Token ID" required />
      <button type="submit">铸造 NFT</button>
      {hash && <div>交易哈希: {hash}</div>}
    </form>
  )
}
```

### 3. 等待交易确认

使用 `useWaitForTransactionReceipt` 等待交易上链：

```tsx
import {
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi'

function MintWithConfirmation() {
  const {
    writeContract,
    data: hash,
    isPending,
    error
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const handleMint = (tokenId: string) => {
    writeContract({
      address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
      abi: contractConfig.abi,
      functionName: 'mint',
      args: [BigInt(tokenId)],
    })
  }

  return (
    <>
      <button onClick={() => handleMint('123')} disabled={isPending}>
        {isPending ? '确认中...' : '铸造'}
      </button>

      {hash && <div>交易哈希: {hash}</div>}
      {isConfirming && <div>等待确认...</div>}
      {isConfirmed && <div>交易已确认！</div>}
      {error && <div>错误: {error.message}</div>}
    </>
  )
}
```

### 4. 模拟交易 - `useSimulateContract`

在发送前验证交易是否会成功：

```tsx
import { useSimulateContract, useWriteContract } from 'wagmi'

function SafeTransfer() {
  const { data } = useSimulateContract({
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    abi: contractConfig.abi,
    functionName: 'transfer',
    args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', 100n],
  })

  const { writeContract } = useWriteContract()

  return (
    <button
      disabled={!data?.request}
      onClick={() => data?.request && writeContract(data.request)}
    >
      安全转账
    </button>
  )
}
```

### 5. 批量写入 - `useWriteContracts` (实验性)

一次执行多个合约调用：

```tsx
import { useWriteContracts } from 'wagmi/experimental'
import { parseAbi } from 'viem'

const abi = parseAbi([
  'function approve(address, uint256) returns (bool)',
  'function transferFrom(address, address, uint256) returns (bool)',
])

function BatchWrite() {
  const { writeContracts } = useWriteContracts()

  const handleBatch = () => {
    writeContracts({
      contracts: [
        {
          address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
          abi,
          functionName: 'approve',
          args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC', 100n],
        },
        {
          address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
          abi,
          functionName: 'transferFrom',
          args: [
            '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
            '0x0000000000000000000000000000000000000000',
            100n,
          ],
        },
      ],
    })
  }

  return <button onClick={handleBatch}>批量执行</button>
}
```

---

## 监听合约事件

### 1. 监听事件 - `useWatchContractEvent`

实时监听合约事件：

```tsx
import { useWatchContractEvent } from 'wagmi'

function WatchTransfers() {
  useWatchContractEvent({
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    abi: contractConfig.abi,
    eventName: 'Transfer',
    onLogs(logs) {
      console.log('新的转账事件:', logs)
      logs.forEach(log => {
        console.log('从:', log.args.from)
        console.log('到:', log.args.to)
        console.log('数量:', log.args.value)
      })
    },
  })

  return <div>正在监听转账事件...</div>
}
```

---

## 高级用法

### 1. 指定区块读取

读取历史区块的数据：

```tsx
const { data } = useReadContract({
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  abi: contractConfig.abi,
  functionName: 'totalSupply',
  blockNumber: 17829139n, // 指定区块号
})
```

或使用区块标签：

```tsx
const { data } = useReadContract({
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  abi: contractConfig.abi,
  functionName: 'totalSupply',
  blockTag: 'safe', // 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'
})
```

### 2. 指定链 ID

跨链读取数据：

```tsx
import { mainnet } from 'wagmi/chains'

const { data } = useReadContract({
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  abi: contractConfig.abi,
  functionName: 'totalSupply',
  chainId: mainnet.id, // 指定在主网读取
})
```

### 3. 自定义账户

模拟其他账户调用合约：

```tsx
const { data } = useSimulateContract({
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  abi: contractConfig.abi,
  functionName: 'transfer',
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', 100n],
  account: '0xd2135CfB216b74109775236E36d4b433F1DF507B', // 指定调用账户
})
```

### 4. 发送 ETH

在写入时发送以太币：

```tsx
import { parseEther } from 'viem'

writeContract({
  address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  abi: contractConfig.abi,
  functionName: 'mint',
  args: [1n],
  value: parseEther('0.01'), // 发送 0.01 ETH
})
```

---

## 常用工具函数

### 从 viem 导入

```ts
import {
  parseEther,      // '1.0' -> 1000000000000000000n
  formatEther,     // 1000000000000000000n -> '1.0'
  parseUnits,      // '1.0' + 6 decimals -> 1000000n
  formatUnits,     // 1000000n + 6 decimals -> '1.0'
  parseAbi,        // 解析人类可读的 ABI
} from 'viem'
```

### 示例

```ts
// 解析 1 ETH
const value = parseEther('1.0') // 1000000000000000000n

// 格式化 Wei 为 ETH
const formatted = formatEther(1000000000000000000n) // '1.0'

// 解析 USDC (6 decimals)
const usdcAmount = parseUnits('100', 6) // 100000000n

// 格式化 USDC
const formattedUsdc = formatUnits(100000000n, 6) // '100'

// 人类可读的 ABI
const abi = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
])
```

---

## 最佳实践

### 1. 类型安全

使用 `as const` 确保 ABI 类型推断：

```ts
export const abi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const // 重要！
```

### 2. 错误处理

总是处理错误和加载状态：

```tsx
const { data, isPending, error } = useReadContract({...})

if (isPending) return <Loading />
if (error) return <Error message={error.message} />
return <Data value={data} />
```

### 3. 复用合约配置

```ts
// contracts.ts
export const tokenConfig = {
  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  abi: [...],
} as const

// Component.tsx
const { data } = useReadContract({
  ...tokenConfig,
  functionName: 'balanceOf',
  args: [address],
})
```

### 4. 使用 BigInt

区块链数字使用 `BigInt`：

```ts
const amount = 100n // BigInt 字面量
const value = BigInt(100) // 构造函数
const parsed = parseEther('1.0') // 返回 BigInt
```

---

## 调试技巧

### 1. 查看完整错误

```tsx
import { type BaseError } from 'wagmi'

if (error) {
  const errorMessage = (error as BaseError).shortMessage || error.message
  console.log('错误详情:', error)
  return <div>错误: {errorMessage}</div>
}
```

### 2. 检查请求数据

```tsx
const { data } = useSimulateContract({...})
console.log('模拟结果:', data?.request)
console.log('预估 gas:', data?.result)
```

### 3. 监控交易状态

```tsx
const { data: receipt } = useWaitForTransactionReceipt({ hash })
console.log('交易收据:', receipt)
console.log('Gas 使用:', receipt?.gasUsed)
console.log('状态:', receipt?.status) // 'success' | 'reverted'
```

---

## 总结

**读取数据：**
- `useReadContract` - 单个读取
- `useReadContracts` - 批量读取

**写入数据：**
- `useWriteContract` - 执行交易
- `useSimulateContract` - 模拟验证
- `useWaitForTransactionReceipt` - 等待确认

**监听事件：**
- `useWatchContractEvent` - 实时监听

**核心工具：**
- `parseEther` / `formatEther` - ETH 转换
- `parseUnits` / `formatUnits` - 代币转换
- `parseAbi` - 解析 ABI

记住：所有数字使用 `BigInt`，ABI 使用 `as const`，总是处理加载和错误状态！
