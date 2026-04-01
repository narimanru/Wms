import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight,
  Check,
  Bell,
  Plus,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router';

type Step = 1 | 2 | 3;

export default function RepricerCreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [strategyName, setStrategyName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [store, setStore] = useState('wb-main');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [notificationChannels, setNotificationChannels] = useState<any[]>([]);
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [showTelegramHelp, setShowTelegramHelp] = useState(false);

  const steps = [
    { number: 1, label: 'Настройка', completed: currentStep > 1 },
    { number: 2, label: 'Товары', completed: currentStep > 2 },
    { number: 3, label: 'История', completed: false }
  ];

  const handleNext = () => {
    if (currentStep === 1 && strategyName) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    } else {
      navigate('/repricer');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '24px 32px', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <button
              onClick={handleBack}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                cursor: 'pointer',
                color: '#6B7280',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.borderColor = '#111827';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '500', 
              color: '#111827', 
              margin: 0 
            }}>
              Создание стратегии репрайсера
            </h1>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: step.number < currentStep ? 'pointer' : 'default'
                  }}
                  onClick={() => step.number < currentStep && setCurrentStep(step.number as Step)}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: step.completed ? '#111827' : step.number === currentStep ? '#111827' : '#F3F4F6',
                    color: step.completed || step.number === currentStep ? 'white' : '#9CA3AF',
                    fontSize: '14px',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    {step.completed ? <Check size={16} strokeWidth={2} /> : step.number}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: step.number === currentStep ? '#111827' : '#6B7280'
                    }}>
                      {step.label}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    width: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D1D5DB'
                  }}>
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {currentStep === 1 && (
            <div style={{ display: 'flex', gap: '24px' }}>
              {/* Main Settings */}
              <div style={{ flex: 2 }}>
                <div style={{ background: 'white', borderRadius: '5px', border: '1px solid #E5E7EB', padding: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: '0 0 20px 0' }}>
                    Основные настройки
                  </h2>

                  {/* Strategy Name */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#111827', 
                      marginBottom: '8px' 
                    }}>
                      Название стратегии <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Введите название стратегии"
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '5px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    />
                  </div>

                  {/* Status Toggle */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#111827', 
                      marginBottom: '8px' 
                    }}>
                      Статус стратегии
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => setIsActive(!isActive)}
                        style={{
                          width: '48px',
                          height: '28px',
                          borderRadius: '14px',
                          background: isActive ? '#111827' : '#E5E7EB',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '4px',
                          left: isActive ? '24px' : '4px',
                          transition: 'all 0.2s'
                        }} />
                      </button>
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>
                        {isActive ? 'Включена' : 'Выключена'}
                      </span>
                    </div>
                  </div>

                  {/* Store */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#111827', 
                      marginBottom: '8px' 
                    }}>
                      Магазин <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      value={store}
                      onChange={(e) => setStore(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '5px',
                        fontSize: '14px',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="wb-main">WB Основной кабинет</option>
                      <option value="wb-second">WB Дополнительный кабинет</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#111827', 
                      marginBottom: '8px' 
                    }}>
                      Поле сортировки товаров
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '10px 12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '5px',
                          fontSize: '14px',
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="name">Название</option>
                        <option value="stock">Остаток</option>
                        <option value="discount">Скидка</option>
                        <option value="updated">Дата обновления</option>
                      </select>
                      <button
                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        style={{
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          color: '#6B7280',
                          fontSize: '18px'
                        }}
                        title={sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'}
                      >
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </button>
                    </div>
                  </div>

                  {/* Strategy Type */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: '#111827', 
                      marginBottom: '12px' 
                    }}>
                      Тип стратегии
                    </label>
                    <div style={{
                      padding: '16px',
                      background: '#F9FAFB',
                      border: '2px solid #111827',
                      borderRadius: '5px'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                        Изменение скидок по времени
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        Автоматическое изменение скидок товаров по расписанию
                      </div>
                    </div>
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '12px', 
                      background: '#F0F9FF', 
                      borderRadius: '5px',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start'
                    }}>
                      <Info size={16} strokeWidth={1.5} style={{ color: '#3B82F6', flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '13px', color: '#1E40AF', lineHeight: '1.5' }}>
                        Система автоматически меняет скидки товаров по расписанию, учитывает ограничения Wildberries, отслеживает изменения и ведёт историю действий.
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                    <button
                      onClick={handleNext}
                      disabled={!strategyName}
                      style={{
                        padding: '12px 24px',
                        background: strategyName ? '#111827' : '#E5E7EB',
                        color: strategyName ? 'white' : '#9CA3AF',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: strategyName ? 'pointer' : 'not-allowed',
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        if (strategyName) {
                          e.currentTarget.style.background = '#1F2937';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (strategyName) {
                          e.currentTarget.style.background = '#111827';
                        }
                      }}
                    >
                      Создать стратегию
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications Sidebar */}
              <div style={{ flex: 1 }}>
                <div style={{ background: 'white', borderRadius: '5px', border: '1px solid #E5E7EB', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Bell size={18} strokeWidth={1.5} style={{ color: '#111827' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0 }}>
                      Уведомления
                    </h2>
                  </div>

                  {notificationChannels.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.5 }}>🔔</div>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 16px 0' }}>
                        Подключите Telegram для получения уведомлений
                      </p>
                      <button
                        onClick={() => setShowAddSubscription(true)}
                        style={{
                          padding: '8px 16px',
                          background: '#111827',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          fontSize: '14px',
                          fontWeight: '400',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Plus size={14} strokeWidth={1.5} />
                        Добавить подписку
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Notification channels list would go here */}
                    </div>
                  )}

                  {/* Notification Settings */}
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>
                      Типы уведомлений
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { id: 'errors', label: 'Ошибки' },
                        { id: 'success', label: 'Успешные изменения' },
                        { id: 'skipped', label: 'Пропущенные операции' },
                        { id: 'all', label: 'Все события' }
                      ].map((option) => (
                        <label
                          key={option.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            color: '#6B7280',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ background: 'white', borderRadius: '5px', border: '1px solid #E5E7EB', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
              <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#111827', margin: '0 0 8px 0' }}>
                Добавьте товары в стратегию
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 24px 0' }}>
                Выберите товары, для которых будет работать репрайсер
              </p>
              <button
                style={{
                  padding: '10px 20px',
                  background: '#111827',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Plus size={16} strokeWidth={1.5} />
                Добавить товары
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ background: 'white', borderRadius: '5px', border: '1px solid #E5E7EB', padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
              <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#111827', margin: '0 0 8px 0' }}>
                История действий пуста
              </h2>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                История появится после первого запуска стратегии
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddSubscription && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowAddSubscription(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#111827', margin: '0 0 20px 0' }}>
              Создать контакт
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#111827', 
                marginBottom: '8px' 
              }}>
                Тип
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="telegram">Telegram</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#111827', 
                marginBottom: '8px' 
              }}>
                Chat ID
              </label>
              <input
                type="text"
                placeholder="Введите chat_id"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white'
                }}
              />
              <div style={{ 
                marginTop: '8px', 
                padding: '12px', 
                background: '#F0F9FF', 
                borderRadius: '5px',
                fontSize: '13px',
                color: '#1E40AF',
                lineHeight: '1.5'
              }}>
                <strong>Как получить chat_id:</strong><br />
                1. Откройте Telegram-бота FASTWMS_BOT<br />
                2. Нажмите Start<br />
                3. Скопируйте chat_id<br />
                4. Вставьте его в систему
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTelegramHelp(true)}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  color: '#6B7280',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer'
                }}
              >
                Как подключить?
              </button>
              <button
                onClick={() => setShowAddSubscription(false)}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  color: '#6B7280',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer'
                }}
              >
                Отменить
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: '#111827',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer'
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telegram Help Modal */}
      {showTelegramHelp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}
        onClick={() => setShowTelegramHelp(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#111827', margin: '0 0 20px 0' }}>
              Как подключить Telegram
            </h2>

            <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>Откройте Telegram</li>
                <li style={{ marginBottom: '12px' }}>Найдите бота <strong>FASTWMS_BOT</strong></li>
                <li style={{ marginBottom: '12px' }}>Нажмите Start</li>
                <li style={{ marginBottom: '12px' }}>Получите chat_id</li>
                <li style={{ marginBottom: '12px' }}>Скопируйте его</li>
                <li>Вставьте в систему</li>
              </ol>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E5E7EB' }}>
              <button
                style={{
                  width: '100%',
                  padding: '10px 20px',
                  background: '#111827',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer'
                }}
              >
                Отправить тестовое сообщение
              </button>
            </div>

            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <button
                onClick={() => setShowTelegramHelp(false)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  color: '#6B7280',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer'
                }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
