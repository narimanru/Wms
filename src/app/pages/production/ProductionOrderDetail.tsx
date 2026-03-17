import { 
  ArrowLeft, 
  AlertTriangle, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Package,
  Edit,
  Save,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ordersData from '../../data/production-orders.json';

type TabType = 'overview' | 'items' | 'workflow' | 'payments' | 'issues';

function ProductionOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const order = ordersData.orders.find(o => o.id === id);

  if (!order) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Заказ не найден</h2>
        <button onClick={() => navigate('/production/orders')}>Вернуться к списку</button>
      </div>
    );
  }

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

  const getTotalFact = () => {
    return order.items.reduce((sum, item) => 
      sum + item.sizes.reduce((s, size) => s + size.fact, 0), 0
    );
  };

  const getTotalPlan = () => {
    return order.items.reduce((sum, item) => 
      sum + item.sizes.reduce((s, size) => s + size.plan, 0), 0
    );
  };

  const statusColors = getStatusColor(order.status);
  const totalFact = getTotalFact();
  const totalPlan = getTotalPlan();
  const progressPercent = totalPlan > 0 ? (totalFact / totalPlan) * 100 : 0;

  const tabs = [
    { id: 'overview' as TabType, label: 'Обзор' },
    { id: 'items' as TabType, label: 'План vs Факт' },
    { id: 'workflow' as TabType, label: 'Этапы производства' },
    { id: 'payments' as TabType, label: 'Оплата' },
    { id: 'issues' as TabType, label: `Инциденты ${order.issues.length > 0 ? `(${order.issues.length})` : ''}` }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8' }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '20px 24px'
        }}>
          <button
            onClick={() => navigate('/production/orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#6b7280',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Назад к списку
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ 
                  fontSize: '24px', 
                  fontWeight: 600, 
                  color: '#1f2937',
                  margin: 0
                }}>
                  {order.id}
                </h1>
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
                display: 'flex',
                gap: '24px',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                <span>Клиент: <strong style={{ color: '#1f2937' }}>{order.clientName}</strong></span>
                <span>•</span>
                <span>Срок готовности: <strong style={{ color: '#1f2937' }}>
                  {new Date(order.deadline).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long'
                  })}
                </strong></span>
                <span>•</span>
                <span>Объём: <strong style={{ color: '#1f2937' }}>{order.totalQuantity} шт</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {order.status === 'new' && (
                <>
                  <button
                    onClick={() => setShowAcceptModal(true)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#10a37f',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Принять заказ
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      color: '#6b7280',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Запросить изменения
                  </button>
                </>
              )}
              <button
                onClick={() => setShowIssueModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #fbbf24',
                  background: '#fffbeb',
                  color: '#92400e',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <AlertTriangle style={{ width: '16px', height: '16px' }} />
                Сообщить о проблеме
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: '#6b7280',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <Upload style={{ width: '16px', height: '16px' }} />
                Загрузить документ
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '4px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  background: 'transparent',
                  color: activeTab === tab.id ? '#10a37f' : '#6b7280',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #10a37f' : '2px solid transparent',
                  marginBottom: '-1px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '24px'
      }}>
        {activeTab === 'overview' && <OverviewTab order={order} progressPercent={progressPercent} totalFact={totalFact} totalPlan={totalPlan} />}
        {activeTab === 'items' && <ItemsTab order={order} />}
        {activeTab === 'workflow' && <WorkflowTab order={order} />}
        {activeTab === 'payments' && <PaymentsTab order={order} />}
        {activeTab === 'issues' && <IssuesTab order={order} onCreateIssue={() => setShowIssueModal(true)} />}
      </div>

      {/* Accept Modal */}
      {showAcceptModal && (
        <Modal onClose={() => setShowAcceptModal(false)} title="Принять заказ">
          <AcceptOrderModal onClose={() => setShowAcceptModal(false)} orderId={order.id} />
        </Modal>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <Modal onClose={() => setShowRejectModal(false)} title="Запросить изменения">
          <RejectOrderModal onClose={() => setShowRejectModal(false)} orderId={order.id} />
        </Modal>
      )}

      {/* Issue Modal */}
      {showIssueModal && (
        <Modal onClose={() => setShowIssueModal(false)} title="Создать инцидент">
          <CreateIssueModal onClose={() => setShowIssueModal(false)} orderId={order.id} />
        </Modal>
      )}
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ order, progressPercent, totalFact, totalPlan }: any) {
  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      awaiting: 'Ожидается',
      partial: 'Частично',
      received: 'Получена',
      paid: 'Оплачено',
      not_issued: 'Не выставлен'
    };
    return labels[status] || status;
  };

  const currentStage = order.workflow.find((w: any) => w.status === 'in_progress');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>
            Статус заказа
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
            {order.status === 'new' ? 'Новый' : order.status === 'accepted' ? 'Принят' : 'В работе'}
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>
            Текущий этап
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
            {currentStage?.name || 'Не начато'}
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>
            План / Факт
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
            {totalFact} / {totalPlan}
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#f3f4f6',
            borderRadius: '3px',
            marginTop: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: '#10a37f',
              borderRadius: '3px'
            }} />
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>
            Оплата
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>
            {getPaymentStatusLabel(order.payments.prepayment.status)}
          </div>
        </div>
      </div>

      {/* Key Requirements */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '16px' }}>
          Ключевые условия
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: '#6b7280', width: '180px' }}>Кто печатает КИЗ:</div>
            <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: 500 }}>
              {order.requirements.kizPrinting === 'seller' ? 'Селлер' : 
               order.requirements.kizPrinting === 'contractor' ? 'Подрядчик (мы)' : 'Фулфилмент'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: '#6b7280', width: '180px' }}>Упаковка:</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {order.requirements.packaging.map((p: string) => (
                <span key={p} style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: '#f3f4f6',
                  fontSize: '12px',
                  color: '#1f2937'
                }}>
                  {p === 'polybag' ? 'Пакет' : p === 'tag' ? 'Бирка' : 'Стикер'}
                </span>
              ))}
            </div>
          </div>
          {order.requirements.clientComments && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: '#6b7280', width: '180px' }}>Комментарии клиента:</div>
              <div style={{ fontSize: '13px', color: '#1f2937', fontStyle: 'italic' }}>
                {order.requirements.clientComments}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Items Tab Component
function ItemsTab({ order }: any) {
  const [editingSize, setEditingSize] = useState<string | null>(null);
  const [factValue, setFactValue] = useState<number>(0);

  const handleSaveFact = (itemSku: string, sizeSize: string) => {
    // In real app, save to backend
    console.log('Saving fact for', itemSku, sizeSize, factValue);
    setEditingSize(null);
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '6px' }}>
          План vs Факт по размерам
        </h3>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
          В одежде факт может отличаться от плана — фиксируйте причину, чтобы клиент видел прозрачность.
        </p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <th style={{
              padding: '12px 24px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>SKU / Наименование</th>
            <th style={{
              padding: '12px 24px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>Размер</th>
            <th style={{
              padding: '12px 24px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>План</th>
            <th style={{
              padding: '12px 24px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>Факт</th>
            <th style={{
              padding: '12px 24px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>Отклонение</th>
            <th style={{
              padding: '12px 24px',
              textAlign: 'left',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>Причина</th>
            <th style={{
              padding: '12px 24px',
              textAlign: 'center',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase'
            }}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item: any) => (
            item.sizes.map((size: any, idx: number) => (
              <tr key={`${item.sku}-${size.size}`} style={{
                borderBottom: '1px solid #f3f4f6'
              }}>
                {idx === 0 && (
                  <td rowSpan={item.sizes.length} style={{
                    padding: '16px 24px',
                    fontSize: '13px',
                    color: '#1f2937',
                    verticalAlign: 'top',
                    borderRight: '1px solid #f3f4f6'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{item.sku}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.name}</div>
                  </td>
                )}
                <td style={{ padding: '16px 24px', fontSize: '13px', color: '#1f2937' }}>
                  {size.size} ({size.rusSize})
                </td>
                <td style={{ padding: '16px 24px', fontSize: '13px', textAlign: 'center', fontWeight: 600, color: '#1f2937' }}>
                  {size.plan}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '13px', textAlign: 'center' }}>
                  {editingSize === `${item.sku}-${size.size}` ? (
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <input
                        type="number"
                        value={factValue}
                        onChange={(e) => setFactValue(parseInt(e.target.value) || 0)}
                        style={{
                          width: '70px',
                          padding: '4px 8px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          fontSize: '13px',
                          textAlign: 'center'
                        }}
                      />
                      <button
                        onClick={() => handleSaveFact(item.sku, size.size)}
                        style={{
                          padding: '4px 8px',
                          border: 'none',
                          background: '#10a37f',
                          color: '#fff',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Save style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button
                        onClick={() => setEditingSize(null)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          color: '#6b7280',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <X style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontWeight: 600, color: '#1f2937' }}>{size.fact}</span>
                      <button
                        onClick={() => {
                          setEditingSize(`${item.sku}-${size.size}`);
                          setFactValue(size.fact);
                        }}
                        style={{
                          padding: '2px',
                          border: 'none',
                          background: 'transparent',
                          color: '#6b7280',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  )}
                </td>
                <td style={{
                  padding: '16px 24px',
                  fontSize: '13px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: size.deviation < 0 ? '#dc2626' : size.deviation > 0 ? '#10a37f' : '#6b7280'
                }}>
                  {size.deviation !== 0 && (size.deviation > 0 ? '+' : '')}{size.deviation}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '12px', color: '#6b7280' }}>
                  {size.deviationReason && (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: '#fef3c7',
                      color: '#92400e'
                    }}>
                      {ordersData.deviationReasons.find(r => r.value === size.deviationReason)?.label}
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: size.status === 'done' ? '#d1fae5' : size.status === 'in_progress' ? '#e0e7ff' : '#f3f4f6',
                    color: size.status === 'done' ? '#065f46' : size.status === 'in_progress' ? '#3730a3' : '#6b7280'
                  }}>
                    {size.status === 'done' ? 'Готово' : size.status === 'in_progress' ? 'В работе' : 'Ожидание'}
                  </span>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Workflow Tab Component
function WorkflowTab({ order }: any) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', marginBottom: '24px' }}>
        Этапы производства
      </h3>

      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          left: '19px',
          top: '30px',
          bottom: '30px',
          width: '2px',
          background: '#e5e7eb'
        }} />

        {order.workflow.map((stage: any, idx: number) => (
          <div key={stage.id} style={{
            position: 'relative',
            paddingLeft: '56px',
            paddingBottom: idx < order.workflow.length - 1 ? '32px' : '0'
          }}>
            {/* Status indicator */}
            <div style={{
              position: 'absolute',
              left: '0',
              top: '0',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: stage.status === 'done' ? '#d1fae5' : 
                          stage.status === 'in_progress' ? '#e0e7ff' : '#f3f4f6',
              border: `2px solid ${stage.status === 'done' ? '#10a37f' : 
                                   stage.status === 'in_progress' ? '#6366f1' : '#e5e7eb'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stage.status === 'done' && <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10a37f' }} />}
              {stage.status === 'in_progress' && <Clock style={{ width: '20px', height: '20px', color: '#6366f1' }} />}
              {stage.status === 'not_started' && <Package style={{ width: '20px', height: '20px', color: '#9ca3af' }} />}
            </div>

            <div style={{
              background: stage.status === 'in_progress' ? '#f9fafb' : '#fff',
              border: stage.status === 'in_progress' ? '1px solid #e5e7eb' : 'none',
              borderRadius: '8px',
              padding: stage.status === 'in_progress' ? '16px' : '0'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '4px'
              }}>
                {stage.name}
              </div>

              {stage.responsible && (
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Ответственный: {stage.responsible}
                </div>
              )}

              {(stage.startDate || stage.endDate) && (
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  {stage.startDate && `Начало: ${new Date(stage.startDate).toLocaleDateString('ru-RU')}`}
                  {stage.endDate && ` • Окончание: ${new Date(stage.endDate).toLocaleDateString('ru-RU')}`}
                </div>
              )}

              {stage.comment && (
                <div style={{
                  fontSize: '12px',
                  color: '#1f2937',
                  marginTop: '8px',
                  padding: '8px 12px',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  fontStyle: 'italic'
                }}>
                  {stage.comment}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Payments Tab Component
function PaymentsTab({ order }: any) {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      awaiting: 'Ожидается',
      received: 'Получена',
      not_issued: 'Не выставлен',
      paid: 'Оплачено'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      awaiting: { bg: '#fef3c7', text: '#92400e' },
      received: { bg: '#d1fae5', text: '#065f46' },
      not_issued: { bg: '#f3f4f6', text: '#6b7280' },
      paid: { bg: '#d1fae5', text: '#065f46' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const prepaymentColors = getStatusColor(order.payments.prepayment.status);
  const balanceColors = getStatusColor(order.payments.balance.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Prepayment */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Предоплата
          </h3>
          <span style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            background: prepaymentColors.bg,
            color: prepaymentColors.text
          }}>
            {getStatusLabel(order.payments.prepayment.status)}
          </span>
        </div>
        
        {order.payments.prepayment.receivedDate && (
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            Дата получения: {new Date(order.payments.prepayment.receivedDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        )}
      </div>

      {/* Balance */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Остаток
          </h3>
          <span style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            background: balanceColors.bg,
            color: balanceColors.text
          }}>
            {getStatusLabel(order.payments.balance.status)}
          </span>
        </div>
        
        {order.payments.balance.receivedDate && (
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            Дата получения: {new Date(order.payments.balance.receivedDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '12px'
      }}>
        <button style={{
          padding: '10px 18px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          background: '#fff',
          color: '#1f2937',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          Подтвердить получение
        </button>
        <button style={{
          padding: '10px 18px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          background: '#fff',
          color: '#1f2937',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          Запросить оплату
        </button>
      </div>
    </div>
  );
}

// Issues Tab Component
function IssuesTab({ order, onCreateIssue }: any) {
  const getStatusColor = (status: string) => {
    return status === 'resolved' ? 
      { bg: '#d1fae5', text: '#065f46' } : 
      { bg: '#fee2e2', text: '#991b1b' };
  };

  return (
    <div>
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Инциденты и проблемы
          </h3>
          <button
            onClick={onCreateIssue}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#10a37f',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Создать инцидент
          </button>
        </div>

        {order.issues.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <AlertTriangle style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#d1d5db' }} />
            <p style={{ fontSize: '14px', fontWeight: 500 }}>Инцидентов нет</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              Если возникнут проблемы, создайте инцидент
            </p>
          </div>
        ) : (
          <div style={{ padding: '24px' }}>
            {order.issues.map((issue: any) => {
              const statusColors = getStatusColor(issue.status);
              return (
                <div key={issue.id} style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                        {issue.comment}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {issue.sku} • {issue.size} • {issue.quantity} шт
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: statusColors.bg,
                      color: statusColors.text
                    }}>
                      {issue.status === 'resolved' ? 'Решено' : 'Ожидает решения'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Создано: {new Date(issue.createdAt).toLocaleDateString('ru-RU')}
                    {issue.resolvedAt && ` • Решено: ${new Date(issue.resolvedAt).toLocaleDateString('ru-RU')}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Modal Component
function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Accept Order Modal
function AcceptOrderModal({ onClose, orderId }: { onClose: () => void; orderId: string }) {
  const [materialsAvailable, setMaterialsAvailable] = useState(false);
  const [deadlineConfirmed, setDeadlineConfirmed] = useState(false);

  return (
    <div style={{ padding: '24px' }}>
      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
        Подтвердите, что сроки и объём реалистичны
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={materialsAvailable}
            onChange={(e) => setMaterialsAvailable(e.target.checked)}
          />
          <span style={{ fontSize: '13px', color: '#1f2937' }}>
            Материалы доступны
          </span>
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={deadlineConfirmed}
            onChange={(e) => setDeadlineConfirmed(e.target.checked)}
          />
          <span style={{ fontSize: '13px', color: '#1f2937' }}>
            Сроки подтверждаю
          </span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#6b7280',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Отмена
        </button>
        <button
          disabled={!materialsAvailable || !deadlineConfirmed}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: materialsAvailable && deadlineConfirmed ? '#10a37f' : '#d1d5db',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            cursor: materialsAvailable && deadlineConfirmed ? 'pointer' : 'not-allowed'
          }}
        >
          Принять заказ
        </button>
      </div>
    </div>
  );
}

// Reject Order Modal
function RejectOrderModal({ onClose, orderId }: { onClose: () => void; orderId: string }) {
  const [changeType, setChangeType] = useState('');
  const [reason, setReason] = useState('');
  const [proposal, setProposal] = useState('');

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
            Что требуется изменить
          </label>
          <select
            value={changeType}
            onChange={(e) => setChangeType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px'
            }}
          >
            <option value="">Выберите...</option>
            <option value="deadline">Сроки</option>
            <option value="volume">Объём</option>
            <option value="materials">Материалы</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
            Причина
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Опишите причину..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              minHeight: '80px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
            Предложение
          </label>
          <input
            type="text"
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            placeholder="Например: -30 шт из-за ткани"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#6b7280',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Отмена
        </button>
        <button
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: '#10a37f',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Отправить клиенту
        </button>
      </div>
    </div>
  );
}

// Create Issue Modal
function CreateIssueModal({ onClose, orderId }: { onClose: () => void; orderId: string }) {
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [solution, setSolution] = useState('');
  const [comment, setComment] = useState('');

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
            Тип проблемы
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px'
            }}
          >
            <option value="">Выберите...</option>
            {ordersData.issueTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
            Количество затронуто (шт)
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
            Предложение решения
          </label>
          <select
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px'
            }}
          >
            <option value="">Выберите...</option>
            {ordersData.solutions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>
            Комментарий
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Опишите проблему..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '13px',
              minHeight: '80px',
              fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#6b7280',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Отмена
        </button>
        <button
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: '#10a37f',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Отправить клиенту
        </button>
      </div>
    </div>
  );
}

export default ProductionOrderDetail;
