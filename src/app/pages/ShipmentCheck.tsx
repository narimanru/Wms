import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Shield, 
  Copy, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import '../../styles/ai-pages.css';

type Step = 'select' | 'result';

interface Issue {
  id: string;
  type: 'critical' | 'warning';
  title: string;
  description: string;
  action?: string;
}

function ShipmentCheck() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [selectedShipment, setSelectedShipment] = useState('12345');

  const shipments = [
    { id: '12345', name: 'Поставка #12345 (WB)', status: 'pending' },
    { id: '12346', name: 'Поставка #12346 (Ozon)', status: 'pending' },
    { id: '12347', name: 'Поставка #12347 (WB)', status: 'checked' }
  ];

  const criticalIssues: Issue[] = [
    {
      id: '1',
      type: 'critical',
      title: '2 кода уже выбыли из оборота',
      description: 'Коды ••••4821 и ••••3492 помечены как выбывшие. Использование может привести к отклонению УПД.',
      action: 'Заменить коды'
    },
    {
      id: '2',
      type: 'critical',
      title: '1 код не назначен товару/размеру',
      description: 'Код ••••7563 загружен, но не привязан к конкретному SKU.',
      action: 'Назначить'
    }
  ];

  const warnings: Issue[] = [
    {
      id: '1',
      type: 'warning',
      title: '5 кодов в статусе "не готов к УПД"',
      description: 'Эти коды требуют изменения статуса перед отправкой документов.'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Риск пересорта: размер L → M',
      description: 'По истории операций обнаружена частая путаница между размерами L и M для SKU Top Basic.'
    }
  ];

  const recommendations = [
    'Заменить 2 выбывших КИЗ на новые из банка кодов',
    'Перепечатать 3 этикетки: слабая читаемость (по сканам/жалобам)',
    'Перед УПД проверь: 5 кодов должны быть "в обороте"'
  ];

  const handleOpenKIZVault = () => {
    navigate('/ai/kiz-vault/replace');
  };

  const handleCheck = () => {
    setStep('result');
  };

  const handleBack = () => {
    if (step === 'result') {
      setStep('select');
    } else {
      navigate('/ai');
    }
  };

  return (
    <div className="ai-page">
      {/* Header */}
      <div className="ai-page__header">
        <button className="ai-page__back" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ai-page__header-content">
          <div className="ai-page__title-wrapper">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="ai-page__title">Проверка поставки</h1>
            <span className="ai-badge">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </div>
          <p className="ai-page__subtitle">
            {step === 'select' 
              ? 'Выберите поставку для проверки перед отгрузкой' 
              : 'Результаты проверки поставки #12345'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="ai-page__content">
        {step === 'select' && (
          <>
            {/* Select Shipment */}
            <div className="ai-card">
              <div className="ai-card__header">
                <h2 className="ai-card__title">Выбор поставки</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-form-group">
                  <label className="ai-label">Поставка</label>
                  <select 
                    className="ai-select"
                    value={selectedShipment}
                    onChange={(e) => setSelectedShipment(e.target.value)}
                  >
                    {shipments.map((shipment) => (
                      <option key={shipment.id} value={shipment.id}>
                        {shipment.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="ai-btn ai-btn--primary" onClick={handleCheck}>
                  Запустить проверку
                </button>
              </div>
            </div>

            {/* What we check */}
            <div className="ai-card">
              <div className="ai-card__header">
                <h2 className="ai-card__title">Что проверяем?</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-chips">
                  <div className="ai-chip ai-chip--info">
                    <CheckCircle2 className="w-4 h-4" />
                    Статусы КИЗ
                  </div>
                  <div className="ai-chip ai-chip--info">
                    <Copy className="w-4 h-4" />
                    Дубли
                  </div>
                  <div className="ai-chip ai-chip--info">
                    <AlertTriangle className="w-4 h-4" />
                    Несоответствие SKU/размер
                  </div>
                  <div className="ai-chip ai-chip--info">
                    <XCircle className="w-4 h-4" />
                    Не назначены коды
                  </div>
                  <div className="ai-chip ai-chip--info">
                    <Users className="w-4 h-4" />
                    Риски обезлички
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 'result' && (
          <>
            {/* Score */}
            <div className="ai-score ai-score--warning">
              <div className="ai-score__icon">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="ai-score__content">
                <div className="ai-score__title">Риск: Средний</div>
                <div className="ai-score__subtitle">Проблем: 3, предупреждений: 5</div>
              </div>
            </div>

            {/* Critical Issues */}
            <div className="ai-card">
              <div className="ai-card__header ai-card__header--critical">
                <XCircle className="w-5 h-5" />
                <h2 className="ai-card__title">Критично</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-issues">
                  {criticalIssues.map((issue) => (
                    <div key={issue.id} className="ai-issue ai-issue--critical">
                      <div className="ai-issue__icon">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <div className="ai-issue__content">
                        <div className="ai-issue__title">{issue.title}</div>
                        <div className="ai-issue__description">{issue.description}</div>
                      </div>
                      {issue.action && (
                        <button 
                          className="ai-issue__action"
                          onClick={handleOpenKIZVault}
                        >
                          {issue.action}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warnings */}
            <div className="ai-card">
              <div className="ai-card__header ai-card__header--warning">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="ai-card__title">Предупреждения</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-issues">
                  {warnings.map((issue) => (
                    <div key={issue.id} className="ai-issue ai-issue--warning">
                      <div className="ai-issue__icon">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="ai-issue__content">
                        <div className="ai-issue__title">{issue.title}</div>
                        <div className="ai-issue__description">{issue.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="ai-card">
              <div className="ai-card__header">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="ai-card__title">Рекомендации AI</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-recommendations">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="ai-recommendation">
                      <input type="checkbox" className="ai-recommendation__checkbox" />
                      <div className="ai-recommendation__text">{rec}</div>
                      <button className="ai-recommendation__button">
                        Перейти
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ShipmentCheck;