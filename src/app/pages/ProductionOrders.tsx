import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Filter, Calendar, Factory, Package, Clock, CheckCircle, AlertTriangle, XCircle, Eye } from 'lucide-react';
import '../../styles/production.css';

interface ProductionOrder {
  id: string;
  orderNumber: string;
  factory: string;
  season: string;
  status: 'draft' | 'approved' | 'in_production' | 'qc' | 'ready' | 'shipped' | 'received';
  totalItems: number;
  totalAmount: number;
  plannedDate: string;
  startDate: string;
  kizStatus: 'ok' | 'deficit' | 'warning';
  kizNeeded: number;
  kizDeficit: number;
}

const statusLabels = {
  draft: 'Черновик',
  approved: 'Утверждён',
  in_production: 'В производстве',
  qc: 'Контроль качества',
  ready: 'Готов',
  shipped: 'Отгружен',
  received: 'Получен'
};

const statusColors = {
  draft: 'gray',
  approved: 'blue',
  in_production: 'orange',
  qc: 'purple',
  ready: 'green',
  shipped: 'teal',
  received: 'emerald'
};

function ProductionOrders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const orders: ProductionOrder[] = [
    {
      id: '1',
      orderNumber: 'PO-2026-00041',
      factory: 'Kyrgyz Sewing #1',
      season: 'Весна 2026',
      status: 'in_production',
      totalItems: 1050,
      totalAmount: 1980000,
      plannedDate: '25 марта 2026',
      startDate: '10 марта 2026',
      kizStatus: 'deficit',
      kizNeeded: 1050,
      kizDeficit: 25
    },
    {
      id: '2',
      orderNumber: 'PO-2026-00040',
      factory: 'Турецкая фабрика Tekstil Pro',
      season: 'Весна 2026',
      status: 'qc',
      totalItems: 850,
      totalAmount: 1530000,
      plannedDate: '20 марта 2026',
      startDate: '5 марта 2026',
      kizStatus: 'ok',
      kizNeeded: 850,
      kizDeficit: 0
    },
    {
      id: '3',
      orderNumber: 'PO-2026-00039',
      factory: 'Kyrgyz Sewing #1',
      season: 'Зима 2025',
      status: 'received',
      totalItems: 1200,
      totalAmount: 2400000,
      plannedDate: '15 февраля 2026',
      startDate: '1 февраля 2026',
      kizStatus: 'ok',
      kizNeeded: 1200,
      kizDeficit: 0
    },
    {
      id: '4',
      orderNumber: 'PO-2026-00038',
      factory: 'Узбекистан Textile',
      season: 'Весна 2026',
      status: 'draft',
      totalItems: 600,
      totalAmount: 1080000,
      plannedDate: '1 апреля 2026',
      startDate: '15 марта 2026',
      kizStatus: 'warning',
      kizNeeded: 600,
      kizDeficit: 12
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.factory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getKizStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'deficit':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="production-orders">
      {/* Header */}
      <div className="production-orders__header">
        <div className="production-orders__header-top">
          <div>
            <h1 className="production-orders__title">Заказы на производство</h1>
            <p className="production-orders__subtitle">
              Управление производственными заказами, контроль сроков и материалов
            </p>
          </div>
          <button 
            className="production-orders__create-btn"
            onClick={() => navigate('/production-orders/create')}
          >
            <Plus className="w-5 h-5" />
            Создать заказ
          </button>
        </div>

        {/* Filters */}
        <div className="production-orders__filters">
          <div className="production-orders__search">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по номеру или фабрике..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="production-orders__search-input"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="production-orders__filter-select"
          >
            <option value="all">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="approved">Утверждён</option>
            <option value="in_production">В производстве</option>
            <option value="qc">Контроль качества</option>
            <option value="ready">Готов</option>
            <option value="shipped">Отгружен</option>
            <option value="received">Получен</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="production-orders__stats">
        <div className="production-orders__stat-card">
          <div className="production-orders__stat-icon production-orders__stat-icon--blue">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="production-orders__stat-value">4</div>
            <div className="production-orders__stat-label">Всего заказов</div>
          </div>
        </div>

        <div className="production-orders__stat-card">
          <div className="production-orders__stat-icon production-orders__stat-icon--orange">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="production-orders__stat-value">2</div>
            <div className="production-orders__stat-label">В работе</div>
          </div>
        </div>

        <div className="production-orders__stat-card">
          <div className="production-orders__stat-icon production-orders__stat-icon--green">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="production-orders__stat-value">1</div>
            <div className="production-orders__stat-label">Завершено</div>
          </div>
        </div>

        <div className="production-orders__stat-card">
          <div className="production-orders__stat-icon production-orders__stat-icon--purple">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="production-orders__stat-value">3</div>
            <div className="production-orders__stat-label">Фабрики</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="production-orders__content">
        <div className="production-orders__table-wrapper">
          <table className="production-orders__table">
            <thead>
              <tr>
                <th>Номер заказа</th>
                <th>Фабрика</th>
                <th>Сезон</th>
                <th>Статус</th>
                <th>Количество</th>
                <th>Сумма</th>
                <th>Готовность</th>
                <th>КИЗ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="production-orders__order-number">
                      {order.orderNumber}
                    </div>
                  </td>
                  <td>
                    <div className="production-orders__factory">
                      <Factory className="w-4 h-4 text-gray-400" />
                      {order.factory}
                    </div>
                  </td>
                  <td>{order.season}</td>
                  <td>
                    <span className={`production-orders__status production-orders__status--${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td>
                    <div className="production-orders__quantity">
                      {order.totalItems.toLocaleString()} шт
                    </div>
                  </td>
                  <td>
                    <div className="production-orders__amount">
                      {order.totalAmount.toLocaleString()} ₽
                    </div>
                  </td>
                  <td>
                    <div className="production-orders__date">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {order.plannedDate}
                    </div>
                  </td>
                  <td>
                    <div className="production-orders__kiz">
                      {getKizStatusIcon(order.kizStatus)}
                      <span className={order.kizDeficit > 0 ? 'text-red-600' : 'text-gray-600'}>
                        {order.kizNeeded}
                        {order.kizDeficit > 0 && ` (-${order.kizDeficit})`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="production-orders__action-btn"
                      onClick={() => navigate(`/production-orders/${order.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="production-orders__empty">
            <Package className="w-12 h-12 text-gray-300" />
            <p className="production-orders__empty-title">Заказов не найдено</p>
            <p className="production-orders__empty-text">
              Попробуйте изменить критерии поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductionOrders;