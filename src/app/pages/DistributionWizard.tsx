import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  Package,
  ShoppingBag,
  Search
} from 'lucide-react';
import '../../styles/wizard.css';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  detectedSize: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  color: string;
  colorHex: string;
  articleNumber: string;
  image: string;
  availableSizes: string[];
}

function DistributionWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: '1',
      name: '40_gtin_04655051383501_quantity_210.pdf',
      size: '2.9 МБ',
      detectedSize: '40'
    },
    {
      id: '2',
      name: 'gtin_04655051383518_quantity_400.pdf',
      size: '5.5 МБ',
      detectedSize: '42'
    },
    {
      id: '3',
      name: '44_gtin_04655051383051_quantity_400.pdf',
      size: '5.5 МБ',
      detectedSize: '44'
    }
  ]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Distribution state - количество КИЗов по товару и размеру
  const [distribution, setDistribution] = useState<Record<string, Record<string, number>>>({});

  // Mock products data
  const products: Product[] = [
    {
      id: '1',
      name: 'Брюки классические',
      category: 'Брюки',
      color: 'Чёрный',
      colorHex: '#000000',
      articleNumber: 'BR-2024-001',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
      availableSizes: ['40', '42', '44', '46', '48', '50']
    },
    {
      id: '2',
      name: 'Брюки прямого кроя',
      category: 'Брюки',
      color: 'Чёрный',
      colorHex: '#000000',
      articleNumber: 'BR-2024-002',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=500&fit=crop',
      availableSizes: ['42', '44', '46', '48']
    },
    {
      id: '3',
      name: 'Брюки зауженные',
      category: 'Брюки',
      color: 'Чёрный',
      colorHex: '#000000',
      articleNumber: 'BR-2024-003',
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop',
      availableSizes: ['40', '42', '44', '46']
    },
    {
      id: '4',
      name: 'Брюки офисные',
      category: 'Брюки',
      color: 'Серый',
      colorHex: '#6B7280',
      articleNumber: 'BR-2024-004',
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop',
      availableSizes: ['42', '44', '46', '48', '50']
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Files uploaded:', e.target.files);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const handleComplete = () => {
    navigate('/');
  };

  const steps = [
    { number: 1, title: 'Выбор товаров', description: 'Выберите товары для распределения' },
    { number: 2, title: 'Загрузка файлов', description: 'Загрузите PDF/CSV с КИЗами' },
    { number: 3, title: 'Распределение', description: 'Распределите КИЗы по товарам и размерам' },
    { number: 4, title: 'Завершение', description: 'Результат операции' }
  ];

  return (
    <div className="fw-wizard">
      {/* Header */}
      <div className="fw-wizard__header">
        <div className="fw-wizard__header-content">
          <button className="fw-wizard__back" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="fw-wizard__title">Массовое распределение КИЗ</h1>
            <p className="fw-wizard__subtitle">Пошаговый процесс распределения кодов маркировки</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="fw-wizard__progress">
        <div className="fw-wizard__progress-content">
          {steps.map((step, index) => (
            <div key={step.number} className="fw-wizard__step-wrapper">
              <div 
                className={`fw-wizard__step ${
                  currentStep === step.number ? 'fw-wizard__step--active' : ''
                } ${currentStep > step.number ? 'fw-wizard__step--completed' : ''}`}
              >
                <div className="fw-wizard__step-number">
                  {currentStep > step.number ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="fw-wizard__step-info">
                  <div className="fw-wizard__step-title text-[14px]">{step.title}</div>
                  <div className="fw-wizard__step-description">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`fw-wizard__step-line ${
                  currentStep > step.number ? 'fw-wizard__step-line--completed' : ''
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="fw-wizard__content">
        {/* Step 1: Select Products */}
        {currentStep === 1 && (
          <div className="fw-wizard__step-content">
            <div className="fw-wizard__section-header">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="fw-wizard__section-title">Выбор товаров</h2>
                <p className="fw-wizard__section-description">
                  Найдите и выберите товары для распределения кодов маркировки
                </p>
              </div>
            </div>

            <div className="fw-products-list__filters">
              <div className="fw-products-list__search">
                <Search className="w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск по названию или артикулу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="fw-products-list__filter-row">
                <div className="fw-form-group">
                  <select
                    className="fw-form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">Все категории</option>
                    <option value="Брюки">Брюки</option>
                    <option value="Рубашки">Рубашки</option>
                    <option value="Куртки">Куртки</option>
                  </select>
                </div>
                <div className="fw-form-group">
                  <select
                    className="fw-form-select"
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                  >
                    <option value="">Все цвета</option>
                    <option value="Чёрный">Чёрный</option>
                    <option value="Синий">Синий</option>
                    <option value="Серый">Серый</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="fw-products-grid">
              {products
                .filter((product) =>
                  product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (categoryFilter === '' || product.category === categoryFilter) &&
                  (colorFilter === '' || product.color === colorFilter)
                )
                .map((product) => (
                  <div 
                    key={product.id} 
                    className={`fw-product-item ${selectedProducts.includes(product.id) ? 'fw-product-item--selected' : ''}`}
                    onClick={() => {
                      if (selectedProducts.includes(product.id)) {
                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                      } else {
                        setSelectedProducts([...selectedProducts, product.id]);
                      }
                    }}
                  >
                    <div className="fw-product-item__image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="fw-product-item__info">
                      <div className="fw-product-item__name">{product.name}</div>
                      <div className="fw-product-item__article">Арт. {product.articleNumber}</div>
                      <div className="fw-product-item__meta">
                        <span className="fw-product-item__category">{product.category}</span>
                        <span className="fw-product-item__color" style={{ backgroundColor: product.colorHex }}>
                          {product.color}
                        </span>
                      </div>
                      <div className="fw-product-item__sizes">
                        {product.availableSizes.map((size) => (
                          <span key={size} className="fw-product-item__size">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="fw-product-item__select">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => {}}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                ))}
            </div>

            {selectedProducts.length > 0 && (
              <div className="fw-products-selected">
                <span>Выбрано товаров: <strong>{selectedProducts.length}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Upload */}
        {currentStep === 2 && (
          <div className="fw-wizard__step-content">
            <div className="fw-wizard__section-header">
              <Upload className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="fw-wizard__section-title">Загрузка файлов с КИЗами</h2>
                <p className="fw-wizard__section-description">
                  Загрузите PDF или CSV файлы с кодами маркировки
                </p>
              </div>
            </div>

            <div className="fw-upload-zone">
              <input
                type="file"
                id="fileUpload"
                multiple
                accept=".pdf,.csv"
                onChange={handleFileUpload}
                className="fw-upload-zone__input"
              />
              <label htmlFor="fileUpload" className="fw-upload-zone__label">
                <div className="fw-upload-zone__icon">
                  <Upload />
                </div>
                <div className="fw-upload-zone__text">
                  <div className="fw-upload-zone__title">Перетащите файлы или нажмите для выбора</div>
                  <div className="fw-upload-zone__description">Поддерживаются форматы: PDF, CSV</div>
                </div>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="fw-files-list">
                <div className="fw-files-list__header">
                  <FileText className="w-4 h-4" />
                  <span>Загруженные файлы ({uploadedFiles.length})</span>
                </div>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="fw-file-item">
                    <div className="fw-file-item__icon">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="fw-file-item__info">
                      <div className="fw-file-item__name">{file.name}</div>
                      <div className="fw-file-item__size">{file.size}</div>
                    </div>
                    <button className="fw-file-item__remove">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Distribution */}
        {currentStep === 3 && (
          <div className="fw-wizard__step-content">
            <div className="fw-wizard__section-header">
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="fw-wizard__section-title">Распределение кодов маркировки</h2>
                <p className="fw-wizard__section-description">
                  Укажите количество КИЗов для каждого размера выбранных товаров
                </p>
              </div>
            </div>

            {/* Summary info */}
            <div className="fw-distribution-summary">
              <div className="fw-distribution-summary__item">
                <span className="fw-distribution-summary__label">Всего КИЗов:</span>
                <span className="fw-distribution-summary__value">1,010 кодов</span>
              </div>
              <div className="fw-distribution-summary__item">
                <span className="fw-distribution-summary__label">Выбрано товаров:</span>
                <span className="fw-distribution-summary__value">{selectedProducts.length}</span>
              </div>
              <div className="fw-distribution-summary__item">
                <span className="fw-distribution-summary__label">Файлов загружено:</span>
                <span className="fw-distribution-summary__value">{uploadedFiles.length}</span>
              </div>
            </div>

            {/* Distribution table */}
            <div className="fw-distribution-table-container">
              {products
                .filter((product) => selectedProducts.includes(product.id))
                .map((product) => (
                  <div key={product.id} className="fw-distribution-product">
                    {/* Product header */}
                    <div className="fw-distribution-product__header">
                      <div className="fw-distribution-product__image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="fw-distribution-product__info">
                        <div className="fw-distribution-product__name">{product.name}</div>
                        <div className="fw-distribution-product__meta">
                          <span className="fw-distribution-product__article">Арт. {product.articleNumber}</span>
                          <span className="fw-distribution-product__color" style={{ backgroundColor: product.colorHex }}>
                            {product.color}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sizes distribution */}
                    <div className="fw-distribution-sizes">
                      <div className="fw-distribution-sizes__header">
                        <div className="fw-distribution-sizes__col">Размер</div>
                        <div className="fw-distribution-sizes__col">Доступно КИЗов</div>
                        <div className="fw-distribution-sizes__col">Количество</div>
                      </div>
                      {product.availableSizes.map((size) => {
                        // Определяем доступное количество КИЗов для этого размера
                        const availableFile = uploadedFiles.find(f => f.detectedSize === size);
                        const availableCount = availableFile ? 
                          (size === '40' ? 210 : size === '42' ? 400 : size === '44' ? 400 : 0) : 0;
                        
                        return (
                          <div key={size} className="fw-distribution-sizes__row">
                            <div className="fw-distribution-sizes__col">
                              <span className="fw-distribution-sizes__size">{size}</span>
                            </div>
                            <div className="fw-distribution-sizes__col">
                              <span className={`fw-distribution-sizes__available ${availableCount > 0 ? 'fw-distribution-sizes__available--active' : ''}`}>
                                {availableCount > 0 ? `${availableCount} кодов` : 'Нет файла'}
                              </span>
                            </div>
                            <div className="fw-distribution-sizes__col">
                              <input
                                type="number"
                                min="0"
                                max={availableCount}
                                disabled={availableCount === 0}
                                placeholder="0"
                                className="fw-distribution-sizes__input"
                                value={distribution[product.id]?.[size] || ''}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value) || 0;
                                  setDistribution({
                                    ...distribution,
                                    [product.id]: {
                                      ...distribution[product.id],
                                      [size]: Math.min(value, availableCount)
                                    }
                                  });
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Product total */}
                    <div className="fw-distribution-product__total">
                      <span>Итого для товара:</span>
                      <strong>
                        {Object.values(distribution[product.id] || {}).reduce((sum, val) => sum + val, 0)} кодов
                      </strong>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="fw-wizard__step-content">
            <div className="fw-wizard__success">
              <div className="fw-wizard__success-icon">
                <CheckCircle2 />
              </div>
              <h2 className="fw-wizard__success-title">Распределение завершено!</h2>
              <p className="fw-wizard__success-description">
                Коды маркировки успешно распределены по размерам
              </p>
              <div className="fw-wizard__success-stats">
                <div className="fw-wizard__success-stat">
                  <div className="fw-wizard__success-stat-value">2,120</div>
                  <div className="fw-wizard__success-stat-label">Кодов распределено</div>
                </div>
                <div className="fw-wizard__success-stat">
                  <div className="fw-wizard__success-stat-value">{uploadedFiles.length}</div>
                  <div className="fw-wizard__success-stat-label">Размеров обработано</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fw-wizard__footer">
        <div className="fw-wizard__footer-content">
          {currentStep > 1 && currentStep < 4 && (
            <button className="fw-wizard__btn fw-wizard__btn--secondary" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
              Назад
            </button>
          )}
          <div style={{ flex: 1 }} />
          {currentStep < 4 ? (
            <button className="fw-wizard__btn fw-wizard__btn--primary" onClick={handleNext}>
              Далее
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="fw-wizard__btn fw-wizard__btn--primary" onClick={handleComplete}>
              Завершить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DistributionWizard;