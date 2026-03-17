import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Save, Check, Plus, Info, Sparkles, Calendar, DollarSign, Factory, Package2, Box, ClipboardCheck, FileCheck, XCircle, AlertTriangle } from 'lucide-react';
import '../../styles/production.css';

interface OrderData {
  orderNumber: string;
  factory: string;
  organization: string;
  season: string;
  orderType: 'production' | 'reorder' | 'relabeling';
  plannedDate: string;
  startDate: string;
  prepaymentPercent: number;
  prepaymentAmount: number;
  currency: string;
  linkedToPlan: boolean;
  planName: string;
  planReason: string;
}

interface OrderItem {
  id: string;
  sku: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  kizNeeded: number;
  kizStatus: 'ok' | 'deficit';
  comment: string;
}

interface Material {
  id: string;
  name: string;
  supplierArticle: string;
  normPer: number;
  totalNeeded: number;
  inStock: number;
  deficit: number;
  supplier: string;
  eta: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  responsible: string;
  status: 'pending' | 'in_progress' | 'completed';
}

function CreateProductionOrder() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [orderData, setOrderData] = useState<OrderData>({
    orderNumber: 'PO-2026-00041',
    factory: '',
    organization: 'Kamilek',
    season: '',
    orderType: 'production',
    plannedDate: '',
    startDate: '',
    prepaymentPercent: 30,
    prepaymentAmount: 0,
    currency: 'RUB',
    linkedToPlan: true,
    planName: 'Весна 2026 / 30 дней',
    planReason: 'Пополнение WB Краснодар / дефицит размеров M/L'
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: '1',
      sku: 'Pants-Rib-Black',
      name: 'Pants Rib',
      color: 'Чёрный',
      size: 'S',
      quantity: 300,
      price: 1800,
      kizNeeded: 300,
      kizStatus: 'ok',
      comment: ''
    },
    {
      id: '2',
      sku: 'Pants-Rib-Black',
      name: 'Pants Rib',
      color: 'Чёрный',
      size: 'M',
      quantity: 400,
      price: 1800,
      kizNeeded: 400,
      kizStatus: 'deficit',
      comment: 'Дефицит КИЗ: 25 шт'
    },
    {
      id: '3',
      sku: 'Pants-Rib-Black',
      name: 'Pants Rib',
      color: 'Чёрный',
      size: 'L',
      quantity: 300,
      price: 1800,
      kizNeeded: 300,
      kizStatus: 'ok',
      comment: ''
    }
  ]);

  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      name: 'Rib cotton',
      supplierArticle: 'RIB-001-BLK',
      normPer: 0.9,
      totalNeeded: 980,
      inStock: 760,
      deficit: 220,
      supplier: 'Текстиль Импорт',
      eta: '15 марта 2026'
    },
    {
      id: '2',
      name: 'Эластан лента',
      supplierArticle: 'ELA-002',
      normPer: 0.15,
      totalNeeded: 165,
      inStock: 200,
      deficit: 0,
      supplier: 'Фурнитура Плюс',
      eta: ''
    }
  ]);

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: '1', name: 'Крой', startDate: '10.03.2026', endDate: '12.03.2026', responsible: 'Иванов А.', status: 'pending' },
    { id: '2', name: 'Пошив', startDate: '13.03.2026', endDate: '20.03.2026', responsible: 'Бригада #1', status: 'pending' },
    { id: '3', name: 'ВТО', startDate: '21.03.2026', endDate: '22.03.2026', responsible: 'Петров С.', status: 'pending' },
    { id: '4', name: 'ОТК', startDate: '23.03.2026', endDate: '23.03.2026', responsible: 'Контроль качества', status: 'pending' },
    { id: '5', name: 'Упаковка', startDate: '24.03.2026', endDate: '24.03.2026', responsible: 'Упаковка', status: 'pending' },
    { id: '6', name: 'Маркировка/наклейка', startDate: '24.03.2026', endDate: '25.03.2026', responsible: 'Маркировка', status: 'pending' },
    { id: '7', name: 'Отгрузка', startDate: '25.03.2026', endDate: '25.03.2026', responsible: 'Логистика', status: 'pending' }
  ]);

  const [activeTab, setActiveTab] = useState<'materials' | 'accessories' | 'packaging'>('materials');

  const steps = [
    { number: 1, title: 'Основное', icon: Factory },
    { number: 2, title: 'Состав заказа', icon: Package2 },
    { number: 3, title: 'Материалы', icon: Box },
    { number: 4, title: 'План работ', icon: ClipboardCheck },
    { number: 5, title: 'Итоги', icon: FileCheck }
  ];

  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalKizNeeded = orderItems.reduce((sum, item) => sum + item.kizNeeded, 0);
  const totalKizDeficit = orderItems.filter(item => item.kizStatus === 'deficit').reduce((sum, item) => sum + 25, 0);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Создать заказ
      navigate('/production-orders/1');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/production-orders');
    }
  };

  const saveDraft = () => {
    alert('Черновик сохранён');
  };

  return (
    <div className="create-production-order">
      {/* Header */}
      <div className="create-production-order__header">
        <button 
          className="create-production-order__back-btn"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="create-production-order__title">Создать заказ на производство</h1>
          <p className="create-production-order__subtitle">
            {orderData.orderNumber} • Шаг {currentStep} из 5
          </p>
        </div>
        <button 
          className="create-production-order__draft-btn"
          onClick={saveDraft}
        >
          <Save className="w-4 h-4" />
          Сохранить черновик
        </button>
      </div>

      {/* Stepper */}
      <div className="create-production-order__stepper">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.number} 
              className={`create-production-order__step ${
                step.number === currentStep ? 'create-production-order__step--active' : ''
              } ${step.number < currentStep ? 'create-production-order__step--completed' : ''}`}
            >
              <div className="create-production-order__step-icon">
                {step.number < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="create-production-order__step-content">
                <div className="create-production-order__step-number">Шаг {step.number}</div>
                <div className="create-production-order__step-title">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="create-production-order__step-line"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="create-production-order__content">
        {/* Step 1 - Basics */}
        {currentStep === 1 && (
          <div className="create-production-order__step-content-wrapper">
            <h2 className="create-production-order__section-title">Основная информация</h2>
            
            <div className="create-production-order__form">
              <div className="create-production-order__form-row">
                <div className="create-production-order__form-group">
                  <label className="create-production-order__label">Номер заказа</label>
                  <input
                    type="text"
                    value={orderData.orderNumber}
                    disabled
                    className="create-production-order__input create-production-order__input--disabled"
                  />
                  <span className="create-production-order__hint">Генерируется автоматически</span>
                </div>

                <div className="create-production-order__form-group">
                  <label className="create-production-order__label">Фабрика / Подрядчик</label>
                  <div className="create-production-order__input-with-btn">
                    <select
                      value={orderData.factory}
                      onChange={(e) => setOrderData({ ...orderData, factory: e.target.value })}
                      className="create-production-order__select"
                    >
                      <option value="">Выберите фабрику</option>
                      <option value="kyrgyz">Kyrgyz Sewing #1</option>
                      <option value="turkey">Турецкая фабрика Tekstil Pro</option>
                      <option value="uzbek">Узбекистан Textile</option>
                    </select>
                    <button className="create-production-order__add-btn">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="create-production-order__form-row">
                <div className="create-production-order__form-group">
                  <label className="create-production-order__label">Сезон / Коллекция</label>
                  <select
                    value={orderData.season}
                    onChange={(e) => setOrderData({ ...orderData, season: e.target.value })}
                    className="create-production-order__select"
                  >
                    <option value="">Выберите сезон</option>
                    <option value="spring2026">Весна 2026</option>
                    <option value="summer2026">Лето 2026</option>
                    <option value="autumn2026">Осень 2026</option>
                    <option value="winter2026">Зима 2026</option>
                  </select>
                </div>

                <div className="create-production-order__form-group">
                  <label className="create-production-order__label">Тип заказа</label>
                  <div className="create-production-order__chips">
                    <button
                      className={`create-production-order__chip ${orderData.orderType === 'production' ? 'create-production-order__chip--active' : ''}`}
                      onClick={() => setOrderData({ ...orderData, orderType: 'production' })}
                    >
                      Производство (пошив)
                    </button>
                    <button
                      className={`create-production-order__chip ${orderData.orderType === 'reorder' ? 'create-production-order__chip--active' : ''}`}
                      onClick={() => setOrderData({ ...orderData, orderType: 'reorder' })}
                    >
                      Дозаказ
                    </button>
                    <button
                      className={`create-production-order__chip ${orderData.orderType === 'relabeling' ? 'create-production-order__chip--active' : ''}`}
                      onClick={() => setOrderData({ ...orderData, orderType: 'relabeling' })}
                    >
                      Перемаркировка
                    </button>
                  </div>
                </div>
              </div>

              <div className="create-production-order__form-row">
                <div className="create-production-order__form-group">
                  <label className="create-production-order__label">Дата старта</label>
                  <input
                    type="date"
                    value={orderData.startDate}
                    onChange={(e) => setOrderData({ ...orderData, startDate: e.target.value })}
                    className="create-production-order__input"
                  />
                </div>

                <div className="create-production-order__form-group">
                  <label className="create-production-order__label">Плановая дата готовности</label>
                  <input
                    type="date"
                    value={orderData.plannedDate}
                    onChange={(e) => setOrderData({ ...orderData, plannedDate: e.target.value })}
                    className="create-production-order__input"
                  />
                </div>
              </div>

              <div className="create-production-order__form-row">
                <div className="create-production-order__form-group">
                  <label className="create-production-order__label">Предоплата (%)</label>
                  <input
                    type="number"
                    value={orderData.prepaymentPercent}
                    onChange={(e) => setOrderData({ ...orderData, prepaymentPercent: parseInt(e.target.value) })}
                    className="create-production-order__input"
                  />
                </div>

                <div className="create-production-order__form-group">
                  <label className="create-production-order__label">Валюта</label>
                  <select
                    value={orderData.currency}
                    onChange={(e) => setOrderData({ ...orderData, currency: e.target.value })}
                    className="create-production-order__select"
                  >
                    <option value="RUB">RUB (₽)</option>
                    <option value="USD">USD ($)</option>
                    <option value="THB">THB (฿)</option>
                  </select>
                </div>
              </div>

              {/* AI Plan Link */}
              <div className="create-production-order__plan-link">
                <div className="create-production-order__plan-link-header">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h3 className="create-production-order__plan-link-title">Связь с AI-планом</h3>
                  <label className="create-production-order__toggle">
                    <input
                      type="checkbox"
                      checked={orderData.linkedToPlan}
                      onChange={(e) => setOrderData({ ...orderData, linkedToPlan: e.target.checked })}
                    />
                    <span className="create-production-order__toggle-slider"></span>
                  </label>
                </div>
                
                {orderData.linkedToPlan && (
                  <div className="create-production-order__plan-link-content">
                    <div className="create-production-order__form-group">
                      <label className="create-production-order__label">План</label>
                      <select className="create-production-order__select">
                        <option>Весна 2026 / 30 дней</option>
                        <option>Лето 2026 / 14 дней</option>
                      </select>
                    </div>
                    <div className="create-production-order__plan-reason">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span>Причина: {orderData.planReason}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Order Items */}
        {currentStep === 2 && (
          <div className="create-production-order__step-content-wrapper">
            <h2 className="create-production-order__section-title">Состав заказа</h2>
            
            <div className="create-production-order__add-items">
              <button className="create-production-order__add-items-btn">
                <Plus className="w-4 h-4" />
                Добавить вручную
              </button>
              <button className="create-production-order__add-items-btn create-production-order__add-items-btn--ai">
                <Sparkles className="w-4 h-4" />
                Из AI-рекомендаций
              </button>
            </div>

            <div className="create-production-order__table-wrapper">
              <table className="create-production-order__table">
                <thead>
                  <tr>
                    <th>SKU / Наименование</th>
                    <th>Цвет</th>
                    <th>Размер</th>
                    <th>Кол-во</th>
                    <th>Цена за пошив</th>
                    <th>Сумма</th>
                    <th>КИЗ нужно</th>
                    <th>Статус КИЗ</th>
                    <th>Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="create-production-order__product-cell">
                          <Package2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="create-production-order__product-name">{item.name}</div>
                            <div className="create-production-order__product-sku">{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td>{item.color}</td>
                      <td><span className="create-production-order__size-badge">{item.size}</span></td>
                      <td><input type="number" value={item.quantity} onChange={() => {}} className="create-production-order__table-input" /></td>
                      <td>{item.price.toLocaleString()} ₽</td>
                      <td>{(item.quantity * item.price).toLocaleString()} ₽</td>
                      <td>{item.kizNeeded}</td>
                      <td>
                        {item.kizStatus === 'ok' ? (
                          <span className="create-production-order__status-badge create-production-order__status-badge--ok">В наличии</span>
                        ) : (
                          <span className="create-production-order__status-badge create-production-order__status-badge--deficit">Дефицит</span>
                        )}
                      </td>
                      <td><input type="text" value={item.comment} onChange={() => {}} placeholder="Комментарий" className="create-production-order__table-input" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="create-production-order__summary">
              <div className="create-production-order__summary-item">
                <span>Итого шт:</span>
                <strong>{totalItems.toLocaleString()}</strong>
              </div>
              <div className="create-production-order__summary-item">
                <span>Итого сумма:</span>
                <strong>{totalAmount.toLocaleString()} ₽</strong>
              </div>
              <div className="create-production-order__summary-item">
                <span>Итого КИЗ нужно:</span>
                <strong>{totalKizNeeded.toLocaleString()}</strong>
              </div>
            </div>

            {totalKizDeficit > 0 && (
              <div className="create-production-order__ai-hint">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <div className="create-production-order__ai-hint-title">Размер M самый дефицитный на WB — рекомендовано +120</div>
                  <div className="create-production-order__ai-hint-text">КИЗ дефицит {totalKizDeficit} — добавьте в план КИЗ</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3 - Materials */}
        {currentStep === 3 && (
          <div className="create-production-order__step-content-wrapper">
            <h2 className="create-production-order__section-title">Материалы, фурнитура, упаковка</h2>
            
            <div className="create-production-order__tabs">
              <button
                className={`create-production-order__tab ${activeTab === 'materials' ? 'create-production-order__tab--active' : ''}`}
                onClick={() => setActiveTab('materials')}
              >
                Материалы
              </button>
              <button
                className={`create-production-order__tab ${activeTab === 'accessories' ? 'create-production-order__tab--active' : ''}`}
                onClick={() => setActiveTab('accessories')}
              >
                Фурнитура
              </button>
              <button
                className={`create-production-order__tab ${activeTab === 'packaging' ? 'create-production-order__tab--active' : ''}`}
                onClick={() => setActiveTab('packaging')}
              >
                Упаковка/этикетки
              </button>
            </div>

            {activeTab === 'materials' && (
              <div>
                <div className="create-production-order__table-wrapper">
                  <table className="create-production-order__table">
                    <thead>
                      <tr>
                        <th>Материал (ткань)</th>
                        <th>Артикул поставщика</th>
                        <th>Норма расхода (м/шт)</th>
                        <th>Нужно (итого)</th>
                        <th>На складе</th>
                        <th>Дефицит</th>
                        <th>Поставщик</th>
                        <th>Дата поступления (ETA)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((material) => (
                        <tr key={material.id} className={material.deficit > 0 ? 'create-production-order__row--deficit' : ''}>
                          <td>{material.name}</td>
                          <td>{material.supplierArticle}</td>
                          <td>{material.normPer} м</td>
                          <td>{material.totalNeeded} м</td>
                          <td>{material.inStock} м</td>
                          <td>
                            {material.deficit > 0 ? (
                              <span className="create-production-order__deficit-text">{material.deficit} м</span>
                            ) : (
                              <span className="create-production-order__ok-text">—</span>
                            )}
                          </td>
                          <td>{material.supplier}</td>
                          <td>{material.eta || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {materials.some(m => m.deficit > 0) && (
                  <div className="create-production-order__material-actions">
                    <button className="create-production-order__material-btn create-production-order__material-btn--primary">
                      <Plus className="w-4 h-4" />
                      Создать заявку на закупку
                    </button>
                    <button className="create-production-order__material-btn">
                      Резервировать со склада
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'packaging' && (
              <div className="create-production-order__packaging">
                <div className="create-production-order__checkbox-group">
                  <label className="create-production-order__checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Пакет/зип-лок</span>
                  </label>
                  <label className="create-production-order__checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Стикер размера</span>
                  </label>
                  <label className="create-production-order__checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Бирка</span>
                  </label>
                  <label className="create-production-order__checkbox-label">
                    <input type="checkbox" />
                    <span>Инструкция/вкладыш</span>
                  </label>
                </div>

                <div className="create-production-order__marking-section">
                  <div className="create-production-order__marking-header">
                    <h3 className="create-production-order__marking-title">Маркировка</h3>
                    <label className="create-production-order__toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="create-production-order__toggle-slider"></span>
                    </label>
                  </div>
                  <div className="create-production-order__marking-content">
                    <div className="create-production-order__form-group">
                      <label className="create-production-order__label">КИЗ печатает</label>
                      <select className="create-production-order__select">
                        <option>Фабрика</option>
                        <option>Мы</option>
                        <option>Фулфилмент</option>
                      </select>
                    </div>
                    <div className="create-production-order__form-group">
                      <label className="create-production-order__label">Формат файла</label>
                      <select className="create-production-order__select">
                        <option>PDF</option>
                        <option>CSV</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4 - Workflow */}
        {currentStep === 4 && (
          <div className="create-production-order__step-content-wrapper">
            <h2 className="create-production-order__section-title">План работ и контроль качества</h2>
            
            <div className="create-production-order__workflow">
              <h3 className="create-production-order__workflow-title">Этапы производства</h3>
              <div className="create-production-order__workflow-steps">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="create-production-order__workflow-step">
                    <div className="create-production-order__workflow-step-number">{index + 1}</div>
                    <div className="create-production-order__workflow-step-content">
                      <div className="create-production-order__workflow-step-name">{step.name}</div>
                      <div className="create-production-order__workflow-step-details">
                        <div className="create-production-order__workflow-step-detail">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{step.startDate} — {step.endDate}</span>
                        </div>
                        <div className="create-production-order__workflow-step-detail">
                          <span>Ответственный: {step.responsible}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="create-production-order__qc">
              <h3 className="create-production-order__qc-title">Чек-лист контроля качества</h3>
              <div className="create-production-order__qc-items">
                <label className="create-production-order__qc-item">
                  <input type="checkbox" />
                  <span>Размерная сетка соблюдена</span>
                </label>
                <label className="create-production-order__qc-item">
                  <input type="checkbox" />
                  <span>Швы/дефекты</span>
                </label>
                <label className="create-production-order__qc-item">
                  <input type="checkbox" />
                  <span>Бирки/упаковка</span>
                </label>
                <label className="create-production-order__qc-item">
                  <input type="checkbox" />
                  <span>Маркировка наклеена корректно</span>
                </label>
                <label className="create-production-order__qc-item">
                  <input type="checkbox" />
                  <span>Скан DataMatrix проходит</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 5 - Review */}
        {currentStep === 5 && (
          <div className="create-production-order__step-content-wrapper">
            <h2 className="create-production-order__section-title">Итоги и создание</h2>
            
            <div className="create-production-order__summary-cards">
              <div className="create-production-order__summary-card">
                <div className="create-production-order__summary-card-label">Заказ</div>
                <div className="create-production-order__summary-card-value">{orderData.orderNumber}</div>
              </div>
              <div className="create-production-order__summary-card">
                <div className="create-production-order__summary-card-label">Итого</div>
                <div className="create-production-order__summary-card-value">{totalItems.toLocaleString()} шт / {totalAmount.toLocaleString()} ₽</div>
              </div>
              <div className="create-production-order__summary-card">
                <div className="create-production-order__summary-card-label">Готовность</div>
                <div className="create-production-order__summary-card-value">25 марта</div>
              </div>
              <div className="create-production-order__summary-card">
                <div className="create-production-order__summary-card-label">КИЗ</div>
                <div className="create-production-order__summary-card-value">
                  нужно {totalKizNeeded} / дефицит {totalKizDeficit}
                </div>
              </div>
            </div>

            {(totalKizDeficit > 0 || materials.some(m => m.deficit > 0)) && (
              <div className="create-production-order__risks">
                <h3 className="create-production-order__risks-title">Риски</h3>
                {totalKizDeficit > 0 && (
                  <div className="create-production-order__risk-item create-production-order__risk-item--error">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="create-production-order__risk-text">Не хватает КИЗ: {totalKizDeficit}</div>
                      <button className="create-production-order__risk-btn">Добавить в план КИЗ</button>
                    </div>
                  </div>
                )}
                {materials.filter(m => m.deficit > 0).map((material) => (
                  <div key={material.id} className="create-production-order__risk-item create-production-order__risk-item--warning">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <div>
                      <div className="create-production-order__risk-text">Материал {material.name} дефицит {material.deficit} м</div>
                      <button className="create-production-order__risk-btn">Создать закупку</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="create-production-order__final-actions">
              <button className="create-production-order__final-btn create-production-order__final-btn--secondary">
                Печать спецификации PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="create-production-order__navigation">
        <button
          className="create-production-order__nav-btn create-production-order__nav-btn--back"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5" />
          {currentStep === 1 ? 'Отмена' : 'Назад'}
        </button>
        <button
          className="create-production-order__nav-btn create-production-order__nav-btn--next"
          onClick={handleNext}
        >
          {currentStep === 5 ? (
            <>
              <Check className="w-5 h-5" />
              Создать заказ
            </>
          ) : (
            <>
              Далее
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CreateProductionOrder;