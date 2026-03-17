import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Sparkles,
  TrendingUp,
  Package,
  Factory,
  Tag,
  AlertTriangle,
  Calendar,
  ArrowRight,
  BarChart3,
  ChevronDown,
  Play
} from 'lucide-react';
import '../../styles/seasonal-dashboard.css';
import '../../styles/autopilot.css';

type Scenario = 'base' | 'optimistic' | 'conservative';

function SeasonalDashboard() {
  const navigate = useNavigate();
  const [season, setSeason] = useState('Весна 2026');
  const [scenario, setScenario] = useState<Scenario>('base');
  const [duration, setDuration] = useState('12');
  const [autopilotMode, setAutopilotMode] = useState<'draft' | 'semi' | 'auto'>('draft');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const weeklyDemand = [70, 80, 90, 95, 110, 115, 105, 95, 90, 85, 80, 75];

  const decisions = [
    {
      id: '1',
      text: 'Увеличить выпуск Pants Rib M/L на +20% к неделе 4',
      action: 'Открыть план'
    },
    {
      id: '2',
      text: 'Сместить отгрузку на WB Краснодар раньше на 1 неделю',
      action: 'Открыть план'
    },
    {
      id: '3',
      text: 'КИЗ докупить заранее: +900 до недели 3',
      action: 'Открыть план'
    }
  ];

  return (
    <div className="seasonal-dashboard">
      {/* Header */}
      <div className="seasonal-dashboard__header">
        <div className="seasonal-dashboard__header-content">
          <div className="seasonal-dashboard__title-wrapper">
            <Calendar className="w-7 h-7 text-emerald-600" />
            <div>
              <h1 className="seasonal-dashboard__title">AI Планировщик — Сезон</h1>
              <p className="seasonal-dashboard__subtitle">
                Прогноз спроса, план производства и отгрузок по неделям — с учётом мощностей и КИЗ.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="seasonal-dashboard__controls">
        <div className="seasonal-dashboard__control-group">
          <label className="seasonal-dashboard__control-label">Сезон</label>
          <select 
            className="seasonal-dashboard__select"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            <option>Весна 2026</option>
            <option>Лето 2026</option>
            <option>Осень 2026</option>
            <option>Зима 2026</option>
          </select>
        </div>

        <div className="seasonal-dashboard__control-group">
          <label className="seasonal-dashboard__control-label">Сценарий</label>
          <div className="seasonal-dashboard__scenario-tabs">
            <button
              className={`seasonal-dashboard__scenario-tab ${scenario === 'base' ? 'seasonal-dashboard__scenario-tab--active' : ''}`}
              onClick={() => setScenario('base')}
            >
              База
            </button>
            <button
              className={`seasonal-dashboard__scenario-tab ${scenario === 'optimistic' ? 'seasonal-dashboard__scenario-tab--active' : ''}`}
              onClick={() => setScenario('optimistic')}
            >
              Оптимистичный
            </button>
            <button
              className={`seasonal-dashboard__scenario-tab ${scenario === 'conservative' ? 'seasonal-dashboard__scenario-tab--active' : ''}`}
              onClick={() => setScenario('conservative')}
            >
              Осторожный
            </button>
          </div>
        </div>

        <div className="seasonal-dashboard__control-group">
          <label className="seasonal-dashboard__control-label">Длина</label>
          <select 
            className="seasonal-dashboard__select seasonal-dashboard__select--small"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="8">8 недель</option>
            <option value="12">12 недель</option>
          </select>
        </div>

        <div className="seasonal-dashboard__control-actions">
          {/* Autopilot Mode Selector */}
          <div style={{ position: 'relative' }}>
            <button 
              className="seasonal-dashboard__btn seasonal-dashboard__btn--secondary"
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Режим: {autopilotMode === 'draft' ? 'Черновик' : autopilotMode === 'semi' ? 'Полуавто' : 'Авто'}
              <ChevronDown className="w-4 h-4" />
            </button>
            {showModeDropdown && (
              <div className="autopilot-mode-dropdown">
                <button 
                  className={`autopilot-mode-dropdown__item ${autopilotMode === 'draft' ? 'autopilot-mode-dropdown__item--active' : ''}`}
                  onClick={() => { setAutopilotMode('draft'); setShowModeDropdown(false); }}
                >
                  <div className="autopilot-mode-dropdown__title">Черновик (безопасно)</div>
                  <div className="autopilot-mode-dropdown__desc">Создаёт черновики поставок/заказов</div>
                </button>
                <button 
                  className={`autopilot-mode-dropdown__item ${autopilotMode === 'semi' ? 'autopilot-mode-dropdown__item--active' : ''}`}
                  onClick={() => { setAutopilotMode('semi'); setShowModeDropdown(false); }}
                >
                  <div className="autopilot-mode-dropdown__title">Полуавто</div>
                  <div className="autopilot-mode-dropdown__desc">Создаёт и назначает ответственных + дедлайны</div>
                </button>
                <button 
                  className="autopilot-mode-dropdown__item autopilot-mode-dropdown__item--disabled"
                  disabled
                >
                  <div className="autopilot-mode-dropdown__title">Авто (скоро)</div>
                  <div className="autopilot-mode-dropdown__desc">Полная автоматизация</div>
                </button>
              </div>
            )}
          </div>
          
          <button 
            className="seasonal-dashboard__btn seasonal-dashboard__btn--primary"
            onClick={() => navigate('/autopilot/setup')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Play className="w-4 h-4" />
            Запустить автопилот
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="seasonal-dashboard__kpi">
        <div className="seasonal-dashboard__kpi-card">
          <div className="seasonal-dashboard__kpi-icon">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="seasonal-dashboard__kpi-content">
            <div className="seasonal-dashboard__kpi-value">~ 8 400</div>
            <div className="seasonal-dashboard__kpi-label">Прогноз спроса (шт)</div>
          </div>
        </div>

        <div className="seasonal-dashboard__kpi-card">
          <div className="seasonal-dashboard__kpi-icon">
            <Factory className="w-6 h-6" />
          </div>
          <div className="seasonal-dashboard__kpi-content">
            <div className="seasonal-dashboard__kpi-value">~ 7 600</div>
            <div className="seasonal-dashboard__kpi-label">План производства (шт)</div>
          </div>
        </div>

        <div className="seasonal-dashboard__kpi-card">
          <div className="seasonal-dashboard__kpi-icon">
            <Package className="w-6 h-6" />
          </div>
          <div className="seasonal-dashboard__kpi-content">
            <div className="seasonal-dashboard__kpi-value">~ 6 900</div>
            <div className="seasonal-dashboard__kpi-label">План отгрузок WB (шт)</div>
          </div>
        </div>

        <div className="seasonal-dashboard__kpi-card seasonal-dashboard__kpi-card--warning">
          <div className="seasonal-dashboard__kpi-icon">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="seasonal-dashboard__kpi-content">
            <div className="seasonal-dashboard__kpi-value">18</div>
            <div className="seasonal-dashboard__kpi-label">Риск OOS (точек)</div>
          </div>
        </div>

        <div className="seasonal-dashboard__kpi-card seasonal-dashboard__kpi-card--critical">
          <div className="seasonal-dashboard__kpi-icon">
            <Factory className="w-6 h-6" />
          </div>
          <div className="seasonal-dashboard__kpi-content">
            <div className="seasonal-dashboard__kpi-value">2</div>
            <div className="seasonal-dashboard__kpi-label">Узкие места производства</div>
          </div>
        </div>

        <div className="seasonal-dashboard__kpi-card">
          <div className="seasonal-dashboard__kpi-icon">
            <Tag className="w-6 h-6" />
          </div>
          <div className="seasonal-dashboard__kpi-content">
            <div className="seasonal-dashboard__kpi-value">~ 7 900</div>
            <div className="seasonal-dashboard__kpi-label">КИЗ к закупке</div>
          </div>
        </div>
      </div>

      {/* Demand Peaks */}
      <div className="seasonal-dashboard__section">
        <h2 className="seasonal-dashboard__section-title">Пики спроса (по неделям)</h2>
        <div className="seasonal-dashboard__chart-card">
          <div className="seasonal-dashboard__chart">
            {weeklyDemand.map((value, index) => (
              <div key={index} className="seasonal-dashboard__bar-wrapper">
                <div 
                  className={`seasonal-dashboard__bar ${index >= 4 && index <= 5 ? 'seasonal-dashboard__bar--peak' : ''}`}
                  style={{ height: `${(value / 115) * 100}%` }}
                >
                  <span className="seasonal-dashboard__bar-value">{value}</span>
                </div>
                <div className="seasonal-dashboard__bar-label">W{index + 1}</div>
              </div>
            ))}
          </div>
          <div className="seasonal-dashboard__chart-legend">
            <div className="seasonal-dashboard__chart-legend-item">
              <span className="seasonal-dashboard__chart-legend-dot seasonal-dashboard__chart-legend-dot--peak"></span>
              <span>Пик: неделя 5–6</span>
            </div>
            <div className="seasonal-dashboard__chart-legend-item">
              <span className="seasonal-dashboard__chart-legend-dot seasonal-dashboard__chart-legend-dot--risk"></span>
              <span>Риск OOS: неделя 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Decisions */}
      <div className="seasonal-dashboard__section">
        <h2 className="seasonal-dashboard__section-title">Главные решения AI</h2>
        <div className="seasonal-dashboard__decisions">
          {decisions.map((decision) => (
            <div key={decision.id} className="seasonal-dashboard__decision-card">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <div className="seasonal-dashboard__decision-text">{decision.text}</div>
              <button 
                className="seasonal-dashboard__decision-btn"
                onClick={() => navigate('/seasonal/weekly-plan')}
              >
                {decision.action}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="seasonal-dashboard__quick-actions">
        <button 
          className="seasonal-dashboard__quick-action"
          onClick={() => navigate('/seasonal/weekly-plan')}
        >
          <BarChart3 className="w-5 h-5" />
          Недельный план
        </button>
        <button 
          className="seasonal-dashboard__quick-action"
          onClick={() => navigate('/seasonal/scenarios')}
        >
          <TrendingUp className="w-5 h-5" />
          Сравнить сценарии
        </button>
        <button 
          className="seasonal-dashboard__quick-action"
          onClick={() => navigate('/seasonal/production-capacity')}
        >
          <Factory className="w-5 h-5" />
          Мощности производства
        </button>
      </div>
    </div>
  );
}

export default SeasonalDashboard;