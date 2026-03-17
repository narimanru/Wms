import { useState } from 'react';
import { X, Search, Filter, CheckCircle2, AlertCircle, Clock, RotateCcw, Calendar, User as UserIcon } from 'lucide-react';

interface KIZRecord {
  id: string;
  code: string;
  fullCode: string;
  status: 'available' | 'used' | 'reserved' | 'rejected';
  usedDate: string | null;
  usedBy: string | null;
  uploadDate: string;
  orderId: string | null;
  wbAccepted: boolean;
  comment: string;
}

interface KIZDetailsModalProps {
  onClose: () => void;
  productName: string;
  size: string;
  totalKiz: number;
}

export function KIZDetailsModal({ onClose, productName, size, totalKiz }: KIZDetailsModalProps) {
  const [kizSearchQuery, setKizSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'used' | 'reserved' | 'rejected'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Генерация моковых данных КИЗов
  const generateKIZ = (index: number, status: 'available' | 'used' | 'reserved' | 'rejected'): KIZRecord => {
    const baseCode = `01046550513835${String(1000 + index).padStart(4, '0')}`;
    const maskedCode = `••••${String(1000 + index).slice(-4)}`;
    
    let usedDate = null;
    let usedBy = null;
    let wbAccepted = false;
    let comment = '';

    if (status === 'used') {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      usedDate = date.toLocaleDateString('ru-RU');
      usedBy = ['Иван Иванов', 'Петр Петров', 'Сидорова А.'][Math.floor(Math.random() * 3)];
      wbAccepted = Math.random() > 0.3;
      comment = wbAccepted ? 'Принято WB' : 'Ожидает принятия WB';
    } else if (status === 'reserved') {
      usedBy = 'Заказ #12345';
      comment = 'Зарезервирован для заказа';
    } else if (status === 'rejected') {
      usedDate = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU');
      usedBy = ['Иван Иванов', 'Петр Петров'][Math.floor(Math.random() * 2)];
      wbAccepted = false;
      comment = ['Брак товара', 'Повреждена упаковка', 'Ошибка маркировки'][Math.floor(Math.random() * 3)];
    }

    return {
      id: `kiz-${index}`,
      code: maskedCode,
      fullCode: baseCode,
      status,
      usedDate,
      usedBy,
      uploadDate: '26.02.2026',
      orderId: status === 'used' ? `ORD-${1000 + Math.floor(Math.random() * 9000)}` : null,
      wbAccepted,
      comment
    };
  };

  // Генерация данных
  const allKizRecords: KIZRecord[] = [];
  const availableCount = Math.floor(totalKiz * 0.4);
  const usedCount = Math.floor(totalKiz * 0.45);
  const reservedCount = Math.floor(totalKiz * 0.1);
  const rejectedCount = totalKiz - availableCount - usedCount - reservedCount;

  for (let i = 0; i < availableCount; i++) {
    allKizRecords.push(generateKIZ(i, 'available'));
  }
  for (let i = availableCount; i < availableCount + usedCount; i++) {
    allKizRecords.push(generateKIZ(i, 'used'));
  }
  for (let i = availableCount + usedCount; i < availableCount + usedCount + reservedCount; i++) {
    allKizRecords.push(generateKIZ(i, 'reserved'));
  }
  for (let i = availableCount + usedCount + reservedCount; i < totalKiz; i++) {
    allKizRecords.push(generateKIZ(i, 'rejected'));
  }

  // Фильтрация
  const filteredKizRecords = allKizRecords.filter(kiz => {
    // Поиск по коду
    if (kizSearchQuery && !kiz.fullCode.includes(kizSearchQuery) && !kiz.code.includes(kizSearchQuery)) {
      return false;
    }

    // Фильтр по статусу
    if (statusFilter !== 'all' && kiz.status !== statusFilter) {
      return false;
    }

    // Фильтр по дате
    if (dateFilter !== 'all' && kiz.usedDate) {
      const kizDate = new Date(kiz.usedDate.split('.').reverse().join('-'));
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (dateFilter === 'today') {
        if (kizDate < todayStart) return false;
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(todayStart);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (kizDate < weekAgo) return false;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(todayStart);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (kizDate < monthAgo) return false;
      }
    }

    return true;
  });

  // Статистика
  const stats = {
    total: allKizRecords.length,
    available: allKizRecords.filter(k => k.status === 'available').length,
    used: allKizRecords.filter(k => k.status === 'used').length,
    reserved: allKizRecords.filter(k => k.status === 'reserved').length,
    rejected: allKizRecords.filter(k => k.status === 'rejected').length,
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Доступен',
      used: 'Использован',
      reserved: 'Зарезервирован',
      rejected: 'Отклонён'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      available: { bg: '#d1fae5', text: '#065f46' },
      used: { bg: '#dbeafe', text: '#1e40af' },
      reserved: { bg: '#fef3c7', text: '#92400e' },
      rejected: { bg: '#fee2e2', text: '#991b1b' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const handleRestore = (kizId: string) => {
    console.log('Restoring KIZ:', kizId);
    // Здесь будет логика восстановления КИЗа
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          maxWidth: '1400px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
              КИЗы: {productName} • Размер {size}
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Всего КИЗов: {stats.total.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              cursor: 'pointer',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Stats */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div style={{
              padding: '16px',
              background: '#fff',
              borderRadius: '12px',
              border: '2px solid #d1fae5'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                Доступно
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#10a37f' }}>
                {stats.available.toLocaleString()}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#fff',
              borderRadius: '12px',
              border: '2px solid #dbeafe'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                Использовано
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#3b82f6' }}>
                {stats.used.toLocaleString()}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#fff',
              borderRadius: '12px',
              border: '2px solid #fef3c7'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                Зарезервировано
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#f59e0b' }}>
                {stats.reserved.toLocaleString()}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: '#fff',
              borderRadius: '12px',
              border: '2px solid #fee2e2'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: 500 }}>
                Отклонено
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#dc2626' }}>
                {stats.rejected.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: '#fff'
        }}>
          {/* Search */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Поиск по коду КИЗ..."
              value={kizSearchQuery}
              onChange={(e) => setKizSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#10a37f'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            {kizSearchQuery && (
              <button
                onClick={() => setKizSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '4px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <X style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            <option value="all">Все статусы</option>
            <option value="available">✓ Доступен</option>
            <option value="used">→ Использован</option>
            <option value="reserved">⏸ Зарезервирован</option>
            <option value="rejected">✕ Отклонён</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '160px'
            }}
          >
            <option value="all">Все даты</option>
            <option value="today">Сегодня</option>
            <option value="week">Последние 7 дней</option>
            <option value="month">Последний месяц</option>
          </select>
        </div>

        {/* Results Count */}
        {(kizSearchQuery || statusFilter !== 'all' || dateFilter !== 'all') && (
          <div style={{
            padding: '12px 24px',
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '13px',
            color: '#6b7280'
          }}>
            Найдено: <strong>{filteredKizRecords.length.toLocaleString()}</strong> из {stats.total.toLocaleString()} КИЗов
          </div>
        )}

        {/* Table */}
        <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px 24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#6b7280',
                  background: '#f9fafb'
                }}>
                  КОД КИЗ
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#6b7280',
                  background: '#f9fafb'
                }}>
                  СТАТУС
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#6b7280',
                  background: '#f9fafb'
                }}>
                  ДАТА ИСПОЛЬЗОВАНИЯ
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#6b7280',
                  background: '#f9fafb'
                }}>
                  КТО ИСПОЛЬЗОВАЛ
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#6b7280',
                  background: '#f9fafb'
                }}>
                  ДАТА ЗАГРУЗКИ
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#6b7280',
                  background: '#f9fafb'
                }}>
                  КОММЕНТАРИЙ
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  color: '#6b7280',
                  background: '#f9fafb',
                  width: '120px'
                }}>
                  ДЕЙСТВИЯ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredKizRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    {kizSearchQuery ? `Ничего не найдено по запросу "${kizSearchQuery}"` : 'Нет данных для отображения'}
                  </td>
                </tr>
              ) : (
                filteredKizRecords.map((kiz) => {
                  const statusColors = getStatusColor(kiz.status);
                  return (
                    <tr key={kiz.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ 
                          fontFamily: 'monospace', 
                          fontSize: '13px', 
                          color: '#1f2937',
                          fontWeight: 500
                        }}>
                          {kiz.code}
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: statusColors.bg,
                            color: statusColors.text,
                            whiteSpace: 'nowrap'
                          }}>
                            {getStatusLabel(kiz.status)}
                          </span>
                          {kiz.status === 'used' && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              fontSize: '11px',
                              color: kiz.wbAccepted ? '#10a37f' : '#f59e0b'
                            }}>
                              {kiz.wbAccepted ? (
                                <>
                                  <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                                  <span>WB принято</span>
                                </>
                              ) : (
                                <>
                                  <Clock style={{ width: '12px', height: '12px' }} />
                                  <span>Ожидание WB</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ 
                          fontSize: '13px', 
                          color: kiz.usedDate ? '#1f2937' : '#9ca3af'
                        }}>
                          {kiz.usedDate || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ 
                          fontSize: '13px', 
                          color: kiz.usedBy ? '#1f2937' : '#9ca3af',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {kiz.usedBy && (
                            <UserIcon style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                          )}
                          {kiz.usedBy || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ 
                          fontSize: '13px', 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Calendar style={{ width: '14px', height: '14px' }} />
                          {kiz.uploadDate}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ 
                          fontSize: '13px', 
                          color: kiz.comment ? '#1f2937' : '#9ca3af'
                        }}>
                          {kiz.comment || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {kiz.status === 'used' && !kiz.wbAccepted && (
                          <button
                            onClick={() => handleRestore(kiz.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #10a37f',
                              background: '#fff',
                              color: '#10a37f',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#10a37f';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#fff';
                              e.currentTarget.style.color = '#10a37f';
                            }}
                          >
                            <RotateCcw style={{ width: '12px', height: '12px' }} />
                            Восстановить
                          </button>
                        )}
                        {kiz.status === 'rejected' && (
                          <button
                            onClick={() => handleRestore(kiz.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              border: '1px solid #10a37f',
                              background: '#fff',
                              color: '#10a37f',
                              fontSize: '12px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#10a37f';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#fff';
                              e.currentTarget.style.color = '#10a37f';
                            }}
                          >
                            <RotateCcw style={{ width: '12px', height: '12px' }} />
                            Восстановить
                          </button>
                        )}
                        {(kiz.status === 'available' || kiz.status === 'reserved') && (
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f9fafb'
        }}>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            Показано {filteredKizRecords.length} из {stats.total} КИЗов
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#1f2937',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
