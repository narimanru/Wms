import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Info, ArrowLeft, Settings } from 'lucide-react';

interface ActionItem {
  id: string;
  label: string;
  count: number;
  description: string;
  checked: boolean;
}

function AutopilotSetup() {
  const navigate = useNavigate();
  
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: 'shipments',
      label: 'Поставки WB',
      count: 3,
      description: 'Создать черновики поставок по складам',
      checked: true
    },
    {
      id: 'production',
      label: 'Заказы в производство',
      count: 4,
      description: 'Создать заказы и дедлайны',
      checked: true
    },
    {
      id: 'kiz',
      label: 'Закупка КИЗ',
      count: 2,
      description: 'Сформировать список к покупке',
      checked: true
    },
    {
      id: 'tasks',
      label: 'Задачи складу/фулфилменту',
      count: 12,
      description: 'Сборка, печать, упаковка',
      checked: true
    },
    {
      id: 'report',
      label: 'Отчёт владельцу',
      count: 1,
      description: 'Сводка в Telegram/Email',
      checked: false
    }
  ]);

  const [responsible, setResponsible] = useState({
    shipments: 'Логист',
    production: 'Менеджер производства',
    warehouse: 'Fulfillment #1',
    startDate: '2026-03-09',
    autoPriority: true
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const toggleAction = (id: string) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, checked: !action.checked } : action
    ));
  };

  const selectedActions = actions.filter(a => a.checked);
  const totalItems = selectedActions.reduce((sum, a) => sum + a.count, 0);

  const previewItems = [
    'WB Краснодар — поставка #draft (Pants Rib M 120 шт)',
    'Производство — заказ #draft (Pants Rib M 200 шт)',
    'КИЗ — к покупке 420 шт (2 позиции)',
    'Задачи фулфилменту — 12 задач'
  ];

  return (
    <div className="autopilot-setup">
      {/* Header */}
      <div className="autopilot-setup__header">
        <div className="autopilot-setup__header-top">
          <div className="autopilot-setup__badge">
            <Sparkles className="w-4 h-4" />
            <span>AI</span>
          </div>
        </div>
        <h1 className="autopilot-setup__title">Автопилот</h1>
        <p className="autopilot-setup__subtitle">
          Превратите план в готовые действия за 1 минуту.
        </p>
      </div>

      <div className="autopilot-setup__content">
        {/* Блок A — Что запускать */}
        <div className="autopilot-setup__section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 className="autopilot-setup__section-title" style={{ margin: 0 }}>Что запускать</h2>
            <button 
              className="autopilot-setup__constraints-btn"
              onClick={() => navigate('/autopilot/constraints')}
            >
              <Settings className="w-4 h-4" />
              Ограничения
            </button>
          </div>
          <p className="autopilot-setup__section-hint">
            Выберите, что создать. Ничего не отправим без подтверждения.
          </p>

          <div className="autopilot-setup__actions">
            {actions.map(action => (
              <div key={action.id} className="autopilot-action">
                <label className="autopilot-action__label">
                  <input
                    type="checkbox"
                    checked={action.checked}
                    onChange={() => toggleAction(action.id)}
                    className="autopilot-action__checkbox"
                  />
                  <span className="autopilot-action__text">
                    {action.label} <span className="autopilot-action__count">({action.count})</span>
                  </span>
                </label>
                
                <div className="autopilot-action__info-wrapper">
                  <button
                    className="autopilot-action__info"
                    onMouseEnter={() => setShowTooltip(action.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip === action.id && (
                    <div className="autopilot-tooltip">
                      {action.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Блок B — Параметры */}
        <div className="autopilot-setup__section">
          <h2 className="autopilot-setup__section-title">Параметры</h2>

          <div className="autopilot-setup__params">
            <div className="autopilot-param">
              <label className="autopilot-param__label">
                Ответственный за отгрузки
              </label>
              <select 
                className="autopilot-param__select"
                value={responsible.shipments}
                onChange={(e) => setResponsible({...responsible, shipments: e.target.value})}
              >
                <option>Логист</option>
                <option>Менеджер склада</option>
                <option>Руководитель отдела</option>
              </select>
            </div>

            <div className="autopilot-param">
              <label className="autopilot-param__label">
                Ответственный за производство
              </label>
              <select 
                className="autopilot-param__select"
                value={responsible.production}
                onChange={(e) => setResponsible({...responsible, production: e.target.value})}
              >
                <option>Менеджер производства</option>
                <option>Начальник цеха</option>
                <option>Директор фабрики</option>
              </select>
            </div>

            <div className="autopilot-param">
              <label className="autopilot-param__label">
                Склад исполнителя
              </label>
              <select 
                className="autopilot-param__select"
                value={responsible.warehouse}
                onChange={(e) => setResponsible({...responsible, warehouse: e.target.value})}
              >
                <option>Fulfillment #1</option>
                <option>Fulfillment #2</option>
                <option>Основной склад</option>
              </select>
            </div>

            <div className="autopilot-param">
              <label className="autopilot-param__label">
                Старт плана
              </label>
              <input 
                type="date"
                className="autopilot-param__input"
                value={responsible.startDate}
                onChange={(e) => setResponsible({...responsible, startDate: e.target.value})}
              />
            </div>

            <div className="autopilot-param autopilot-param--toggle">
              <label className="autopilot-param__toggle">
                <input
                  type="checkbox"
                  checked={responsible.autoPriority}
                  onChange={(e) => setResponsible({...responsible, autoPriority: e.target.checked})}
                />
                <span className="autopilot-param__toggle-text">
                  Автоприоритизация (High/Med/Low)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Блок C — Превью результата */}
        <div className="autopilot-setup__section">
          <h2 className="autopilot-setup__section-title">Будет создано</h2>
          
          <div className="autopilot-preview">
            {selectedActions.length > 0 ? (
              previewItems.slice(0, selectedActions.length).map((item, index) => (
                <div key={index} className="autopilot-preview__item">
                  <div className="autopilot-preview__dot" />
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="autopilot-preview__empty">
                Выберите хотя бы одно действие
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="autopilot-setup__footer">
        <button 
          className="autopilot-setup__btn autopilot-setup__btn--secondary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
        <button 
          className="autopilot-setup__btn autopilot-setup__btn--primary"
          onClick={() => navigate('/autopilot/review')}
          disabled={selectedActions.length === 0}
        >
          Создать пакет действий
        </button>
      </div>
    </div>
  );
}

export default AutopilotSetup;