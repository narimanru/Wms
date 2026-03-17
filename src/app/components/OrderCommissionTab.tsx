import { DollarSign, User, TrendingUp, AlertCircle } from 'lucide-react';
import partnersData from '../data/partners-data.json';

interface OrderCommissionTabProps {
  orderId: string;
  partnerId?: string;
  partnerName?: string;
  items: Array<{
    sku: string;
    name: string;
    category: string;
    clientPrice: number;
    partnerCommission: number;
    commissionType: string;
    sizes: Array<{
      size: string;
      plan: number;
      fact: number;
    }>;
  }>;
}

export function OrderCommissionTab({ orderId, partnerId, partnerName, items }: OrderCommissionTabProps) {
  // Calculate totals
  const calculateCommission = (item: any, size: any) => {
    const qty = size.fact || 0;
    if (item.commissionType === 'percent') {
      return (item.clientPrice * item.partnerCommission / 100) * qty;
    }
    return item.partnerCommission * qty;
  };

  const calculatePlanCommission = (item: any, size: any) => {
    const qty = size.plan || 0;
    if (item.commissionType === 'percent') {
      return (item.clientPrice * item.partnerCommission / 100) * qty;
    }
    return item.partnerCommission * qty;
  };

  const totalCommission = items.reduce((sum, item) => 
    sum + item.sizes.reduce((itemSum, size) => itemSum + calculateCommission(item, size), 0), 0
  );

  const totalPlanCommission = items.reduce((sum, item) => 
    sum + item.sizes.reduce((itemSum, size) => itemSum + calculatePlanCommission(item, size), 0), 0
  );

  const hasDeviation = Math.abs(totalCommission - totalPlanCommission) > 0;

  // Find commission status from earnings data
  const orderEarnings = partnersData.earnings.filter(e => e.orderId === orderId);
  const commissionStatus = orderEarnings.length > 0 ? orderEarnings[0].status : 'pending';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span style={{ 
            padding: '4px 12px', 
            borderRadius: '12px', 
            background: '#fef3c7', 
            color: '#92400e', 
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Pending — создано
          </span>
        );
      case 'accrued':
        return (
          <span style={{ 
            padding: '4px 12px', 
            borderRadius: '12px', 
            background: '#dbeafe', 
            color: '#1e40af', 
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Accrued — начислено
          </span>
        );
      case 'paid':
        return (
          <span style={{ 
            padding: '4px 12px', 
            borderRadius: '12px', 
            background: '#dcfce7', 
            color: '#166534', 
            fontSize: '13px',
            fontWeight: '500'
          }}>
            Paid — выплачено
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Partner Info */}
      {partnerId && partnerName ? (
        <div style={{ 
          background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <User size={24} />
            <div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Партнёр по заказу</div>
              <div style={{ fontSize: '20px', fontWeight: '600' }}>{partnerName}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Модель комиссии</div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>
                {items[0]?.commissionType === 'fixed_per_unit' ? '₽/шт по категориям' : '% от цены'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Основание начисления</div>
              <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>По факту выпуска</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Статус начисления</div>
              <div style={{ marginTop: '4px' }}>
                {getStatusBadge(commissionStatus)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ 
          background: '#fef3c7',
          border: '1px solid #fde047',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={20} style={{ color: '#92400e' }} />
          <span style={{ fontSize: '14px', color: '#92400e' }}>
            Партнёр не привязан к этому заказу
          </span>
        </div>
      )}

      {/* Commission Breakdown */}
      <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e5e5', background: '#f9fafb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>Начисление по позициям</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666' }}>SKU / Размер</th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>План qty</th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>Факт qty</th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>Ставка</th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#666' }}>Начислено ₽</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                item.sizes.map((size, idx) => {
                  const commission = calculateCommission(item, size);
                  const planCommission = calculatePlanCommission(item, size);
                  const hasChange = commission !== planCommission;

                  return (
                    <tr key={`${item.sku}-${size.size}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px 20px' }}>
                        {idx === 0 && (
                          <div style={{ fontWeight: '500', marginBottom: '2px' }}>{item.name}</div>
                        )}
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {item.sku} / {size.size}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px' }}>
                        {size.plan}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{size.fact || 0}</div>
                        {hasChange && (
                          <div style={{ fontSize: '12px', color: '#dc2626' }}>
                            ({size.fact - size.plan > 0 ? '+' : ''}{size.fact - size.plan})
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '14px', color: '#666' }}>
                        {item.commissionType === 'percent' 
                          ? `${item.partnerCommission}%`
                          : `${item.partnerCommission} ₽/шт`
                        }
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', fontSize: '15px', color: '#10a37f' }}>
                          {commission.toLocaleString('ru')} ₽
                        </div>
                        {hasChange && planCommission > 0 && (
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                            план: {planCommission.toLocaleString('ru')} ₽
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: hasDeviation ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '16px' }}>
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrendingUp size={18} style={{ color: '#0369a1' }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#0369a1' }}>Итого по плану</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#0c4a6e' }}>
            {totalPlanCommission.toLocaleString('ru')} ₽
          </div>
        </div>

        <div style={{ background: '#f0fdf9', border: '1px solid #86efac', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <DollarSign size={18} style={{ color: '#10a37f' }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#10a37f' }}>Начислено по факту</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#065f46' }}>
            {totalCommission.toLocaleString('ru')} ₽
          </div>
        </div>

        {hasDeviation && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertCircle size={18} style={{ color: '#dc2626' }} />
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#dc2626' }}>Отклонение</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#991b1b' }}>
              {(totalCommission - totalPlanCommission > 0 ? '+' : '')}
              {(totalCommission - totalPlanCommission).toLocaleString('ru')} ₽
            </div>
          </div>
        )}
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
        <strong>Важно:</strong> Комиссия начисляется по фактическому количеству выпущенной продукции. 
        При изменении факта относительно плана сумма начисления пересчитывается автоматически.
      </div>
    </div>
  );
}
