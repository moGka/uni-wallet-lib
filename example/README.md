# uni-wallet-lib Example

This is a demonstration application showing how to use the `uni-wallet-lib` library for Web3 wallet integration.

## Features Demonstrated

- 🔗 **Wallet Connection**: Connect/disconnect wallets using RainbowKit
- 📊 **Wallet Information**: Display address, ENS name, balance, and current network
- 🔄 **Network Switching**: Switch between supported blockchain networks
- 🎨 **Theme Support**: Beautiful UI with gradient backgrounds and responsive design

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   - `VITE_WALLETCONNECT_PROJECT_ID`: Required for wallet connections
   - `VITE_ALCHEMY_API_KEY`: Optional, for better RPC performance
   - `VITE_INFURA_API_KEY`: Optional, alternative to Alchemy

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

## Getting API Keys

### WalletConnect Project ID (Required)
1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Sign up and create a new project
3. Copy your Project ID

### Alchemy API Key (Optional)
1. Visit [Alchemy](https://www.alchemy.com/)
2. Sign up and create a new app
3. Copy your API key

### Infura API Key (Optional)
1. Visit [Infura](https://infura.io/)
2. Sign up and create a new project
3. Copy your API key

## Supported Networks

- Ethereum Mainnet
- Sepolia Testnet
- Polygon
- Arbitrum One
- Optimism
- Base

## Library Usage

This example demonstrates the main hooks provided by `uni-wallet-lib`:

```tsx
import { useWalletConnection, useWalletInfo, useWalletSwitch } from 'uni-wallet-lib'

// Connection state and methods
const { isConnected, address, disconnect } = useWalletConnection()

// Wallet information
const { balance, ensName, chainId, chain } = useWalletInfo()

// Network switching
const { switchChain, isPending } = useWalletSwitch()
```

## Troubleshooting

- Make sure you have a WalletConnect Project ID configured
- Ensure you have a Web3 wallet installed (MetaMask, Rainbow, etc.)
- Check the browser console for any error messages