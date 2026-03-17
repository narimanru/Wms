import { Search, Filter, AlertCircle, Package, Clock, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import ProductionLayout from '../../components/ProductionLayout';
import ordersData from '../../data/production-orders.json';

type OrderStatus = 'new' | 'accepted' | 'in_progress' | 'qc' | 'ready' | 'shipped' | 'closed';
type PaymentStatus = 'awaiting' | 'partial' | 'paid';

function ProductionOrders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [urgentOnly, setUrgentOnly] = useState(false);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'Новый',
      accepted: 'Принят',
      in_progress: 'В работе',
      qc: 'ОТК',
      ready: 'Готово',
      shipped: 'Отгружено',
      closed: 'Закрыто'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      new: { bg: '#fef3c7', text: '#92400e' },
      accepted: { bg: '#dbeafe', text: '#1e40af' },
      in_progress: { bg: '#e0e7ff', text: '#3730a3' },
      qc: { bg: '#fce7f3', text: '#831843' },
      ready: { bg: '#d1fae5', text: '#065f46' },
      shipped: { bg: '#f3f4f6', text: '#374151' },
      closed: { bg: '#f3f4f6', text: '#6b7280' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      awaiting: 'Ожидается',
      partial: 'Частично',
      paid: 'Оплачено'
    };
    return labels[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      awaiting: { bg: '#fef3c7', text: '#92400e' },
      partial: { bg: '#dbeafe', text: '#1e40af' },
      paid: { bg: '#d1fae5', text: '#065f46' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const filteredOrders = ordersData.orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesUrgent = !urgentOnly || order.priority === 'urgent';
    return matchesSearch && matchesStatus && matchesUrgent;
  });

  const newCount = ordersData.orders.filter(o => o.status === 'new').length;
  const inProgressCount = ordersData.orders.filter(o => o.status === 'in_progress').length;
  const overdueCount = ordersData.orders.filter(o => isOverdue(o.deadline) && o.status !== 'shipped' && o.status !== 'closed').length;

  return (
    <ProductionLayout>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '32px 24px 24px 24px'
        }}>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#1f2937', 
            marginBottom: '4px' 
          }}>
            Заказы в производство
          </h1>
          <p style={{ 
            fontSize: '13px', 
            color: '#6b7280', 
            fontWeight: 400 
          }}>
            Управление производственными заказами
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px 24px 0 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Package style={{ width: '20px', height: '20px', color: '#92400e' }} />
              </div>
              <div>
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontWeight: 500,
                  marginBottom: '2px'
                }}>
                  Новых заказов
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  {newCount}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock style={{ width: '20px', height: '20px', color: '#3730a3' }} />
              </div>
              <div>
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontWeight: 500,
                  marginBottom: '2px'
                }}>
                  В работе
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  {inProgressCount}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: overdueCount > 0 ? '#fee2e2' : '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {overdueCount > 0 ? (
                  <AlertCircle style={{ width: '20px', height: '20px', color: '#991b1b' }} />
                ) : (
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#065f46' }} />
                )}
              </div>
              <div>
                <div style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontWeight: 500,
                  marginBottom: '2px'
                }}>
                  Просрочено
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: overdueCount > 0 ? '#dc2626' : '#1f2937'
                }}>
                  {overdueCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 24px 24px'
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
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
                placeholder="Поиск по номеру заказа или клиенту..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  padding: '0 12px 0 36px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: '#1f2937',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#1f2937',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="accepted">Приняты</option>
              <option value="in_progress">В работе</option>
              <option value="qc">ОТК</option>
              <option value="ready">Готово</option>
              <option value="shipped">Отгружено</option>
            </select>

            {/* Urgent Toggle */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 12px',
              height: '38px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: urgentOnly ? '#fef3c7' : '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              color: urgentOnly ? '#92400e' : '#6b7280'
            }}>
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Только срочные
            </label>
          </div>
        </div>

        {/* Orders Table */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {filteredOrders.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#9ca3af'
            }}>
              <Package style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#d1d5db' }} />
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Заказов не найдено</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Заказ
                  </th>
                  <th style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Клиент / Сезон
                  </th>
                  <th style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Срок готовности
                  </th>
                  <th style={{
                    padding: '12px 20px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Объём
                  </th>
                  <th style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Статус
                  </th>
                  <th style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Оплата
                  </th>
                  <th style={{
                    padding: '12px 20px',
                    textAlign: 'right',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Действие
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => {
                  const overdue = isOverdue(order.deadline);
                  const statusColors = getStatusColor(order.status);
                  const paymentColors = getPaymentStatusColor(order.paymentStatus);

                  return (
                    <tr
                      key={order.id}
                      style={{
                        borderBottom: idx < filteredOrders.length - 1 ? '1px solid #f3f4f6' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                      onClick={() => navigate(`/production/orders/${order.id}`)}
                    >
                      <td style={{
                        padding: '16px 20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1f2937',
                        fontFamily: 'monospace'
                      }}>
                        {order.id}
                        {order.priority === 'urgent' && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            fontWeight: 600
                          }}>
                            СРОЧНО
                          </span>
                        )}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        fontSize: '13px'
                      }}>
                        <div style={{
                          fontWeight: 600,
                          color: '#1f2937',
                          marginBottom: '2px'
                        }}>
                          {order.clientName}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          {order.season}
                        </div>
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        fontSize: '13px',
                        color: overdue ? '#dc2626' : '#1f2937',
                        fontWeight: overdue ? 600 : 400
                      }}>
                        {new Date(order.deadline).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        textAlign: 'center',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1f2937'
                      }}>
                        {order.totalQuantity.toLocaleString()} шт
                      </td>
                      <td style={{
                        padding: '16px 20px'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: statusColors.bg,
                          color: statusColors.text
                        }}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td style={{
                        padding: '16px 20px'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: paymentColors.bg,
                          color: paymentColors.text
                        }}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </span>
                      </td>
                      <td style={{
                        padding: '16px 20px',
                        textAlign: 'right'
                      }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/production/orders/${order.id}`);
                          }}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            color: '#1f2937',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}
                        >
                          Открыть
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProductionLayout>
  );
}

export default ProductionOrders;