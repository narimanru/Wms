import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, CheckCircle, Package2, Factory, Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import '../../styles/production.css';

function ProductionOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="production-order-detail">
      {/* Header */}
      <div className="production-order-detail__header">
        <button 
          className="production-order-detail__back-btn"
          onClick={() => navigate('/production-orders')}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="production-order-detail__header-info">
          <div>
            <h1 className="production-order-detail__title">PO-2026-00041</h1>
            <p className="production-order-detail__subtitle">
              Kyrgyz Sewing #1 • Весна 2026
            </p>
          </div>
          <span className="production-order-detail__status production-order-detail__status--in-progress">
            В производстве
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="production-order-detail__actions">
        <button className="production-order-detail__action-btn production-order-detail__action-btn--primary">
          <CheckCircle className="w-4 h-4" />
          Утвердить
        </button>
        <button className="production-order-detail__action-btn">
          Отправить фабрике
        </button>
        <button className="production-order-detail__action-btn">
          Добавить оплату
        </button>
        <button className="production-order-detail__action-btn">
          Создать приёмку
        </button>
        <button className="production-order-detail__action-btn">
          Создать отгрузку на WB
        </button>
      </div>

      {/* Summary Cards */}
      <div className="production-order-detail__summary">
        <div className="production-order-detail__card">
          <Package2 className="w-8 h-8 text-blue-500" />
          <div>
            <div className="production-order-detail__card-label">Количество</div>
            <div className="production-order-detail__card-value">1,050 шт</div>
          </div>
        </div>

        <div className="production-order-detail__card">
          <DollarSign className="w-8 h-8 text-emerald-500" />
          <div>
            <div className="production-order-detail__card-label">Сумма заказа</div>
            <div className="production-order-detail__card-value">1,980,000 ₽</div>
          </div>
        </div>

        <div className="production-order-detail__card">
          <Calendar className="w-8 h-8 text-amber-500" />
          <div>
            <div className="production-order-detail__card-label">Готовность</div>
            <div className="production-order-detail__card-value">25 марта 2026</div>
          </div>
        </div>

        <div className="production-order-detail__card">
          <Tag className="w-8 h-8 text-purple-500" />
          <div>
            <div className="production-order-detail__card-label">КИЗ статус</div>
            <div className="production-order-detail__card-value">Дефицит 25</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="production-order-detail__tabs">
        <button className="production-order-detail__tab production-order-detail__tab--active">
          Состав
        </button>
        <button className="production-order-detail__tab">
          Материалы
        </button>
        <button className="production-order-detail__tab">
          Статусы работ
        </button>
        <button className="production-order-detail__tab">
          Финансы
        </button>
        <button className="production-order-detail__tab">
          Документы
        </button>
        <button className="production-order-detail__tab">
          Маркировка (КИЗ)
        </button>
      </div>

      {/* Content */}
      <div className="production-order-detail__content">
        <div className="production-order-detail__table-wrapper">
          <table className="production-order-detail__table">
            <thead>
              <tr>
                <th>SKU / Наименование</th>
                <th>Размер</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Сумма</th>
                <th>КИЗ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="production-order-detail__product">
                    <div className="production-order-detail__product-name">Pants Rib</div>
                    <div className="production-order-detail__product-sku">Pants-Rib-Black</div>
                  </div>
                </td>
                <td><span className="production-order-detail__size-badge">S</span></td>
                <td>300</td>
                <td>1,800 ₽</td>
                <td>540,000 ₽</td>
                <td><span className="production-order-detail__kiz-status production-order-detail__kiz-status--ok">300</span></td>
              </tr>
              <tr>
                <td>
                  <div className="production-order-detail__product">
                    <div className="production-order-detail__product-name">Pants Rib</div>
                    <div className="production-order-detail__product-sku">Pants-Rib-Black</div>
                  </div>
                </td>
                <td><span className="production-order-detail__size-badge">M</span></td>
                <td>400</td>
                <td>1,800 ₽</td>
                <td>720,000 ₽</td>
                <td><span className="production-order-detail__kiz-status production-order-detail__kiz-status--deficit">375 (-25)</span></td>
              </tr>
              <tr>
                <td>
                  <div className="production-order-detail__product">
                    <div className="production-order-detail__product-name">Pants Rib</div>
                    <div className="production-order-detail__product-sku">Pants-Rib-Black</div>
                  </div>
                </td>
                <td><span className="production-order-detail__size-badge">L</span></td>
                <td>300</td>
                <td>1,800 ₽</td>
                <td>540,000 ₽</td>
                <td><span className="production-order-detail__kiz-status production-order-detail__kiz-status--ok">300</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductionOrderDetail;