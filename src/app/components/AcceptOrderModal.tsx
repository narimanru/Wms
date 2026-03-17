import { useState } from 'react';
import { X, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AcceptOrderModalProps {
  onClose: () => void;
  order: any;
}

export function AcceptOrderModal({ onClose, order }: AcceptOrderModalProps) {
  const [step, setStep] = useState<'review' | 'pricing' | 'reject'>('review');
  const [materialsAvailable, setMaterialsAvailable] = useState(false);
  const [deadlineConfirmed, setDeadlineConfirmed] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  
  // Pricing state - стоимость изготовления для каждого item
  const [itemPrices, setItemPrices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    order.items.forEach((item: any) => {
      initial[item.sku] = 0;
    });
    return initial;
  });

  const canProceedToPricing = materialsAvailable && deadlineConfirmed;
  const canAccept = Object.values(itemPrices).every(price => price > 0);
  const canReject = rejectReason && rejectComment;

  return (
    <div style={{
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
    }} onClick={onClose}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        maxWidth: step === 'pricing' ? '700px' : '550px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                {step === 'review' && 'Проверка заказа'}
                {step === 'pricing' && 'Стоимость изготовления'}
                {step === 'reject' && 'Отклонить заказ'}
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                {step === 'review' && 'Проверьте возможность выполнения заказа'}
                {step === 'pricing' && 'Укажите стоимость производства для каждого товара'}
                {step === 'reject' && 'Укажите причину отклонения заказа'}
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
                borderRadius: '6px'
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Review Step */}
          {step === 'review' && (
            <>
              <div style={{
                padding: '16px',
                background: '#f9fafb',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                marginBottom: '24px'
              }}>
                <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.8' }}>
                  <div><strong>Заказ:</strong> {order.id}</div>
                  <div><strong>Клиент:</strong> {order.clientName}</div>
                  <div><strong>Объём:</strong> {order.totalQuantity} шт</div>
                  <div><strong>Срок:</strong> {new Date(order.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#1f2937' }}>
                  Состав заказа:
                </div>
                {order.items.map((item: any) => (
                  <div key={item.sku} style={{ 
                    padding: '12px', 
                    background: '#f9fafb', 
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '13px'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ color: '#6b7280' }}>
                      {item.sizes.map((s: any) => `${s.size}: ${s.plan} шт`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={materialsAvailable}
                    onChange={(e) => setMaterialsAvailable(e.target.checked)}
                    style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.5' }}>
                    Материалы доступны или могут быть закуплены в срок
                  </span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={deadlineConfirmed}
                    onChange={(e) => setDeadlineConfirmed(e.target.checked)}
                    style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.5' }}>
                    Сроки реалистичны, заказ может быть выполнен вовремя
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep('reject')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #fca5a5',
                    background: '#fff',
                    color: '#dc2626',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Отклонить
                </button>
                <button
                  onClick={() => setStep('pricing')}
                  disabled={!canProceedToPricing}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: canProceedToPricing ? '#10a37f' : '#e5e7eb',
                    color: canProceedToPricing ? '#fff' : '#9ca3af',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: canProceedToPricing ? 'pointer' : 'not-allowed'
                  }}
                >
                  Далее →
                </button>
              </div>
            </>
          )}

          {/* Pricing Step */}
          {step === 'pricing' && (
            <>
              <div style={{
                padding: '16px',
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '10px',
                marginBottom: '24px',
                fontSize: '13px',
                color: '#92400e',
                display: 'flex',
                gap: '12px'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Важно:</strong> Укажите стоимость изготовления за одно изделие. 
                  Эти цены будут видны клиенту и партнёру.
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                {order.items.map((item: any) => {
                  const totalQty = item.sizes.reduce((sum: number, s: any) => sum + s.plan, 0);
                  return (
                    <div key={item.sku} style={{
                      padding: '20px',
                      background: '#f9fafb',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: '2px solid ' + (itemPrices[item.sku] > 0 ? '#10a37f' : '#e5e7eb')
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>
                            SKU: {item.sku} • Всего: {totalQty} шт
                          </div>
                        </div>
                        {itemPrices[item.sku] > 0 && (
                          <CheckCircle2 size={24} style={{ color: '#10a37f' }} />
                        )}
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                          Стоимость изготовления (₽/шт)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={itemPrices[item.sku] || ''}
                          onChange={(e) => setItemPrices({
                            ...itemPrices,
                            [item.sku]: parseFloat(e.target.value) || 0
                          })}
                          placeholder="Введите стоимость..."
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '16px',
                            fontWeight: 600
                          }}
                        />
                        {itemPrices[item.sku] > 0 && (
                          <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
                            Итого по позиции: <strong>{(itemPrices[item.sku] * totalQty).toLocaleString('ru')} ₽</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {Object.values(itemPrices).every(p => p > 0) && (
                <div style={{
                  padding: '16px',
                  background: '#f0fdf9',
                  border: '2px solid #10a37f',
                  borderRadius: '10px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '13px', color: '#065f46', marginBottom: '8px' }}>
                    Общая стоимость заказа:
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#10a37f' }}>
                    {Object.entries(itemPrices).reduce((sum, [sku, price]) => {
                      const item = order.items.find((i: any) => i.sku === sku);
                      const qty = item.sizes.reduce((s: number, size: any) => s + size.plan, 0);
                      return sum + (price * qty);
                    }, 0).toLocaleString('ru')} ₽
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep('review')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    color: '#1f2937',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  ← Назад
                </button>
                <button
                  onClick={onClose}
                  disabled={!canAccept}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: canAccept ? '#10a37f' : '#e5e7eb',
                    color: canAccept ? '#fff' : '#9ca3af',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: canAccept ? 'pointer' : 'not-allowed'
                  }}
                >
                  Принять заказ в работу
                </button>
              </div>
            </>
          )}

          {/* Reject Step */}
          {step === 'reject' && (
            <>
              <div style={{
                padding: '16px',
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                borderRadius: '10px',
                marginBottom: '24px',
                fontSize: '13px',
                color: '#991b1b',
                display: 'flex',
                gap: '12px'
              }}>
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  Заказ будет отклонён. Клиент получит уведомление с указанной причиной.
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                  Причина отклонения
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Выберите причину...</option>
                  <option value="deadline">Нереалистичные сроки</option>
                  <option value="materials">Недоступность материалов</option>
                  <option value="capacity">Недостаточная производственная мощность</option>
                  <option value="quality">Невозможно обеспечить требуемое качество</option>
                  <option value="price">Несогласованная стоимость</option>
                  <option value="other">Другая причина</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
                  Комментарий для клиента
                </label>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Опишите детали и возможные альтернативы..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep('review')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    color: '#1f2937',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  ← Назад
                </button>
                <button
                  onClick={onClose}
                  disabled={!canReject}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: canReject ? '#dc2626' : '#e5e7eb',
                    color: canReject ? '#fff' : '#9ca3af',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: canReject ? 'pointer' : 'not-allowed'
                  }}
                >
                  Отклонить заказ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
