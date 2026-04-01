import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight,
  Check,
  Bell,
  Plus,
  Info,
  Search,
  Filter,
  X,
  Clock,
  Edit,
  Trash2,
  History as HistoryIcon
} from 'lucide-react';
import { useNavigate } from 'react-router';

type Step = 1 | 2 | 3;

interface Product {
  id: string;
  name: string;
  article: string;
  nmId: string;
  sku: string;
  baseDiscount: number;
  tempDiscount: number;
  startTime: string;
  endTime: string;
  status: 'active' | 'paused';
  warning?: 'wb-limited' | 'wb-changed' | 'user-changed';
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Футболка базовая хлопок',
    article: 'FT-001',
    nmId: '123456789',
    sku: 'SKU-001',
    baseDiscount: 10,
    tempDiscount: 25,
    startTime: '10:00',
    endTime: '14:00',
    status: 'active'
  },
  {
    id: '2',
    name: 'Джинсы классические',
    article: 'JN-002',
    nmId: '987654321',
    sku: 'SKU-002',
    baseDiscount: 15,
    tempDiscount: 30,
    startTime: '12:00',
    endTime: '16:00',
    status: 'active',
    warning: 'wb-limited'
  }
];

const TIME_OPTIONS = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
  '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

export default function RepricerCreateFull() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(2); // Start at step 2 for demo
  const [strategyName, setStrategyName] = useState('Моя стратегия');
  const [isActive, setIsActive] = useState(true);
  const [store, setStore] = useState('wb-main');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [notificationChannels, setNotificationChannels] = useState<any[]>([]);
  
  // Products
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Modals
  const [showAddSubscription, setShowAddSubscription] = useState(false);
  const [showTelegramHelp, setShowTelegramHelp] = useState(false);
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [showSetStartTime, setShowSetStartTime] = useState(false);
  const [showSetEndTime, setShowSetEndTime] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 32px 0 32px' }}>
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
              {strategyName || 'Создание стратегии репрайсера'}
            </h1>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #E5E7EB' }}>
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => {
                  if (step.number === 3) {
                    navigate('/repricer/history');
                  } else if (step.number <= currentStep) {
                    setCurrentStep(step.number as Step);
                  }
                }}
                disabled={step.number > currentStep}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: step.number === currentStep ? '2px solid #111827' : '2px solid transparent',
                  cursor: step.number <= currentStep ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: step.number === currentStep ? '#111827' : step.number <= currentStep ? '#6B7280' : '#9CA3AF',
                  transition: 'all 0.15s',
                  position: 'relative',
                  marginBottom: '-1px'
                }}
                onMouseEnter={(e) => {
                  if (step.number <= currentStep) {
                    e.currentTarget.style.color = '#111827';
                    if (step.number !== currentStep) {
                      e.currentTarget.style.background = '#F9FAFB';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = step.number === currentStep ? '#111827' : step.number <= currentStep ? '#6B7280' : '#9CA3AF';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {currentStep === 2 && (
            <div>
              {/* Toolbar */}
              <div style={{ 
                background: 'white', 
                borderRadius: '5px', 
                border: '1px solid #E5E7EB', 
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                  {/* Search */}
                  <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search 
                      size={16} 
                      strokeWidth={1.5}
                      style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#9CA3AF' 
                      }} 
                    />
                    <input
                      type="text"
                      placeholder="Поиск по названию, артикулу, SKU или nmId"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 36px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '5px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    />
                  </div>

                  {/* Add Products Button */}
                  <button
                    onClick={() => setShowAddProducts(true)}
                    style={{
                      padding: '8px 16px',
                      background: '#111827',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '14px',
                      fontWeight: '400',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={14} strokeWidth={1.5} />
                    Добавить товары
                  </button>
                </div>

                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div style={{
                    padding: '12px',
                    background: '#F0F9FF',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '14px', color: '#1E40AF', fontWeight: '500' }}>
                      Выбрано: {selectedProducts.length}
                    </span>
                    <div style={{ flex: 1 }} />
                    <button
                      onClick={() => setShowSetStartTime(true)}
                      style={{
                        padding: '6px 12px',
                        background: 'white',
                        color: '#1E40AF',
                        border: '1px solid #3B82F6',
                        borderRadius: '5px',
                        fontSize: '13px',
                        fontWeight: '400',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Clock size={12} strokeWidth={1.5} />
                      Установить начало
                    </button>
                    <button
                      onClick={() => setShowSetEndTime(true)}
                      style={{
                        padding: '6px 12px',
                        background: 'white',
                        color: '#1E40AF',
                        border: '1px solid #3B82F6',
                        borderRadius: '5px',
                        fontSize: '13px',
                        fontWeight: '400',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Clock size={12} strokeWidth={1.5} />
                      Установить окончание
                    </button>
                    <button
                      onClick={() => setSelectedProducts([])}
                      style={{
                        padding: '6px 12px',
                        background: 'white',
                        color: '#EF4444',
                        border: '1px solid #EF4444',
                        borderRadius: '5px',
                        fontSize: '13px',
                        fontWeight: '400',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                      Удалить
                    </button>
                  </div>
                )}
              </div>

              {/* Products Table */}
              <div style={{ background: 'white', borderRadius: '5px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                      <th style={{ padding: '12px 16px', width: '40px' }}>
                        <input
                          type="checkbox"
                          checked={selectedProducts.length === products.length}
                          onChange={toggleAllProducts}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Товар
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        width: '100px'
                      }}>
                        Базовая скидка
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        width: '120px'
                      }}>
                        Временная скидка
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        width: '120px'
                      }}>
                        Начало
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        width: '120px'
                      }}>
                        Завершение
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        width: '100px'
                      }}>
                        Статус
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'right', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        width: '120px'
                      }}>
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr 
                        key={product.id}
                        style={{ 
                          borderBottom: index < products.length - 1 ? '1px solid #E5E7EB' : 'none',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#F9FAFB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <td style={{ padding: '16px' }}>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>
                            {product.article} • nmId: {product.nmId} • SKU: {product.sku}
                          </div>
                          {product.warning && (
                            <div style={{ 
                              marginTop: '6px',
                              padding: '4px 8px',
                              background: '#FEF3C7',
                              color: '#92400E',
                              fontSize: '11px',
                              borderRadius: '3px',
                              display: 'inline-block'
                            }}>
                              {product.warning === 'wb-limited' && '⚠️ Ограничено WB'}
                              {product.warning === 'wb-changed' && '🔄 Изменено WB'}
                              {product.warning === 'user-changed' && '✏️ Изменено пользователем'}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>
                            {product.baseDiscount}%
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="number"
                            value={product.tempDiscount}
                            onChange={(e) => {
                              const newProducts = products.map(p => 
                                p.id === product.id ? { ...p, tempDiscount: Number(e.target.value) } : p
                              );
                              setProducts(newProducts);
                            }}
                            style={{
                              width: '80px',
                              padding: '6px 8px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '5px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                          />
                          <span style={{ marginLeft: '4px', fontSize: '14px', color: '#6B7280' }}>%</span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <select
                            value={product.startTime}
                            onChange={(e) => {
                              const newProducts = products.map(p => 
                                p.id === product.id ? { ...p, startTime: e.target.value } : p
                              );
                              setProducts(newProducts);
                            }}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '5px',
                              fontSize: '14px',
                              background: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <select
                            value={product.endTime}
                            onChange={(e) => {
                              const newProducts = products.map(p => 
                                p.id === product.id ? { ...p, endTime: e.target.value } : p
                              );
                              setProducts(newProducts);
                            }}
                            style={{
                              width: '100%',
                              padding: '6px 8px',
                              border: '1px solid #E5E7EB',
                              borderRadius: '5px',
                              fontSize: '14px',
                              background: 'white',
                              cursor: 'pointer'
                            }}
                          >
                            {TIME_OPTIONS.map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: product.status === 'active' ? '#10B981' : '#F59E0B',
                            background: product.status === 'active' ? '#ECFDF5' : '#FEF3C7'
                          }}>
                            {product.status === 'active' ? 'Активно' : 'Пауза'}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                            <button
                              style={{
                                width: '28px',
                                height: '28px',
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
                              title="История"
                              onClick={() => setCurrentStep(3)}
                            >
                              <HistoryIcon size={12} strokeWidth={1.5} />
                            </button>
                            <button
                              style={{
                                width: '28px',
                                height: '28px',
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
                              title="Удалить"
                            >
                              <Trash2 size={12} strokeWidth={1.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

      {/* Add Products Modal */}
      {showAddProducts && (
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
        onClick={() => setShowAddProducts(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#111827', margin: 0 }}>
                Добавить товары
              </h2>
              <button
                onClick={() => setShowAddProducts(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search 
                size={16} 
                strokeWidth={1.5}
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#9CA3AF' 
                }} 
              />
              <input
                type="text"
                placeholder="Поиск товаров..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white'
                }}
              />
            </div>

            {/* Mock products list */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '12px' }}>
                Найдено товаров: 156
              </div>
              <div style={{ 
                border: '1px solid #E5E7EB', 
                borderRadius: '5px',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <label
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderBottom: i < 5 ? '1px solid #E5E7EB' : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        Товар {i}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>
                        Артикул: ART-00{i} • nmId: 12345678{i}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddProducts(false)}
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
                onClick={() => setShowAddProducts(false)}
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
                Добавить выбранные товары
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Set Start Time Modal */}
      {showSetStartTime && (
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
        onClick={() => setShowSetStartTime(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#111827', margin: '0 0 20px 0' }}>
              Установить время начала для всех товаров
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#111827', 
                marginBottom: '8px' 
              }}>
                Время начала
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
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <div style={{ 
                marginTop: '8px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                Время будет применено к {selectedProducts.length} ��ыбранным товарам
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSetStartTime(false)}
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
                onClick={() => setShowSetStartTime(false)}
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

      {/* Set End Time Modal */}
      {showSetEndTime && (
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
        onClick={() => setShowSetEndTime(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#111827', margin: '0 0 20px 0' }}>
              Установить время окончания для всех товаров
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#111827', 
                marginBottom: '8px' 
              }}>
                Время окончания
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
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <div style={{ 
                marginTop: '8px',
                fontSize: '13px',
                color: '#6B7280'
              }}>
                Время будет применено к {selectedProducts.length} выбранным товарам
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSetEndTime(false)}
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
                onClick={() => setShowSetEndTime(false)}
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
    </div>
  );
}