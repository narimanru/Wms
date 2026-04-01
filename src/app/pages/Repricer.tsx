import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Edit, 
  Copy, 
  Trash2,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface Strategy {
  id: string;
  name: string;
  store: string;
  type: string;
  productCount: number;
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  lastRunResult?: {
    success: number;
    errors: number;
    skipped: number;
  };
}

const MOCK_STRATEGIES: Strategy[] = [
  {
    id: '1',
    name: 'Скидки по времени - Основная',
    store: 'WB Основной кабинет',
    type: 'Изменение скидок по времени',
    productCount: 245,
    status: 'active',
    lastRun: '2026-03-21 14:30',
    lastRunResult: {
      success: 240,
      errors: 2,
      skipped: 3
    }
  },
  {
    id: '2',
    name: 'Акция выходного дня',
    store: 'WB Основной кабинет',
    type: 'Изменение скидок по времени',
    productCount: 89,
    status: 'active',
    lastRun: '2026-03-21 10:00',
    lastRunResult: {
      success: 87,
      errors: 0,
      skipped: 2
    }
  },
  {
    id: '3',
    name: 'Ночные скидки',
    store: 'WB Основной кабинет',
    type: 'Изменение скидок по времени',
    productCount: 156,
    status: 'paused',
    lastRun: '2026-03-20 22:00',
    lastRunResult: {
      success: 150,
      errors: 1,
      skipped: 5
    }
  },
  {
    id: '4',
    name: 'Новая стратегия',
    store: 'WB Основной кабинет',
    type: 'Изменение скидок по времени',
    productCount: 0,
    status: 'draft'
  }
];

const STATUS_CONFIG = {
  active: { label: 'Активна', color: '#10B981', bg: '#ECFDF5' },
  paused: { label: 'Пауза', color: '#F59E0B', bg: '#FEF3C7' },
  draft: { label: 'Черновик', color: '#6B7280', bg: '#F3F4F6' }
};

export default function Repricer() {
  const navigate = useNavigate();
  const [strategies] = useState<Strategy[]>(MOCK_STRATEGIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredStrategies = strategies.filter((strategy) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!strategy.name.toLowerCase().includes(query)) return false;
    }
    if (statusFilter !== 'all' && strategy.status !== statusFilter) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '24px 32px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '500', 
              color: '#111827', 
              margin: 0 
            }}>
              Репрайсер
            </h1>
            <button
              style={{
                padding: '10px 20px',
                background: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1F2937';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111827';
              }}
              onClick={() => navigate('/repricer/create')}
            >
              <Plus size={16} strokeWidth={1.5} />
              Создать стратегию
            </button>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search 
                size={16} 
                strokeWidth={1.5}
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#9CA3AF' 
                }} 
              />
              <input
                type="text"
                placeholder="Поиск стратегий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white'
                }}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '8px 16px',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                background: showFilters ? '#111827' : 'white',
                color: showFilters ? 'white' : '#6B7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '400',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Filter size={14} strokeWidth={1.5} />
              Фильтры
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              background: '#F9FAFB',
              borderRadius: '5px',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#6B7280', 
                  marginBottom: '6px' 
                }}>
                  Статус
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    fontSize: '14px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">Все статусы</option>
                  <option value="active">Активна</option>
                  <option value="paused">Пауза</option>
                  <option value="draft">Черновик</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Strategies Table */}
          <div style={{ background: 'white', borderRadius: '5px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Название стратегии
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Магазин
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Товаров
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Статус
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Последний запуск
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Результат
                  </th>
                  <th style={{ 
                    padding: '12px 16px', 
                    textAlign: 'right', 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStrategies.map((strategy, index) => {
                  const statusConfig = STATUS_CONFIG[strategy.status];
                  
                  return (
                    <tr 
                      key={strategy.id}
                      style={{ 
                        borderBottom: index < filteredStrategies.length - 1 ? '1px solid #E5E7EB' : 'none',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '16px' }}>
                        <div 
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: '#111827', 
                            marginBottom: '4px',
                            cursor: 'pointer',
                            transition: 'color 0.15s'
                          }}
                          onClick={() => navigate('/repricer/create-full')}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#3B82F6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#111827';
                          }}
                        >
                          {strategy.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {strategy.type}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#111827' }}>
                          {strategy.store}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                          {strategy.productCount}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          color: statusConfig.color,
                          background: statusConfig.bg
                        }}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        {strategy.lastRun ? (
                          <div style={{ fontSize: '14px', color: '#6B7280' }}>
                            {strategy.lastRun}
                          </div>
                        ) : (
                          <div style={{ fontSize: '14px', color: '#D1D5DB' }}>
                            Не запускалась
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {strategy.lastRunResult ? (
                          <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                            <span style={{ color: '#10B981' }}>✓ {strategy.lastRunResult.success}</span>
                            {strategy.lastRunResult.errors > 0 && (
                              <span style={{ color: '#EF4444' }}>✗ {strategy.lastRunResult.errors}</span>
                            )}
                            {strategy.lastRunResult.skipped > 0 && (
                              <span style={{ color: '#F59E0B' }}>⊘ {strategy.lastRunResult.skipped}</span>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: '14px', color: '#D1D5DB' }}>
                            —
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            style={{
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'transparent',
                              border: '1px solid #E5E7EB',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              color: '#6B7280',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#F3F4F6';
                              e.currentTarget.style.borderColor = '#111827';
                              e.currentTarget.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = '#E5E7EB';
                              e.currentTarget.style.color = '#6B7280';
                            }}
                            title={strategy.status === 'active' ? 'Приостановить' : 'Активировать'}
                          >
                            {strategy.status === 'active' ? (
                              <Pause size={14} strokeWidth={1.5} />
                            ) : (
                              <Play size={14} strokeWidth={1.5} />
                            )}
                          </button>
                          <button
                            style={{
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'transparent',
                              border: '1px solid #E5E7EB',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              color: '#6B7280',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#F3F4F6';
                              e.currentTarget.style.borderColor = '#111827';
                              e.currentTarget.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = '#E5E7EB';
                              e.currentTarget.style.color = '#6B7280';
                            }}
                            title="Редактировать"
                          >
                            <Edit size={14} strokeWidth={1.5} />
                          </button>
                          <button
                            style={{
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'transparent',
                              border: '1px solid #E5E7EB',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              color: '#6B7280',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#F3F4F6';
                              e.currentTarget.style.borderColor = '#111827';
                              e.currentTarget.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = '#E5E7EB';
                              e.currentTarget.style.color = '#6B7280';
                            }}
                            title="Дублировать"
                          >
                            <Copy size={14} strokeWidth={1.5} />
                          </button>
                          <button
                            style={{
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'transparent',
                              border: '1px solid #E5E7EB',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              color: '#6B7280',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#FEE2E2';
                              e.currentTarget.style.borderColor = '#EF4444';
                              e.currentTarget.style.color = '#EF4444';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.borderColor = '#E5E7EB';
                              e.currentTarget.style.color = '#6B7280';
                            }}
                            title="Удалить"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredStrategies.length === 0 && (
              <div style={{ 
                padding: '48px', 
                textAlign: 'center', 
                color: '#9CA3AF' 
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📊</div>
                <p style={{ fontSize: '16px', margin: '0 0 8px 0', fontWeight: '500', color: '#6B7280' }}>
                  {searchQuery ? 'Стратегии не найдены' : 'Нет созданных стратегий'}
                </p>
                <p style={{ fontSize: '14px', margin: 0, color: '#9CA3AF' }}>
                  {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Создайте первую стратегию репрайсера'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}