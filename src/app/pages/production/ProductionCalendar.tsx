import { Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import ProductionLayout from '../../components/ProductionLayout';
import ordersData from '../../data/production-orders.json';

function ProductionCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date('2026-03-15'));
  const [view, setView] = useState<'week' | 'month'>('week');

  const getWeekDays = (date: Date) => {
    const days = [];
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getOrdersForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return ordersData.orders.filter(order => order.deadline === dateStr);
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: '#fbbf24',
      accepted: '#3b82f6',
      in_progress: '#6366f1',
      qc: '#ec4899',
      ready: '#10a37f',
      shipped: '#6b7280'
    };
    return colors[status] || '#9ca3af';
  };

  const weekDays = getWeekDays(currentDate);
  const overdueOrders = ordersData.orders.filter(
    o => isOverdue(o.deadline) && o.status !== 'shipped' && o.status !== 'closed'
  );

  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
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
            Календарь производства
          </h1>
          <p style={{ 
            fontSize: '13px', 
            color: '#6b7280', 
            fontWeight: 400 
          }}>
            Загрузка и сроки производственных заказов
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px 24px 0 24px'
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={goToPrevWeek}
              style={{
                padding: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronLeft style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            </button>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', minWidth: '200px', textAlign: 'center' }}>
              {weekDays[0].toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} - {weekDays[6].toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={goToNextWeek}
              style={{
                padding: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronRight style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setView('week')}
              style={{
                padding: '8px 16px',
                border: view === 'week' ? 'none' : '1px solid #e5e7eb',
                background: view === 'week' ? '#10a37f' : '#fff',
                color: view === 'week' ? '#fff' : '#6b7280',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Неделя
            </button>
            <button
              onClick={() => setView('month')}
              style={{
                padding: '8px 16px',
                border: view === 'month' ? 'none' : '1px solid #e5e7eb',
                background: view === 'month' ? '#10a37f' : '#fff',
                color: view === 'month' ? '#fff' : '#6b7280',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Месяц
            </button>
          </div>
        </div>

        {/* Overdue Alert */}
        {overdueOrders.length > 0 && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: '#92400e' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#92400e', marginBottom: '2px' }}>
                Просроченные заказы
              </div>
              <div style={{ fontSize: '13px', color: '#92400e' }}>
                {overdueOrders.length} {overdueOrders.length === 1 ? 'заказ просрочен' : 'заказов просрочено'}
              </div>
            </div>
            <button
              style={{
                padding: '8px 16px',
                border: 'none',
                background: '#92400e',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Посмотреть
            </button>
          </div>
        )}

        {/* Calendar Grid */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {/* Week Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            {weekDays.map((day, idx) => (
              <div key={idx} style={{
                padding: '16px',
                borderRight: idx < weekDays.length - 1 ? '1px solid #e5e7eb' : 'none',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {day.toLocaleDateString('ru-RU', { weekday: 'short' })}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Week Body */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            minHeight: '500px'
          }}>
            {weekDays.map((day, idx) => {
              const dayOrders = getOrdersForDate(day);
              return (
                <div key={idx} style={{
                  padding: '12px',
                  borderRight: idx < weekDays.length - 1 ? '1px solid #f3f4f6' : 'none',
                  background: '#fff'
                }}>
                  {dayOrders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/production/orders/${order.id}`)}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        background: '#f9fafb',
                        borderLeft: `3px solid ${getStatusColor(order.status)}`,
                        marginBottom: '8px',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#1f2937', marginBottom: '2px', fontFamily: 'monospace' }}>
                        {order.id}
                      </div>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>
                        {order.clientName}
                      </div>
                      <div style={{ fontSize: '10px', color: '#6b7280' }}>
                        {order.totalQuantity} шт
                      </div>
                      {order.priority === 'urgent' && (
                        <div style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          color: '#dc2626',
                          marginTop: '4px'
                        }}>
                          СРОЧНО
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ height: '40px' }} />
    </ProductionLayout>
  );
}

export default ProductionCalendar;