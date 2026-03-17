import { useNavigate } from 'react-router';
import { Sparkles, Shield, CheckCircle2, Info, ArrowLeft } from 'lucide-react';

interface PolicyRule {
  id: string;
  rule: string;
  impact: string;
  type: 'applied' | 'considered' | 'skipped';
}

function PolicyExplanation() {
  const navigate = useNavigate();

  const appliedRules: PolicyRule[] = [
    {
      id: '1',
      rule: 'Не отгружать >35 дней покрытия',
      impact: 'Электросталь исключена из плана отгрузок',
      type: 'applied'
    },
    {
      id: '2',
      rule: 'Не запускать производство без КИЗ',
      impact: 'Добавлена закупка 25 КИЗ для Long Sleeve M',
      type: 'applied'
    },
    {
      id: '3',
      rule: 'Мин. партия 100 шт',
      impact: 'Размеры S/XS объединены в одну партию 120 шт',
      type: 'applied'
    },
    {
      id: '4',
      rule: 'Макс. выпуск 1800/неделя',
      impact: 'Производство Pants Rib L перенесено на W4',
      type: 'applied'
    },
    {
      id: '5',
      rule: 'Приоритет складов: Краснодар → Казань',
      impact: 'Краснодар получил приоритет при распределении',
      type: 'applied'
    }
  ];

  const consideredRules: PolicyRule[] = [
    {
      id: '6',
      rule: 'Блокировать план, если нет ткани',
      impact: 'Отключено в настройках',
      type: 'skipped'
    }
  ];

  return (
    <div className="policy-explanation">
      {/* Header */}
      <div className="policy-explanation__header">
        <div className="policy-explanation__header-top">
          <div className="policy-explanation__badge">
            <Shield className="w-4 h-4" />
            <span>Политики</span>
          </div>
        </div>
        <h1 className="policy-explanation__title">Почему AI так спланировал</h1>
        <p className="policy-explanation__subtitle">
          AI работает по вашим правилам — без сюрпризов. Вот какие ограничения повлияли на план.
        </p>
      </div>

      <div className="policy-explanation__content">
        {/* Applied Rules */}
        <div className="policy-explanation__section">
          <div className="policy-explanation__section-header">
            <h2 className="policy-explanation__section-title">
              Применённые правила
              <span className="policy-explanation__count">{appliedRules.length}</span>
            </h2>
            <p className="policy-explanation__section-desc">
              Эти ограничения были учтены при формировании плана
            </p>
          </div>

          <div className="policy-explanation__rules">
            {appliedRules.map((rule) => (
              <div key={rule.id} className="policy-rule">
                <div className="policy-rule__icon">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="policy-rule__content">
                  <div className="policy-rule__title">{rule.rule}</div>
                  <div className="policy-rule__impact">
                    <span className="policy-rule__impact-label">Влияние:</span>
                    {rule.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skipped Rules */}
        {consideredRules.length > 0 && (
          <div className="policy-explanation__section">
            <div className="policy-explanation__section-header">
              <h2 className="policy-explanation__section-title policy-explanation__section-title--muted">
                Неактивные правила
              </h2>
              <p className="policy-explanation__section-desc">
                Эти ограничения не применялись
              </p>
            </div>

            <div className="policy-explanation__rules">
              {consideredRules.map((rule) => (
                <div key={rule.id} className="policy-rule policy-rule--muted">
                  <div className="policy-rule__icon">
                    <Info className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="policy-rule__content">
                    <div className="policy-rule__title">{rule.rule}</div>
                    <div className="policy-rule__impact">{rule.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="policy-explanation__info-box">
          <div className="policy-explanation__info-icon">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="policy-explanation__info-content">
            <div className="policy-explanation__info-title">
              AI не "угадывает" — следует правилам
            </div>
            <div className="policy-explanation__info-text">
              Все решения основаны на ваших ограничениях. Если правило конфликтует с планом, мы покажем это на этапе проверки.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="policy-explanation__footer">
        <button 
          className="policy-explanation__btn policy-explanation__btn--secondary"
          onClick={() => navigate('/autopilot/constraints')}
        >
          Изменить ограничения
        </button>
        <button 
          className="policy-explanation__btn policy-explanation__btn--primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
      </div>
    </div>
  );
}

export default PolicyExplanation;
