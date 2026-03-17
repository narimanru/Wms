import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Settings, Info, Save, RotateCcw, ArrowLeft, GripVertical } from 'lucide-react';

interface Constraint {
  id: string;
  label: string;
  type: 'number' | 'toggle' | 'checkbox';
  value: number | boolean;
  tooltip?: string;
  unit?: string;
}

function AutopilotConstraints() {
  const navigate = useNavigate();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Отгрузки WB
  const [shipmentConstraints, setShipmentConstraints] = useState({
    maxPerWarehouse: 500,
    minShipment: 60,
    noShipmentIfBelow: true,
    noCoverageOverflow: true,
    coverageThreshold: 35,
    allowAIPriorityChange: true
  });

  const [warehousePriority, setWarehousePriority] = useState([
    'Краснодар',
    'Казань',
    'Электросталь'
  ]);

  // Производство
  const [productionConstraints, setProductionConstraints] = useState({
    maxWeeklyOutput: 1800,
    minBatch: 100,
    leadTime: 12,
    blockIfDeadlineImpossible: true,
    blockIfNoMaterials: false
  });

  // КИЗ
  const [kizConstraints, setKizConstraints] = useState({
    blockProductionWithoutKIZ: true,
    blockShipmentWithoutUPD: true,
    duplicateCheckMode: 'strict' as 'strict' | 'normal'
  });

  // Бюджет
  const [budgetConstraints, setBudgetConstraints] = useState({
    maxKIZBudgetPerWeek: 150000,
    offerWeeklySplit: true,
    maxWBCoverage: 30
  });

  const applyTemplate = (template: 'growth' | 'saving' | 'fulfillment') => {
    switch (template) {
      case 'growth':
        setShipmentConstraints({
          ...shipmentConstraints,
          noCoverageOverflow: false,
          allowAIPriorityChange: true
        });
        break;
      case 'saving':
        setShipmentConstraints({
          ...shipmentConstraints,
          noCoverageOverflow: true,
          coverageThreshold: 25
        });
        setBudgetConstraints({
          ...budgetConstraints,
          maxWBCoverage: 25
        });
        break;
      case 'fulfillment':
        setKizConstraints({
          ...kizConstraints,
          duplicateCheckMode: 'strict',
          blockProductionWithoutKIZ: true,
          blockShipmentWithoutUPD: true
        });
        break;
    }
    setShowTemplateModal(false);
  };

  const resetToDefaults = () => {
    setShipmentConstraints({
      maxPerWarehouse: 500,
      minShipment: 60,
      noShipmentIfBelow: true,
      noCoverageOverflow: true,
      coverageThreshold: 35,
      allowAIPriorityChange: true
    });
    setProductionConstraints({
      maxWeeklyOutput: 1800,
      minBatch: 100,
      leadTime: 12,
      blockIfDeadlineImpossible: true,
      blockIfNoMaterials: false
    });
  };

  return (
    <div className="autopilot-constraints">
      {/* Header */}
      <div className="autopilot-constraints__header">
        <div className="autopilot-constraints__header-top">
          <div className="autopilot-constraints__badge">
            <Settings className="w-4 h-4" />
            <span>Ограничения</span>
          </div>
        </div>
        <h1 className="autopilot-constraints__title">Ограничения автопилота</h1>
        <p className="autopilot-constraints__subtitle">
          AI будет планировать только в рамках этих правил. Если правило мешает плану, мы покажем конфликт и варианты решения.
        </p>
      </div>

      <div className="autopilot-constraints__content">
        {/* A) Отгрузки на WB */}
        <div className="autopilot-constraints__section">
          <h2 className="autopilot-constraints__section-title">Отгрузки на WB</h2>
          
          <div className="autopilot-constraint">
            <div className="autopilot-constraint__header">
              <label className="autopilot-constraint__label">
                Макс. отгрузка на 1 склад WB
                <button
                  className="autopilot-constraint__info"
                  onMouseEnter={() => setShowTooltip('maxWarehouse')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info className="w-4 h-4" />
                </button>
                {showTooltip === 'maxWarehouse' && (
                  <div className="autopilot-tooltip">
                    Чтобы не переливать и не замораживать деньги
                  </div>
                )}
              </label>
            </div>
            <div className="autopilot-constraint__input-group">
              <input
                type="number"
                className="autopilot-constraint__input"
                value={shipmentConstraints.maxPerWarehouse}
                onChange={(e) => setShipmentConstraints({
                  ...shipmentConstraints,
                  maxPerWarehouse: parseInt(e.target.value)
                })}
              />
              <span className="autopilot-constraint__unit">шт/неделя</span>
            </div>
          </div>

          <div className="autopilot-constraint">
            <div className="autopilot-constraint__header">
              <label className="autopilot-constraint__label">Мин. отгрузка</label>
            </div>
            <div className="autopilot-constraint__input-group">
              <input
                type="number"
                className="autopilot-constraint__input"
                value={shipmentConstraints.minShipment}
                onChange={(e) => setShipmentConstraints({
                  ...shipmentConstraints,
                  minShipment: parseInt(e.target.value)
                })}
              />
              <span className="autopilot-constraint__unit">шт</span>
            </div>
            <label className="autopilot-constraint__checkbox-label">
              <input
                type="checkbox"
                checked={shipmentConstraints.noShipmentIfBelow}
                onChange={(e) => setShipmentConstraints({
                  ...shipmentConstraints,
                  noShipmentIfBelow: e.target.checked
                })}
              />
              <span>Не создавать поставку, если меньше минимума</span>
            </label>
          </div>

          <div className="autopilot-constraint">
            <label className="autopilot-constraint__toggle-label">
              <input
                type="checkbox"
                checked={shipmentConstraints.noCoverageOverflow}
                onChange={(e) => setShipmentConstraints({
                  ...shipmentConstraints,
                  noCoverageOverflow: e.target.checked
                })}
                className="autopilot-constraint__toggle"
              />
              <span>Не отгружать, если покрытие превышает порог</span>
            </label>
            {shipmentConstraints.noCoverageOverflow && (
              <div className="autopilot-constraint__input-group">
                <span className="autopilot-constraint__label-small">Порог покрытия</span>
                <input
                  type="number"
                  className="autopilot-constraint__input autopilot-constraint__input--small"
                  value={shipmentConstraints.coverageThreshold}
                  onChange={(e) => setShipmentConstraints({
                    ...shipmentConstraints,
                    coverageThreshold: parseInt(e.target.value)
                  })}
                />
                <span className="autopilot-constraint__unit">дней</span>
              </div>
            )}
          </div>

          <div className="autopilot-constraint">
            <div className="autopilot-constraint__header">
              <label className="autopilot-constraint__label">Приоритет складов WB</label>
            </div>
            <div className="autopilot-priority-list">
              {warehousePriority.map((warehouse, index) => (
                <div key={warehouse} className="autopilot-priority-item">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="autopilot-priority-number">{index + 1}</span>
                  <span className="autopilot-priority-name">{warehouse}</span>
                </div>
              ))}
            </div>
            <label className="autopilot-constraint__checkbox-label">
              <input
                type="checkbox"
                checked={shipmentConstraints.allowAIPriorityChange}
                onChange={(e) => setShipmentConstraints({
                  ...shipmentConstraints,
                  allowAIPriorityChange: e.target.checked
                })}
              />
              <span>Разрешить AI менять приоритет, если риск OOS критический</span>
            </label>
          </div>
        </div>

        {/* B) Производство */}
        <div className="autopilot-constraints__section">
          <h2 className="autopilot-constraints__section-title">Производство</h2>
          
          <div className="autopilot-constraint">
            <label className="autopilot-constraint__label">Макс. выпуск/неделя</label>
            <div className="autopilot-constraint__input-group">
              <input
                type="number"
                className="autopilot-constraint__input"
                value={productionConstraints.maxWeeklyOutput}
                onChange={(e) => setProductionConstraints({
                  ...productionConstraints,
                  maxWeeklyOutput: parseInt(e.target.value)
                })}
              />
              <span className="autopilot-constraint__unit">шт</span>
            </div>
          </div>

          <div className="autopilot-constraint">
            <label className="autopilot-constraint__label">Мин. партия на SKU/размер</label>
            <div className="autopilot-constraint__input-group">
              <input
                type="number"
                className="autopilot-constraint__input"
                value={productionConstraints.minBatch}
                onChange={(e) => setProductionConstraints({
                  ...productionConstraints,
                  minBatch: parseInt(e.target.value)
                })}
              />
              <span className="autopilot-constraint__unit">шт</span>
            </div>
          </div>

          <div className="autopilot-constraint">
            <label className="autopilot-constraint__label">Lead time (дней)</label>
            <div className="autopilot-constraint__input-group">
              <input
                type="number"
                className="autopilot-constraint__input"
                value={productionConstraints.leadTime}
                onChange={(e) => setProductionConstraints({
                  ...productionConstraints,
                  leadTime: parseInt(e.target.value)
                })}
              />
              <span className="autopilot-constraint__unit">дней</span>
            </div>
            <label className="autopilot-constraint__checkbox-label">
              <input
                type="checkbox"
                checked={productionConstraints.blockIfDeadlineImpossible}
                onChange={(e) => setProductionConstraints({
                  ...productionConstraints,
                  blockIfDeadlineImpossible: e.target.checked
                })}
              />
              <span>Не планировать выпуск, если дедлайн невозможен</span>
            </label>
          </div>

          <div className="autopilot-constraint">
            <label className="autopilot-constraint__toggle-label">
              <input
                type="checkbox"
                checked={productionConstraints.blockIfNoMaterials}
                onChange={(e) => setProductionConstraints({
                  ...productionConstraints,
                  blockIfNoMaterials: e.target.checked
                })}
                className="autopilot-constraint__toggle"
              />
              <span>Блокировать план, если нет ткани/фурнитуры</span>
            </label>
          </div>
        </div>

        {/* C) КИЗ */}
        <div className="autopilot-constraints__section">
          <h2 className="autopilot-constraints__section-title">Маркировка / КИЗ</h2>
          
          <div className="autopilot-constraint">
            <label className="autopilot-constraint__toggle-label">
              <input
                type="checkbox"
                checked={kizConstraints.blockProductionWithoutKIZ}
                onChange={(e) => setKizConstraints({
                  ...kizConstraints,
                  blockProductionWithoutKIZ: e.target.checked
                })}
                className="autopilot-constraint__toggle"
              />
              <span>Не запускать производство, если не хватает КИЗ</span>
            </label>
          </div>

          <div className="autopilot-constraint">
            <label className="autopilot-constraint__toggle-label">
              <input
                type="checkbox"
                checked={kizConstraints.blockShipmentWithoutUPD}
                onChange={(e) => setKizConstraints({
                  ...kizConstraints,
                  blockShipmentWithoutUPD: e.target.checked
                })}
                className="autopilot-constraint__toggle"
              />
              <span>Не отгружать без статуса "готово к УПД"</span>
            </label>
          </div>

          <div className="autopilot-constraint">
            <label className="autopilot-constraint__label">Режим проверки дублей</label>
            <select
              className="autopilot-constraint__select"
              value={kizConstraints.duplicateCheckMode}
              onChange={(e) => setKizConstraints({
                ...kizConstraints,
                duplicateCheckMode: e.target.value as 'strict' | 'normal'
              })}
            >
              <option value="strict">Строгий</option>
              <option value="normal">Нормальный</option>
            </select>
          </div>
        </div>

        {/* D) Бюджет */}
        <div className="autopilot-constraints__section">
          <h2 className="autopilot-constraints__section-title">Бюджет и деньги</h2>
          
          <div className="autopilot-constraint">
            <div className="autopilot-constraint__header">
              <label className="autopilot-constraint__label">Макс. бюджет КИЗ/неделя</label>
            </div>
            <div className="autopilot-constraint__input-group">
              <input
                type="number"
                className="autopilot-constraint__input"
                value={budgetConstraints.maxKIZBudgetPerWeek}
                onChange={(e) => setBudgetConstraints({
                  ...budgetConstraints,
                  maxKIZBudgetPerWeek: parseInt(e.target.value)
                })}
              />
              <span className="autopilot-constraint__unit">₽</span>
            </div>
            <label className="autopilot-constraint__checkbox-label">
              <input
                type="checkbox"
                checked={budgetConstraints.offerWeeklySplit}
                onChange={(e) => setBudgetConstraints({
                  ...budgetConstraints,
                  offerWeeklySplit: e.target.checked
                })}
              />
              <span>Если превышает — предложить разбивку по неделям</span>
            </label>
          </div>

          <div className="autopilot-constraint">
            <div className="autopilot-constraint__header">
              <label className="autopilot-constraint__label">
                Макс. покрытие WB
                <button
                  className="autopilot-constraint__info"
                  onMouseEnter={() => setShowTooltip('maxCoverage')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info className="w-4 h-4" />
                </button>
                {showTooltip === 'maxCoverage' && (
                  <div className="autopilot-tooltip">
                    Чтобы не держать лишнее на складах WB
                  </div>
                )}
              </label>
            </div>
            <div className="autopilot-constraint__input-group">
              <input
                type="number"
                className="autopilot-constraint__input"
                value={budgetConstraints.maxWBCoverage}
                onChange={(e) => setBudgetConstraints({
                  ...budgetConstraints,
                  maxWBCoverage: parseInt(e.target.value)
                })}
              />
              <span className="autopilot-constraint__unit">дней</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="autopilot-constraints__footer">
        <button 
          className="autopilot-constraints__btn autopilot-constraints__btn--link"
          onClick={() => setShowTemplateModal(true)}
        >
          Применить шаблон
        </button>
        <button 
          className="autopilot-constraints__btn autopilot-constraints__btn--secondary"
          onClick={resetToDefaults}
        >
          <RotateCcw className="w-4 h-4" />
          Сбросить на рекомендованные
        </button>
        <button 
          className="autopilot-constraints__btn autopilot-constraints__btn--primary"
          onClick={() => navigate(-1)}
        >
          <Save className="w-4 h-4" />
          Сохранить ограничения
        </button>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="autopilot-modal-overlay" onClick={() => setShowTemplateModal(false)}>
          <div className="autopilot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="autopilot-modal__header">
              <h2 className="autopilot-modal__title">Шаблоны ограничений</h2>
              <p className="autopilot-modal__subtitle">
                Быстро настройте правила под ваш бизнес-сценарий
              </p>
            </div>
            
            <div className="autopilot-modal__content">
              <button 
                className="autopilot-template-card"
                onClick={() => applyTemplate('growth')}
              >
                <h3 className="autopilot-template-card__title">Селлер WB (быстрый рост)</h3>
                <p className="autopilot-template-card__desc">
                  Приоритет OOS, больше отгрузок на топ склады
                </p>
              </button>

              <button 
                className="autopilot-template-card"
                onClick={() => applyTemplate('saving')}
              >
                <h3 className="autopilot-template-card__title">Селлер WB (бережём деньги)</h3>
                <p className="autopilot-template-card__desc">
                  Жёсткий запрет перелива, лимит покрытия
                </p>
              </button>

              <button 
                className="autopilot-template-card"
                onClick={() => applyTemplate('fulfillment')}
              >
                <h3 className="autopilot-template-card__title">Фулфилмент</h3>
                <p className="autopilot-template-card__desc">
                  Строгие роли, контроль дублей, минимизация пересорта
                </p>
              </button>
            </div>

            <div className="autopilot-modal__footer">
              <button 
                className="autopilot-modal__btn autopilot-modal__btn--secondary"
                onClick={() => setShowTemplateModal(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutopilotConstraints;
