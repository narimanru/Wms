import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Sparkles,
  TrendingUp,
  FileText,
  Tag,
  Package,
  Warehouse,
  Users,
  HelpCircle,
  Play
} from 'lucide-react';
import '../../styles/ai-analytics.css';

type Scenario = 'shipment' | 'upd' | 'kiz' | 'stock' | 'warehouse' | 'fulfillment' | null;
type Goal = 'find-errors' | 'reduce-risks' | 'speed-up' | 'what-to-buy' | 'find-losses' | 'report' | null;

interface ScenarioCard {
  id: Scenario;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function AIAnalytics() {
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(null);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [selectedObject, setSelectedObject] = useState('12345');
  const [showHelper, setShowHelper] = useState(false);

  const scenarios: ScenarioCard[] = [
    {
      id: 'shipment',
      icon: <Package className="w-6 h-6" />,
      title: 'Поставка WB',
      subtitle: 'проверка перед отгрузкой'
    },
    {
      id: 'upd',
      icon: <FileText className="w-6 h-6" />,
      title: 'УПД / ЭДО',
      subtitle: 'почему отклонено и как исправить'
    },
    {
      id: 'kiz',
      icon: <Tag className="w-6 h-6" />,
      title: 'Коды маркировки (КИЗ)',
      subtitle: 'дубли, статусы, остатки'
    },
    {
      id: 'stock',
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Остатки и OOS',
      subtitle: 'что закончится и когда'
    },
    {
      id: 'warehouse',
      icon: <Warehouse className="w-6 h-6" />,
      title: 'Склад / пересорт / потери',
      subtitle: 'аномалии и слабые места'
    },
    {
      id: 'fulfillment',
      icon: <Users className="w-6 h-6" />,
      title: 'Фулфилмент (качество работы)',
      subtitle: 'скорость, ошибки, журнал'
    }
  ];

  const goals: { id: Goal; label: string }[] = [
    { id: 'find-errors', label: 'Найти ошибки' },
    { id: 'reduce-risks', label: 'Снизить риск штрафов' },
    { id: 'speed-up', label: 'Ускорить отгрузку' },
    { id: 'what-to-buy', label: 'Что докупить' },
    { id: 'find-losses', label: 'Найти потери' },
    { id: 'report', label: 'Собрать отчёт для владельца' }
  ];

  const quickStarts = [
    { label: 'Проверить перед отгрузкой', scenario: 'shipment' as Scenario, goal: 'reduce-risks' as Goal },
    { label: 'Почему УПД отклонён?', scenario: 'upd' as Scenario, goal: 'find-errors' as Goal },
    { label: 'Что докупить по размерам?', scenario: 'stock' as Scenario, goal: 'what-to-buy' as Goal },
    { label: 'Где пересорт за неделю?', scenario: 'warehouse' as Scenario, goal: 'find-losses' as Goal }
  ];

  const handleScenarioClick = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  const handleGoalToggle = (goal: Goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleQuickStart = (scenario: Scenario, goal: Goal) => {
    setSelectedScenario(scenario);
    setSelectedGoals([goal]);
  };

  const handleAnalyze = () => {
    navigate('/ai/analytics/result');
  };

  const getHint = () => {
    if (selectedScenario === 'shipment') {
      return 'Рекомендуем проверить поставку перед УПД — так вы поймаете выбытие/дубли до отправки.';
    }
    if (selectedScenario === 'stock') {
      return 'Выберите период 14 дней, если хотите прогноз по размерам.';
    }
    if (selectedScenario === 'fulfillment') {
      return 'Если работает фулфилмент — включите "Журнал действий".';
    }
    return 'Выберите сценарий анализа для получения подсказок';
  };

  return (
    <div className="ai-analytics">
      {/* Header */}
      <div className="ai-analytics__header">
        <div className="ai-analytics__title-wrapper">
          <Sparkles className="w-7 h-7 text-emerald-600" />
          <div>
            <h1 className="ai-analytics__title">AI Аналитика</h1>
            <p className="ai-analytics__subtitle">
              Выберите, что проверить — FASTWMS покажет риски и действия.
            </p>
          </div>
        </div>
        <button 
          className="ai-analytics__help-btn"
          onClick={() => setShowHelper(true)}
        >
          <HelpCircle className="w-5 h-5" />
          Не знаете, что выбрать?
        </button>
      </div>

      {/* Quick Start */}
      <div className="ai-analytics__quick-start">
        <div className="ai-analytics__quick-start-label">Быстрый старт:</div>
        <div className="ai-analytics__quick-start-chips">
          {quickStarts.map((qs, index) => (
            <button
              key={index}
              className="ai-analytics__quick-chip"
              onClick={() => handleQuickStart(qs.scenario, qs.goal)}
            >
              <Play className="w-3 h-3" />
              {qs.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="ai-analytics__section">
        <h2 className="ai-analytics__section-title">Что анализировать?</h2>
        <div className="ai-analytics__scenarios">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`ai-analytics__scenario-card ${selectedScenario === scenario.id ? 'ai-analytics__scenario-card--active' : ''}`}
              onClick={() => handleScenarioClick(scenario.id)}
            >
              <div className="ai-analytics__scenario-icon">
                {scenario.icon}
              </div>
              <div className="ai-analytics__scenario-content">
                <div className="ai-analytics__scenario-title">{scenario.title}</div>
                <div className="ai-analytics__scenario-subtitle">{scenario.subtitle}</div>
              </div>
              {selectedScenario === scenario.id && (
                <div className="ai-analytics__scenario-check">✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      {selectedScenario && (
        <div className="ai-analytics__section">
          <h2 className="ai-analytics__section-title">Цель анализа</h2>
          <div className="ai-analytics__goals">
            {goals.map((goal) => (
              <button
                key={goal.id}
                className={`ai-analytics__goal-chip ${selectedGoals.includes(goal.id) ? 'ai-analytics__goal-chip--active' : ''}`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Object Selection */}
      {selectedScenario && selectedGoals.length > 0 && (
        <div className="ai-analytics__section">
          <h2 className="ai-analytics__section-title">Выбор объекта</h2>
          <div className="ai-analytics__object-select">
            {selectedScenario === 'shipment' && (
              <div className="ai-analytics__form-group">
                <label className="ai-analytics__label">Постав��а</label>
                <select 
                  className="ai-analytics__select"
                  value={selectedObject}
                  onChange={(e) => setSelectedObject(e.target.value)}
                >
                  <option value="12345">Поставка #12345 (WB)</option>
                  <option value="12346">Поставка #12346 (Ozon)</option>
                  <option value="12347">Поставка #12347 (WB)</option>
                </select>
              </div>
            )}
            {selectedScenario === 'upd' && (
              <div className="ai-analytics__form-group">
                <label className="ai-analytics__label">УПД</label>
                <select 
                  className="ai-analytics__select"
                  value={selectedObject}
                  onChange={(e) => setSelectedObject(e.target.value)}
                >
                  <option value="7891">УПД #7891</option>
                  <option value="7890">УПД #7890</option>
                  <option value="7889">УПД #7889</option>
                </select>
              </div>
            )}
            {selectedScenario === 'kiz' && (
              <div className="ai-analytics__form-row">
                <div className="ai-analytics__form-group">
                  <label className="ai-analytics__label">SKU</label>
                  <select className="ai-analytics__select">
                    <option>Pants Rib</option>
                    <option>Top Basic</option>
                    <option>Long Sleeve</option>
                  </select>
                </div>
                <div className="ai-analytics__form-group">
                  <label className="ai-analytics__label">Размер</label>
                  <select className="ai-analytics__select">
                    <option>M</option>
                    <option>S</option>
                    <option>L</option>
                  </select>
                </div>
              </div>
            )}
            {(selectedScenario === 'stock' || selectedScenario === 'warehouse') && (
              <div className="ai-analytics__form-group">
                <label className="ai-analytics__label">Период</label>
                <select className="ai-analytics__select">
                  <option>7 дней</option>
                  <option>14 дней</option>
                  <option>30 дней</option>
                </select>
              </div>
            )}
            {selectedScenario === 'fulfillment' && (
              <div className="ai-analytics__form-row">
                <div className="ai-analytics__form-group">
                  <label className="ai-analytics__label">Клиент/Склад</label>
                  <select className="ai-analytics__select">
                    <option>Склад Москва</option>
                    <option>Склад СПБ</option>
                    <option>Все склады</option>
                  </select>
                </div>
                <div className="ai-analytics__form-group">
                  <label className="ai-analytics__label">Период</label>
                  <select className="ai-analytics__select">
                    <option>7 дней</option>
                    <option>14 дней</option>
                    <option>30 дней</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Smart Hints */}
          <div className="ai-analytics__hint">
            <Sparkles className="w-4 h-4" />
            <span>{getHint()}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      {selectedScenario && selectedGoals.length > 0 && (
        <div className="ai-analytics__actions">
          <button className="ai-analytics__action-btn ai-analytics__action-btn--link">
            Пример отчёта
          </button>
          <button className="ai-analytics__action-btn ai-analytics__action-btn--secondary">
            Сохранить как шаблон
          </button>
          <button 
            className="ai-analytics__action-btn ai-analytics__action-btn--primary"
            onClick={handleAnalyze}
          >
            <Play className="w-4 h-4" />
            Запустить анализ
          </button>
        </div>
      )}

      {/* Helper Modal */}
      {showHelper && (
        <>
          <div 
            className="ai-analytics__modal-overlay"
            onClick={() => setShowHelper(false)}
          />
          <div className="ai-analytics__modal">
            <div className="ai-analytics__modal-header">
              <h3 className="ai-analytics__modal-title">Помощь в выборе</h3>
              <button 
                className="ai-analytics__modal-close"
                onClick={() => setShowHelper(false)}
              >
                ×
              </button>
            </div>
            <div className="ai-analytics__modal-body">
              <div className="ai-analytics__modal-question">
                <label className="ai-analytics__modal-label">Что сейчас болит?</label>
                <div className="ai-analytics__modal-options">
                  <button className="ai-analytics__modal-option">Отгрузка</button>
                  <button className="ai-analytics__modal-option">УПД</button>
                  <button className="ai-analytics__modal-option">Остатки</button>
                  <button className="ai-analytics__modal-option">Склад</button>
                </div>
              </div>
              <div className="ai-analytics__modal-question">
                <label className="ai-analytics__modal-label">Вы работаете через фулфилмент?</label>
                <div className="ai-analytics__modal-options">
                  <button className="ai-analytics__modal-option">Да</button>
                  <button className="ai-analytics__modal-option">Нет</button>
                </div>
              </div>
              <div className="ai-analytics__modal-question">
                <label className="ai-analytics__modal-label">Цель на сегодня?</label>
                <div className="ai-analytics__modal-options">
                  <button className="ai-analytics__modal-option">Ускорить</button>
                  <button className="ai-analytics__modal-option">Без ошибок</button>
                  <button className="ai-analytics__modal-option">Что докупить</button>
                </div>
              </div>
            </div>
            <div className="ai-analytics__modal-footer">
              <button 
                className="ai-analytics__modal-btn"
                onClick={() => {
                  setShowHelper(false);
                  setSelectedScenario('shipment');
                  setSelectedGoals(['reduce-risks']);
                }}
              >
                Подобрать сценарий
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AIAnalytics;
