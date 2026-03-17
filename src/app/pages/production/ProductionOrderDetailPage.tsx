import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Package, 
  Clock,
  Loader,
  X,
  FileText,
  Upload,
  AlertCircle,
  Box,
  DollarSign,
  FileCheck,
  Tag,
  Layers,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react';
import ProductionLayout from '../../components/ProductionLayout';
import ordersData from '../../data/production-orders.json';
import { OrderCommissionTab } from '../../components/OrderCommissionTab';
import { AcceptOrderModal } from '../../components/AcceptOrderModal';

type TabType = 'overview' | 'items' | 'workflow' | 'payments' | 'issues' | 'shipment' | 'commission' | 'materials' | 'status' | 'finances' | 'documents' | 'marking';

export default function ProductionOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);

  const order = ordersData.orders.find(o => o.id === id);

  if (!order) {
    return (
      <ProductionLayout>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Заказ не найден</p>
        </div>
      </ProductionLayout>
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

  const totalPlan = order.items.reduce((sum, item) => 
    sum + item.sizes.reduce((s, size) => s + size.plan, 0), 0
  );
  
  const totalFact = order.items.reduce((sum, item) => 
    sum + item.sizes.reduce((s, size) => s + size.fact, 0), 0
  );

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'items', label: 'Состав заказа' },
    { id: 'workflow', label: 'Этапы' },
    { id: 'materials', label: 'Материалы' },
    { id: 'status', label: 'Статус' },
    { id: 'finances', label: 'Финансы' },
    { id: 'documents', label: 'Документы' },
    { id: 'marking', label: 'Маркировка' },
    { id: 'payments', label: 'Оплата' },
    { id: 'issues', label: 'Инциденты', count: order.issues.length },
    { id: 'shipment', label: 'Отгрузка' },
    { id: 'commission', label: 'Комиссия' },
  ];

  const statusColors = getStatusColor(order.status);

  return (
    <ProductionLayout>
      <div style={{ minHeight: '100vh', background: '#f7f7f8' }}>
        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
            <button
              onClick={() => navigate('/production/orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
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

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                    {order.id}
                  </h1>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: statusColors.bg,
                    color: statusColors.text
                  }}>
                    {getStatusLabel(order.status)}
                  </span>
                  {order.priority === 'urgent' && (
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: '#fee2e2',
                      color: '#991b1b'
                    }}>
                      СРОЧНО
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', color: '#6b7280' }}>
                  <span><strong>Клиент:</strong> {order.clientName}</span>
                  <span><strong>Сезон:</strong> {order.season}</span>
                  <span><strong>Срок:</strong> {new Date(order.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                  <span><strong>Объём:</strong> {order.totalQuantity} шт</span>
                </div>
              </div>

              {order.status === 'new' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowRequestChangesModal(true)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      color: '#1f2937',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Запросить изменения
                  </button>
                  <button
                    onClick={() => setShowAcceptModal(true)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#10a37f',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Принять заказ
                  </button>
                </div>
              )}

              {order.status !== 'new' && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowIssueModal(true)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: '1px solid #f59e0b',
                      background: '#fffbeb',
                      color: '#92400e',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <AlertTriangle style={{ width: '16px', height: '16px' }} />
                    Сообщить о проблеме
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #e5e7eb' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    background: 'transparent',
                    color: activeTab === tab.id ? '#10a37f' : '#6b7280',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    cursor: 'pointer',
                    borderBottom: activeTab === tab.id ? '2px solid #10a37f' : '2px solid transparent',
                    position: 'relative'
                  }}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: '#fee2e2',
                      color: '#991b1b',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
          {activeTab === 'overview' && <OverviewTab order={order} totalPlan={totalPlan} totalFact={totalFact} />}
          {activeTab === 'items' && <ItemsTab order={order} />}
          {activeTab === 'workflow' && <WorkflowTab order={order} />}
          {activeTab === 'materials' && <MaterialsTab order={order} />}
          {activeTab === 'status' && <StatusTab order={order} />}
          {activeTab === 'finances' && <FinancesTab order={order} />}
          {activeTab === 'documents' && <DocumentsTab order={order} />}
          {activeTab === 'marking' && <MarkingTab order={order} />}
          {activeTab === 'payments' && <PaymentsTab order={order} />}
          {activeTab === 'issues' && <IssuesTab order={order} onCreateIssue={() => setShowIssueModal(true)} />}
          {activeTab === 'shipment' && <ShipmentTab order={order} />}
          {activeTab === 'commission' && (
            <OrderCommissionTab
              orderId={order.id}
              partnerId="PTR-001"
              partnerName="Иван Партнёров"
              items={order.items.map(item => ({
                sku: item.sku,
                name: item.name,
                category: item.category,
                clientPrice: 500,
                partnerCommission: item.category === 'Брюки' ? 100 : 50,
                commissionType: 'fixed_per_unit',
                sizes: item.sizes
              }))}
            />
          )}
        </div>

        {/* Modals */}
        {showAcceptModal && <AcceptOrderModal onClose={() => setShowAcceptModal(false)} order={order} />}
        {showIssueModal && <CreateIssueModal onClose={() => setShowIssueModal(false)} order={order} />}
        {showRequestChangesModal && <RequestChangesModal onClose={() => setShowRequestChangesModal(false)} order={order} />}
      </div>
    </ProductionLayout>
  );
}

// Overview Tab
function OverviewTab({ order, totalPlan, totalFact }: any) {
  const progress = totalPlan > 0 ? (totalFact / totalPlan) * 100 : 0;
  
  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      awaiting: 'Ожидается',
      received: 'Получена',
      not_issued: 'Не выставлен',
      partial: 'Частично'
    };
    return labels[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      awaiting: { bg: '#fef3c7', text: '#92400e' },
      received: { bg: '#d1fae5', text: '#065f46' },
      not_issued: { bg: '#f3f4f6', text: '#6b7280' },
      partial: { bg: '#dbeafe', text: '#1e40af' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const currentStageLabel = order.workflow.find((w: any) => w.status === 'in_progress')?.name || 'Не начато';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
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
            {getStatusLabel(order.status)}
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
            {currentStageLabel}
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
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
            {totalFact} / {totalPlan}
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: '#f3f4f6',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: progress === 100 ? '#10a37f' : '#3b82f6',
              transition: 'width 0.3s ease'
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
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(() => {
              const prepaymentColors = getPaymentStatusColor(order.payments.prepayment.status);
              return (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  background: prepaymentColors.bg,
                  color: prepaymentColors.text
                }}>
                  {getPaymentStatusLabel(order.payments.prepayment.status)}
                </span>
              );
            })()}
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
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '20px' }}>
          Ключевые условия
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
              Кто печатает КИЗ
            </div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
              {order.requirements.kizPrinting === 'seller' ? 'Селлер' : 
               order.requirements.kizPrinting === 'contractor' ? 'Мы (подрядчик)' : 'Фулфилмент'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
              Упаковка
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {order.requirements.packaging.map((pkg: string) => (
                <span key={pkg} style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: '#f3f4f6',
                  color: '#1f2937',
                  fontSize: '13px',
                  fontWeight: 500
                }}>
                  {pkg === 'polybag' ? 'Пакет' : 
                   pkg === 'tag' ? 'Бирка' : 
                   pkg === 'sticker' ? 'Стикер' : pkg}
                </span>
              ))}
            </div>
          </div>

          {order.requirements.clientComments && (
            <div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                Комментарии клиента
              </div>
              <div style={{
                padding: '12px',
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#92400e',
                lineHeight: '1.6'
              }}>
                {order.requirements.clientComments}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Items Tab
function ItemsTab({ order }: any) {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [factValues, setFactValues] = useState<Record<string, number>>({});

  const getDeviationReasonLabel = (value: string) => {
    const reason = ordersData.deviationReasons.find(r => r.value === value);
    return reason?.label || value;
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
          План vs Факт по размерам
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
          💡 В одежде факт может отличаться от плана — фиксируйте причину, чтобы клиент видел прозрачность.
        </p>
      </div>

      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                SKU / Наименование
              </th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Размер
              </th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                План
              </th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Факт
              </th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Отклонение
              </th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Причина
              </th>
              <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Статус
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, itemIdx: number) => (
              item.sizes.map((size: any, sizeIdx: number) => {
                const rowKey = `${item.sku}-${size.size}`;
                const deviation = size.fact - size.plan;
                const showReason = deviation !== 0;

                return (
                  <tr 
                    key={rowKey}
                    style={{ borderBottom: '1px solid #f3f4f6' }}
                  >
                    {sizeIdx === 0 && (
                      <td 
                        rowSpan={item.sizes.length}
                        style={{ padding: '16px 20px', borderRight: '1px solid #f3f4f6', verticalAlign: 'top' }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f2937', fontFamily: 'monospace', marginBottom: '4px' }}>
                          {item.sku}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {item.name}
                        </div>
                      </td>
                    )}
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                        {size.size}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        RU {size.rusSize}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                      {size.plan}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <input
                        type="number"
                        defaultValue={size.fact}
                        style={{
                          width: '80px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          textAlign: 'center',
                          fontSize: '13px',
                          fontWeight: 600
                        }}
                        onFocus={() => setEditingRow(rowKey)}
                        onChange={(e) => {
                          setFactValues({
                            ...factValues,
                            [rowKey]: parseInt(e.target.value) || 0
                          });
                        }}
                      />
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: deviation > 0 ? '#10a37f' : deviation < 0 ? '#dc2626' : '#6b7280'
                      }}>
                        {deviation > 0 ? '+' : ''}{deviation}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {showReason && size.deviationReason ? (
                        <span style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          display: 'block',
                          maxWidth: '200px'
                        }}>
                          {getDeviationReasonLabel(size.deviationReason)}
                        </span>
                      ) : showReason ? (
                        <select style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #fca5a5',
                          fontSize: '12px',
                          background: '#fef2f2'
                        }}>
                          <option value="">Выберите причину...</option>
                          {ordersData.deviationReasons.map(reason => (
                            <option key={reason.value} value={reason.value}>{reason.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      {size.status === 'done' ? (
                        <CheckCircle2 style={{ width: '18px', height: '18px', color: '#10a37f', margin: '0 auto' }} />
                      ) : size.status === 'in_progress' ? (
                        <Loader style={{ width: '18px', height: '18px', color: '#3b82f6', margin: '0 auto' }} />
                      ) : (
                        <Clock style={{ width: '18px', height: '18px', color: '#9ca3af', margin: '0 auto' }} />
                      )}
                    </td>
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{
          padding: '10px 18px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          background: '#fff',
          color: '#1f2937',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer'
        }}>
          Предложить замену
        </button>
        <button style={{
          padding: '10px 18px',
          borderRadius: '8px',
          border: 'none',
          background: '#10a37f',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Сохранить факт
        </button>
      </div>
    </div>
  );
}

// Workflow Tab
function WorkflowTab({ order }: any) {
  const getStageStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; icon: string; border: string }> = {
      done: { bg: '#d1fae5', icon: '#10a37f', border: '#10a37f' },
      in_progress: { bg: '#dbeafe', icon: '#3b82f6', border: '#3b82f6' },
      not_started: { bg: '#f3f4f6', icon: '#9ca3af', border: '#e5e7eb' }
    };
    return colors[status] || colors.not_started;
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '24px' }}>
          Этапы производства
        </h3>

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            left: '20px',
            top: '30px',
            bottom: '30px',
            width: '2px',
            background: '#e5e7eb'
          }} />

          {/* Stages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {order.workflow.map((stage: any, idx: number) => {
              const colors = getStageStatusColor(stage.status);
              
              return (
                <div key={stage.id} style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  position: 'relative',
                  paddingBottom: idx < order.workflow.length - 1 ? '32px' : '0'
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: colors.bg,
                    border: `2px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1
                  }}>
                    {stage.status === 'done' ? (
                      <CheckCircle2 style={{ width: '20px', height: '20px', color: colors.icon }} />
                    ) : stage.status === 'in_progress' ? (
                      <Loader style={{ width: '20px', height: '20px', color: colors.icon }} />
                    ) : (
                      <Clock style={{ width: '20px', height: '20px', color: colors.icon }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937', margin: '0 0 4px 0' }}>
                          {stage.name}
                        </h4>
                        {stage.responsible && (
                          <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            Ответственный: {stage.responsible}
                          </p>
                        )}
                      </div>
                      {stage.status === 'not_started' && idx === order.workflow.findIndex((s: any) => s.status === 'not_started') && (
                        <button style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#10a37f',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}>
                          Начать этап
                        </button>
                      )}
                    </div>

                    {stage.startDate && (
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                        {stage.startDate && !stage.endDate && `Начато: ${new Date(stage.startDate).toLocaleDateString('ru-RU')}`}
                        {stage.startDate && stage.endDate && (
                          `${new Date(stage.startDate).toLocaleDateString('ru-RU')} — ${new Date(stage.endDate).toLocaleDateString('ru-RU')}`
                        )}
                      </div>
                    )}

                    {stage.comment && (
                      <p style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        background: '#f9fafb',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        margin: '8px 0 0 0',
                        lineHeight: '1.6'
                      }}>
                        {stage.comment}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Payments Tab
function PaymentsTab({ order }: any) {
  const getPaymentStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      awaiting: 'Ожидается',
      received: 'Получена',
      not_issued: 'Не выставлен'
    };
    return labels[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      awaiting: { bg: '#fef3c7', text: '#92400e' },
      received: { bg: '#d1fae5', text: '#065f46' },
      not_issued: { bg: '#f3f4f6', text: '#6b7280' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '24px' }}>
          Статус оплат
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Prepayment */}
          <div style={{
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '10px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                Предоплата
              </h4>
              {(() => {
                const colors = getPaymentStatusColor(order.payments.prepayment.status);
                return (
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: colors.bg,
                    color: colors.text
                  }}>
                    {getPaymentStatusLabel(order.payments.prepayment.status)}
                  </span>
                );
              })()}
            </div>
            {order.payments.prepayment.receivedDate && (
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Получена: {new Date(order.payments.prepayment.receivedDate).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>

          {/* Balance */}
          <div style={{
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '10px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                Остаток
              </h4>
              {(() => {
                const colors = getPaymentStatusColor(order.payments.balance.status);
                return (
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: colors.bg,
                    color: colors.text
                  }}>
                    {getPaymentStatusLabel(order.payments.balance.status)}
                  </span>
                );
              })()}
            </div>
            {order.payments.balance.receivedDate && (
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Получена: {new Date(order.payments.balance.receivedDate).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>
        </div>

        {order.payments.prepayment.status === 'awaiting' && (
          <div style={{ marginTop: '24px' }}>
            <button style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #10a37f',
              background: '#fff',
              color: '#10a37f',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              Запросить оплату
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Issues Tab
function IssuesTab({ order, onCreateIssue }: any) {
  const getIssueTypeLabel = (type: string) => {
    const issueType = ordersData.issueTypes.find(t => t.value === type);
    return issueType?.label || type;
  };

  const getSolutionLabel = (solution: string) => {
    const sol = ordersData.solutions.find(s => s.value === solution);
    return sol?.label || solution;
  };

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
            Инциденты и отклонения
          </h3>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
            Фиксируйте проблемы для прозрачности с клиентом
          </p>
        </div>
        <button
          onClick={onCreateIssue}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: '#10a37f',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Создать инцидент
        </button>
      </div>

      {order.issues.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <CheckCircle2 style={{ width: '48px', height: '48px', color: '#10a37f', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '14px', color: '#6b7280' }}>Инцидентов нет</p>
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          {order.issues.map((issue: any) => (
            <div
              key={issue.id}
              style={{
                padding: '16px',
                background: issue.status === 'resolved' ? '#f0fdf4' : '#fffbeb',
                border: `1px solid ${issue.status === 'resolved' ? '#d1fae5' : '#fef3c7'}`,
                borderRadius: '10px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: issue.status === 'resolved' ? '#d1fae5' : '#fee2e2',
                      color: issue.status === 'resolved' ? '#065f46' : '#991b1b'
                    }}>
                      {issue.status === 'resolved' ? 'Решено' : 'Ожидает решения'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {getIssueTypeLabel(issue.type)}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#1f2937', fontWeight: 500, margin: '0 0 8px 0' }}>
                    {issue.comment}
                  </p>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    SKU: {issue.sku} • Размер: {issue.size} • Количество: {issue.quantity} шт
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Решение: {getSolutionLabel(issue.solution)}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                Создан: {new Date(issue.createdAt).toLocaleDateString('ru-RU')}
                {issue.resolvedAt && ` • Решён: ${new Date(issue.resolvedAt).toLocaleDateString('ru-RU')}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Shipment Tab
function ShipmentTab({ order }: any) {
  const [checklist, setChecklist] = useState({
    packaging: false,
    labeling: false,
    qc: false
  });

  const isReadyToShip = checklist.packaging && checklist.labeling && checklist.qc;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '24px' }}>
          Готовность к отгрузке
        </h3>

        {/* Checklist */}
        <div style={{
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '16px' }}>
            Чек-лист отгрузки
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checklist.packaging}
                onChange={(e) => setChecklist({ ...checklist, packaging: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#1f2937' }}>Упаковка выполнена</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checklist.labeling}
                onChange={(e) => setChecklist({ ...checklist, labeling: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#1f2937' }}>Маркировка наклеена</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checklist.qc}
                onChange={(e) => setChecklist({ ...checklist, qc: e.target.checked })}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#1f2937' }}>ОТК пройден</span>
            </label>
          </div>
        </div>

        {/* Documents */}
        <div style={{
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937', marginBottom: '16px' }}>
            Документы
          </h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#1f2937',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText style={{ width: '16px', height: '16px' }} />
              Сформировать накладную
            </button>
            <button style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#1f2937',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Upload style={{ width: '16px', height: '16px' }} />
              Загрузить акт/фото
            </button>
          </div>
        </div>

        {/* Ship Button */}
        {isReadyToShip ? (
          <button style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            background: '#10a37f',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Отметить как отгружено
          </button>
        ) : (
          <div style={{
            padding: '12px',
            background: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            Завершите все пункты чек-листа для отгрузки
          </div>
        )}
      </div>
    </div>
  );
}

// Materials Tab
function MaterialsTab({ order }: any) {
  const materials = [
    {
      id: 1,
      name: 'Ткань основная (рибана)',
      type: 'Ткань',
      color: 'Черный',
      composition: '95% хлопок, 5% эластан',
      requiredQuantity: 250,
      unit: 'м',
      availableQuantity: 300,
      supplier: 'ТД "Текстиль Про"',
      status: 'available',
      costPerUnit: 450,
      totalCost: 112500
    },
    {
      id: 2,
      name: 'Резинка эластичная 40мм',
      type: 'Фурнитура',
      color: 'Черный',
      composition: '-',
      requiredQuantity: 2100,
      unit: 'м',
      availableQuantity: 1800,
      supplier: 'ООО "Фурнитура+"',
      status: 'need_order',
      costPerUnit: 12,
      totalCost: 25200
    },
    {
      id: 3,
      name: 'Нитки армированные',
      type: 'Расходники',
      color: 'Черный',
      composition: 'Полиэстер',
      requiredQuantity: 45,
      unit: 'катушка',
      availableQuantity: 120,
      supplier: 'ИП Швейные материалы',
      status: 'available',
      costPerUnit: 85,
      totalCost: 3825
    },
    {
      id: 4,
      name: 'Этикетки составные',
      type: 'Фурнитура',
      color: '-',
      composition: '-',
      requiredQuantity: 1050,
      unit: 'шт',
      availableQuantity: 0,
      supplier: 'Типография "Ярлык"',
      status: 'ordered',
      costPerUnit: 3.5,
      totalCost: 3675
    }
  ];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'В наличии',
      need_order: 'Требуется заказ',
      ordered: 'Заказано',
      in_transit: 'В пути'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      available: { bg: '#d1fae5', text: '#065f46' },
      need_order: { bg: '#fee2e2', text: '#991b1b' },
      ordered: { bg: '#dbeafe', text: '#1e40af' },
      in_transit: { bg: '#fef3c7', text: '#92400e' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const totalCost = materials.reduce((sum, m) => sum + m.totalCost, 0);
  const materialsReady = materials.filter(m => m.status === 'available').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Box style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              Всего материалов
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#1f2937' }}>
            {materials.length}
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10a37f' }} />
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              Готово
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#10a37f' }}>
            {materialsReady}/{materials.length}
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <DollarSign style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              Общая стоимость
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
            {totalCost.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <button style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            background: '#10a37f',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Заказать недостающее
          </button>
        </div>
      </div>

      {/* Materials Table */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Список материалов
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Материал
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Тип / Состав
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Требуется
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  В наличии
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Поставщик
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Стоимость
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Статус
                </th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => {
                const statusColors = getStatusColor(material.status);
                return (
                  <tr key={material.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937', marginBottom: '4px' }}>
                        {material.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {material.color}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '13px', color: '#1f2937', marginBottom: '2px' }}>
                        {material.type}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {material.composition}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
                        {material.requiredQuantity} {material.unit}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: material.availableQuantity >= material.requiredQuantity ? '#10a37f' : '#dc2626' 
                      }}>
                        {material.availableQuantity} {material.unit}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {material.supplier}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
                        {material.totalCost.toLocaleString('ru-RU')} ₽
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {material.costPerUnit} ₽/{material.unit}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: statusColors.bg,
                        color: statusColors.text,
                        whiteSpace: 'nowrap'
                      }}>
                        {getStatusLabel(material.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Status Tab
function StatusTab({ order }: any) {
  const timeline = [
    {
      id: 1,
      date: '2026-03-01 10:24',
      event: 'Заказ создан',
      description: 'Партнёр Иван Партнёров создал заказ для клиента Kamilek',
      user: 'Партнёр',
      icon: Package,
      color: '#6b7280'
    },
    {
      id: 2,
      date: '2026-03-01 14:15',
      event: 'Отправлен на производство',
      description: 'Заказ отправлен производителю на рассмотрение',
      user: 'Селлер',
      icon: Upload,
      color: '#3b82f6'
    },
    {
      id: 3,
      date: '2026-03-11 09:30',
      event: 'Ожидает подтверждения',
      description: 'Производитель ещё не принял заказ. Статус: Новый',
      user: 'Система',
      icon: Clock,
      color: '#f59e0b'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Status Card */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock style={{ width: '24px', height: '24px', color: '#92400e' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: '0 0 4px 0' }}>
              Новый заказ
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Ожидает принятия производителем
            </p>
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
            Прогресс выполнения
          </div>
          <div style={{
            height: '8px',
            background: '#e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '0%',
              height: '100%',
              background: '#10a37f',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>0% завершено</span>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>0 / 1050 шт</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Дата создания</div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
              01 марта 2026
            </div>
          </div>
          <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Дедлайн</div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#dc2626' }}>
              25 марта 2026
            </div>
          </div>
          <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Осталось дней</div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
              14 дней
            </div>
          </div>
          <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Приоритет</div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#dc2626' }}>
              Срочно
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            История изменений
          </h3>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ position: 'relative' }}>
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.id} style={{ position: 'relative', paddingLeft: '48px', paddingBottom: index < timeline.length - 1 ? '32px' : '0' }}>
                  {/* Timeline line */}
                  {index < timeline.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '19px',
                      top: '40px',
                      bottom: '0',
                      width: '2px',
                      background: '#e5e7eb'
                    }} />
                  )}

                  {/* Icon */}
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${item.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon style={{ width: '20px', height: '20px', color: item.color }} />
                  </div>

                  {/* Content */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                        {item.event}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {item.date}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 4px 0' }}>
                      {item.description}
                    </p>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {item.user}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Finances Tab
function FinancesTab({ order }: any) {
  const finances = {
    manufacturing: {
      items: [
        { name: 'Брюки классические палаццо', quantity: 1000, pricePerUnit: 0, total: 0, status: 'pending' },
        { name: 'Топ базовый', quantity: 530, pricePerUnit: 0, total: 0, status: 'pending' }
      ],
      total: 0
    },
    materials: {
      total: 145200
    },
    commission: {
      partnerRate: 15,
      partnerAmount: 0
    },
    clientPrice: {
      items: [
        { name: 'Брюки классические палаццо', quantity: 1000, pricePerUnit: 2500, total: 2500000 },
        { name: 'Топ базовый', quantity: 530, pricePerUnit: 1200, total: 636000 }
      ],
      total: 3136000
    }
  };

  const expectedProfit = finances.clientPrice.total - finances.manufacturing.total - finances.materials.total - finances.commission.partnerAmount;
  const marginPercent = finances.clientPrice.total > 0 ? ((expectedProfit / finances.clientPrice.total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>
            Цена клиенту
          </div>
          <div style={{ fontSize: '22px', fontWeight: 600, color: '#1f2937' }}>
            {finances.clientPrice.total.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>
            Себестоимость
          </div>
          <div style={{ fontSize: '22px', fontWeight: 600, color: '#f59e0b' }}>
            {(finances.manufacturing.total + finances.materials.total).toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>
            Прибыль
          </div>
          <div style={{ fontSize: '22px', fontWeight: 600, color: '#10a37f' }}>
            {expectedProfit.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: 500 }}>
            Маржа
          </div>
          <div style={{ fontSize: '22px', fontWeight: 600, color: '#10a37f' }}>
            {marginPercent.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Manufacturing Costs */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: '0 0 4px 0' }}>
                Стоимость изготовления
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                Будет указана после принятия заказа
              </p>
            </div>
            <span style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              background: '#fef3c7',
              color: '#92400e'
            }}>
              Ожидается
            </span>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {finances.manufacturing.items.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: idx < finances.manufacturing.items.length - 1 ? '1px solid #e5e7eb' : 'none'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  {item.quantity} шт
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280' }}>
                  —
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Materials Cost */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: '0 0 4px 0' }}>
              Материалы
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Расчёт по спецификации
            </p>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
            {finances.materials.total.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>

      {/* Partner Commission */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: '0 0 4px 0' }}>
              Комиссия партнёра
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              {finances.commission.partnerRate}% от стоимости заказа
            </p>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: '#3b82f6' }}>
            {finances.commission.partnerAmount.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>

      {/* Client Pricing */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Цены для клиента
          </h3>
        </div>

        <div style={{ padding: '20px' }}>
          {finances.clientPrice.items.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: idx < finances.clientPrice.items.length - 1 ? '1px solid #e5e7eb' : 'none'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                  {item.quantity} шт × {item.pricePerUnit.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>
                {item.total.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          ))}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0 0 0',
            marginTop: '16px',
            borderTop: '2px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>
              Итого
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>
              {finances.clientPrice.total.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Documents Tab
function DocumentsTab({ order }: any) {
  const documents = [
    {
      id: 1,
      name: 'Техническое задание',
      type: 'PDF',
      size: '2.4 МБ',
      uploadedBy: 'Партнёр',
      uploadedAt: '2026-03-01 10:30',
      status: 'uploaded',
      url: '#'
    },
    {
      id: 2,
      name: 'Спецификация материалов',
      type: 'Excel',
      size: '145 КБ',
      uploadedBy: 'Производитель',
      uploadedAt: null,
      status: 'pending',
      url: null
    },
    {
      id: 3,
      name: 'Договор производства',
      type: 'PDF',
      size: '—',
      uploadedBy: 'Система',
      uploadedAt: null,
      status: 'pending',
      url: null
    },
    {
      id: 4,
      name: 'Акт приёмки',
      type: 'PDF',
      size: '—',
      uploadedBy: '—',
      uploadedAt: null,
      status: 'pending',
      url: null
    }
  ];

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      uploaded: 'Загружен',
      pending: 'Ожидается',
      signed: 'Подписан'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      uploaded: { bg: '#d1fae5', text: '#065f46' },
      pending: { bg: '#fef3c7', text: '#92400e' },
      signed: { bg: '#dbeafe', text: '#1e40af' }
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Upload Section */}
      <div style={{
        background: '#fff',
        border: '2px dashed #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center'
      }}>
        <Upload style={{ width: '48px', height: '48px', color: '#9ca3af', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
          Загрузите документы
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 20px 0' }}>
          Перетащите файлы сюда или нажмите кнопку ниже
        </p>
        <button style={{
          padding: '10px 20px',
          borderRadius: '8px',
          border: '1px solid #10a37f',
          background: '#fff',
          color: '#10a37f',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Выбрать файлы
        </button>
      </div>

      {/* Documents List */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Документы заказа
          </h3>
        </div>

        <div style={{ padding: '20px' }}>
          {documents.map((doc, idx) => {
            const statusColors = getStatusColor(doc.status);
            return (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: idx < documents.length - 1 ? '12px' : '0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FileText style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937', marginBottom: '4px' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {doc.type} • {doc.size}
                      {doc.uploadedAt && ` • ${doc.uploadedBy} • ${doc.uploadedAt}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: statusColors.bg,
                    color: statusColors.text
                  }}>
                    {getStatusLabel(doc.status)}
                  </span>

                  {doc.status === 'uploaded' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        cursor: 'pointer'
                      }}>
                        <Eye style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      </button>
                      <button style={{
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        cursor: 'pointer'
                      }}>
                        <Download style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Marking Tab
function MarkingTab({ order }: any) {
  const kizSummary = {
    required: 1050,
    generated: 0,
    distributed: 0,
    available: 1050
  };

  const items = order.items.map((item: any) => {
    const total = item.sizes.reduce((sum: number, size: any) => sum + size.plan, 0);
    return {
      ...item,
      totalQuantity: total,
      kizGenerated: 0,
      kizStatus: 'pending'
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Tag style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              Требуется КИЗов
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#1f2937' }}>
            {kizSummary.required.toLocaleString('ru-RU')}
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10a37f' }} />
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              Сгенерировано
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#10a37f' }}>
            {kizSummary.generated.toLocaleString('ru-RU')}
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Layers style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              Распределено
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#3b82f6' }}>
            {kizSummary.distributed.toLocaleString('ru-RU')}
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Package style={{ width: '16px', height: '16px', color: '#6b7280' }} />
            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>
              Доступно
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#6b7280' }}>
            {kizSummary.available.toLocaleString('ru-RU')}
          </div>
        </div>
      </div>

      {/* Notice */}
      <div style={{
        padding: '16px',
        background: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <AlertCircle style={{ width: '20px', height: '20px', color: '#f59e0b', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#92400e', marginBottom: '4px' }}>
            Маркировка ещё не начата
          </div>
          <div style={{ fontSize: '13px', color: '#92400e' }}>
            После принятия заказа производителем можно будет сгенерировать и распределить КИЗы
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Распределение по товарам
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Товар
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Требуется
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Сгенерировано
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Прогресс
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Статус
                </th>
                <th style={{ padding: '12px 20px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any) => (
                <tr key={item.sku} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937', marginBottom: '4px' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      SKU: {item.sku}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>
                      {item.totalQuantity.toLocaleString('ru-RU')} шт
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>
                      {item.kizGenerated.toLocaleString('ru-RU')} шт
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{
                      height: '6px',
                      background: '#e5e7eb',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: '0%',
                        height: '100%',
                        background: '#10a37f',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center', marginTop: '4px' }}>
                      0%
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: '#fef3c7',
                      color: '#92400e'
                    }}>
                      Ожидается
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <button
                      disabled
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#f9fafb',
                        color: '#9ca3af',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'not-allowed'
                      }}
                    >
                      Генерировать КИЗы
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Button */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <button
          disabled
          style={{
            padding: '14px 32px',
            borderRadius: '8px',
            border: 'none',
            background: '#e5e7eb',
            color: '#9ca3af',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'not-allowed'
          }}
        >
          Начать массовое распределение КИЗов
        </button>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '12px 0 0 0' }}>
          Доступно после принятия заказа производителем
        </p>
      </div>
    </div>
  );
}

// Create Issue Modal
function CreateIssueModal({ onClose, order }: any) {
  const [issueType, setIssueType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [solution, setSolution] = useState('');
  const [comment, setComment] = useState('');

  const canSubmit = issueType && quantity && solution && comment;

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
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                Создать инцидент
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                Сообщите клиенту о проблеме и предложите решение
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1f2937', marginBottom: '8px' }}>
                Тип инцидента
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  background: '#fff'
                }}
              >
                <option value="">Выберите тип...</option>
                {ordersData.issueTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1f2937', marginBottom: '8px' }}>
                Количество затронуто (шт)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1f2937', marginBottom: '8px' }}>
                Предложение решения
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ordersData.solutions.map(sol => (
                  <button
                    key={sol.value}
                    onClick={() => setSolution(sol.value)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: `1px solid ${solution === sol.value ? '#10a37f' : '#e5e7eb'}`,
                      background: solution === sol.value ? '#f0fdf4' : '#fff',
                      color: solution === sol.value ? '#10a37f' : '#6b7280',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {sol.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1f2937', marginBottom: '8px' }}>
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Опишите проблему подробнее..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={onClose}
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
              Отмена
            </button>
            <button
              disabled={!canSubmit}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: canSubmit ? '#10a37f' : '#e5e7eb',
                color: canSubmit ? '#fff' : '#9ca3af',
                fontSize: '14px',
                fontWeight: 600,
                cursor: canSubmit ? 'pointer' : 'not-allowed'
              }}
            >
              Отправить клиенту
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Request Changes Modal
function RequestChangesModal({ onClose, order }: any) {
  const [changeType, setChangeType] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const toggleChangeType = (type: string) => {
    if (changeType.includes(type)) {
      setChangeType(changeType.filter(t => t !== type));
    } else {
      setChangeType([...changeType, type]);
    }
  };

  const canSubmit = changeType.length > 0 && reason && suggestion;

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
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                Запросить изменения
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                Укажите, что необходимо изменить в заказе
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1f2937', marginBottom: '8px' }}>
                Что нужно изменить
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['deadlines', 'volume', 'materials'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleChangeType(type)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: `1px solid ${changeType.includes(type) ? '#10a37f' : '#e5e7eb'}`,
                      background: changeType.includes(type) ? '#f0fdf4' : '#fff',
                      color: changeType.includes(type) ? '#10a37f' : '#6b7280',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {type === 'deadlines' ? 'Сроки' : type === 'volume' ? 'Объём' : 'Материалы'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1f2937', marginBottom: '8px' }}>
                Причина
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Опишите причину запроса изменений..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#1f2937', marginBottom: '8px' }}>
                Предложение
              </label>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Например: -30 шт из-за нехватки ткани, или сдвинуть срок на 5 дней..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={onClose}
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
              Отмена
            </button>
            <button
              disabled={!canSubmit}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: canSubmit ? '#10a37f' : '#e5e7eb',
                color: canSubmit ? '#fff' : '#9ca3af',
                fontSize: '14px',
                fontWeight: 600,
                cursor: canSubmit ? 'pointer' : 'not-allowed'
              }}
            >
              Отправить клиенту
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
