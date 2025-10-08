import { Link, useLocation } from 'react-router-dom'
import { WalletButton } from 'uni-wallet-lib'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Wallet Demo', icon: '👛' },
    { path: '/token', label: 'YD Token', icon: '🪙' },
    { path: '/course', label: 'Course Contract', icon: '📚' },
  ]

  return (
    <div style={{
      background: '#f0eee6',
      marginBottom: '24px',
      borderRadius: '12px',
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#667eea'
        }}>
          uni-wallet-lib
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: location.pathname === item.path ? 'white' : '#374151',
                background: location.pathname === item.path
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                fontWeight: location.pathname === item.path ? '600' : '500',
                transition: 'all 0.2s',
                fontSize: '14px'
              }}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
        {/* Wallet Connect Button */}
        <div style={{ marginLeft: '16px' }}>
          <WalletButton />
        </div>
      </div>
    </div>
  )
}

export default Navigation
