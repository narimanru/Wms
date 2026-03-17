import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, XCircle, AlertTriangle, CheckCircle2, ArrowLeft, Plus, TrendingUp, Shield, Minus, Repeat } from 'lucide-react';

interface Conflict {
  id: string;
  type: 'error' | 'warning';
  title: string;
  impact: string;
  solution: string;
  resolved: boolean;
  category?: 'policy' | 'general';
  solutions?: Array<{ label: string; icon: React.ReactNode }>;
}

function AutopilotReview() {
  const navigate = useNavigate();
  
  const [conflicts, setConflicts] = useState<Conflict[]>([
    {
      id: '1',
      type: 'error',
      category: 'policy',
      title: 'Нельзя запустить производство Long Sleeve M: не хватает КИЗ (дефицит 25)',
      impact: 'Нарушение правила "Не запускать производство без КИЗ"',
      solution: 'Добавить к покупке',
      resolved: false,
      solutions: [
        { label: 'Добавить к покупке', icon: <Plus className="w-4 h-4" /> },
        { label: 'Разбить выпуск на 2 недели', icon: <Repeat className="w-4 h-4" /> },
        { label: 'Снизить план', icon: <Minus className="w-4 h-4" /> }
      ]
    },
    {
      id: '2',
      type: 'warning',
      category: 'policy',
      title: 'Электросталь уже имеет покрытие 38 дней — ограничение 35 дней',
      impact: 'Нарушение правила "Не отгружать если покрытие >35 дней"',
      solution: 'Убрать эту отгрузку',
      resolved: false,
      solutions: [
        { label: 'Убрать эту отгрузку', icon: <XCircle className="w-4 h-4" /> },
        { label: 'Перенаправить часть в Казань', icon: <Repeat className="w-4 h-4" /> }
      ]
    },
    {
      id: '3',
      type: 'warning',
      category: 'general',
      title: 'Перегруз производства: W3 = 110%',
      impact: 'Превышение лимита 1800 шт/неделя',
      solution: 'Применить оптимизацию',
      resolved: false
    }
  ]);

  const okItems = [
    'План отгрузок готов',
    'Производство в срок',
    'Задачи сформированы'
  ];

  const resolveConflict = (id: string) => {
    setConflicts(conflicts.map(conflict => 
      conflict.id === id ? { ...conflict, resolved: !conflict.resolved } : conflict
    ));
  };

  const unresolvedConflicts = conflicts.filter(c => !c.resolved);
  const policyConflicts = conflicts.filter(c => c.category === 'policy');
  const generalConflicts = conflicts.filter(c => c.category === 'general');
  const canProceed = unresolvedConflicts.length === 0;

  return (
    <div className="autopilot-review">
      {/* Header */}
      <div className="autopilot-review__header">
        <div className="autopilot-review__header-top">
          <div className="autopilot-review__badge">
            <Sparkles className="w-4 h-4" />
            <span>AI</span>
          </div>
        </div>
        <h1 className="autopilot-review__title">Проверка перед запуском</h1>
        <p className="autopilot-review__subtitle">
          {unresolvedConflicts.length > 0 
            ? `AI нашёл конфликты и предлагает решения. Исправьте ${unresolvedConflicts.length} ${unresolvedConflicts.length === 1 ? 'конфликт' : 'конфликта'}, чтобы план сработал без сюрпризов.`
            : 'Всё готово к запуску. Конфликты разрешены.'
          }
        </p>
      </div>

      <div className="autopilot-review__content">
        {/* Секция конфликтов с политиками */}
        {policyConflicts.length > 0 && (
          <div className="autopilot-review__section">
            <h2 className="autopilot-review__section-title">
              <Shield className="w-5 h-5 text-amber-600" />
              Конфликты с ограничениями
              {policyConflicts.filter(c => !c.resolved).length > 0 && (
                <span className="autopilot-review__count">
                  {policyConflicts.filter(c => !c.resolved).length}
                </span>
              )}
            </h2>
            <p className="autopilot-review__section-desc">
              План нарушает правила, которые вы установили
            </p>

            <div className="autopilot-conflicts">
              {policyConflicts.map(conflict => (
                <div 
                  key={conflict.id} 
                  className={`autopilot-conflict ${conflict.resolved ? 'autopilot-conflict--resolved' : ''}`}
                >
                  <div className="autopilot-conflict__header">
                    <div className="autopilot-conflict__icon-wrapper">
                      {conflict.resolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : conflict.type === 'error' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div className="autopilot-conflict__content">
                      <div className="autopilot-conflict__title">
                        {conflict.title}
                      </div>
                      <div className="autopilot-conflict__impact">
                        {conflict.impact}
                      </div>
                    </div>
                  </div>
                  
                  <div className="autopilot-conflict__actions">
                    {!conflict.resolved ? (
                      conflict.solutions ? (
                        conflict.solutions.map((sol, idx) => (
                          <button 
                            key={idx}
                            className="autopilot-conflict__btn"
                            onClick={() => resolveConflict(conflict.id)}
                          >
                            {sol.icon}
                            {sol.label}
                          </button>
                        ))
                      ) : (
                        <button 
                          className="autopilot-conflict__btn"
                          onClick={() => resolveConflict(conflict.id)}
                        >
                          {conflict.id === '1' && <Plus className="w-4 h-4" />}
                          {conflict.id === '2' && <TrendingUp className="w-4 h-4" />}
                          {conflict.solution}
                        </button>
                      )
                    ) : (
                      <button 
                        className="autopilot-conflict__btn autopilot-conflict__btn--undo"
                        onClick={() => resolveConflict(conflict.id)}
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Секция общих конфликтов */}
        {generalConflicts.length > 0 && (
          <div className="autopilot-review__section">
            <h2 className="autopilot-review__section-title">
              Общие конфликты
              {generalConflicts.filter(c => !c.resolved).length > 0 && (
                <span className="autopilot-review__count">
                  {generalConflicts.filter(c => !c.resolved).length}
                </span>
              )}
            </h2>

            <div className="autopilot-conflicts">
              {generalConflicts.map(conflict => (
                <div 
                  key={conflict.id} 
                  className={`autopilot-conflict ${conflict.resolved ? 'autopilot-conflict--resolved' : ''}`}
                >
                  <div className="autopilot-conflict__header">
                    <div className="autopilot-conflict__icon-wrapper">
                      {conflict.resolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : conflict.type === 'error' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div className="autopilot-conflict__content">
                      <div className="autopilot-conflict__title">
                        {conflict.title}
                      </div>
                      <div className="autopilot-conflict__impact">
                        Влияние: {conflict.impact}
                      </div>
                    </div>
                  </div>
                  
                  <div className="autopilot-conflict__actions">
                    {!conflict.resolved ? (
                      <button 
                        className="autopilot-conflict__btn"
                        onClick={() => resolveConflict(conflict.id)}
                      >
                        {conflict.id === '3' && <TrendingUp className="w-4 h-4" />}
                        {conflict.solution}
                      </button>
                    ) : (
                      <button 
                        className="autopilot-conflict__btn autopilot-conflict__btn--undo"
                        onClick={() => resolveConflict(conflict.id)}
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Секция OK */}
        <div className="autopilot-review__section">
          <h2 className="autopilot-review__section-title autopilot-review__section-title--success">
            Готово к запуску
          </h2>
          
          <div className="autopilot-ok">
            {okItems.map((item, index) => (
              <div key={index} className="autopilot-ok__item">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="autopilot-review__footer">
        <button 
          className="autopilot-review__btn autopilot-review__btn--secondary"
          onClick={() => navigate('/autopilot/setup')}
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться к настройкам
        </button>
        <button 
          className={`autopilot-review__btn autopilot-review__btn--primary ${!canProceed ? 'autopilot-review__btn--disabled' : ''}`}
          onClick={() => canProceed && navigate('/autopilot/running')}
          disabled={!canProceed}
        >
          Запустить автопилот
        </button>
      </div>

      {!canProceed && (
        <div className="autopilot-review__hint">
          Разрешите все конфликты, чтобы продолжить
        </div>
      )}
    </div>
  );
}

export default AutopilotReview;