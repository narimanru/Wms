import { Package, Truck, CheckCircle2, Clock, Download, Upload } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import ProductionLayout from '../../components/ProductionLayout';
import ordersData from '../../data/production-orders.json';

function ProductionShipments() {
  const navigate = useNavigate();

  // Filter orders that are ready or shipped
  const readyOrders = ordersData.orders.filter(o => 
    o.status === 'ready' || o.status === 'shipped'
  );

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ready: 'Готово к отгрузке',
      shipped: 'Отгружено'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      ready: { bg: '#d1fae5', text: '#065f46' },
      shipped: { bg: '#f3f4f6', text: '#374151' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

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
            Отгрузки
          </h1>
          <p style={{ 
            fontSize: '13px', 
            color: '#6b7280', 
            fontWeight: 400 
          }}>
            Управление готовыми к отгрузке заказами
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {readyOrders.length === 0 ? (
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <Truck style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#d1d5db' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '6px' }}>
              Нет готовых к отгрузке заказов
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Заказы появятся здесь после завершения производства
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {readyOrders.map(order => {
              const statusColors = getStatusColor(order.status);
              const totalPlan = order.items.reduce((sum, item) => 
                sum + item.sizes.reduce((s, size) => s + size.plan, 0), 0
              );
              const totalFact = order.items.reduce((sum, item) => 
                sum + item.sizes.reduce((s, size) => s + size.fact, 0), 0
              );

              return (
                <div
                  key={order.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Order Header */}
                  <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <h3 style={{ 
                          fontSize: '16px', 
                          fontWeight: 600, 
                          color: '#1f2937',
                          margin: 0,
                          fontFamily: 'monospace'
                        }}>
                          {order.id}
                        </h3>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: statusColors.bg,
                          color: statusColors.text
                        }}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        display: 'flex',
                        gap: '16px'
                      }}>
                        <span>Клиент: <strong style={{ color: '#1f2937' }}>{order.clientName}</strong></span>
                        <span>•</span>
                        <span>Готово: {totalFact} из {totalPlan} шт</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/production/orders/${order.id}`)}
                      style={{
                        padding: '8px 16px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        color: '#1f2937',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      Открыть заказ
                    </button>
                  </div>

                  {/* Checklist and Actions */}
                  <div style={{
                    padding: '20px 24px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '24px',
                    alignItems: 'start'
                  }}>
                    {/* Checklist */}
                    <div>
                      <div style={{ 
                        fontSize: '13px', 
                        fontWeight: 600, 
                        color: '#1f2937', 
                        marginBottom: '12px' 
                      }}>
                        Чек-лист готовности
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#1f2937',
                          cursor: 'pointer'
                        }}>
                          <input type="checkbox" checked readOnly style={{ cursor: 'pointer' }} />
                          <span>Упаковка выполнена</span>
                        </label>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#1f2937',
                          cursor: 'pointer'
                        }}>
                          <input type="checkbox" checked readOnly style={{ cursor: 'pointer' }} />
                          <span>Маркировка наклеена</span>
                        </label>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#1f2937',
                          cursor: 'pointer'
                        }}>
                          <input type="checkbox" checked readOnly style={{ cursor: 'pointer' }} />
                          <span>ОТК пройден</span>
                        </label>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#1f2937',
                          cursor: 'pointer'
                        }}>
                          <input type="checkbox" checked={order.status === 'shipped'} readOnly style={{ cursor: 'pointer' }} />
                          <span>Документы подготовлены</span>
                        </label>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
                      {order.status === 'ready' && (
                        <>
                          <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            border: 'none',
                            background: '#10a37f',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}>
                            <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                            Отметить как отгружено
                          </button>
                          <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            border: '1px solid #e5e7eb',
                            background: '#fff',
                            color: '#1f2937',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer'
                          }}>
                            <Download style={{ width: '16px', height: '16px' }} />
                            Сформировать накладную
                          </button>
                        </>
                      )}
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        color: '#1f2937',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}>
                        <Upload style={{ width: '16px', height: '16px' }} />
                        Загрузить фото коробов
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProductionLayout>
  );
}

export default ProductionShipments;