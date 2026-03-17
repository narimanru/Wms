import { useNavigate } from 'react-router';
import { Sparkles, Package, Factory, Tag, CheckSquare, ArrowRight, ExternalLink, Shield } from 'lucide-react';

interface ResultCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  count: string;
  description: string;
  link: string;
  buttonText: string;
}

function AutopilotResult() {
  const navigate = useNavigate();
  
  const results: ResultCard[] = [
    {
      id: 'shipments',
      icon: <Package className="w-6 h-6" />,
      title: 'Поставки WB',
      count: '3 черновика',
      description: 'Готовы к утверждению и отправке на склады',
      link: '/autopilot/objects?tab=shipments',
      buttonText: 'Открыть план отгрузок'
    },
    {
      id: 'production',
      icon: <Factory className="w-6 h-6" />,
      title: 'Производство',
      count: '4 заказа',
      description: 'С дедлайнами и распределением по неделям',
      link: '/autopilot/objects?tab=production',
      buttonText: 'Открыть заказы'
    },
    {
      id: 'kiz',
      icon: <Tag className="w-6 h-6" />,
      title: 'КИЗ',
      count: '2 позиции к покупке (420 шт)',
      description: 'Список кодов маркировки для заказа',
      link: '/autopilot/objects?tab=kiz',
      buttonText: 'Открыть список КИЗ'
    },
    {
      id: 'tasks',
      icon: <CheckSquare className="w-6 h-6" />,
      title: 'Задачи фулфилменту',
      count: '12 задач назначено',
      description: 'Печать, упаковка, сборка с дедлайнами',
      link: '/autopilot/objects?tab=tasks',
      buttonText: 'Открыть задачи'
    }
  ];

  const nextSteps = [
    'Утвердите черновики поставок и распечатайте задания',
    'Запустите производство по дедлайнам',
    'Купите КИЗ до W3'
  ];

  return (
    <div className="autopilot-result">
      {/* Header */}
      <div className="autopilot-result__header">
        <div className="autopilot-result__header-top">
          <div className="autopilot-result__badge">
            <Sparkles className="w-4 h-4" />
            <span>AI</span>
          </div>
        </div>
        <h1 className="autopilot-result__title">Готово. Автопилот создал действия</h1>
        <p className="autopilot-result__subtitle">
          Теперь вы можете отправить поставки, запустить производство и контролировать выполнение.
        </p>
      </div>

      <div className="autopilot-result__content">
        {/* Result Cards */}
        <div className="autopilot-result__cards">
          {results.map(result => (
            <div key={result.id} className="autopilot-result-card">
              <div className="autopilot-result-card__icon">
                {result.icon}
              </div>
              <div className="autopilot-result-card__content">
                <h3 className="autopilot-result-card__title">{result.title}</h3>
                <div className="autopilot-result-card__count">{result.count}</div>
                <p className="autopilot-result-card__description">{result.description}</p>
              </div>
              <button 
                className="autopilot-result-card__btn"
                onClick={() => navigate(result.link)}
              >
                {result.buttonText}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="autopilot-result__next">
          <h2 className="autopilot-result__next-title">Что дальше?</h2>
          <div className="autopilot-result__next-list">
            {nextSteps.map((step, index) => (
              <div key={index} className="autopilot-result__next-item">
                <div className="autopilot-result__next-number">{index + 1}</div>
                <span>{step}</span>
              </div>
            ))}
          </div>
          
          <button 
            className="autopilot-result__policy-link"
            onClick={() => navigate('/autopilot/policy-explanation')}
          >
            <Shield className="w-4 h-4" />
            Почему AI так спланировал
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="autopilot-result__footer">
        <button 
          className="autopilot-result__btn autopilot-result__btn--secondary"
          onClick={() => navigate('/planner')}
        >
          Вернуться к планировщику
        </button>
        <button 
          className="autopilot-result__btn autopilot-result__btn--primary"
          onClick={() => navigate('/autopilot/objects')}
        >
          Управление объектами
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default AutopilotResult;