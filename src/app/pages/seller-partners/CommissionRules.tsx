import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Edit2, Trash2, Tag, Percent, DollarSign, Package } from 'lucide-react';
import partnersData from '../../data/partners-data.json';

function CommissionRules() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fixed_per_unit':
        return <DollarSign size={16} />;
      case 'percent':
        return <Percent size={16} />;
      case 'fixed_per_order':
        return <Package size={16} />;
      default:
        return <Tag size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fixed_per_unit':
        return '₽/шт';
      case 'percent':
        return '% от цены';
      case 'fixed_per_order':
        return '₽ за заказ';
      case 'mixed':
        return 'Смешанная';
      default:
        return type;
    }
  };

  const getScopeLabel = (scope: string, scopeValue: string | null) => {
    switch (scope) {
      case 'all':
        return 'Все товары';
      case 'category':
        return `Категория: ${scopeValue}`;
      case 'tag':
        return `Тег: ${scopeValue}`;
      case 'sku':
        return `SKU: ${scopeValue}`;
      default:
        return scope;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '20px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/seller/partners')}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#666',
              fontSize: '14px',
              marginBottom: '16px'
            }}
          >
            <ArrowLeft size={18} />
            Назад
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                Партнёры
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '600', margin: 0 }}>
                Правила комиссии
              </h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '10px 20px',
                background: '#10a37f',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={18} />
              Добавить правило
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
        {/* Info Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
            Как работает система комиссий
          </h3>
          <p style={{ fontSize: '14px', opacity: 0.9, margin: 0 }}>
            Комиссия партнёру начисляется <strong>по факту выпуска</strong> продукции. 
            Если фактическое количество отличается от планового — комиссия пересчитывается автоматически.
          </p>
        </div>

        {/* Commission Model Selection */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Модель комиссии</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { value: 'fixed_per_unit', label: '₽/шт', icon: <DollarSign size={20} /> },
              { value: 'percent', label: '% от цены', icon: <Percent size={20} /> },
              { value: 'fixed_per_order', label: '₽ за заказ', icon: <Package size={20} /> },
              { value: 'mixed', label: 'Смешанная', icon: <Tag size={20} /> }
            ].map((model) => (
              <div
                key={model.value}
                style={{
                  padding: '16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ color: '#666' }}>{model.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{model.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Table */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e5e5' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Активные правила</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Название</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Область действия</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Тип</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Значение</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Действует с</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Статус</th>
                  <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {partnersData.commissionRules.map((rule) => (
                  <tr key={rule.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '500' }}>{rule.name}</div>
                      <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                        {rule.description}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px' }}>
                        {getScopeLabel(rule.scope, rule.scopeValue)}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666' }}>
                        {getTypeIcon(rule.type)}
                        <span style={{ fontSize: '14px' }}>{getTypeLabel(rule.type)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#10a37f' }}>
                        {rule.type === 'percent' ? `${rule.value}%` : `${rule.value} ₽`}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {new Date(rule.validFrom).toLocaleDateString('ru')}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {rule.status === 'active' ? (
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '12px', 
                          background: '#f0fdf4', 
                          color: '#15803d', 
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                          Активно
                        </span>
                      ) : (
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '12px', 
                          background: '#f3f4f6', 
                          color: '#6b7280', 
                          fontSize: '13px',
                          fontWeight: '500'
                        }}>
                          Неактивно
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          style={{
                            padding: '6px',
                            background: 'none',
                            border: '1px solid #d0d0d0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#666'
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          style={{
                            padding: '6px',
                            background: 'none',
                            border: '1px solid #d0d0d0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#dc2626'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '600px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>Добавить правило комиссии</h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Название правила
              </label>
              <input
                type="text"
                placeholder="Например: Брюки - базовая ставка"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Тип комиссии
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="fixed_per_unit">₽ за штуку</option>
                <option value="percent">% от цены клиента</option>
                <option value="fixed_per_order">₽ за заказ</option>
                <option value="mixed">Смешанная</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Значение
              </label>
              <input
                type="number"
                placeholder="100"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Область действия
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '8px'
                }}
              >
                <option value="all">Все товары</option>
                <option value="category">По категории</option>
                <option value="tag">По тегу</option>
                <option value="sku">По SKU</option>
              </select>
              <input
                type="text"
                placeholder="Укажите категорию, тег или SKU"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Действует с
              </label>
              <input
                type="date"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'white',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#10a37f',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Создать правило
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommissionRules;
