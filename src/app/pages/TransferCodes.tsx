import { useState } from 'react';
import { ArrowLeft, Search, Plus, ArrowRight, Calendar, User, Package, Check, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import '../../styles/transfer-codes.css';
import React from 'react';

interface TransferHistoryItem {
  id: string;
  date: string;
  time: string;
  user: string;
  sourceProduct: {
    name: string;
    article: string;
    image: string;
    sizes: { size: string; quantity: number }[];
  };
  targetProduct: {
    name: string;
    article: string;
    image: string;
    sizes: { size: string; quantity: number }[];
  };
  totalCodes: number;
  status: 'completed' | 'pending' | 'failed';
}

interface Product {
  name: string;
  article: string;
  color: string;
  image: string;
  sizes: { size: string; barcode: string; unused: number; stock: number }[];
}

function TransferCodes() {
  const navigate = useNavigate();
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [sourceArticle, setSourceArticle] = useState('');
  const [targetArticle, setTargetArticle] = useState('');
  const [sourceProduct, setSourceProduct] = useState<Product | null>(null);
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [distribution, setDistribution] = useState<Record<string, number>>({});

  // Mock transfer history data
  const [transferHistory] = useState<TransferHistoryItem[]>([
    {
      id: '1',
      date: '2024-02-28',
      time: '14:35',
      user: 'Иванова М.С.',
      sourceProduct: {
        name: 'Брюки палаццо классические широкие с высокой посадкой',
        article: '529940427',
        image: 'https://images.unsplash.com/photo-1768221677435-3bb38477f09b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxhenpvJTIwcGFudHMlMjBlbGVnYW50JTIwd29tYW58ZW58MXx8fHwxNzcyMjYwMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        sizes: [{ size: '48', quantity: 100 }]
      },
      targetProduct: {
        name: 'Брюки палаццо классические широкие...',
        article: '529940427',
        image: 'https://images.unsplash.com/photo-1768221677435-3bb38477f09b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxhenpvJTIwcGFudHMlMjBlbGVnYW50JTIwd29tYW58ZW58MXx8fHwxNzcyMjYwMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        sizes: [
          { size: '42', quantity: 50 },
          { size: '44', quantity: 50 }
        ]
      },
      totalCodes: 100,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-02-27',
      time: '16:20',
      user: 'Петров А.И.',
      sourceProduct: {
        name: 'Брюки классические палаццо...',
        article: '578345623',
        image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHBhbnRzJTIwd29tYW58ZW58MXx8fHwxNzI1OTgyMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        sizes: [{ size: '46', quantity: 75 }]
      },
      targetProduct: {
        name: 'Брюки классические палаццо...',
        article: '634729381',
        image: 'https://images.unsplash.com/photo-1624206112918-ad7b07c3079b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF5JTIwcGFudHMlMjB3b21hbnxlbnwxfHx8fDE3MjU5ODIwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
        sizes: [{ size: '44', quantity: 75 }]
      },
      totalCodes: 75,
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-02-26',
      time: '11:15',
      user: 'Сидорова Е.П.',
      sourceProduct: {
        name: 'Брюки широкие...',
        article: '445672890',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHBhbnRzJTIwd29tYW58ZW58MXx8fHwxNzI1OTgyMDI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        sizes: [{ size: '50', quantity: 60 }]
      },
      targetProduct: {
        name: 'Брюки широкие...',
        article: '445672890',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHBhbnRzJTIwd29tYW58ZW58MXx8fHwxNzI1OTgyMDI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        sizes: [{ size: '48', quantity: 60 }]
      },
      totalCodes: 60,
      status: 'completed'
    }
  ]);

  // Mock product database
  const mockProducts: Record<string, Product> = {
    '529940427': {
      name: 'Брюки палаццо классические широкие...',
      article: '529940427',
      color: 'Черный',
      image: 'https://images.unsplash.com/photo-1768221677435-3bb38477f09b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxhenpvJTIwcGFudHMlMjBlbGVnYW50JTIwd29tYW58ZW58MXx8fHwxNzcyMjYwMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      sizes: [
        { size: '42', barcode: '2045935398097', unused: 35, stock: 50 },
        { size: '44', barcode: '2045935398103', unused: 70, stock: 70 },
        { size: '46', barcode: '2045935398110', unused: 75, stock: 100 },
        { size: '48', barcode: '2045935398127', unused: 147, stock: 120 },
        { size: '50', barcode: '2047648456675', unused: 68, stock: 40 }
      ]
    },
    '578345623': {
      name: 'Брюки классические палаццо...',
      article: '578345623',
      color: 'Бежевый',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHBhbnRzJTIwd29tYW58ZW58MXx8fHwxNzI1OTgyMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      sizes: [
        { size: '42', barcode: '2045935398201', unused: 45, stock: 60 },
        { size: '44', barcode: '2045935398202', unused: 80, stock: 80 },
        { size: '46', barcode: '2045935398203', unused: 65, stock: 90 }
      ]
    },
    '634729381': {
      name: 'Брюки классические палаццо...',
      article: '634729381',
      color: 'Серый',
      image: 'https://images.unsplash.com/photo-1624206112918-ad7b07c3079b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF5JTIwcGFudHMlMjB3b21hbnxlbnwxfHx8fDE3MjU5ODIwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      sizes: [
        { size: '42', barcode: '2045935398301', unused: 55, stock: 70 },
        { size: '44', barcode: '2045935398302', unused: 90, stock: 100 },
        { size: '46', barcode: '2045935398303', unused: 75, stock: 95 }
      ]
    }
  };

  const handleSourceArticleSearch = () => {
    const product = mockProducts[sourceArticle.trim()];
    if (product) {
      setSourceProduct(product);
    } else {
      setSourceProduct(null);
      alert('Товар с таким артикулом не найден');
    }
  };

  const handleTargetArticleSearch = () => {
    const product = mockProducts[targetArticle.trim()];
    if (product) {
      setTargetProduct(product);
      // Initialize distribution
      const initialDist: Record<string, number> = {};
      product.sizes.forEach(size => {
        initialDist[size.barcode] = 0;
      });
      setDistribution(initialDist);
    } else {
      setTargetProduct(null);
      alert('Товар с таким артикулом не найден');
    }
  };

  const handleDistributeEvenly = () => {
    if (!sourceProduct || !targetProduct) return;
    
    const totalAvailable = sourceProduct.sizes.reduce((sum, s) => sum + s.unused, 0);
    const targetSizesCount = targetProduct.sizes.length;
    const perSize = Math.floor(totalAvailable / targetSizesCount);
    
    const newDist: Record<string, number> = {};
    targetProduct.sizes.forEach(size => {
      newDist[size.barcode] = perSize;
    });
    
    setDistribution(newDist);
  };

  const getTotalDistributed = () => {
    return Object.values(distribution).reduce((sum, val) => sum + val, 0);
  };

  const getTotalAvailable = () => {
    if (!sourceProduct) return 0;
    return sourceProduct.sizes.reduce((sum, s) => sum + s.unused, 0);
  };

  const handleTransferExecute = () => {
    const totalDist = getTotalDistributed();
    const totalAvail = getTotalAvailable();
    
    if (totalDist === 0) {
      alert('Распределите КИЗы по размерам');
      return;
    }
    
    if (totalDist > totalAvail) {
      alert(`Невозможно распределить ${totalDist} КИЗов. Доступно только ${totalAvail}`);
      return;
    }
    
    alert('Перенос выполнен успешно!');
    // Reset form
    setShowTransferForm(false);
    setSourceArticle('');
    setTargetArticle('');
    setSourceProduct(null);
    setTargetProduct(null);
    setDistribution({});
  };

  const filteredHistory = transferHistory.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.sourceProduct.article.toLowerCase().includes(query) ||
      item.targetProduct.article.toLowerCase().includes(query) ||
      item.sourceProduct.name.toLowerCase().includes(query) ||
      item.targetProduct.name.toLowerCase().includes(query) ||
      item.user.toLowerCase().includes(query)
    );
  });

  return (
    <div className="tc-container">
      {/* Header */}
      <div className="tc-header">
        <div className="tc-header__content">
          <div className="tc-header__info">
            <h1 className="tc-header__title">Перенос КИЗов</h1>
            <p className="tc-header__subtitle">
              История и управление переносом кодов маркировки между товарами
            </p>
          </div>
          <button 
            className="tc-create-btn"
            onClick={() => setShowTransferForm(true)}
          >
            <Plus className="w-5 h-5" />
            Создать перенос
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="tc-filters">
        <div className="tc-filters__content">
          <div className="tc-search">
            <Search className="tc-search__icon" />
            <input
              type="text"
              className="tc-search__input"
              placeholder="Поиск по артикулу, названию или пользователю..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* History Grid */}
      <div className="tc-history">
        <div className="tc-history__content">
          {filteredHistory.length === 0 ? (
            <div className="tc-empty">
              <Package className="tc-empty__icon" />
              <p className="tc-empty__text">История переносов пуста</p>
            </div>
          ) : (
            <div className="tc-history-grid">
              {filteredHistory.map(item => (
                <div key={item.id} className="tc-history-card">
                  {/* Card Header */}
                  <div className="tc-history-card__header">
                    <div className="tc-history-card__meta">
                      <div className="tc-history-card__date">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date} в {item.time}</span>
                      </div>
                      <div className="tc-history-card__user">
                        <User className="w-4 h-4" />
                        <span>{item.user}</span>
                      </div>
                    </div>
                    <div className={`tc-history-card__status tc-history-card__status--${item.status}`}>
                      {item.status === 'completed' && <Check className="w-4 h-4" />}
                      {item.status === 'failed' && <AlertCircle className="w-4 h-4" />}
                      {item.status === 'completed' ? 'Выполнено' : item.status === 'pending' ? 'В процессе' : 'Ошибка'}
                    </div>
                  </div>

                  {/* Transfer Flow */}
                  <div className="tc-transfer-flow">
                    {/* Source */}
                    <div className="tc-transfer-product">
                      <img 
                        src={item.sourceProduct.image} 
                        alt="" 
                        className="tc-transfer-product__image"
                      />
                      <div className="tc-transfer-product__info">
                        <div className="tc-transfer-product__name">
                          {item.sourceProduct.name}
                        </div>
                        <div className="tc-transfer-product__article">
                          {item.sourceProduct.article}
                        </div>
                        <div className="tc-transfer-product__sizes">
                          {item.sourceProduct.sizes.map((size, idx) => (
                            <span key={idx} className="tc-transfer-size-badge tc-transfer-size-badge--source">
                              Размер {size.size}: {size.quantity} КИЗов
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="tc-transfer-arrow">
                      <ArrowRight className="w-6 h-6" />
                      <span className="tc-transfer-count">{item.totalCodes} КИЗов</span>
                    </div>

                    {/* Target */}
                    <div className="tc-transfer-product">
                      <img 
                        src={item.targetProduct.image} 
                        alt="" 
                        className="tc-transfer-product__image"
                      />
                      <div className="tc-transfer-product__info">
                        <div className="tc-transfer-product__name">
                          {item.targetProduct.name}
                        </div>
                        <div className="tc-transfer-product__article">
                          {item.targetProduct.article}
                        </div>
                        <div className="tc-transfer-product__sizes">
                          {item.targetProduct.sizes.map((size, idx) => (
                            <span key={idx} className="tc-transfer-size-badge tc-transfer-size-badge--target">
                              Размер {size.size}: +{size.quantity} КИЗов
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <div className="tc-modal" onClick={() => setShowTransferForm(false)}>
          <div className="tc-modal__overlay"></div>
          <div className="tc-modal__content tc-modal__content--large" onClick={(e) => e.stopPropagation()}>
            <button className="tc-modal__close" onClick={() => setShowTransferForm(false)}>
              <X className="w-5 h-5" />
            </button>

            <div className="tc-modal__header">
              <div>
                <h2 className="tc-modal__title">Создать новый перенос КИЗов</h2>
                <p className="tc-modal__subtitle">
                  Введите артикулы товаров дл переноса кодов маркировки
                </p>
              </div>
            </div>

            <div className="tc-modal__body">
              {/* Two Column Layout */}
              <div className="tc-comparison">
                {/* Left Panel - Source */}
                <div className="tc-comparison__panel tc-comparison__panel--left">
                  <div className="tc-comparison__panel-header">
                    <h3 className="tc-comparison__panel-title">Источник переноса</h3>
                    <p className="tc-comparison__panel-subtitle">
                      Выберите товар, с которого нужно перенести КИЗы
                    </p>
                  </div>

                  <div className="tc-form-section">
                    <label className="tc-form-label">Артикул источника</label>
                    <div className="tc-form-row">
                      <input
                        type="text"
                        className="tc-form-input"
                        placeholder="Введите артикул товара"
                        value={sourceArticle}
                        onChange={(e) => setSourceArticle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSourceArticleSearch()}
                      />
                      <button className="tc-form-search-btn" onClick={handleSourceArticleSearch}>
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Source Product Display */}
                  {sourceProduct ? (
                    <div className="tc-product-preview tc-product-preview--source">
                      <img src={sourceProduct.image} alt="" className="tc-product-preview__image" />
                      <div className="tc-product-preview__info">
                        <div className="tc-product-preview__name">{sourceProduct.name}</div>
                        <div className="tc-product-preview__meta">
                          <span>{sourceProduct.article}</span>
                          <span>·</span>
                          <span>{sourceProduct.color}</span>
                        </div>
                        <div className="tc-product-preview__sizes">
                          {sourceProduct.sizes.map(size => (
                            <div key={size.barcode} className="tc-size-row">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span 
                                  className="fw-size-badge"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: '#3b82f6',
                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                  }}
                                >
                                  {size.size}
                                </span>
                                <span 
                                  style={{
                                    fontFamily: "'SF Mono', 'Monaco', 'Courier New', monospace",
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                    fontWeight: 400
                                  }}
                                >
                                  {size.barcode}
                                </span>
                              </div>
                              <span className="tc-size-row__value">{size.unused} КИЗов</span>
                            </div>
                          ))}
                        </div>
                        <div className="tc-product-preview__total">
                          Всего доступно: <strong>{getTotalAvailable()} КИЗов</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="tc-panel-empty">
                      <Package className="tc-panel-empty__icon" />
                      <p className="tc-panel-empty__text">
                        Здесь будет карточка товара-источника
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Panel - Target */}
                <div className="tc-comparison__panel tc-comparison__panel--right">
                  <div className="tc-comparison__panel-header">
                    <h3 className="tc-comparison__panel-title">Назначение переноса</h3>
                    <p className="tc-comparison__panel-subtitle">
                      Добавьте товар и распределите КИЗы по размерам
                    </p>
                  </div>

                  <div className="tc-form-section">
                    <label className="tc-form-label">Артикул назначения</label>
                    <div className="tc-form-row">
                      <input
                        type="text"
                        className="tc-form-input"
                        placeholder="Введите артикул товара"
                        value={targetArticle}
                        onChange={(e) => setTargetArticle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTargetArticleSearch()}
                      />
                      <button className="tc-form-search-btn" onClick={handleTargetArticleSearch}>
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Target Product Display */}
                  {targetProduct ? (
                    <div className="tc-product-preview tc-product-preview--target">
                      <img src={targetProduct.image} alt="" className="tc-product-preview__image" />
                      <div className="tc-product-preview__info">
                        <div className="tc-product-preview__name">{targetProduct.name}</div>
                        <div className="tc-product-preview__meta">
                          <span>{targetProduct.article}</span>
                          <span>·</span>
                          <span>{targetProduct.color}</span>
                        </div>

                        {/* Distribution */}
                        <div className="tc-distribution-compact">
                          <div className="tc-distribution-compact__header">
                            <span className="tc-form-label">Распределение</span>
                            <button 
                              className="tc-distribute-btn-small"
                              onClick={handleDistributeEvenly}
                            >
                              Поровну
                            </button>
                          </div>
                          
                          <div className="tc-distribution-list">
                            {targetProduct.sizes.map(size => (
                              <div key={size.barcode} className="tc-distribution-row">
                                <div className="tc-distribution-row__info">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span 
                                      className="fw-size-badge"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: '#3b82f6',
                                        border: '1px solid rgba(59, 130, 246, 0.2)'
                                      }}
                                    >
                                      {size.size}
                                    </span>
                                    <span 
                                      style={{
                                        fontFamily: "'SF Mono', 'Monaco', 'Courier New', monospace",
                                        fontSize: '12px',
                                        color: '#9ca3af',
                                        fontWeight: 400
                                      }}
                                    >
                                      {size.barcode}
                                    </span>
                                  </div>
                                  <span className="tc-distribution-row__current">Текущий: {size.unused}</span>
                                </div>
                                <input
                                  type="number"
                                  className="tc-distribution-row__input"
                                  placeholder="0"
                                  min="0"
                                  value={distribution[size.barcode] || 0}
                                  onChange={(e) => setDistribution({
                                    ...distribution,
                                    [size.barcode]: parseInt(e.target.value) || 0
                                  })}
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className={`tc-distribution-summary-compact ${getTotalDistributed() > getTotalAvailable() ? 'tc-distribution-summary-compact--error' : ''}`}>
                            <div className="tc-distribution-summary-compact__row">
                              <span>Распределено:</span>
                              <strong>{getTotalDistributed()}</strong>
                            </div>
                            <div className="tc-distribution-summary-compact__row">
                              <span>Доступно:</span>
                              <strong>{getTotalAvailable()}</strong>
                            </div>
                            {getTotalDistributed() > getTotalAvailable() && (
                              <div className="tc-distribution-summary-compact__error">
                                Превышен доступный лимит!
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="tc-panel-empty">
                      <Package className="tc-panel-empty__icon" />
                      <p className="tc-panel-empty__text">
                        Добавьте товар из правой панели
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {sourceProduct && targetProduct && (
              <div className="tc-modal__actions">
                <button 
                  className="tc-modal__btn tc-modal__btn--cancel"
                  onClick={() => setShowTransferForm(false)}
                >
                  Отменить
                </button>
                <button 
                  className="tc-modal__btn tc-modal__btn--confirm"
                  onClick={handleTransferExecute}
                  disabled={getTotalDistributed() === 0 || getTotalDistributed() > getTotalAvailable()}
                >
                  <ArrowRight className="w-5 h-5" />
                  Выполнить перенос
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TransferCodes;