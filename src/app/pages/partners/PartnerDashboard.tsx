import { Users, TrendingUp, Clock, CheckCircle, AlertCircle, Package } from 'lucide-react';
import partnersData from '../../data/partners-data.json';
import { PartnerLayout } from '../../components/PartnerLayout';

function PartnerDashboard() {
  // Mock: используем первого партнёра
  const currentPartnerId = 'PTR-001';
  const currentPartner = partnersData.partners.find(p => p.id === currentPartnerId)!;
  
  // Get partner's clients
  const partnerClients = partnersData.clients.filter(c => c.partnerId === currentPartnerId);
  const activeClients = partnerClients.filter(c => c.status === 'active').length;
  
  // Calculate earnings
  const partnerEarnings = partnersData.earnings.filter(e => e.partnerId === currentPartnerId);
  const totalAccrued = partnerEarnings
    .filter(e => e.status === 'accrued' || e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalPayable = partnerEarnings
    .filter(e => e.status === 'accrued')
    .reduce((sum, e) => sum + e.amount, 0);
    
  const totalPaid = partnersData.payouts
    .filter(p => p.partnerId === currentPartnerId && p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  // Count orders in progress
  const ordersInProgress = partnerEarnings.filter(e => e.status === 'pending').length;
  
  // Recent earnings
  const recentEarnings = partnerEarnings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <PartnerLayout>
      <div style={{ minHeight: '100vh', background: '#f7f7f8' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '32px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>
              Добро пожаловать, {currentPartner.name.split(' ')[0]}!
            </h1>
            <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
              Ваша партнёрская статистика и начисления
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f0fdf9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} style={{ color: '#10a37f' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Клиентов</div>
                </div>
              </div>
              <div style={{ fontSize: '36px', fontWeight: '600', marginBottom: '4px' }}>{activeClients}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Активных партнёров</div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={24} style={{ color: '#0ea5e9' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Начислено</div>
                </div>
              </div>
              <div style={{ fontSize: '36px', fontWeight: '600', marginBottom: '4px' }}>
                {totalAccrued.toLocaleString('ru')} ₽
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>Всего заработано</div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={24} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>К выплате</div>
                </div>
              </div>
              <div style={{ fontSize: '36px', fontWeight: '600', marginBottom: '4px' }}>
                {totalPayable.toLocaleString('ru')} ₽
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>Готово к переводу</div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={24} style={{ color: '#22c55e' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Выплачено</div>
                </div>
              </div>
              <div style={{ fontSize: '36px', fontWeight: '600', marginBottom: '4px' }}>
                {totalPaid.toLocaleString('ru')} ₽
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>Получено</div>
            </div>
          </div>

          {/* Two column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Recent Earnings */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e5e5' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Последние начисления</h2>
              </div>
              
              <div>
                {recentEarnings.map((earning) => {
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case 'pending':
                        return (
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            background: '#fef3c7', 
                            color: '#92400e', 
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            Ожидание
                          </span>
                        );
                      case 'accrued':
                        return (
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            background: '#dbeafe', 
                            color: '#1e40af', 
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            Начислено
                          </span>
                        );
                      case 'paid':
                        return (
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            background: '#dcfce7', 
                            color: '#166534', 
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            Выплачено
                          </span>
                        );
                      default:
                        return null;
                    }
                  };

                  return (
                    <div 
                      key={earning.id} 
                      style={{ 
                        padding: '20px 24px', 
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <div style={{ fontWeight: '600', fontSize: '15px' }}>
                            {earning.productName}
                          </div>
                          {getStatusBadge(earning.status)}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {earning.orderId} • {earning.clientName} • {earning.factQty} шт
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          {earning.basis}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#10a37f' }}>
                          {earning.amount.toLocaleString('ru')} ₽
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                          {new Date(earning.createdAt).toLocaleDateString('ru')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              {/* Orders in Progress */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={20} style={{ color: '#f59e0b' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#666' }}>Заказов в работе</div>
                  </div>
                </div>
                <div style={{ fontSize: '32px', fontWeight: '600' }}>{ordersInProgress}</div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                  Ожидают выпуска
                </div>
              </div>

              {/* Info Banner */}
              <div style={{ 
                background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                  <AlertCircle size={20} style={{ marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                      Как работают начисления
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.5' }}>
                      Комиссия начисляется <strong>по факту выпуска</strong> продукции. После приёмки партии клиентом начисления переходят в статус "К выплате".
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

export default PartnerDashboard;
