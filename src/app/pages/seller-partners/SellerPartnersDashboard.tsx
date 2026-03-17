import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Users, TrendingUp, DollarSign, CheckCircle, Plus, Settings, Link2, Clock } from 'lucide-react';
import partnersData from '../../data/partners-data.json';

function SellerPartnersDashboard() {
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Calculate KPIs
  const totalClients = partnersData.clients.filter(c => c.status === 'active').length;
  const totalAccrued = partnersData.earnings.reduce((sum, e) => sum + (e.status === 'accrued' || e.status === 'paid' ? e.amount : 0), 0);
  const totalPayable = partnersData.earnings.reduce((sum, e) => sum + (e.status === 'accrued' ? e.amount : 0), 0);
  const totalPaid = partnersData.payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '20px 40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
              Партнёры
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', margin: 0 }}>
              Панель управления
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/seller/partners/rules')}
              style={{
                padding: '10px 20px',
                background: 'white',
                border: '1px solid #d0d0d0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Settings size={18} />
              Правила комиссии
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
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
              Пригласить партнёра
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0fdf9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} style={{ color: '#10a37f' }} />
              </div>
              <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Приведено клиентов</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600' }}>{totalClients}</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} style={{ color: '#0ea5e9' }} />
              </div>
              <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Начислено</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600' }}>{totalAccrued.toLocaleString('ru')} ₽</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>К выплате</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600' }}>{totalPayable.toLocaleString('ru')} ₽</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={20} style={{ color: '#22c55e' }} />
              </div>
              <div style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Выплачено</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '600' }}>{totalPaid.toLocaleString('ru')} ₽</div>
          </div>
        </div>

        {/* Clients Table */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e5e5' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Клиенты партнёров</h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Клиент</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Партнёр</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Дата подключения</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Заказов</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Начислено</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>Статус</th>
                </tr>
              </thead>
              <tbody>
                {partnersData.clients.map((client) => {
                  const partner = partnersData.partners.find(p => p.id === client.partnerId);
                  return (
                    <tr key={client.id} style={{ borderBottom: '1px solid #e5e5e5' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '500' }}>{client.name}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>{partner?.name}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          {new Date(client.connectedAt).toLocaleDateString('ru')}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '14px' }}>{client.totalOrders}</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: '500' }}>{client.totalEarned.toLocaleString('ru')} ₽</div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {client.status === 'active' ? (
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '12px', 
                            background: '#f0fdf4', 
                            color: '#15803d', 
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            Активен
                          </span>
                        ) : (
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: '12px', 
                            background: '#fef2f2', 
                            color: '#991b1b', 
                            fontSize: '13px',
                            fontWeight: '500'
                          }}>
                            Пауза
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
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
        }} onClick={() => setShowInviteModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '500px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Пригласить партнёра</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              Создайте уникальную реферальную ссылку для нового партнёра
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>
                Email партнёра
              </label>
              <input
                type="email"
                placeholder="partner@example.com"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d0d0d0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{
              padding: '16px',
              background: '#f0fdf9',
              border: '1px solid #10a37f20',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Link2 size={16} style={{ color: '#10a37f' }} />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#10a37f' }}>Реферальная ссылка</span>
              </div>
              <div style={{ 
                padding: '8px 12px', 
                background: 'white', 
                borderRadius: '6px', 
                fontSize: '13px',
                fontFamily: 'monospace',
                color: '#666'
              }}>
                https://fastwms.ru/join?ref=DEMO2026
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowInviteModal(false)}
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
                onClick={() => setShowInviteModal(false)}
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
                Отправить приглашение
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SellerPartnersDashboard;
