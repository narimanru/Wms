import { useState } from 'react';
import { Filter, Download, Search } from 'lucide-react';
import partnersData from '../../data/partners-data.json';
import { PartnerLayout } from '../../components/PartnerLayout';

function PartnerEarnings() {
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock: используем первого партнёра
  const currentPartnerId = 'PTR-001';
  
  // Get partner's earnings
  const allEarnings = partnersData.earnings.filter(e => e.partnerId === currentPartnerId);
  
  // Apply filters
  const filteredEarnings = allEarnings.filter(e => {
    if (statusFilter === 'all') return true;
    return e.status === statusFilter;
  });

  // Calculate totals
  const totalPending = allEarnings
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalAccrued = allEarnings
    .filter(e => e.status === 'accrued')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalPaid = allEarnings
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span style={{ 
            padding: '6px 12px', 
            borderRadius: '12px', 
            background: '#fef3c7', 
            color: '#92400e', 
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Pending
          </span>
        );
      case 'accrued':
        return (
          <span style={{ 
            padding: '6px 12px', 
            borderRadius: '12px', 
            background: '#dbeafe', 
            color: '#1e40af', 
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Accrued
          </span>
        );
      case 'paid':
        return (
          <span style={{ 
            padding: '6px 12px', 
            borderRadius: '12px', 
            background: '#dcfce7', 
            color: '#166534', 
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Paid
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <PartnerLayout>
      <div style={{ minHeight: '100vh', background: '#f7f7f8' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '32px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>
                Начисления
              </h1>
              <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
                История всех начислений по заказам
              </p>
            </div>
            <button
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
              <Download size={18} />
              Экспорт CSV
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>В ожидании (Pending)</div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#f59e0b' }}>
                {totalPending.toLocaleString('ru')} ₽
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                {allEarnings.filter(e => e.status === 'pending').length} начислений
              </div>
            </div>
            
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Начислено (Accrued)</div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#0ea5e9' }}>
                {totalAccrued.toLocaleString('ru')} ₽
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                {allEarnings.filter(e => e.status === 'accrued').length} начислений
              </div>
            </div>
            
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Выплачено (Paid)</div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#22c55e' }}>
                {totalPaid.toLocaleString('ru')} ₽
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                {allEarnings.filter(e => e.status === 'paid').length} начислений
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            border: '1px solid #e5e5e5',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <Filter size={18} style={{ color: '#666' }} />
            
            <div style={{ flex: 1, position: 'relative' }}>
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#999'
                }} 
              />
              <input
                type="text"
                placeholder="Поиск по заказу, клиенту или SKU..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '1px solid #d0d0d0',
                borderRadius: '8px',
                fontSize: '14px',
                minWidth: '150px'
              }}
            >
              <option value="all">Все статусы</option>
              <option value="pending">Pending</option>
              <option value="accrued">Accrued</option>
              <option value="paid">Paid</option>
            </select>

            <input
              type="date"
              style={{
                padding: '10px 14px',
                border: '1px solid #d0d0d0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Earnings Table */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Дата
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Заказ
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Клиент
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Товар
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Факт qty
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Ставка
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Сумма
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEarnings.map((earning) => (
                    <tr key={earning.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '14px' }}>
                          {new Date(earning.createdAt).toLocaleDateString('ru')}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'monospace' }}>
                          {earning.orderId}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '14px' }}>
                          {earning.clientName}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '2px' }}>
                          {earning.productName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {earning.sku} / {earning.size}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: '600' }}>
                          {earning.factQty}
                        </div>
                        {earning.planQty !== earning.factQty && (
                          <div style={{ fontSize: '12px', color: '#dc2626' }}>
                            план: {earning.planQty}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {earning.commissionType === 'percent' 
                            ? `${earning.commissionRate}%`
                            : `${earning.commissionRate} ₽/шт`
                          }
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ fontSize: '17px', fontWeight: '600', color: '#10a37f' }}>
                          {earning.amount.toLocaleString('ru')} ₽
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        {getStatusBadge(earning.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Note */}
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            background: '#fffbeb',
            border: '1px solid #fde047',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#92400e'
          }}>
            <strong>Жизненный цикл начисления:</strong> Pending (создано, ожидает выпуска) → Accrued (начислено по факту) → Paid (выплачено).
            Комиссия считается по фактическому количеству.
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

export default PartnerEarnings;
