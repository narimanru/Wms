import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Package, 
  ArrowRightLeft, 
  ChevronRight,
  Menu,
  X,
  FileCheck
} from 'lucide-react';
import '../../styles/sidebar.css';
import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['inventory']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Главная',
      icon: <LayoutDashboard />,
      path: '/'
    },
    {
      id: 'inventory',
      label: 'Честный знак',
      icon: <Package />,
      path: '/inventory',
      children: [
        {
          id: 'wizard',
          label: 'Загрузка КИЗов',
          icon: <Upload />,
          path: '/wizard'
        },
        {
          id: 'history',
          label: 'История загрузок',
          icon: <FileText />,
          path: '/history'
        },
        {
          id: 'transfer',
          label: 'Перенос КИЗов',
          icon: <ArrowRightLeft />,
          path: '/transfer'
        },
        {
          id: 'upd',
          label: 'Работа с УПД',
          icon: <FileCheck />,
          path: '/upd'
        }
      ]
    }
  ];

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = item.path ? isActive(item.path) : false;

    return (
      <div key={item.id} className="sb-menu-item-wrapper">
        <button
          className={`sb-menu-item ${active ? 'sb-menu-item--active' : ''} ${level > 0 ? 'sb-menu-item--child' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleItem(item.id);
            }
            if (item.path) {
              handleNavigate(item.path);
            }
          }}
        >
          <div className="sb-menu-item__content">
            <div className="sb-menu-item__icon">
              {item.icon}
            </div>
            <span className="sb-menu-item__label text-[14px]">{item.label}</span>
          </div>
          {hasChildren && (
            <ChevronRight 
              className={`sb-menu-item__chevron ${isExpanded ? 'sb-menu-item__chevron--expanded' : ''}`}
            />
          )}
        </button>

        {hasChildren && isExpanded && (
          <div className="sb-submenu">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="sb-mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="sb-mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sb-sidebar ${isMobileOpen ? 'sb-sidebar--mobile-open' : ''}`}>
        <div className="sb-header">
          <div className="sb-logo">
            <div className="sb-logo__icon">F</div>
            <div className="sb-logo__text">
              <div className="sb-logo__title">FASTWMS</div>
              <div className="sb-logo__subtitle">Система управления складом</div>
            </div>
          </div>
        </div>

        <nav className="sb-nav">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-user__avatar">Н</div>
            <div className="sb-user__info">
              <div className="sb-user__name">Нариман</div>
              <div className="sb-user__role">Администратор</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;