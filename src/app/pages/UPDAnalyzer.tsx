import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  FileText, 
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download,
  CheckCircle2
} from 'lucide-react';
import '../../styles/ai-pages.css';

type Step = 'select' | 'result';

interface RejectedCode {
  id: string;
  code: string;
  sku: string;
  size: string;
  reason: string;
  recommendation: string;
}

function UPDAnalyzer() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [selectedUPD, setSelectedUPD] = useState('7891');

  const updList = [
    { id: '7891', name: 'УПД #7891', status: 'error', date: '15 марта 2026' },
    { id: '7890', name: 'УПД #7890', status: 'success', date: '14 марта 2026' },
    { id: '7889', name: 'УПД #7889', status: 'success', date: '13 марта 2026' }
  ];

  const rejectedCodes: RejectedCode[] = [
    {
      id: '1',
      code: '••••4821',
      sku: 'Pants Rib',
      size: 'M',
      reason: 'Код выбыл из оборота',
      recommendation: 'Заменить код'
    },
    {
      id: '2',
      code: '••••3492',
      sku: 'Pants Rib',
      size: 'L',
      reason: 'Код выбыл из оборота',
      recommendation: 'Заменить код'
    },
    {
      id: '3',
      code: '••••7563',
      sku: 'Top Basic',
      size: 'S',
      reason: 'Код выбыл из оборота',
      recommendation: 'Заменить код'
    },
    {
      id: '4',
      code: '••••9184',
      sku: 'Top Basic',
      size: 'M',
      reason: 'Код выбыл из оборота',
      recommendation: 'Заменить код'
    },
    {
      id: '5',
      code: '••••2756',
      sku: 'Long Sleeve',
      size: 'L',
      reason: 'Код выбыл из оборота',
      recommendation: 'Заменить код'
    },
    {
      id: '6',
      code: '••••6183',
      sku: 'Long Sleeve',
      size: 'S',
      reason: 'Код выбыл из оборота',
      recommendation: 'Заменить код'
    },
    {
      id: '7',
      code: '••••4927',
      sku: 'Pants Rib',
      size: 'M',
      reason: 'Статус кода не подходит для операции',
      recommendation: 'Обновить статус'
    },
    {
      id: '8',
      code: '••••8341',
      sku: 'Top Basic',
      size: 'L',
      reason: 'Статус кода не подходит для операции',
      recommendation: 'Обновить статус'
    }
  ];

  const planSteps = [
    {
      id: '1',
      title: 'Заменить 6 кодов',
      description: 'Коды выбыли из оборота и требуют замены',
      action: 'Открыть банк КИЗ',
      onClick: () => navigate('/ai/kiz-vault/replace')
    },
    {
      id: '2',
      title: 'Обновить назначения',
      description: 'Обновить статусы 2 кодов для корректной работы',
      action: 'Обновить статусы',
      onClick: () => {}
    },
    {
      id: '3',
      title: 'Пересоздать/перепровести УПД',
      description: 'После исправления создать документ заново',
      action: 'Создать заново',
      onClick: () => {}
    }
  ];

  const handleAnalyze = () => {
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
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="ai-page__title">Разбор УПД</h1>
            <span className="ai-badge">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </div>
          <p className="ai-page__subtitle">
            {step === 'select' 
              ? 'Выберите УПД для анализа ошибок' 
              : 'Подробный разбор ошибок УПД #7891'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="ai-page__content">
        {step === 'select' && (
          <>
            {/* API Integration Info */}
            <div className="ai-card">
              <div className="ai-card__header">
                <Download className="w-5 h-5 text-emerald-600" />
                <h2 className="ai-card__title">Интеграция с API</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-api-status">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="ai-api-status__text">
                    Подключено к API Честного знака
                  </span>
                </div>
              </div>
            </div>

            {/* Select UPD */}
            <div className="ai-card">
              <div className="ai-card__header">
                <h2 className="ai-card__title">Выбор документа</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-upd-list">
                  {updList.map((upd) => (
                    <div 
                      key={upd.id}
                      className={`ai-upd-item ${selectedUPD === upd.id ? 'ai-upd-item--selected' : ''} ai-upd-item--${upd.status}`}
                      onClick={() => setSelectedUPD(upd.id)}
                    >
                      <div className="ai-upd-item__icon">
                        {upd.status === 'error' ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>
                      <div className="ai-upd-item__content">
                        <div className="ai-upd-item__name">{upd.name}</div>
                        <div className="ai-upd-item__date">{upd.date}</div>
                      </div>
                      <div className="ai-upd-item__status">
                        {upd.status === 'error' ? 'Обработан с ошибкой' : 'Принят'}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="ai-btn ai-btn--primary" onClick={handleAnalyze}>
                  Разобрать УПД #{selectedUPD}
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'result' && (
          <>
            {/* Explanation */}
            <div className="ai-card">
              <div className="ai-card__header">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h2 className="ai-card__title">Объяснение</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-explanation">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <div className="ai-explanation__text">
                    <strong>Проблема:</strong> 8 кодов отклонены — 6 из них уже использованы, 2 не в нужном статусе.
                  </div>
                </div>
              </div>
            </div>

            {/* Rejected Codes Table */}
            <div className="ai-card">
              <div className="ai-card__header ai-card__header--critical">
                <XCircle className="w-5 h-5" />
                <h2 className="ai-card__title">Отклонённые коды ({rejectedCodes.length})</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-table-container">
                  <table className="ai-table">
                    <thead>
                      <tr>
                        <th>КИЗ</th>
                        <th>SKU</th>
                        <th>Размер</th>
                        <th>Причина</th>
                        <th>Рекомендация</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rejectedCodes.map((code) => (
                        <tr key={code.id}>
                          <td><code className="ai-code">{code.code}</code></td>
                          <td>{code.sku}</td>
                          <td><span className="ai-size-badge">{code.size}</span></td>
                          <td className="ai-table__reason">{code.reason}</td>
                          <td>
                            <button className="ai-table__action">
                              {code.recommendation}
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

            {/* Action Plan */}
            <div className="ai-card">
              <div className="ai-card__header">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h2 className="ai-card__title">План исправления</h2>
              </div>
              <div className="ai-card__body">
                <div className="ai-plan">
                  {planSteps.map((planStep, index) => (
                    <div key={planStep.id} className="ai-plan-step">
                      <div className="ai-plan-step__number">{index + 1}</div>
                      <div className="ai-plan-step__content">
                        <div className="ai-plan-step__title">{planStep.title}</div>
                        <div className="ai-plan-step__description">{planStep.description}</div>
                      </div>
                      <button className="ai-plan-step__action" onClick={planStep.onClick}>
                        {planStep.action}
                        <ArrowRight className="w-4 h-4" />
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

export default UPDAnalyzer;