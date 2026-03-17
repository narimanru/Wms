import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Factory,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Settings
} from 'lucide-react';
import '../../styles/production-capacity.css';

interface WeekLoad {
  week: number;
  planned: number;
  percentage: number;
  status: 'normal' | 'warning' | 'critical';
}

function ProductionCapacity() {
  const navigate = useNavigate();
  const [maxCapacity, setMaxCapacity] = useState(1800);
  const [minBatch, setMinBatch] = useState(100);
  const [leadTime, setLeadTime] = useState(12);
  const [fabricAvailable, setFabricAvailable] = useState(true);
  const [furnitureAvailable, setFurnitureAvailable] = useState(true);
  const [packagingAvailable, setPackagingAvailable] = useState(true);

  const weekLoads: WeekLoad[] = [
    { week: 1, planned: 800, percentage: 44, status: 'normal' },
    { week: 2, planned: 1200, percentage: 67, status: 'normal' },
    { week: 3, planned: 1980, percentage: 110, status: 'critical' },
    { week: 4, planned: 1710, percentage: 95, status: 'normal' },
    { week: 5, planned: 1620, percentage: 90, status: 'normal' },
    { week: 6, planned: 1440, percentage: 80, status: 'normal' },
    { week: 7, planned: 1350, percentage: 75, status: 'normal' },
    { week: 8, planned: 1260, percentage: 70, status: 'normal' },
    { week: 9, planned: 1440, percentage: 80, status: 'normal' },
    { week: 10, planned: 1260, percentage: 70, status: 'normal' },
    { week: 11, planned: 1080, percentage: 60, status: 'normal' },
    { week: 12, planned: 900, percentage: 50, status: 'normal' }
  ];

  const recommendations = [
    {
      id: '1',
      type: 'warning',
      message: 'Перенести 180 шт Pants Rib с W3 на W4',
      impact: 'Снизит нагрузку W3 до 100%'
    },
    {
      id: '2',
      type: 'info',
      message: 'Разбить партию Top Basic на 2 недели',
      impact: 'Равномерное распределение нагрузки'
    }
  ];

  const handleOptimize = () => {
    alert('План оптимизирован! Перегруз устранен.');
    navigate('/seasonal/weekly-plan');
  };

  return (
    <div className="production-capacity">
      {/* Header */}
      <div className="production-capacity__header">
        <button 
          className="production-capacity__back-btn"
          onClick={() => navigate('/seasonal/weekly-plan')}
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <div className="production-capacity__header-content">
          <div className="production-capacity__title-wrapper">
            <Factory className="w-7 h-7 text-emerald-600" />
            <div>
              <h1 className="production-capacity__title">Мощности производства</h1>
              <p className="production-capacity__subtitle">
                Управление ограничениями и оптимизация загрузки по неделям
              </p>
            </div>
          </div>
        </div>
        <button 
          className="production-capacity__btn production-capacity__btn--primary"
          onClick={handleOptimize}
        >
          <Sparkles className="w-4 h-4" />
          Применить оптимизацию
        </button>
      </div>

      {/* Capacity Settings */}
      <div className="production-capacity__section">
        <div className="production-capacity__section-header">
          <Settings className="w-5 h-5" />
          <h2 className="production-capacity__section-title">Параметры мощностей</h2>
        </div>
        <div className="production-capacity__settings">
          <div className="production-capacity__setting">
            <label className="production-capacity__setting-label">
              Макс. выпуск/неделя (шт)
            </label>
            <input
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className="production-capacity__setting-input"
            />
          </div>

          <div className="production-capacity__setting">
            <label className="production-capacity__setting-label">
              Мин. партия (шт)
            </label>
            <input
              type="number"
              value={minBatch}
              onChange={(e) => setMinBatch(Number(e.target.value))}
              className="production-capacity__setting-input"
            />
          </div>

          <div className="production-capacity__setting">
            <label className="production-capacity__setting-label">
              Lead time (дни)
            </label>
            <input
              type="number"
              value={leadTime}
              onChange={(e) => setLeadTime(Number(e.target.value))}
              className="production-capacity__setting-input"
            />
          </div>
        </div>
      </div>

      {/* Critical Resources */}
      <div className="production-capacity__section">
        <h3 className="production-capacity__section-title">Критические ресурсы</h3>
        <div className="production-capacity__resources">
          <div 
            className={`production-capacity__resource ${fabricAvailable ? 'production-capacity__resource--available' : 'production-capacity__resource--unavailable'}`}
            onClick={() => setFabricAvailable(!fabricAvailable)}
          >
            <div className="production-capacity__resource-icon">
              {fabricAvailable ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="production-capacity__resource-content">
              <div className="production-capacity__resource-name">Ткань</div>
              <div className="production-capacity__resource-status">
                {fabricAvailable ? 'Есть в наличии' : 'Не хватает'}
              </div>
            </div>
          </div>

          <div 
            className={`production-capacity__resource ${furnitureAvailable ? 'production-capacity__resource--available' : 'production-capacity__resource--unavailable'}`}
            onClick={() => setFurnitureAvailable(!furnitureAvailable)}
          >
            <div className="production-capacity__resource-icon">
              {furnitureAvailable ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="production-capacity__resource-content">
              <div className="production-capacity__resource-name">Фурнитура</div>
              <div className="production-capacity__resource-status">
                {furnitureAvailable ? 'Есть в наличии' : 'Не хватает'}
              </div>
            </div>
          </div>

          <div 
            className={`production-capacity__resource ${packagingAvailable ? 'production-capacity__resource--available' : 'production-capacity__resource--unavailable'}`}
            onClick={() => setPackagingAvailable(!packagingAvailable)}
          >
            <div className="production-capacity__resource-icon">
              {packagingAvailable ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="production-capacity__resource-content">
              <div className="production-capacity__resource-name">Упаковка</div>
              <div className="production-capacity__resource-status">
                {packagingAvailable ? 'Есть в наличии' : 'Не хватает'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Load */}
      <div className="production-capacity__section">
        <h3 className="production-capacity__section-title">Нагрузка по неделям</h3>
        <div className="production-capacity__load-table">
          <div className="production-capacity__load-header">
            <div className="production-capacity__load-cell">Неделя</div>
            <div className="production-capacity__load-cell">План выпуска</div>
            <div className="production-capacity__load-cell">% загрузки</div>
            <div className="production-capacity__load-cell">Статус</div>
          </div>
          {weekLoads.map((load) => (
            <div 
              key={load.week} 
              className={`production-capacity__load-row production-capacity__load-row--${load.status}`}
            >
              <div className="production-capacity__load-cell">
                <strong>W{load.week}</strong>
              </div>
              <div className="production-capacity__load-cell">
                {load.planned.toLocaleString()} шт
              </div>
              <div className="production-capacity__load-cell">
                <div className="production-capacity__load-bar-wrapper">
                  <div 
                    className={`production-capacity__load-bar production-capacity__load-bar--${load.status}`}
                    style={{ width: `${Math.min(load.percentage, 100)}%` }}
                  ></div>
                  <span className="production-capacity__load-percentage">{load.percentage}%</span>
                </div>
              </div>
              <div className="production-capacity__load-cell">
                {load.status === 'normal' && (
                  <span className="production-capacity__load-status production-capacity__load-status--normal">
                    Норма
                  </span>
                )}
                {load.status === 'warning' && (
                  <span className="production-capacity__load-status production-capacity__load-status--warning">
                    Внимание
                  </span>
                )}
                {load.status === 'critical' && (
                  <span className="production-capacity__load-status production-capacity__load-status--critical">
                    Перегруз
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="production-capacity__section">
        <div className="production-capacity__recommendations-header">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="production-capacity__section-title">Рекомендации AI</h3>
        </div>
        <div className="production-capacity__recommendations">
          {recommendations.map((rec) => (
            <div 
              key={rec.id} 
              className={`production-capacity__recommendation production-capacity__recommendation--${rec.type}`}
            >
              <div className="production-capacity__recommendation-icon">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="production-capacity__recommendation-content">
                <div className="production-capacity__recommendation-message">{rec.message}</div>
                <div className="production-capacity__recommendation-impact">{rec.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductionCapacity;