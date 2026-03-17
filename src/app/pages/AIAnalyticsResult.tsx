import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Download,
  Send,
  Save,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import '../../styles/ai-analytics-result.css';

interface IssueItem {
  id: string;
  object: string;
  problem: string;
  reason: string;
  action: string;
  severity: 'critical' | 'warning';
}

function AIAnalyticsResult() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');

  const issues: IssueItem[] = [
    {
      id: '1',
      object: 'КИЗ ••••4821 (Pants Rib, M)',
      problem: 'Код выбыл из оборота',
      reason: 'Код был использован ранее в другой поставке',
      action: 'Заменить код',
      severity: 'critical'
    },
    {
      id: '2',
      object: 'КИЗ ••••3492 (Pants Rib, L)',
      problem: 'Код выбыл из оборота',
      reason: 'Код был использован ранее в другой поставке',
      action: 'Заменить код',
      severity: 'critical'
    },
    {
      id: '3',
      object: 'КИЗ ••••7563 (Top Basic, S)',
      problem: 'Статус кода не подходит',
      reason: 'Код находится в статусе "Напечатан", требуется "Доступен"',
      action: 'Обновить статус',
      severity: 'warning'
    },
    {
      id: '4',
      object: 'КИЗ ••••9184 (Top Basic, M)',
      problem: 'Статус кода не подходит',
      reason: 'Код находится в статусе "Напечатан", требуется "Доступен"',
      action: 'Обновить статус',
      severity: 'warning'
    },
    {
      id: '5',
      object: 'КИЗ ••••2756 (Long Sleeve, L)',
      problem: 'Статус кода не подходит',
      reason: 'Код находится в статусе "В УПД", требуется "Доступен"',
      action: 'Обновить статус',
      severity: 'warning'
    }
  ];

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warnings = issues.filter(i => i.severity === 'warning');

  const handleReplaceClick = () => {
    navigate('/ai/kiz-vault/replace');
  };

  const handleFixClick = () => {
    setShowToast(true);
    setRiskLevel('low');
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low':
        return '#059669';
      case 'medium':
        return '#d97706';
      case 'high':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'low':
        return 'Низкий';
      case 'medium':
        return 'Средний';
      case 'high':
        return 'Высокий';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="ai-result">
      {/* Toast */}
      {showToast && (
        <div className="ai-result__toast">
          <CheckCircle2 className="w-5 h-5" />
          <span>Риск снижен до "Низкий". Поставка готова к отгрузке.</span>
        </div>
      )}

      {/* Header */}
      <div className="ai-result__header">
        <button className="ai-result__back" onClick={() => navigate('/ai/analytics')}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ai-result__header-content">
          <div className="ai-result__title-wrapper">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h1 className="ai-result__title">Результат анализа</h1>
            <span className="ai-badge">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </div>
          <p className="ai-result__subtitle">Поставка #12345 — проверка перед отгрузкой</p>
        </div>
        <div className="ai-result__header-actions">
          <button className="ai-result__header-btn">
            <Send className="w-4 h-4" />
            Telegram
          </button>
          <button className="ai-result__header-btn">
            <Save className="w-4 h-4" />
            Шаблон
          </button>
          <button className="ai-result__header-btn ai-result__header-btn--primary">
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="ai-result__summary">
        <div className="ai-result__risk" style={{ borderColor: getRiskColor() }}>
          <div className="ai-result__risk-label">Уровень риска</div>
          <div className="ai-result__risk-value" style={{ color: getRiskColor() }}>
            {getRiskLabel()}
          </div>
        </div>
        <div className="ai-result__kpi">
          <div className="ai-result__kpi-item ai-result__kpi-item--critical">
            <div className="ai-result__kpi-value">{criticalIssues.length}</div>
            <div className="ai-result__kpi-label">Критично</div>
          </div>
          <div className="ai-result__kpi-item ai-result__kpi-item--warning">
            <div className="ai-result__kpi-value">{warnings.length}</div>
            <div className="ai-result__kpi-label">Предупреждения</div>
          </div>
          <div className="ai-result__kpi-item ai-result__kpi-item--info">
            <div className="ai-result__kpi-value">7</div>
            <div className="ai-result__kpi-label">Рекомендаций</div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="ai-result__section">
        <h2 className="ai-result__section-title">Что важно сделать сейчас</h2>
        <div className="ai-result__action-cards">
          <div className="ai-result__action-card ai-result__action-card--critical">
            <div className="ai-result__action-card-icon">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="ai-result__action-card-content">
              <div className="ai-result__action-card-title">
                2 кода выбыло из оборота
              </div>
              <div className="ai-result__action-card-description">
                Коды были использованы ранее и требуют замены
              </div>
            </div>
            <button 
              className="ai-result__action-card-btn"
              onClick={handleReplaceClick}
            >
              Заменить коды
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="ai-result__action-card ai-result__action-card--warning">
            <div className="ai-result__action-card-icon">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="ai-result__action-card-content">
              <div className="ai-result__action-card-title">
                3 кода не готовы к УПД
              </div>
              <div className="ai-result__action-card-description">
                Статусы кодов не соответствуют требованиям для создания УПД
              </div>
            </div>
            <button 
              className="ai-result__action-card-btn"
              onClick={handleFixClick}
            >
              Исправить
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="ai-result__action-card ai-result__action-card--info">
            <div className="ai-result__action-card-icon">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="ai-result__action-card-content">
              <div className="ai-result__action-card-title">
                Размер M скоро закончится
              </div>
              <div className="ai-result__action-card-description">
                Прогноз: остатки кодов хватит на 4–6 дней
              </div>
            </div>
            <button className="ai-result__action-card-btn">
              Сформировать закупку
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="ai-result__section">
        <h2 className="ai-result__section-title">Детали</h2>
        <div className="ai-result__table-card">
          <div className="ai-result__table-container">
            <table className="ai-result__table">
              <thead>
                <tr>
                  <th>Объект</th>
                  <th>Проблема</th>
                  <th>Причина</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td>
                      <code className="ai-result__code">{issue.object}</code>
                    </td>
                    <td>
                      <div className="ai-result__problem">
                        {issue.severity === 'critical' ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        )}
                        <span>{issue.problem}</span>
                      </div>
                    </td>
                    <td className="ai-result__reason">{issue.reason}</td>
                    <td>
                      <button className="ai-result__table-action">
                        {issue.action}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="ai-result__section">
        <h2 className="ai-result__section-title">Почему так</h2>
        <div className="ai-result__explanation">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <p className="ai-result__explanation-text">
            Основной риск — повторное использование кодов маркировки и несоответствие статусов перед УПД. 
            2 кода уже были применены в других поставках и не могут быть использованы повторно. 
            3 кода находятся в неправильном статусе ("Напечатан" или "В УПД") и требуют обновления до статуса "Доступен" перед созданием нового УПД. 
            Также обратите внимание на прогноз остатков по размеру M — рекомендуем заказать дополнительные коды заранее.
          </p>
        </div>
      </div>

      {/* Quick Fix */}
      <div className="ai-result__quick-fix">
        <div className="ai-result__quick-fix-content">
          <RefreshCw className="w-5 h-5" />
          <div>
            <div className="ai-result__quick-fix-title">Исправить всё одним кликом</div>
            <div className="ai-result__quick-fix-description">
              FASTWMS автоматически заменит проблемные коды и обновит статусы
            </div>
          </div>
        </div>
        <button className="ai-result__quick-fix-btn" onClick={handleReplaceClick}>
          Исправить автоматически
        </button>
      </div>
    </div>
  );
}

export default AIAnalyticsResult;
