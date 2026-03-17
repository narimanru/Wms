import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Sparkles,
  TrendingUp,
  Package,
  Factory,
  Tag,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Calendar,
  ChevronDown,
  Play
} from 'lucide-react';
import '../../styles/ai-planner.css';
import '../../styles/autopilot.css';

type Horizon = '14' | '30' | 'season';

interface ActionCard {
  id: string;
  type: 'critical' | 'warning' | 'success';
  icon: React.ReactNode;
  message: string;
  action: string;
  link: string;
}

interface WarehouseCard {
  id: string;
  name: string;
  oosRisks: number;
  recommendedQty: number;
  priority: 'high' | 'medium' | 'low';
}

function AIPlannerDashboard() {
  const navigate = useNavigate();
  const [horizon, setHorizon] = useState<Horizon>('30');
  const [showExplain, setShowExplain] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [autopilotMode, setAutopilotMode] = useState<'draft' | 'semi' | 'auto'>('draft');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const actions: ActionCard[] = [
    {
      id: '1',
      type: 'critical',
      icon: <XCircle className="w-5 h-5" />,
      message: 'WB Краснодар: Pants Rib M закончится через 1–2 дня',
      action: 'Создать отгрузку',
      link: '/planner/shipments'
    },
    {
      id: '2',
      type: 'warning',
      icon: <AlertTriangle className="w-5 h-5" />,
      message: 'Top Basic L: на WB дефицит в 2 складах',
      action: 'План отгрузок',
      link: '/planner/shipments'
    },
    {
      id: '3',
      type: 'warning',
      icon: <AlertTriangle className="w-5 h-5" />,
      message: 'Long Sleeve M: не хватает КИЗ под план (дефицит 25)',
      action: 'План КИЗ',
      link: '/planner/kiz'
    },
    {
      id: '4',
      type: 'success',
      icon: <CheckCircle2 className="w-5 h-5" />,
      message: 'Pants Rib: производство успевает, но нужно запланировать 300 шт',
      action: 'План производства',
      link: '/planner/production'
    }
  ];

  const warehouses: WarehouseCard[] = [
    {
      id: 'elektrostal',
      name: 'WB Электросталь',
      oosRisks: 2,
      recommendedQty: 230,
      priority: 'medium'
    },
    {
      id: 'kazan',
      name: 'WB Казань',
      oosRisks: 4,
      recommendedQty: 180,
      priority: 'high'
    },
    {
      id: 'krasnodar',
      name: 'WB Краснодар',
      oosRisks: 5,
      recommendedQty: 280,
      priority: 'high'
    }
  ];

  const getHorizonLabel = () => {
    switch (horizon) {
      case '14':
        return '14 дней';
      case '30':
        return '30 дней';
      case 'season':
        return 'Сезон';
    }
  };

  const handleApprovePlan = () => {
    // Will show modal
    setShowApproveModal(true);
  };

  const handleConfirmPlan = () => {
    setShowApproveModal(false);
    alert('План успешно подтвержден!');
  };

  return (
    <div className="ai-planner">
      {/* Header */}
      <div className="ai-planner__header">
        <div className="ai-planner__header-content">
          <div className="ai-planner__title-wrapper">
            <Calendar className="w-7 h-7 text-emerald-600" />
            <div>
              <h1 className="ai-planner__title">AI Планировщик</h1>
              <p className="ai-planner__subtitle">
                Планирует отгрузки на WB и производство на {getHorizonLabel().toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
        <div className="ai-planner__header-actions">
          <button 
            className="ai-planner__help-btn"
            onClick={() => setShowExplain(true)}
          >
            <HelpCircle className="w-4 h-4" />
            Почему так?
          </button>
          
          {/* Autopilot Mode Selector */}
          <div style={{ position: 'relative' }}>
            <button 
              className="ai-planner__btn ai-planner__btn--secondary"
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
            className="ai-planner__btn ai-planner__btn--primary"
            onClick={() => navigate('/autopilot/setup')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Play className="w-4 h-4" />
            Запустить автопилот
          </button>
        </div>
      </div>

      {/* Horizon Selector */}
      <div className="ai-planner__horizon">
        <div className="ai-planner__horizon-label">Горизонт планирования:</div>
        <div className="ai-planner__horizon-tabs">
          <button
            className={`ai-planner__horizon-tab ${horizon === '14' ? 'ai-planner__horizon-tab--active' : ''}`}
            onClick={() => setHorizon('14')}
          >
            14 дней
          </button>
          <button
            className={`ai-planner__horizon-tab ${horizon === '30' ? 'ai-planner__horizon-tab--active' : ''}`}
            onClick={() => setHorizon('30')}
          >
            30 дней
          </button>
          <button
            className={`ai-planner__horizon-tab ${horizon === 'season' ? 'ai-planner__horizon-tab--active' : ''}`}
            onClick={() => navigate('/seasonal')}
          >
            Сезон
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="ai-planner__kpi">
        <div className="ai-planner__kpi-card ai-planner__kpi-card--critical">
          <div className="ai-planner__kpi-icon">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="ai-planner__kpi-content">
            <div className="ai-planner__kpi-value">9</div>
            <div className="ai-planner__kpi-label">Риск OOS</div>
            <div className="ai-planner__kpi-description">размеров</div>
          </div>
        </div>

        <div className="ai-planner__kpi-card ai-planner__kpi-card--info">
          <div className="ai-planner__kpi-icon">
            <Package className="w-6 h-6" />
          </div>
          <div className="ai-planner__kpi-content">
            <div className="ai-planner__kpi-value">3</div>
            <div className="ai-planner__kpi-label">Рекоменд. отгрузки</div>
            <div className="ai-planner__kpi-description">поставки</div>
          </div>
        </div>

        <div className="ai-planner__kpi-card ai-planner__kpi-card--info">
          <div className="ai-planner__kpi-icon">
            <Factory className="w-6 h-6" />
          </div>
          <div className="ai-planner__kpi-content">
            <div className="ai-planner__kpi-value">1 050</div>
            <div className="ai-planner__kpi-label">Производство</div>
            <div className="ai-planner__kpi-description">шт</div>
          </div>
        </div>

        <div className="ai-planner__kpi-card ai-planner__kpi-card--info">
          <div className="ai-planner__kpi-icon">
            <Tag className="w-6 h-6" />
          </div>
          <div className="ai-planner__kpi-content">
            <div className="ai-planner__kpi-value">420</div>
            <div className="ai-planner__kpi-label">КИЗ к закупке</div>
            <div className="ai-planner__kpi-description">шт</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="ai-planner__section">
        <h2 className="ai-planner__section-title">Что делать сегодня</h2>
        <div className="ai-planner__actions">
          {actions.map((action) => (
            <div
              key={action.id}
              className={`ai-planner__action-card ai-planner__action-card--${action.type}`}
            >
              <div className="ai-planner__action-icon">
                {action.icon}
              </div>
              <div className="ai-planner__action-content">
                <div className="ai-planner__action-message">{action.message}</div>
              </div>
              <button
                className="ai-planner__action-btn"
                onClick={() => navigate(action.link)}
              >
                {action.action}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* WB Warehouses */}
      <div className="ai-planner__section">
        <div className="ai-planner__section-header">
          <h2 className="ai-planner__section-title">Карта складов WB</h2>
          <button 
            className="ai-planner__link-btn"
            onClick={() => navigate('/planner/warehouses')}
          >
            Подробнее
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="ai-planner__warehouses">
          {warehouses.map((wh) => (
            <div
              key={wh.id}
              className={`ai-planner__warehouse-card ai-planner__warehouse-card--${wh.priority}`}
              onClick={() => navigate('/planner/warehouses')}
            >
              <div className="ai-planner__warehouse-header">
                <div className="ai-planner__warehouse-name">{wh.name}</div>
                <span className={`ai-planner__warehouse-badge ai-planner__warehouse-badge--${wh.priority}`}>
                  {wh.priority === 'high' ? 'Высокий' : wh.priority === 'medium' ? 'Средний' : 'Низкий'}
                </span>
              </div>
              <div className="ai-planner__warehouse-stats">
                <div className="ai-planner__warehouse-stat">
                  <div className="ai-planner__warehouse-stat-label">OOS риски</div>
                  <div className="ai-planner__warehouse-stat-value">{wh.oosRisks}</div>
                </div>
                <div className="ai-planner__warehouse-stat">
                  <div className="ai-planner__warehouse-stat-label">Рекоменд. пополнение</div>
                  <div className="ai-planner__warehouse-stat-value">{wh.recommendedQty} шт</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explain Modal */}
      {showExplain && (
        <>
          <div
            className="ai-planner__modal-overlay"
            onClick={() => setShowExplain(false)}
          />
          <div className="ai-planner__modal">
            <div className="ai-planner__modal-header">
              <div className="ai-planner__modal-title-wrapper">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="ai-planner__modal-title">Почему так?</h3>
              </div>
              <button
                className="ai-planner__modal-close"
                onClick={() => setShowExplain(false)}
              >
                ×
              </button>
            </div>
            <div className="ai-planner__modal-body">
              <div className="ai-planner__modal-section">
                <h4 className="ai-planner__modal-subtitle">Метод расчета</h4>
                <p className="ai-planner__modal-text">
                  AI анализирует средний спрос за последние 30 дней, остатки на всех складах WB, 
                  ваш склад и производство. Учитывается lead time отгрузки (5–7 дней) и 
                  целевое покрытие (21 + 7 дней страховой запас).
                </p>
              </div>
              <div className="ai-planner__modal-section">
                <h4 className="ai-planner__modal-subtitle">Приоритеты</h4>
                <ul className="ai-planner__modal-list">
                  <li>Высокий — остатки менее 2 дней</li>
                  <li>Средний — остатки 2–7 дней</li>
                  <li>Низкий — остатки более 7 дней</li>
                </ul>
              </div>
              <div className="ai-planner__modal-section">
                <h4 className="ai-planner__modal-subtitle">Рекомендации</h4>
                <p className="ai-planner__modal-text">
                  Система автоматически рассчитывает оптимальные объемы для отгрузки на каждый склад WB 
                  и необходимое производство. План учитывает сезонность и тренды продаж.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <>
          <div
            className="ai-planner__modal-overlay"
            onClick={() => setShowApproveModal(false)}
          />
          <div className="ai-planner__modal">
            <div className="ai-planner__modal-header">
              <div className="ai-planner__modal-title-wrapper">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="ai-planner__modal-title">Подтверждение плана</h3>
              </div>
              <button
                className="ai-planner__modal-close"
                onClick={() => setShowApproveModal(false)}
              >
                ×
              </button>
            </div>
            <div className="ai-planner__modal-body">
              <div className="ai-planner__modal-section">
                <h4 className="ai-planner__modal-subtitle">План отгрузок</h4>
                <p className="ai-planner__modal-text">
                  План отгрузок на следующие 30 дней:
                </p>
                <ul className="ai-planner__modal-list">
                  <li>WB Электросталь: 230 шт</li>
                  <li>WB Казань: 180 шт</li>
                  <li>WB Краснодар: 280 шт</li>
                </ul>
              </div>
              <div className="ai-planner__modal-section">
                <h4 className="ai-planner__modal-subtitle">План производства</h4>
                <p className="ai-planner__modal-text">
                  План производства на следующие 30 дней:
                </p>
                <ul className="ai-planner__modal-list">
                  <li>Pants Rib: 1 050 шт</li>
                </ul>
              </div>
              <div className="ai-planner__modal-section">
                <h4 className="ai-planner__modal-subtitle">План КИЗ</h4>
                <p className="ai-planner__modal-text">
                  План КИЗ к закупке на следующие 30 дней:
                </p>
                <ul className="ai-planner__modal-list">
                  <li>420 шт</li>
                </ul>
              </div>
            </div>
            <div className="ai-planner__modal-footer">
              <button
                className="ai-planner__btn ai-planner__btn--primary"
                onClick={handleConfirmPlan}
              >
                Подтвердить план
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AIPlannerDashboard;