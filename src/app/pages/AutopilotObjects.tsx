import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Sparkles, Package, Factory, Tag, CheckSquare, Edit2, Check, Play, ArrowRight } from 'lucide-react';

type Tab = 'shipments' | 'production' | 'kiz' | 'tasks';

interface Shipment {
  id: string;
  name: string;
  priority: 'High' | 'Med' | 'Low';
  status: 'draft' | 'approved';
}

interface ProductionOrder {
  id: string;
  name: string;
  qty: number;
  deadline: string;
  status: 'Не начат' | 'В работе' | 'Завершён';
}

interface KIZItem {
  id: string;
  sku: string;
  qty: number;
}

interface Task {
  id: string;
  type: string;
  sku: string;
  qty: number;
  assignee: string;
  deadline: string;
  status: 'Ожидает' | 'В работе' | 'Выполнено';
}

function AutopilotObjects() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'shipments';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const shipments: Shipment[] = [
    { id: 'D-001', name: 'Draft WB Краснодар', priority: 'High', status: 'draft' },
    { id: 'D-002', name: 'Draft WB Казань', priority: 'Med', status: 'draft' },
    { id: 'D-003', name: 'Draft WB Электросталь', priority: 'Low', status: 'draft' }
  ];

  const productionOrders: ProductionOrder[] = [
    { id: 'P-101', name: 'Pants Rib M', qty: 200, deadline: '25 марта', status: 'Не начат' },
    { id: 'P-102', name: 'Long Sleeve L', qty: 150, deadline: '27 марта', status: 'Не начат' },
    { id: 'P-103', name: 'Top Basic M', qty: 180, deadline: '29 марта', status: 'Не начат' },
    { id: 'P-104', name: 'Pants Rib L', qty: 120, deadline: '2 апреля', status: 'Не начат' }
  ];

  const kizItems: KIZItem[] = [
    { id: '1', sku: 'Long Sleeve M', qty: 25 },
    { id: '2', sku: 'Pants Rib L', qty: 395 }
  ];

  const tasks: Task[] = [
    { 
      id: 'T-001', 
      type: 'Печать', 
      sku: 'Pants Rib M', 
      qty: 120, 
      assignee: 'Fulfillment #1', 
      deadline: 'Сегодня 18:00',
      status: 'Ожидает'
    },
    { 
      id: 'T-002', 
      type: 'Упаковка', 
      sku: 'Top Basic L', 
      qty: 90, 
      assignee: 'Fulfillment #1', 
      deadline: 'Сегодня 20:00',
      status: 'Ожидает'
    },
    { 
      id: 'T-003', 
      type: 'Сборка', 
      sku: 'Long Sleeve M', 
      qty: 150, 
      assignee: 'Fulfillment #2', 
      deadline: 'Завтра 10:00',
      status: 'Ожидает'
    },
    { 
      id: 'T-004', 
      type: 'Печать', 
      sku: 'Pants Rib L', 
      qty: 80, 
      assignee: 'Fulfillment #1', 
      deadline: 'Завтра 14:00',
      status: 'Ожидает'
    }
  ];

  const tabs = [
    { id: 'shipments' as Tab, label: 'Поставки', icon: <Package className="w-4 h-4" /> },
    { id: 'production' as Tab, label: 'Производство', icon: <Factory className="w-4 h-4" /> },
    { id: 'kiz' as Tab, label: 'КИЗ', icon: <Tag className="w-4 h-4" /> },
    { id: 'tasks' as Tab, label: 'Задачи', icon: <CheckSquare className="w-4 h-4" /> }
  ];

  return (
    <div className="autopilot-objects">
      {/* Header */}
      <div className="autopilot-objects__header">
        <div className="autopilot-objects__header-top">
          <div className="autopilot-objects__badge">
            <Sparkles className="w-4 h-4" />
            <span>AI</span>
          </div>
        </div>
        <h1 className="autopilot-objects__title">Центр управления</h1>
        <p className="autopilot-objects__subtitle">
          Управляйте созданными автопилотом объектами: утверждайте поставки, запускайте производство, контролируйте задачи
        </p>
      </div>

      {/* Tabs */}
      <div className="autopilot-objects__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`autopilot-objects__tab ${activeTab === tab.id ? 'autopilot-objects__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="autopilot-objects__content">
        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <div className="autopilot-objects__section">
            <div className="autopilot-objects__list">
              {shipments.map(shipment => (
                <div key={shipment.id} className="autopilot-object-card">
                  <div className="autopilot-object-card__main">
                    <div className="autopilot-object-card__title">
                      {shipment.name} #{shipment.id}
                    </div>
                    <div className="autopilot-object-card__meta">
                      <span className={`autopilot-object-card__priority autopilot-object-card__priority--${shipment.priority.toLowerCase()}`}>
                        {shipment.priority}
                      </span>
                      <span className="autopilot-object-card__status">
                        Черновик
                      </span>
                    </div>
                  </div>
                  <div className="autopilot-object-card__actions">
                    <button className="autopilot-object-card__btn autopilot-object-card__btn--secondary">
                      <Edit2 className="w-4 h-4" />
                      Редактировать
                    </button>
                    <button className="autopilot-object-card__btn autopilot-object-card__btn--primary">
                      <Check className="w-4 h-4" />
                      Утвердить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Production Tab */}
        {activeTab === 'production' && (
          <div className="autopilot-objects__section">
            <div className="autopilot-objects__list">
              {productionOrders.map(order => (
                <div key={order.id} className="autopilot-object-card">
                  <div className="autopilot-object-card__main">
                    <div className="autopilot-object-card__title">
                      Заказ #{order.id} — {order.name} {order.qty} шт
                    </div>
                    <div className="autopilot-object-card__meta">
                      <span className="autopilot-object-card__deadline">
                        Дедлайн: {order.deadline}
                      </span>
                      <span className="autopilot-object-card__status autopilot-object-card__status--pending">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="autopilot-object-card__actions">
                    <button className="autopilot-object-card__btn autopilot-object-card__btn--secondary">
                      <Edit2 className="w-4 h-4" />
                      Назначить
                    </button>
                    <button className="autopilot-object-card__btn autopilot-object-card__btn--primary">
                      <Play className="w-4 h-4" />
                      Запустить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KIZ Tab */}
        {activeTab === 'kiz' && (
          <div className="autopilot-objects__section">
            <div className="autopilot-objects__kiz-summary">
              <div className="autopilot-objects__kiz-total">
                Всего к покупке: <strong>420 КИЗ</strong> (2 позиции)
              </div>
              <button className="autopilot-objects__kiz-btn">
                <ArrowRight className="w-4 h-4" />
                Перейти к покупке
              </button>
            </div>
            
            <div className="autopilot-objects__list">
              {kizItems.map(item => (
                <div key={item.id} className="autopilot-object-card">
                  <div className="autopilot-object-card__main">
                    <div className="autopilot-object-card__title">
                      {item.sku}
                    </div>
                    <div className="autopilot-object-card__meta">
                      <span className="autopilot-object-card__qty">
                        Купить: {item.qty} шт
                      </span>
                    </div>
                  </div>
                  <div className="autopilot-object-card__actions">
                    <button className="autopilot-object-card__btn autopilot-object-card__btn--primary">
                      <Tag className="w-4 h-4" />
                      Заказать КИЗ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="autopilot-objects__section">
            <div className="autopilot-objects__list">
              {tasks.map(task => (
                <div key={task.id} className="autopilot-object-card">
                  <div className="autopilot-object-card__main">
                    <div className="autopilot-object-card__title">
                      {task.type}: {task.sku} {task.qty} {task.type === 'Печать' ? 'этикеток' : 'шт'}
                    </div>
                    <div className="autopilot-object-card__meta">
                      <span className="autopilot-object-card__assignee">
                        {task.assignee}
                      </span>
                      <span className="autopilot-object-card__deadline">
                        {task.deadline}
                      </span>
                      <span className={`autopilot-object-card__status ${task.status === 'Ожидает' ? 'autopilot-object-card__status--pending' : ''}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="autopilot-object-card__actions">
                    <button className="autopilot-object-card__btn autopilot-object-card__btn--primary">
                      <Play className="w-4 h-4" />
                      Начать выполнение
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AutopilotObjects;
