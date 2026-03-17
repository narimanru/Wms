import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  TrendingUp,
  Factory,
  Package,
  AlertTriangle,
  ArrowLeft,
  Check
} from 'lucide-react';
import '../../styles/season-scenarios.css';

type Scenario = 'base' | 'optimistic' | 'conservative';

interface ScenarioData {
  id: Scenario;
  name: string;
  description: string;
  demandChange: string;
  production: number;
  shipments: number;
  oosRisk: number;
  overstock: 'low' | 'medium' | 'high';
  budget: string;
}

interface ComparisonRow {
  scenario: string;
  sku: string;
  productionChange: string;
  shipmentsChange: string;
  risk: 'up' | 'down' | 'neutral';
}

function SeasonScenarios() {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('base');

  const scenarios: ScenarioData[] = [
    {
      id: 'base',
      name: 'База',
      description: 'Текущий прогноз без корректировок',
      demandChange: '±0%',
      production: 7600,
      shipments: 6900,
      oosRisk: 18,
      overstock: 'low',
      budget: '~ 420 000 ₽'
    },
    {
      id: 'optimistic',
      name: 'Оптимистичный',
      description: 'Спрос выше на 15%',
      demandChange: '+15%',
      production: 8740,
      shipments: 7935,
      oosRisk: 12,
      overstock: 'low',
      budget: '~ 483 000 ₽'
    },
    {
      id: 'conservative',
      name: 'Осторожный',
      description: 'Спрос ниже на 10%',
      demandChange: '-10%',
      production: 6840,
      shipments: 6210,
      oosRisk: 24,
      overstock: 'medium',
      budget: '~ 378 000 ₽'
    }
  ];

  const comparisons: ComparisonRow[] = [
    {
      scenario: 'Оптимистичный',
      sku: 'Pants Rib M',
      productionChange: '+200 шт',
      shipmentsChange: '+160 шт',
      risk: 'down'
    },
    {
      scenario: 'Оптимистичный',
      sku: 'Top Basic L',
      productionChange: '+140 шт',
      shipmentsChange: '+120 шт',
      risk: 'down'
    },
    {
      scenario: 'Осторожный',
      sku: 'Top Basic S',
      productionChange: '-120 шт',
      shipmentsChange: '-100 шт',
      risk: 'up'
    },
    {
      scenario: 'Осторожный',
      sku: 'Long Sleeve M',
      productionChange: '-80 шт',
      shipmentsChange: '-70 шт',
      risk: 'neutral'
    }
  ];

  const getOverstockLabel = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
    }
  };

  const getOverstockColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return '#10a37f';
      case 'medium': return '#d97706';
      case 'high': return '#dc2626';
    }
  };

  const handleApplyScenario = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario);
    alert(`Применен сценарий "${scenario?.name}"`);
    navigate('/seasonal/weekly-plan');
  };

  return (
    <div className="season-scenarios">
      {/* Header */}
      <div className="season-scenarios__header">
        <button 
          className="season-scenarios__back-btn"
          onClick={() => navigate('/seasonal')}
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <div className="season-scenarios__header-content">
          <div className="season-scenarios__title-wrapper">
            <TrendingUp className="w-7 h-7 text-emerald-600" />
            <div>
              <h1 className="season-scenarios__title">Сравнение сценариев</h1>
              <p className="season-scenarios__subtitle">
                Анализ "что-если": как изменится план при разных уровнях спроса
              </p>
            </div>
          </div>
        </div>
        <button 
          className="season-scenarios__btn season-scenarios__btn--primary"
          onClick={handleApplyScenario}
        >
          Применить сценарий
        </button>
      </div>

      {/* Scenario Cards */}
      <div className="season-scenarios__cards">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`season-scenarios__card ${selectedScenario === scenario.id ? 'season-scenarios__card--selected' : ''}`}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <div className="season-scenarios__card-header">
              <div>
                <h3 className="season-scenarios__card-title">{scenario.name}</h3>
                <p className="season-scenarios__card-description">{scenario.description}</p>
              </div>
              {selectedScenario === scenario.id && (
                <div className="season-scenarios__card-check">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="season-scenarios__card-badge">
              Спрос: <strong>{scenario.demandChange}</strong>
            </div>

            <div className="season-scenarios__card-metrics">
              <div className="season-scenarios__card-metric">
                <Factory className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="season-scenarios__card-metric-label">Производство</div>
                  <div className="season-scenarios__card-metric-value">{scenario.production.toLocaleString()} шт</div>
                </div>
              </div>

              <div className="season-scenarios__card-metric">
                <Package className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="season-scenarios__card-metric-label">Отгрузки</div>
                  <div className="season-scenarios__card-metric-value">{scenario.shipments.toLocaleString()} шт</div>
                </div>
              </div>

              <div className="season-scenarios__card-metric">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="season-scenarios__card-metric-label">Риск OOS</div>
                  <div className="season-scenarios__card-metric-value">{scenario.oosRisk} точек</div>
                </div>
              </div>
            </div>

            <div className="season-scenarios__card-footer">
              <div className="season-scenarios__card-overstock">
                <span>Риск переизбытка:</span>
                <span 
                  className="season-scenarios__card-overstock-badge"
                  style={{ color: getOverstockColor(scenario.overstock) }}
                >
                  {getOverstockLabel(scenario.overstock)}
                </span>
              </div>
              <div className="season-scenarios__card-budget">
                <span>Бюджет КИЗ:</span>
                <strong>{scenario.budget}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="season-scenarios__comparison">
        <h2 className="season-scenarios__comparison-title">Детальное сравнение</h2>
        <div className="season-scenarios__table-wrapper">
          <table className="season-scenarios__table">
            <thead>
              <tr>
                <th>Сценарий</th>
                <th>SKU</th>
                <th>Изменение выпуска</th>
                <th>Изменение отгрузок</th>
                <th>Риск</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, index) => (
                <tr key={index}>
                  <td>
                    <span className="season-scenarios__table-scenario">{row.scenario}</span>
                  </td>
                  <td className="season-scenarios__table-sku">{row.sku}</td>
                  <td className="season-scenarios__table-change">{row.productionChange}</td>
                  <td className="season-scenarios__table-change">{row.shipmentsChange}</td>
                  <td>
                    <div className={`season-scenarios__table-risk season-scenarios__table-risk--${row.risk}`}>
                      {row.risk === 'up' && '↑ Выше'}
                      {row.risk === 'down' && '↓ Ниже'}
                      {row.risk === 'neutral' && '→ Стабильно'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="season-scenarios__insights">
        <h3 className="season-scenarios__insights-title">Рекомендации AI</h3>
        <div className="season-scenarios__insights-grid">
          <div className="season-scenarios__insight">
            <div className="season-scenarios__insight-icon season-scenarios__insight-icon--success">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <div className="season-scenarios__insight-title">Оптимистичный сценарий</div>
              <div className="season-scenarios__insight-text">
                Снижает риск OOS на 33%, требует увеличения бюджета на КИЗ на 15%
              </div>
            </div>
          </div>

          <div className="season-scenarios__insight">
            <div className="season-scenarios__insight-icon season-scenarios__insight-icon--warning">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="season-scenarios__insight-title">Осторожный сценарий</div>
              <div className="season-scenarios__insight-text">
                Увеличивает риск переизбытка на Top Basic S, экономит 42 000 ₽ на КИЗ
              </div>
            </div>
          </div>

          <div className="season-scenarios__insight">
            <div className="season-scenarios__insight-icon season-scenarios__insight-icon--info">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="season-scenarios__insight-title">Базовый сценарий</div>
              <div className="season-scenarios__insight-text">
                Оптимальный баланс риска и затрат для текущего прогноза спроса
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeasonScenarios;