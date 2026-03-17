import { useNavigate } from 'react-router';
import { 
  Package, 
  Users, 
  Factory,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function PortalSelector() {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'seller',
      title: 'Селлерский портал',
      description: 'Управление товарами, маркировкой, КИЗами и партнёрами',
      icon: Package,
      color: '#10a37f',
      path: '/',
      features: ['Товары', 'Маркировка', 'Честный знак', 'AI помощник', 'Партнёры']
    },
    {
      id: 'partner',
      title: 'Партнёрский портал',
      description: 'Кабинет партнёра с комиссионной моделью',
      icon: Users,
      color: '#3b82f6',
      path: '/partner/dashboard',
      features: ['Дашборд', 'Клиенты', 'Начисления', 'Выплаты', 'Статистика']
    },
    {
      id: 'production',
      title: 'Производственный портал',
      description: 'Управление заказами в производство',
      icon: Factory,
      color: '#8b5cf6',
      path: '/production/orders',
      features: ['Заказы', 'Календарь', 'Отгрузки', 'Документы'],
      badge: 'С новой модалкой! ✨'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f7f7f8 0%, #e5e7eb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <Sparkles style={{ width: '32px', height: '32px', color: '#10a37f' }} />
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 700, 
              color: '#1f2937',
              margin: 0
            }}>
              FASTWMS
            </h1>
          </div>
          <p style={{ 
            fontSize: '16px', 
            color: '#6b7280',
            fontWeight: 400,
            margin: 0
          }}>
            Выберите портал для работы
          </p>
        </div>

        {/* Portals Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {portals.map(portal => {
            const Icon = portal.icon;
            return (
              <div
                key={portal.id}
                onClick={() => navigate(portal.path)}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '2px solid transparent',
                  position: 'relative',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = portal.color;
                  e.currentTarget.style.boxShadow = `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
              >
                {/* Badge */}
                {portal.badge && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #10a37f 0%, #0d8968 100%)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 4px rgba(16, 163, 127, 0.3)'
                  }}>
                    {portal.badge}
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: `${portal.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Icon style={{ width: '32px', height: '32px', color: portal.color }} />
                </div>

                {/* Title */}
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 600, 
                  color: '#1f2937',
                  margin: '0 0 8px 0'
                }}>
                  {portal.title}
                </h2>

                {/* Description */}
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280',
                  margin: '0 0 20px 0',
                  lineHeight: '1.5'
                }}>
                  {portal.description}
                </p>

                {/* Features */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '20px'
                }}>
                  {portal.features.map(feature => (
                    <span
                      key={feature}
                      style={{
                        padding: '4px 10px',
                        background: '#f9fafb',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: 500,
                        borderRadius: '6px'
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: portal.color,
                  fontSize: '14px',
                  fontWeight: 600
                }}>
                  Открыть портал
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div style={{ 
          marginTop: '48px',
          padding: '24px',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            🎯 Быстрый доступ к новой модалке
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            margin: '0 0 16px 0'
          }}>
            Чтобы протестировать новую модалку принятия заказов:
          </p>
          <ol style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            margin: '0 0 16px 0',
            paddingLeft: '20px',
            lineHeight: '1.8'
          }}>
            <li>Нажмите на карточку <strong>«Производственный портал»</strong></li>
            <li>В списке найдите заказ <strong>PO-2026-00041</strong> с бейджем <span style={{ 
              padding: '2px 8px',
              background: '#fef3c7',
              color: '#92400e',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '4px'
            }}>Новый</span></li>
            <li>Кликните на карточку заказа</li>
            <li>Нажмите зелёную кнопку <strong>«Принять заказ»</strong></li>
            <li>Откроется новая трёхшаговая модалка! 🎉</li>
          </ol>
          <button
            onClick={() => navigate('/production/orders/PO-2026-00041')}
            style={{
              padding: '10px 20px',
              background: '#10a37f',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0d8968';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#10a37f';
            }}
          >
            Перейти сразу к заказу PO-2026-00041
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
