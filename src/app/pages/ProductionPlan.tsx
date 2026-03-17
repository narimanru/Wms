import { useNavigate } from 'react-router';
import { ArrowLeft, Factory, Sparkles, AlertTriangle } from 'lucide-react';
import '../../styles/production-plan.css';

function ProductionPlan() {
  const navigate = useNavigate();

  const production = [
    {
      id: '1',
      sku: 'Pants Rib',
      size: 'M',
      forecast30d: 360,
      available: 260,
      wip: 120,
      needProduce: 200,
      startDate: 'сегодня',
      deadline: '25 марта',
      kizNeeded: 200
    },
    {
      id: '2',
      sku: 'Long Sleeve',
      size: 'M',
      forecast30d: 180,
      available: 80,
      wip: 80,
      needProduce: 120,
      startDate: 'сегодня',
      deadline: '22 марта',
      kizNeeded: 120
    },
    {
      id: '3',
      sku: 'Top Basic',
      size: 'L',
      forecast30d: 180,
      available: 110,
      wip: 0,
      needProduce: 150,
      startDate: 'сегодня',
      deadline: '23 марта',
      kizNeeded: 150
    }
  ];

  return (
    <div className="production-plan">
      <div className="production-plan__header">
        <button className="production-plan__back" onClick={() => navigate('/planner')}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="production-plan__header-content">
          <div className="production-plan__title-wrapper">
            <Factory className="w-6 h-6 text-emerald-600" />
            <h1 className="production-plan__title">План производства на 30 дней</h1>
            <span className="ai-badge">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </div>
          <p className="production-plan__subtitle">
            Сколько произвести, чтобы покрыть спрос и план отгрузок.
          </p>
        </div>
      </div>

      <div className="production-plan__risks">
        <AlertTriangle className="w-5 h-5 text-amber-600" />
        <div>
          <div className="production-plan__risks-item">
            ⚠️ Если запуск позже 3 дней — Краснодар уйдёт в OOS
          </div>
          <div className="production-plan__risks-item">
            ⚠️ Не хватает КИЗ для Long Sleeve M: дефицит 25{' '}
            <button 
              className="production-plan__risks-link"
              onClick={() => navigate('/planner/kiz')}
            >
              (открыть план КИЗ)
            </button>
          </div>
        </div>
      </div>

      <div className="production-plan__table-card">
        <div className="production-plan__table-container">
          <table className="production-plan__table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Размер</th>
                <th>Прогноз 30д</th>
                <th>Доступно</th>
                <th>В производстве</th>
                <th>Нужно произвести</th>
                <th>Старт</th>
                <th>Дедлайн</th>
                <th>КИЗ нужно</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {production.map((item) => (
                <tr key={item.id}>
                  <td><div className="production-plan__sku">{item.sku}</div></td>
                  <td><span className="production-plan__size">{item.size}</span></td>
                  <td><span className="production-plan__forecast">{item.forecast30d} шт</span></td>
                  <td><span className="production-plan__available">{item.available} шт</span></td>
                  <td><span className="production-plan__wip">{item.wip} шт</span></td>
                  <td><span className="production-plan__need">{item.needProduce} шт</span></td>
                  <td><span className="production-plan__date">{item.startDate}</span></td>
                  <td><span className="production-plan__deadline">{item.deadline}</span></td>
                  <td><span className="production-plan__kiz">{item.kizNeeded}</span></td>
                  <td>
                    <button className="production-plan__action-btn">
                      Создать заказ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductionPlan;
