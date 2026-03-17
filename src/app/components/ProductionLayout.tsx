import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  Package, 
  Calendar, 
  Truck, 
  FileText, 
  Settings, 
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';

interface ProductionLayoutProps {
  children: ReactNode;
}

export default function ProductionLayout({ children }: ProductionLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsCount] = useState(3);

  const menuItems = [
    { 
      id: 'orders', 
      label: 'Заказы', 
      icon: Package, 
      path: '/production/orders',
      count: 2
    },
    { 
      id: 'calendar', 
      label: 'Календарь / План', 
      icon: Calendar, 
      path: '/production/calendar' 
    },
    { 
      id: 'shipments', 
      label: 'Отгрузки', 
      icon: Truck, 
      path: '/production/shipments' 
    },
    { 
      id: 'documents', 
      label: 'Документы', 
      icon: FileText, 
      path: '/production/documents' 
    },
    { 
      id: 'settings', 
      label: 'Настройки', 
      icon: Settings, 
      path: '/production/settings' 
    },
  ];

  const isActive = (path: string) => {
    if (path === '/production/orders') {
      return location.pathname === path || location.pathname.startsWith('/production/orders/');
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#f7f7f8' 
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '70px',
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        transition: 'width 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100
      }}>
        {/* Logo & Toggle */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <div>
              <h1 style={{ 
                fontSize: '18px', 
                fontWeight: 700, 
                color: '#1f2937',
                margin: 0,
                marginBottom: '2px'
              }}>
                Производство
              </h1>
              <p style={{ 
                fontSize: '11px', 
                color: '#6b7280',
                margin: 0
              }}>
                Портал подрядчика
              </p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {sidebarOpen ? (
              <X style={{ width: '18px', height: '18px' }} />
            ) : (
              <Menu style={{ width: '18px', height: '18px' }} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {menuItems.map(item => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarOpen ? '12px 14px' : '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: active ? '#f0fdf4' : 'transparent',
                  color: active ? '#10a37f' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <Icon style={{ 
                  width: '20px', 
                  height: '20px',
                  flexShrink: 0
                }} />
                {sidebarOpen && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.count && item.count > 0 && (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: '#10a37f',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        {sidebarOpen && (
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10a37f 0%, #0e8a6d 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600
              }}>
                ФП
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1f2937',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  Фабрика "Прогресс"
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10a37f'
                  }} />
                  Онлайн
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '260px' : '70px',
        transition: 'margin-left 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Top Header */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          {/* Search */}
          <div style={{ 
            flex: 1, 
            maxWidth: '500px', 
            position: 'relative' 
          }}>
            <Search style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Поиск по заказам..."
              style={{
                width: '100%',
                height: '42px',
                padding: '0 16px 0 44px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                background: '#f9fafb',
                color: '#1f2937',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10a37f';
                e.currentTarget.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = '#f9fafb';
              }}
            />
          </div>

          {/* Notifications */}
          <button
            style={{
              position: 'relative',
              padding: '10px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
            }}
          >
            <Bell style={{ width: '20px', height: '20px' }} />
            {notificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid #fff'
              }} />
            )}
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
