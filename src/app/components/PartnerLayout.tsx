import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Users, TrendingUp, CreditCard, Settings, LogOut } from 'lucide-react';
import partnersData from '../data/partners-data.json';

interface PartnerLayoutProps {
  children: React.ReactNode;
}

export function PartnerLayout({ children }: PartnerLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock partner data - в реальном приложении это будет из auth context
  const currentPartner = partnersData.partners[0];

  const navItems = [
    { path: '/partner/dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { path: '/partner/clients', label: 'Клиенты', icon: Users },
    { path: '/partner/earnings', label: 'Начисления', icon: TrendingUp },
    { path: '/partner/payouts', label: 'Выплаты', icon: CreditCard },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f7f8' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '260px', 
        background: 'white', 
        borderRight: '1px solid #e5e5e5',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo / Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            FASTWMS
          </div>
          <div style={{ fontSize: '13px', color: '#666' }}>Партнёрский портал</div>
        </div>

        {/* Partner Info */}
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #e5e5e5',
          background: '#f9fafb'
        }}>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
            Партнёр
          </div>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '2px' }}>
            {currentPartner.name}
          </div>
          <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
            {currentPartner.referralCode}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: isActive ? '#f0fdf9' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #10a37f' : '3px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#10a37f' : '#666',
                  marginBottom: '4px',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid #e5e5e5' }}>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#666',
              marginBottom: '4px'
            }}
          >
            <Settings size={18} />
            Настройки
          </button>
          <button
            onClick={() => navigate('/portal-selector')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: '#dc2626'
            }}
          >
            <LogOut size={18} />
            Выход
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
