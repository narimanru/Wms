import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Calendar,
  Factory,
  Package,
  Tag,
  AlertTriangle,
  Sparkles,
  Filter,
  ArrowLeft
} from 'lucide-react';
import '../../styles/seasonal-weekly-plan.css';

interface ProductionBlock {
  sku: string;
  weeks: { week: number; quantity: number; phase: 'start' | 'production' | 'complete' }[];
  color: string;
}

interface ShipmentWeek {
  warehouse: string;
  weeks: { week: number; quantity: number }[];
}

interface KIZPurchase {
  week: number;
  quantity: number;
}

function SeasonalWeeklyPlan() {
  const navigate = useNavigate();
  const [filterSKU, setFilterSKU] = useState('all');

  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

  const production: ProductionBlock[] = [
    {
      sku: 'Pants Rib',
      weeks: [
        { week: 1, quantity: 0, phase: 'start' },
        { week: 3, quantity: 180, phase: 'production' },
        { week: 4, quantity: 220, phase: 'production' },
        { week: 5, quantity: 150, phase: 'complete' }
      ],
      color: '#10a37f'
    },
    {
      sku: 'Top Basic',
      weeks: [
        { week: 1, quantity: 0, phase: 'start' },
        { week: 2, quantity: 120, phase: 'production' },
        { week: 3, quantity: 140, phase: 'complete' }
      ],
      color: '#3b82f6'
    },
    {
      sku: 'Long Sleeve',
      weeks: [
        { week: 2, quantity: 0, phase: 'start' },
        { week: 4, quantity: 160, phase: 'complete' }
      ],
      color: '#8b5cf6'
    }
  ];

  const shipments: ShipmentWeek[] = [
    {
      warehouse: 'WB Электросталь',
      weeks: [
        { week: 2, quantity: 80 },
        { week: 5, quantity: 120 },
        { week: 8, quantity: 90 }
      ]
    },
    {
      warehouse: 'WB Казань',
      weeks: [
        { week: 3, quantity: 95 },
        { week: 6, quantity: 110 },
        { week: 9, quantity: 85 }
      ]
    },
    {
      warehouse: 'WB Краснодар',
      weeks: [
        { week: 2, quantity: 100 },
        { week: 4, quantity: 130 },
        { week: 7, quantity: 105 }
      ]
    }
  ];

  const kizPurchases: KIZPurchase[] = [
    { week: 2, quantity: 900 },
    { week: 4, quantity: 600 },
    { week: 7, quantity: 450 }
  ];

  const constraints = [
    {
      id: '1',
      type: 'critical',
      icon: <AlertTriangle className="w-4 h-4" />,
      message: 'Мощность производства превышена на W3 (на +180 шт)',
      action: 'Оптимизировать'
    },
    {
      id: '2',
      type: 'warning',
      icon: <AlertTriangle className="w-4 h-4" />,
      message: 'Lead time на WB: если отгрузка W4 → придёт W5',
      action: 'Учтено'
    },
    {
      id: '3',
      type: 'critical',
      icon: <AlertTriangle className="w-4 h-4" />,
      message: 'КИЗ дефицит на W3: -120',
      action: 'Исправить'
    }
  ];

  const handleRecalculate = () => {
    alert('План пересчитан');
  };

  const getShipmentForWeek = (warehouse: string, week: number) => {
    const wh = shipments.find(s => s.warehouse === warehouse);
    return wh?.weeks.find(w => w.week === week)?.quantity || 0;
  };

  const getProductionForWeek = (sku: string, week: number) => {
    const prod = production.find(p => p.sku === sku);
    return prod?.weeks.find(w => w.week === week) || null;
  };

  const getKIZForWeek = (week: number) => {
    return kizPurchases.find(k => k.week === week);
  };

  return (
    <div className="seasonal-weekly-plan">
      {/* Header */}
      <div className="seasonal-weekly-plan__header">
        <button 
          className="seasonal-weekly-plan__back-btn"
          onClick={() => navigate('/seasonal')}
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <div className="seasonal-weekly-plan__header-content">
          <div className="seasonal-weekly-plan__title-wrapper">
            <Calendar className="w-7 h-7 text-emerald-600" />
            <div>
              <h1 className="seasonal-weekly-plan__title">Недельный план (12 недель)</h1>
              <p className="seasonal-weekly-plan__subtitle">
                Мастер-план по неделям: производство, отгрузки WB и закупка КИЗ
              </p>
            </div>
          </div>
        </div>
        <button 
          className="seasonal-weekly-plan__btn seasonal-weekly-plan__btn--primary"
          onClick={handleRecalculate}
        >
          <Sparkles className="w-4 h-4" />
          Пересчитать план
        </button>
      </div>

      {/* Legend & Filter */}
      <div className="seasonal-weekly-plan__controls">
        <div className="seasonal-weekly-plan__legend">
          <div className="seasonal-weekly-plan__legend-item">
            <div className="seasonal-weekly-plan__legend-color" style={{ background: '#10a37f' }}></div>
            <span>Производство</span>
          </div>
          <div className="seasonal-weekly-plan__legend-item">
            <div className="seasonal-weekly-plan__legend-color" style={{ background: '#3b82f6' }}></div>
            <span>Отгрузки</span>
          </div>
          <div className="seasonal-weekly-plan__legend-item">
            <div className="seasonal-weekly-plan__legend-color" style={{ background: '#8b5cf6' }}></div>
            <span>КИЗ</span>
          </div>
        </div>
        <div className="seasonal-weekly-plan__filter">
          <Filter className="w-4 h-4" />
          <select 
            value={filterSKU}
            onChange={(e) => setFilterSKU(e.target.value)}
            className="seasonal-weekly-plan__filter-select"
          >
            <option value="all">Все SKU</option>
            <option value="pants">Pants Rib</option>
            <option value="top">Top Basic</option>
            <option value="long">Long Sleeve</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="seasonal-weekly-plan__timeline">
        {/* Week Headers */}
        <div className="seasonal-weekly-plan__track">
          <div className="seasonal-weekly-plan__track-label"></div>
          <div className="seasonal-weekly-plan__weeks">
            {weeks.map(week => (
              <div key={week} className="seasonal-weekly-plan__week-header">
                W{week}
              </div>
            ))}
          </div>
        </div>

        {/* Production Track */}
        <div className="seasonal-weekly-plan__section">
          <div className="seasonal-weekly-plan__section-header">
            <Factory className="w-5 h-5" />
            <span>Производство</span>
          </div>
          
          {production.map((prod) => (
            <div key={prod.sku} className="seasonal-weekly-plan__track">
              <div className="seasonal-weekly-plan__track-label">{prod.sku}</div>
              <div className="seasonal-weekly-plan__weeks">
                {weeks.map(week => {
                  const item = getProductionForWeek(prod.sku, week);
                  return (
                    <div key={week} className="seasonal-weekly-plan__week-cell">
                      {item && item.quantity > 0 && (
                        <div 
                          className={`seasonal-weekly-plan__block seasonal-weekly-plan__block--${item.phase}`}
                          style={{ background: prod.color }}
                        >
                          <span className="seasonal-weekly-plan__block-value">{item.quantity} шт</span>
                        </div>
                      )}
                      {item && item.phase === 'start' && (
                        <div className="seasonal-weekly-plan__marker">▶</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Shipments Track */}
        <div className="seasonal-weekly-plan__section">
          <div className="seasonal-weekly-plan__section-header">
            <Package className="w-5 h-5" />
            <span>Отгрузки WB</span>
          </div>
          
          {shipments.map((shipment) => (
            <div key={shipment.warehouse} className="seasonal-weekly-plan__track">
              <div className="seasonal-weekly-plan__track-label">{shipment.warehouse}</div>
              <div className="seasonal-weekly-plan__weeks">
                {weeks.map(week => {
                  const qty = getShipmentForWeek(shipment.warehouse, week);
                  return (
                    <div key={week} className="seasonal-weekly-plan__week-cell">
                      {qty > 0 && (
                        <div className="seasonal-weekly-plan__shipment">
                          <Package className="w-3 h-3" />
                          <span>{qty}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* KIZ Track */}
        <div className="seasonal-weekly-plan__section">
          <div className="seasonal-weekly-plan__section-header">
            <Tag className="w-5 h-5" />
            <span>Закупка КИЗ</span>
          </div>
          
          <div className="seasonal-weekly-plan__track">
            <div className="seasonal-weekly-plan__track-label">Закупки</div>
            <div className="seasonal-weekly-plan__weeks">
              {weeks.map(week => {
                const kiz = getKIZForWeek(week);
                return (
                  <div key={week} className="seasonal-weekly-plan__week-cell">
                    {kiz && (
                      <div className="seasonal-weekly-plan__kiz">
                        <Tag className="w-3 h-3" />
                        <span>{kiz.quantity}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Constraints Panel */}
      <div className="seasonal-weekly-plan__constraints">
        <h3 className="seasonal-weekly-plan__constraints-title">Ограничения и риски</h3>
        <div className="seasonal-weekly-plan__constraints-list">
          {constraints.map((constraint) => (
            <div 
              key={constraint.id} 
              className={`seasonal-weekly-plan__constraint seasonal-weekly-plan__constraint--${constraint.type}`}
            >
              <div className="seasonal-weekly-plan__constraint-icon">
                {constraint.icon}
              </div>
              <div className="seasonal-weekly-plan__constraint-message">
                {constraint.message}
              </div>
              <button 
                className="seasonal-weekly-plan__constraint-btn"
                onClick={() => {
                  if (constraint.action === 'Оптимизировать') {
                    navigate('/seasonal/production-capacity');
                  }
                }}
              >
                {constraint.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SeasonalWeeklyPlan;