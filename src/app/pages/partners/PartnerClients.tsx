import { Search, TrendingUp, Calendar } from 'lucide-react';
import partnersData from '../../data/partners-data.json';
import { PartnerLayout } from '../../components/PartnerLayout';

function PartnerClients() {
  // Mock: используем первого партнёра
  const currentPartnerId = 'PTR-001';
  
  // Get partner's clients
  const partnerClients = partnersData.clients.filter(c => c.partnerId === currentPartnerId);

  return (
    <PartnerLayout>
      <div style={{ minHeight: '100vh', background: '#f7f7f8' }}>
        {/* Header */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '32px 40px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>
              Мои клиенты
            </h1>
            <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>
              Список клиентов, привлечённых по вашей реферальной программе
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 40px' }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Всего клиентов</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>{partnerClients.length}</div>
            </div>
            
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Активных</div>
              <div style={{ fontSize: '32px', fontWeight: '600', color: '#10a37f' }}>
                {partnerClients.filter(c => c.status === 'active').length}
              </div>
            </div>
            
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', padding: '20px' }}>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Заказов всего</div>
              <div style={{ fontSize: '32px', fontWeight: '600' }}>
                {partnerClients.reduce((sum, c) => sum + c.totalOrders, 0)}
              </div>
            </div>
          </div>

          {/* Search & Filters */}
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
                placeholder="Поиск по имени клиента..."
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
              style={{
                padding: '10px 14px',
                border: '1px solid #d0d0d0',
                borderRadius: '8px',
                fontSize: '14px',
                minWidth: '150px'
              }}
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="paused">На паузе</option>
            </select>
          </div>

          {/* Clients Table */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                    Клиент
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      Подключён
                    </div>
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                    Заказов
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                    Последний заказ
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <TrendingUp size={14} />
                      Начислено
                    </div>
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666' }}>
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody>
                {partnerClients.map((client) => (
                  <tr key={client.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>
                        {client.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>
                        {client.id}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {new Date(client.connectedAt).toLocaleDateString('ru', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <div style={{ 
                        display: 'inline-block',
                        padding: '6px 12px',
                        background: '#f0f9ff',
                        borderRadius: '8px',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#0369a1'
                      }}>
                        {client.totalOrders}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {/* В реальном приложении это будет дата последнего заказа */}
                        {new Date(client.connectedAt).toLocaleDateString('ru', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#10a37f' }}>
                        {client.totalEarned.toLocaleString('ru')} ₽
                      </div>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      {client.status === 'active' ? (
                        <span style={{ 
                          padding: '6px 14px', 
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
                          padding: '6px 14px', 
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

export default PartnerClients;
