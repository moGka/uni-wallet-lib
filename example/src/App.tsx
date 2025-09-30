import { WalletProvider } from 'uni-wallet-lib'
import WalletDemo from './components/WalletDemo'

function App() {
  return (
    <WalletProvider
      appName="uni-wallet-lib Example"
      projectId="YOUR_WALLETCONNECT_PROJECT_ID"
      alchemyApiKey="YOUR_ALCHEMY_API_KEY"
    >
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <WalletDemo />
      </div>
    </WalletProvider>
  )
}

export default App