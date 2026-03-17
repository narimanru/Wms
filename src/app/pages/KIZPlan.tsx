import { useNavigate } from 'react-router';
import { ArrowLeft, Tag, Sparkles } from 'lucide-react';
import '../../styles/kiz-plan.css';

function KIZPlan() {
  const navigate = useNavigate();

  const kizData = [
    {
      id: '1',
      sku: 'Long Sleeve',
      size: 'M',
      current: 30,
      needed: 55,
      deficit: 25,
      reason: 'Производство'
    },
    {
      id: '2',
      sku: 'Top Basic',
      size: 'L',
      current: 60,
      needed: 110,
      deficit: 50,
      reason: 'Отгрузка + производство'
    },
    {
      id: '3',
      sku: 'Pants Rib',
      size: 'M',
      current: 120,
      needed: 200,
      deficit: 80,
      reason: 'Отгрузка'
    }
  ];

  return (
    <div className="kiz-plan">
      <div className="kiz-plan__header">
        <button className="kiz-plan__back" onClick={() => navigate('/planner')}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="kiz-plan__header-content">
          <div className="kiz-plan__title-wrapper">
            <Tag className="w-6 h-6 text-emerald-600" />
            <h1 className="kiz-plan__title">План КИЗ</h1>
            <span className="ai-badge">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </div>
          <p className="kiz-plan__subtitle">
            Сколько кодов купить под производство и отгрузки.
          </p>
        </div>
      </div>

      <div className="kiz-plan__table-card">
        <div className="kiz-plan__table-container">
          <table className="kiz-plan__table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Размер</th>
                <th>Остаток КИЗ</th>
                <th>Нужно КИЗ (30 дней)</th>
                <th>Дефицит</th>
                <th>Причина</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {kizData.map((item) => (
                <tr key={item.id}>
                  <td><div className="kiz-plan__sku">{item.sku}</div></td>
                  <td><span className="kiz-plan__size">{item.size}</span></td>
                  <td><span className="kiz-plan__current">{item.current}</span></td>
                  <td><span className="kiz-plan__needed">{item.needed}</span></td>
                  <td><span className="kiz-plan__deficit">{item.deficit}</span></td>
                  <td><span className="kiz-plan__reason">{item.reason}</span></td>
                  <td>
                    <button className="kiz-plan__action-btn">
                      Купить КИЗ
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

export default KIZPlan;
