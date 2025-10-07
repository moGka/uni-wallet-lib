import { WalletProvider } from 'uni-wallet-lib'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import WalletDemo from './components/WalletDemo'
import SimpleYDTokenDemo from './components/SimpleYDTokenDemo'
import CourseContractDemo from './components/CourseContractDemo'

function App() {
  return (
    <WalletProvider
      appName="uni-wallet-lib Example"
      projectId="YOUR_WALLETCONNECT_PROJECT_ID"
      alchemyApiKey="YOUR_ALCHEMY_API_KEY"
    >
      <BrowserRouter>
        <div style={{
          minHeight: '100vh',
          // background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          background: '#f0eee6',
          padding: '0 20px 20px'
        }}>
          <Navigation />

          <Routes>
            <Route path="/" element={<WalletDemo />} />
            <Route path="/token" element={<SimpleYDTokenDemo />} />
            <Route path="/course" element={<CourseContractDemo />} />
          </Routes>
        </div>
      </BrowserRouter>
    </WalletProvider>
  )
}

export default App