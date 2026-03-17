import { useNavigate } from 'react-router';
import { 
  Sparkles, 
  AlertTriangle, 
  FileX, 
  PackageX,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import '../../styles/ai-hub.css';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  link?: string;
}

function AIHub() {
  const navigate = useNavigate();

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      message: 'SKU: Pants Rib 68906436 — размер M: закончится через 6 дней',
      link: '/ai/recommendations'
    },
    {
      id: '2',
      type: 'error',
      message: 'Поставка #12345: 8 КИЗ отклонены в УПД',
      link: '/ai/upd-analyzer'
    },
    {
      id: '3',
      type: 'warning',
      message: 'Найдены дубли: 2 кода в партии "Март-1"',
      link: '/ai/shipment-check'
    },
    {
      id: '4',
      type: 'warning',
      message: 'Риск пересорта: размер L → M по SKU Top Basic',
      link: '/ai/shipment-check'
    },
    {
      id: '5',
      type: 'info',
      message: 'Рекомендуется проверка поставки #12346 перед отгрузкой',
      link: '/ai/shipment-check'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="ai-hub">
      {/* Hero Section */}
      <div className="ai-hero">
        <div className="ai-hero__icon">
          <Sparkles className="w-10 h-10" />
        </div>
        <div className="ai-hero__content">
          <h1 className="ai-hero__title">AI-помощник FASTWMS</h1>
          <p className="ai-hero__description">
            Проверяет поставки, объясняет УПД и подсказывает, что докупить.
          </p>
          <div className="ai-hero__actions">
            <button 
              className="ai-btn ai-btn--primary"
              onClick={() => navigate('/ai/analytics')}
            >
              <TrendingUp className="w-4 h-4" />
              AI Аналитика
            </button>
            <button 
              className="ai-btn ai-btn--secondary"
              onClick={() => navigate('/ai/shipment-check')}
            >
              Проверить поставку
            </button>
            <button 
              className="ai-btn ai-btn--secondary"
              onClick={() => navigate('/ai/upd-analyzer')}
            >
              Разобрать УПД
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="ai-summary">
        <div className="ai-summary-card ai-summary-card--warning">
          <div className="ai-summary-card__icon">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="ai-summary-card__content">
            <div className="ai-summary-card__value">4</div>
            <div className="ai-summary-card__label">Риски сегодня</div>
          </div>
        </div>

        <div className="ai-summary-card ai-summary-card--error">
          <div className="ai-summary-card__icon">
            <FileX className="w-6 h-6" />
          </div>
          <div className="ai-summary-card__content">
            <div className="ai-summary-card__value">2</div>
            <div className="ai-summary-card__label">УПД с ошибками</div>
          </div>
        </div>

        <div className="ai-summary-card ai-summary-card--info">
          <div className="ai-summary-card__icon">
            <PackageX className="w-6 h-6" />
          </div>
          <div className="ai-summary-card__content">
            <div className="ai-summary-card__value">3 SKU</div>
            <div className="ai-summary-card__label">Заканчиваются коды</div>
          </div>
        </div>
      </div>

      {/* AI Alerts */}
      <div className="ai-alerts">
        <div className="ai-alerts__header">
          <h2 className="ai-alerts__title">AI-алерты</h2>
          <span className="ai-alerts__badge">
            <Sparkles className="w-3 h-3" />
            AI
          </span>
        </div>

        <div className="ai-alerts__list">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`ai-alert ai-alert--${alert.type}`}
              onClick={() => alert.link && navigate(alert.link)}
            >
              <div className="ai-alert__icon">
                {getAlertIcon(alert.type)}
              </div>
              <div className="ai-alert__message">{alert.message}</div>
              {alert.link && (
                <div className="ai-alert__arrow">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIHub;