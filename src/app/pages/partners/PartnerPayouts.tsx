import { useState } from 'react';
import { CreditCard, Calendar, AlertCircle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import partnersData from '../../data/partners-data.json';
import { PartnerLayout } from '../../components/PartnerLayout';

function PartnerPayouts() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Mock: используем первого партнёра
  const currentPartnerId = 'PTR-001';
  const currentPartner = partnersData.partners.find(p => p.id === currentPartnerId)!;
  
  // Get partner's payouts
  const partnerPayouts = partnersData.payouts.filter(p => p.partnerId === currentPartnerId);
  
  // Calculate balance
  const partnerEarnings = partnersData.earnings.filter(e => e.partnerId === currentPartnerId);
  const balancePayable = partnerEarnings
    .filter(e => e.status === 'accrued')
    .reduce((sum, e) => sum + e.amount, 0);

  const getPayoutStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <span style={{ 
            padding: '6px 12px', 
            borderRadius: '12px', 
            background: '#fef3c7', 
            color: '#92400e', 
            fontSize: '13px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Clock size={14} />
            В обработке
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
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle size={14} />
            Выплачено
          </span>
        );
      case 'failed':
        return (
          <span style={{ 
            padding: '6px 12px', 
            borderRadius: '12px', 
            background: '#fef2f2', 
            color: '#991b1b', 
            fontSize: '13px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertCircle size={14} />
            Ошибка
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
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>
              Выплаты
            </h1>
            <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
              Баланс и история выплат
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
          {/* Balance Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <DollarSign size={32} />
                  <div style={{ fontSize: '16px', opacity: 0.9 }}>Доступно к выплате</div>
                </div>
                <div style={{ fontSize: '56px', fontWeight: '600', marginBottom: '8px' }}>
                  {balancePayable.toLocaleString('ru')} ₽
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  Минимальная сумма выплаты: 5 000 ₽
                </div>
              </div>
              <button
                onClick={() => setShowRequestModal(true)}
                disabled={balancePayable < 5000}
                style={{
                  padding: '14px 28px',
                  background: balancePayable >= 5000 ? 'white' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  borderRadius: '10px',
                  color: balancePayable >= 5000 ? '#10a37f' : 'white',
                  cursor: balancePayable >= 5000 ? 'pointer' : 'not-allowed',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                Запросить выплату
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                  Способ выплаты
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '10px', 
                    background: '#f0f9ff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <CreditCard size={24} style={{ color: '#0ea5e9' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '2px' }}>
                      {currentPartner.paymentDetails.type === 'card' ? 'Банковская карта' : 'Расчётный счёт'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', fontFamily: 'monospace' }}>
                      {currentPartner.paymentDetails.maskedNumber}
                    </div>
                  </div>
                </div>
              </div>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Изменить
              </button>
            </div>
          </div>

          {/* Payouts History */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e5e5' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>История выплат</h2>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      ID выплаты
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Дата запроса
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Дата выплаты
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Сумма
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Способ
                    </th>
                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {partnerPayouts.map((payout) => (
                    <tr key={payout.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'monospace' }}>
                          {payout.id}
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} style={{ color: '#999' }} />
                          <span style={{ fontSize: '14px' }}>
                            {new Date(payout.requestedAt).toLocaleDateString('ru', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        {payout.paidAt ? (
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            {new Date(payout.paidAt).toLocaleDateString('ru', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </div>
                        ) : (
                          <div style={{ fontSize: '14px', color: '#999' }}>—</div>
                        )}
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#10a37f' }}>
                          {payout.amount.toLocaleString('ru')} ₽
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {payout.method === 'card' ? 'Карта' : 'Счёт'}
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                        {getPayoutStatusBadge(payout.status)}
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
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#0c4a6e',
            display: 'flex',
            gap: '12px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>График выплат:</strong> Выплаты обрабатываются еженедельно по понедельникам. 
              Средства поступают на указанный счёт в течение 1-3 рабочих дней после одобрения.
            </div>
          </div>
        </div>
      </div>

      {/* Request Payout Modal */}
      {showRequestModal && (
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
        }} onClick={() => setShowRequestModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '500px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              Запросить выплату
            </h3>
            
            <div style={{ 
              padding: '20px', 
              background: '#f9fafb', 
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                Сумма к выплате
              </div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#10a37f' }}>
                {balancePayable.toLocaleString('ru')} ₽
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                На {currentPartner.paymentDetails.type === 'card' ? 'карту' : 'счёт'}: {currentPartner.paymentDetails.maskedNumber}
              </div>
            </div>

            <div style={{ 
              padding: '16px',
              background: '#fffbeb',
              border: '1px solid #fde047',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '13px',
              color: '#92400e'
            }}>
              Средства поступят в течение 1-3 рабочих дней после одобрения запроса
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowRequestModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
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
                onClick={() => setShowRequestModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#10a37f',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </PartnerLayout>
  );
}

export default PartnerPayouts;
