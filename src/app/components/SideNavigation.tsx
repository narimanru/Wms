import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Package, 
  ArrowRightLeft, 
  ChevronDown,
  ChevronRight,
  FileCheck,
  ShoppingCart,
  Tag,
  Sparkles,
  TrendingUp,
  CheckSquare,
  Vault,
  Calendar,
  Factory,
  Users,
  FileInput,
  PanelLeftClose,
  PanelLeftOpen,
  Columns,
  DollarSign
} from 'lucide-react';
import '../../styles/side-navigation.css';
import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

interface SideNavigationProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

function SideNavigation({ isCollapsed, setIsCollapsed }: SideNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLogoTooltip, setShowLogoTooltip] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Главная',
      icon: <LayoutDashboard strokeWidth={1.5} size={20} />,
      path: '/'
    },
    {
      id: 'products',
      label: 'Товары',
      icon: <ShoppingCart strokeWidth={1.5} size={20} />,
      path: '/products'
    },
    {
      id: 'repricer',
      label: 'Репрайсер',
      icon: <DollarSign strokeWidth={1.5} size={20} />,
      path: '/repricer'
    },
    {
      id: 'marking',
      label: 'Маркировка',
      icon: <Tag strokeWidth={1.5} size={20} />,
      path: '/marking'
    },
    {
      id: 'inventory',
      label: 'Честный знак',
      icon: <Package strokeWidth={1.5} size={20} />,
      path: '/inventory',
      children: [
        {
          id: 'kiz-bank',
          label: 'Банк КИЗов',
          icon: <Vault strokeWidth={1.5} size={18} />,
          path: '/kiz-bank'
        },
        {
          id: 'inventory-main',
          label: 'Товар и КИЗы',
          icon: <Package strokeWidth={1.5} size={18} />,
          path: '/inventory'
        },
        {
          id: 'import-kiz',
          label: 'Импорт кодов маркировки',
          icon: <FileInput strokeWidth={1.5} size={18} />,
          path: '/import-kiz'
        },
        {
          id: 'wizard',
          label: 'Загрузка КИЗов',
          icon: <Upload strokeWidth={1.5} size={18} />,
          path: '/wizard'
        },
        {
          id: 'history',
          label: 'История загрузок',
          icon: <FileText strokeWidth={1.5} size={18} />,
          path: '/history'
        },
        {
          id: 'transfer',
          label: 'Перенос КИЗов',
          icon: <ArrowRightLeft strokeWidth={1.5} size={18} />,
          path: '/transfer'
        },
        {
          id: 'upd',
          label: 'Работа с УПД',
          icon: <FileCheck strokeWidth={1.5} size={18} />,
          path: '/upd'
        }
      ]
    },
    {
      id: 'production',
      label: 'Производство',
      icon: <Factory strokeWidth={1.5} size={20} />,
      path: '/production-orders'
    },
    {
      id: 'kanban',
      label: 'Kanban',
      icon: <Columns strokeWidth={1.5} size={20} />,
      path: '/kanban'
    },
    {
      id: 'partners',
      label: 'Партнёры',
      icon: <Users strokeWidth={1.5} size={20} />,
      path: '/seller/partners'
    },
    {
      id: 'ai',
      label: 'AI помощник',
      icon: <Sparkles strokeWidth={1.5} size={20} />,
      path: '/ai',
      children: [
        {
          id: 'ai-hub',
          label: 'AI Хаб',
          icon: <Sparkles strokeWidth={1.5} size={18} />,
          path: '/ai'
        },
        {
          id: 'ai-analytics',
          label: 'AI Аналитика',
          icon: <TrendingUp strokeWidth={1.5} size={18} />,
          path: '/ai/analytics'
        },
        {
          id: 'ai-shipment-check',
          label: 'Проверка поставок',
          icon: <CheckSquare strokeWidth={1.5} size={18} />,
          path: '/ai/shipment-check'
        },
        {
          id: 'ai-kiz-vault',
          label: 'Банк КИЗ',
          icon: <Vault strokeWidth={1.5} size={18} />,
          path: '/ai/kiz-vault'
        }
      ]
    },
    {
      id: 'planner',
      label: 'AI Планировщик',
      icon: <Calendar strokeWidth={1.5} size={20} />,
      path: '/planner',
      children: [
        {
          id: 'planner-dashboard',
          label: 'Панель',
          icon: <Calendar strokeWidth={1.5} size={18} />,
          path: '/planner'
        },
        {
          id: 'planner-shipments',
          label: 'План отгрузок WB',
          icon: <Package strokeWidth={1.5} size={18} />,
          path: '/planner/shipments'
        },
        {
          id: 'planner-production',
          label: 'План производства',
          icon: <Factory strokeWidth={1.5} size={18} />,
          path: '/planner/production'
        },
        {
          id: 'planner-kiz',
          label: 'План КИЗ',
          icon: <Tag strokeWidth={1.5} size={18} />,
          path: '/planner/kiz'
        }
      ]
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (item: MenuItem) => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => child.path && isActive(child.path));
    }
    return false;
  };

  const toggleDropdown = (itemId: string) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  return (
    <aside className={`sn-sidebar ${isCollapsed ? 'sn-sidebar--collapsed' : ''}`}>
      {/* Logo and Collapse Button */}
      <div style={{
        padding: isCollapsed ? '16px 12px' : '16px 20px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '12px',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        background: '#f9f9f9',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'visible'
      }}>
        <div 
          onClick={() => isCollapsed && setIsCollapsed(false)}
          onMouseEnter={() => isCollapsed && setShowLogoTooltip(true)}
          onMouseLeave={() => setShowLogoTooltip(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: isCollapsed ? 'pointer' : 'default',
            position: 'relative'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            background: '#111827',
            color: 'white',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '18px',
            flexShrink: 0
          }}>
            F
          </div>
          {!isCollapsed && (
            <div style={{
              fontWeight: '600',
              fontSize: '16px',
              color: '#111827',
              whiteSpace: 'nowrap'
            }}>
              FASTWMS
            </div>
          )}
          
          {/* Expand icon and tooltip on collapsed logo hover */}
          {isCollapsed && showLogoTooltip && (
            <>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F3F4F6',
                borderRadius: '5px',
                color: '#111827',
                transition: 'all 0.15s',
                zIndex: 10,
                padding: '5px'
              }}>
                <PanelLeftOpen size={18} />
              </div>
              
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 'calc(100% + 20px)',
                transform: 'translateY(-50%)',
                background: '#111827',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '5px',
                fontSize: '13px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                zIndex: 10000,
                pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                Открыть боковую панель
                {/* Arrow */}
                <div style={{
                  position: 'absolute',
                  left: '-4px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 0,
                  height: 0,
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderRight: '5px solid #111827'
                }} />
              </div>
            </>
          )}
        </div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          onMouseEnter={(e) => {
            setShowTooltip(true);
            e.currentTarget.style.background = '#F3F4F6';
            e.currentTarget.style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            setShowTooltip(false);
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#6B7280';
          }}
          style={{
            width: '36px',
            height: '36px',
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#6B7280',
            transition: 'all 0.15s',
            flexShrink: 0,
            position: 'relative'
          }}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          
          {/* Tooltip */}
          {showTooltip && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '100%',
              marginLeft: '12px',
              transform: 'translateY(-50%)',
              background: '#111827',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '5px',
              fontSize: '13px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              zIndex: 10000,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              {isCollapsed ? 'Открыть боковую панель' : 'Закрыть боковую панель'}
              {/* Arrow */}
              <div style={{
                position: 'absolute',
                left: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderRight: '5px solid #111827'
              }} />
            </div>
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="sn-menu">
        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const active = isParentActive(item);
          const isOpen = openDropdown === item.id;

          return (
            <div key={item.id} className="sn-menu-item-wrapper">
              <button
                className={`sn-menu-item ${active ? 'sn-menu-item--active' : ''}`}
                onClick={() => {
                  if (hasChildren) {
                    if (isCollapsed) {
                      setIsCollapsed(false);
                      setTimeout(() => toggleDropdown(item.id), 50);
                    } else {
                      toggleDropdown(item.id);
                    }
                  } else if (item.path) {
                    handleNavigate(item.path);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="sn-menu-item__icon">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="sn-menu-item__label">{item.label}</span>
                    {hasChildren && (
                      <ChevronRight 
                        className={`sn-menu-item__chevron ${isOpen ? 'sn-menu-item__chevron--open' : ''}`}
                        size={18}
                      />
                    )}
                  </>
                )}
              </button>

              {/* Submenu */}
              {hasChildren && isOpen && !isCollapsed && (
                <div className="sn-submenu">
                  {item.children!.map((child) => (
                    <button
                      key={child.id}
                      className={`sn-submenu-item ${child.path && isActive(child.path) ? 'sn-submenu-item--active' : ''}`}
                      onClick={() => child.path && handleNavigate(child.path)}
                    >
                      <span className="sn-submenu-item__icon">{child.icon}</span>
                      <span className="sn-submenu-item__label">{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default SideNavigation;