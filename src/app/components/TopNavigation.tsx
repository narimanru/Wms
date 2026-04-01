import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Package, 
  ArrowRightLeft, 
  ChevronDown,
  Menu,
  X,
  FileCheck,
  ShoppingCart,
  Tag,
  Sparkles,
  TrendingUp,
  CheckSquare,
  Vault,
  Calendar,
  Factory,
  Users
} from 'lucide-react';
import '../../styles/top-navigation.css';
import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

function TopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closingDropdown, setClosingDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMouseEnter = useCallback((itemId: string) => {
    setClosingDropdown(null);
    setOpenDropdown(itemId);
  }, []);

  const handleMouseLeave = useCallback((itemId: string) => {
    setClosingDropdown(itemId);
    setTimeout(() => {
      setOpenDropdown(null);
      setClosingDropdown(null);
    }, 150); // Match animation duration
  }, []);

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
          id: 'inventory-main',
          label: 'Товар и КИЗы',
          icon: <Package strokeWidth={1.5} size={18} />,
          path: '/inventory'
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
    setOpenDropdown(null);
    setIsMobileOpen(false);
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
    <>
      {/* Top Navigation */}
      <nav className="tn-nav">
        <div className="tn-nav__content">
          {/* Logo */}
          <div className="tn-logo" onClick={() => navigate('/')}>
            <div className="tn-logo__icon">F</div>
            <div className="tn-logo__text">
              <div className="tn-logo__title">FASTWMS</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="tn-menu">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const active = isParentActive(item);
              const isOpen = openDropdown === item.id;

              return (
                <div 
                  key={item.id} 
                  className="tn-menu-item-wrapper" 
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={() => handleMouseLeave(item.id)}
                >
                  <button
                    className={`tn-menu-item ${active ? 'tn-menu-item--active' : ''}`}
                    onClick={() => {
                      if (!hasChildren && item.path) {
                        handleNavigate(item.path);
                      }
                    }}
                  >
                    <span className="tn-menu-item__icon">{item.icon}</span>
                    <span className="tn-menu-item__label">{item.label}</span>
                    {hasChildren && (
                      <ChevronDown 
                        className={`tn-menu-item__chevron ${isOpen ? 'tn-menu-item__chevron--open' : ''}`}
                      />
                    )}
                  </button>

                  {/* Dropdown */}
                  {hasChildren && (isOpen || closingDropdown === item.id) && (
                    <div className={`tn-dropdown ${closingDropdown === item.id ? 'tn-dropdown--closing' : ''}`}>
                      {item.children!.map((child) => (
                        <button
                          key={child.id}
                          className={`tn-dropdown-item ${child.path && isActive(child.path) ? 'tn-dropdown-item--active' : ''}`}
                          onClick={() => child.path && handleNavigate(child.path)}
                        >
                          <span className="tn-dropdown-item__icon">{child.icon}</span>
                          <span className="tn-dropdown-item__label">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* User */}
          <div className="tn-user">
            <div className="tn-user__avatar">Н</div>
            <div className="tn-user__info">
              <div className="tn-user__name">Нариман</div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="tn-mobile-toggle"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <>
          <div 
            className="tn-mobile-overlay"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="tn-mobile-menu">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const active = isParentActive(item);
              const isOpen = openDropdown === item.id;

              return (
                <div key={item.id} className="tn-mobile-item-wrapper">
                  <button
                    className={`tn-mobile-item ${active ? 'tn-mobile-item--active' : ''}`}
                    onClick={() => {
                      if (hasChildren) {
                        toggleDropdown(item.id);
                      } else if (item.path) {
                        handleNavigate(item.path);
                      }
                    }}
                  >
                    <div className="tn-mobile-item__content">
                      <span className="tn-mobile-item__icon">{item.icon}</span>
                      <span className="tn-mobile-item__label">{item.label}</span>
                    </div>
                    {hasChildren && (
                      <ChevronDown 
                        className={`tn-mobile-item__chevron ${isOpen ? 'tn-mobile-item__chevron--open' : ''}`}
                      />
                    )}
                  </button>

                  {/* Mobile Submenu */}
                  {hasChildren && isOpen && (
                    <div className="tn-mobile-submenu">
                      {item.children!.map((child) => (
                        <button
                          key={child.id}
                          className={`tn-mobile-submenu-item ${child.path && isActive(child.path) ? 'tn-mobile-submenu-item--active' : ''}`}
                          onClick={() => child.path && handleNavigate(child.path)}
                        >
                          <span className="tn-mobile-submenu-item__icon">{child.icon}</span>
                          <span className="tn-mobile-submenu-item__label">{child.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default TopNavigation;