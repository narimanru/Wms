import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed';
}

function AutopilotRunning() {
  const navigate = useNavigate();
  
  const [steps, setSteps] = useState<Step[]>([
    {
      id: '1',
      label: 'Созданы черновики поставок WB (3)',
      status: 'pending'
    },
    {
      id: '2',
      label: 'Созданы заказы в производство (4)',
      status: 'pending'
    },
    {
      id: '3',
      label: 'Сформирован список закупки КИЗ (2)',
      status: 'pending'
    },
    {
      id: '4',
      label: 'Созданы задачи складу/фулфилменту (12)',
      status: 'pending'
    }
  ]);

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate step-by-step execution
    const timers: NodeJS.Timeout[] = [];

    steps.forEach((step, index) => {
      // Start each step
      const startTimer = setTimeout(() => {
        setSteps(prev => prev.map((s, i) => 
          i === index ? { ...s, status: 'running' } : s
        ));
      }, index * 1500);
      timers.push(startTimer);

      // Complete each step
      const completeTimer = setTimeout(() => {
        setSteps(prev => prev.map((s, i) => 
          i === index ? { ...s, status: 'completed' } : s
        ));
        
        // If last step, mark as complete
        if (index === steps.length - 1) {
          setTimeout(() => setIsComplete(true), 300);
        }
      }, index * 1500 + 1000);
      timers.push(completeTimer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="autopilot-running">
      {/* Header */}
      <div className="autopilot-running__header">
        <div className="autopilot-running__header-top">
          <div className="autopilot-running__badge">
            <Sparkles className="w-4 h-4" />
            <span>AI</span>
          </div>
        </div>
        <h1 className="autopilot-running__title">
          {isComplete ? 'Пакет действий создан' : 'Создаём пакет действий...'}
        </h1>
        <p className="autopilot-running__subtitle">
          {isComplete 
            ? 'Все действия успешно сформированы и готовы к работе'
            : 'AI автоматически формирует задачи, заказы и поставки'
          }
        </p>
      </div>

      <div className="autopilot-running__content">
        {/* Progress Bar */}
        <div className="autopilot-progress">
          <div className="autopilot-progress__bar">
            <div 
              className="autopilot-progress__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="autopilot-progress__text">
            {completedSteps} из {steps.length} шагов выполнено
          </div>
        </div>

        {/* Steps List */}
        <div className="autopilot-steps">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`autopilot-step ${step.status === 'completed' ? 'autopilot-step--completed' : ''} ${step.status === 'running' ? 'autopilot-step--running' : ''}`}
            >
              <div className="autopilot-step__icon">
                {step.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : step.status === 'running' ? (
                  <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                ) : (
                  <div className="autopilot-step__number">{index + 1}</div>
                )}
              </div>
              <div className="autopilot-step__label">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {isComplete && (
        <div className="autopilot-running__footer">
          <button 
            className="autopilot-running__btn autopilot-running__btn--primary"
            onClick={() => navigate('/autopilot/result')}
          >
            Открыть результат
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            className="autopilot-running__btn autopilot-running__btn--link"
            onClick={() => navigate('/autopilot/objects')}
          >
            Посмотреть созданные объекты
          </button>
        </div>
      )}
    </div>
  );
}

export default AutopilotRunning;
