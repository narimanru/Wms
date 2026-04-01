import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, Bell, CreditCard, User, Building, Store, FileText, Headphones, LogOut } from 'lucide-react';

interface TopHeaderProps {
  isCollapsed?: boolean;
}

export default function TopHeader({ isCollapsed = false }: TopHeaderProps) {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: isCollapsed ? '72px' : '260px',
      right: 0,
      background: '#fff', 
      padding: '8px 24px',
      zIndex: 99,
      height: '51px',
      transition: 'left 0.3s ease',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
        {/* Right Side Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Company Selector */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowCompanyMenu(!showCompanyMenu)}
              style={{
              padding: '8px 12px',
              background: 'transparent',
              border: 'none',
              borderRadius: '5px',
              fontSize: '15px',
              color: '#111827',
              fontWeight: '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F3F4F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            >
              KAMILEK
              <ChevronDown size={16} strokeWidth={1.5} />
            </button>

            {/* Company Dropdown Menu */}
            {showCompanyMenu && (
              <>
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 998
                  }}
                  onClick={() => setShowCompanyMenu(false)}
                />
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  minWidth: '220px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  zIndex: 999,
                  overflow: 'hidden',
                  padding: '8px'
                }}>
                  <button
                    onClick={() => {
                      setShowCompanyMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#F3F4F6',
                      border: 'none',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: '500',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                      marginBottom: '4px'
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#16A34A',
                      flexShrink: 0
                    }} />
                    KAMILEK
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowCompanyMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#6B7280',
                      fontWeight: '400',
                      transition: 'all 0.15s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'transparent',
                      flexShrink: 0
                    }} />
                    FASHION HOUSE
                  </button>

                  <div style={{
                    height: '1px',
                    background: '#E5E7EB',
                    margin: '8px 0'
                  }} />

                  <button
                    onClick={() => {
                      setShowCompanyMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: 'none',
                      border: 'none',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#111827',
                      fontWeight: '400',
                      transition: 'all 0.15s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    <Building size={16} strokeWidth={1.5} color="#6B7280" />
                    Добавить организацию
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Payment Status Button */}
          <button style={{
            padding: '6px 12px',
            background: '#FEF3E2',
            border: 'none',
            borderRadius: '5px',
            fontSize: '13px',
            color: '#F59E0B',
            fontWeight: '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FDE8C7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FEF3E2';
          }}
          >
            <CreditCard size={16} strokeWidth={1.5} />
            Ожидает оплаты
          </button>

          {/* Notifications */}
          <button style={{
            width: '40px',
            height: '40px',
            background: 'white',
            border: 'none',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F9FAFB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
          >
            <Bell size={20} strokeWidth={1.5} color="#111827" />
            {/* Notification Badge */}
            <div style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              background: '#EF4444',
              borderRadius: '50%',
              border: '2px solid white'
            }} />
          </button>

          {/* User Avatar with Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
              width: '30px',
              height: '30px',
              background: '#111827',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.15s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            >
              <User size={20} strokeWidth={1.5} />
              {/* Online Status */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                background: '#16A34A',
                borderRadius: '50%',
                border: '2px solid white'
              }} />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 998
                  }}
                  onClick={() => setShowUserMenu(false)}
                />
                <div style={{
                  position: 'absolute',
                  top: '52px',
                  right: 0,
                  width: '280px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  zIndex: 999,
                  overflow: 'hidden'
                }}>
                  {/* User Info Header */}
                  <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      background: '#111827',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '600',
                      position: 'relative',
                      flexShrink: 0
                    }}>
                      Н
                      <div style={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: '14px',
                        height: '14px',
                        background: '#16A34A',
                        borderRadius: '50%',
                        border: '3px solid white'
                      }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        Нариман
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        Администратор
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '8px' }}>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#111827',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <User size={20} strokeWidth={1.5} color="#6B7280" />
                      Профиль
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#111827',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <Building size={20} strokeWidth={1.5} color="#6B7280" />
                      Организация
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#111827',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <Store size={20} strokeWidth={1.5} color="#6B7280" />
                      Магазины
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#111827',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <FileText size={20} strokeWidth={1.5} color="#6B7280" />
                      Публичная оферта
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#111827',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <Headphones size={20} strokeWidth={1.5} color="#6B7280" />
                      Поддержка
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div style={{ padding: '8px', borderTop: '1px solid #E5E7EB' }}>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/logout');
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#DC2626',
                        transition: 'all 0.15s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FEE2E2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <LogOut size={20} strokeWidth={1.5} />
                      Выход
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}