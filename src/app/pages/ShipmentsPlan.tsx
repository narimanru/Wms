import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Package,
  Sparkles,
  TrendingUp,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import '../../styles/shipments-plan.css';

interface ShipmentItem {
  id: string;
  sku: string;
  size: string;
  warehouse: string;
  currentStock: number;
  daysCover: number;
  recommendedQty: number;
  shipDate: string;
  priority: 'high' | 'medium' | 'low';
}

function ShipmentsPlan() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ShipmentItem | null>(null);

  const shipments: ShipmentItem[] = [
    {
      id: '1',
      sku: 'Pants Rib',
      size: 'M',
      warehouse: 'WB Краснодар',
      currentStock: 8,
      daysCover: 1,
      recommendedQty: 120,
      shipDate: 'до 14 марта',
      priority: 'high'
    },
    {
      id: '2',
      sku: 'Long Sleeve',
      size: 'M',
      warehouse: 'WB Казань',
      currentStock: 8,
      daysCover: 1,
      recommendedQty: 60,
      shipDate: 'до 14 марта',
      priority: 'high'
    },
    {
      id: '3',
      sku: 'Top Basic',
      size: 'L',
      warehouse: 'WB Электросталь',
      currentStock: 18,
      daysCover: 3,
      recommendedQty: 90,
      shipDate: 'до 16 марта',
      priority: 'medium'
    },
    {
      id: '4',
      sku: 'Pants Rib',
      size: 'S',
      warehouse: 'WB Электросталь',
      currentStock: 40,
      daysCover: 5,
      recommendedQty: 100,
      shipDate: 'до 18 марта',
      priority: 'medium'
    },
    {
      id: '5',
      sku: 'Long Sleeve',
      size: 'L',
      warehouse: 'WB Краснодар',
      currentStock: 5,
      daysCover: 1,
      recommendedQty: 70,
      shipDate: 'до 14 марта',
      priority: 'high'
    },
    {
      id: '6',
      sku: 'Top Basic',
      size: 'M',
      warehouse: 'WB Казань',
      currentStock: 35,
      daysCover: 5,
      recommendedQty: 80,
      shipDate: 'до 18 марта',
      priority: 'medium'
    },
    {
      id: '7',
      sku: 'Pants Rib',
      size: 'L',
      warehouse: 'WB Казань',
      currentStock: 10,
      daysCover: 1,
      recommendedQty: 110,
      shipDate: 'до 15 марта',
      priority: 'high'
    },
    {
      id: '8',
      sku: 'Top Basic',
      size: 'S',
      warehouse: 'WB Краснодар',
      currentStock: 22,
      daysCover: 4,
      recommendedQty: 60,
      shipDate: 'до 17 марта',
      priority: 'low'
    }
  ];

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return priority;
    }
  };

  const getDemandPerDay = (sku: string, size: string) => {
    const demandMap: Record<string, Record<string, number>> = {
      'Pants Rib': { S: 8, M: 12, L: 10 },
      'Top Basic': { S: 5, M: 7, L: 6 },
      'Long Sleeve': { S: 4, M: 6, L: 5 }
    };
    return demandMap[sku]?.[size] || 0;
  };

  return (
    <div className="shipments-plan">
      {/* Header */}
      <div className="shipments-plan__header">
        <button 
          className="shipments-plan__back"
          onClick={() => navigate('/planner')}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="shipments-plan__header-content">
          <div className="shipments-plan__title-wrapper">
            <Package className="w-6 h-6 text-emerald-600" />
            <h1 className="shipments-plan__title">План отгрузок на WB</h1>
            <span className="ai-badge">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </div>
          <p className="shipments-plan__subtitle">
            AI рекомендует, что и куда отправить, чтобы избежать OOS.
          </p>
        </div>
      </div>

      {/* AI Hint */}
      <div className="shipments-plan__hint">
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <span>
          Если отгрузить позже 2 дней — риск OOS высокий. Электросталь сейчас в норме — не отправляйте туда лишнее.
        </span>
      </div>

      {/* Content */}
      <div className="shipments-plan__content">
        {/* Table */}
        <div className="shipments-plan__table-wrapper">
          <div className="shipments-plan__table-card">
            <div className="shipments-plan__table-container">
              <table className="shipments-plan__table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Размер</th>
                    <th>Склад WB</th>
                    <th>Остаток WB</th>
                    <th>Покрытие</th>
                    <th>Рекоменд. отгрузка</th>
                    <th>Дата отправки</th>
                    <th>Приоритет</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((item) => (
                    <tr 
                      key={item.id}
                      className={selectedItem?.id === item.id ? 'shipments-plan__table-row--selected' : ''}
                      onClick={() => setSelectedItem(item)}
                    >
                      <td>
                        <div className="shipments-plan__sku">{item.sku}</div>
                      </td>
                      <td>
                        <span className="shipments-plan__size">{item.size}</span>
                      </td>
                      <td>
                        <div className="shipments-plan__warehouse">{item.warehouse}</div>
                      </td>
                      <td>
                        <span className="shipments-plan__stock">{item.currentStock} шт</span>
                      </td>
                      <td>
                        <span className={`shipments-plan__days shipments-plan__days--${item.priority}`}>
                          {item.daysCover} {item.daysCover === 1 ? 'день' : 'дня'}
                        </span>
                      </td>
                      <td>
                        <span className="shipments-plan__qty">{item.recommendedQty} шт</span>
                      </td>
                      <td>
                        <span className="shipments-plan__date">{item.shipDate}</span>
                      </td>
                      <td>
                        <span className={`shipments-plan__priority shipments-plan__priority--${item.priority}`}>
                          {getPriorityLabel(item.priority)}
                        </span>
                      </td>
                      <td>
                        <button className="shipments-plan__action-btn">
                          Создать поставку
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {selectedItem && (
          <div className="shipments-plan__sidebar">
            <div className="shipments-plan__sidebar-card">
              <div className="shipments-plan__sidebar-header">
                <h3 className="shipments-plan__sidebar-title">Почему так?</h3>
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              
              <div className="shipments-plan__sidebar-section">
                <div className="shipments-plan__sidebar-label">Товар</div>
                <div className="shipments-plan__sidebar-value">
                  {selectedItem.sku} — размер {selectedItem.size}
                </div>
              </div>

              <div className="shipments-plan__sidebar-section">
                <div className="shipments-plan__sidebar-label">Спрос</div>
                <div className="shipments-plan__sidebar-value">
                  {getDemandPerDay(selectedItem.sku, selectedItem.size)} шт/день
                </div>
              </div>

              <div className="shipments-plan__sidebar-section">
                <div className="shipments-plan__sidebar-label">Цель</div>
                <div className="shipments-plan__sidebar-value">
                  21 день + 7 дней запас
                </div>
              </div>

              <div className="shipments-plan__sidebar-section">
                <div className="shipments-plan__sidebar-label">Lead time</div>
                <div className="shipments-plan__sidebar-value">
                  6 дней
                </div>
              </div>

              <div className="shipments-plan__sidebar-divider" />

              <div className="shipments-plan__sidebar-recommendation">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="shipments-plan__sidebar-rec-title">Рекомендуем</div>
                  <div className="shipments-plan__sidebar-rec-text">
                    {selectedItem.recommendedQty} шт — покроет спрос на {Math.round(selectedItem.recommendedQty / getDemandPerDay(selectedItem.sku, selectedItem.size))} дней
                  </div>
                </div>
              </div>

              <button 
                className="shipments-plan__sidebar-btn"
                onClick={() => navigate(`/planner/forecast/${selectedItem.sku}-${selectedItem.size}`)}
              >
                <TrendingUp className="w-4 h-4" />
                Открыть SKU прогноз
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShipmentsPlan;
