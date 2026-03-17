import { useState, ChangeEvent } from 'react';
import { X } from 'lucide-react';
import '../../styles/distribution.css';

interface DistributionModalProps {
  onClose: () => void;
}

interface SizeQuantity {
  size: string;
  currentStock: number;
  toAdd: number;
  enabled: boolean;
}

export function DistributionModal({ onClose }: DistributionModalProps) {
  const [fileType, setFileType] = useState<'csv' | 'pdf'>('csv');
  const [fileName, setFileName] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState('palazzo-black');
  
  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([
    { size: '40', currentStock: 0, toAdd: 200, enabled: true },
    { size: '42', currentStock: 0, toAdd: 300, enabled: true },
    { size: '44', currentStock: 0, toAdd: 250, enabled: true },
    { size: '46', currentStock: 0, toAdd: 250, enabled: true },
    { size: '48', currentStock: 0, toAdd: 156, enabled: true },
    { size: '50', currentStock: 0, toAdd: 0, enabled: false },
  ]);

  const stats = {
    uploaded: 1200,
    new: 1156,
    duplicates: 44,
    blocked: 0,
    available: 1156,
  };

  const products = [
    { id: 'palazzo-black', name: 'Брюки палаццо — Чёрный (связанная группа)', category: 'Брюки', color: 'Чёрный', gtin: '046555051383006' },
    { id: 'leggings-black', name: 'Леггинсы — Чёрный (связанная группа)', category: 'Леггинсы', color: 'Чёрный', gtin: '046555051383007' },
    { id: 'vest-beige', name: 'Жилет — Бежевый (связанная группа)', category: 'Жилет', color: 'Бежевый', gtin: '046555051383008' },
  ];

  const currentProduct = products.find(p => p.id === selectedProduct)!;

  const totalDistributed = sizeQuantities
    .filter(s => s.enabled)
    .reduce((sum, s) => sum + s.toAdd, 0);
  
  const remaining = stats.available - totalDistributed;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleQuantityChange = (size: string, value: number) => {
    setSizeQuantities(prev =>
      prev.map(s => s.size === size ? { ...s, toAdd: Math.max(0, value) } : s)
    );
  };

  const handleSizeToggle = (size: string) => {
    setSizeQuantities(prev =>
      prev.map(s => {
        if (s.size === size) {
          return { ...s, enabled: !s.enabled, toAdd: !s.enabled ? s.toAdd : 0 };
        }
        return s;
      })
    );
  };

  const handleDistribute = () => {
    alert('Коды успешно распределены!');
    onClose();
  };

  return (
    <div className="fw-overlay" role="dialog" aria-modal="true" aria-labelledby="fwModalTitle">
      <div className="fw-modal">
        {/* Header */}
        <div className="fw-modal__header">
          <div>
            <h2 id="fwModalTitle" className="fw-title">Массовое распределение кодов маркировки</h2>
            <p className="fw-subtitle">Загрузите пул КИЗов и распределите между связанными товарами и размерами.</p>
          </div>

          <button className="fw-icon-btn" aria-label="Закрыть" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="fw-modal__body">
          {/* Step 1 */}
          <section className="fw-section">
            <div className="fw-section__head">
              <div className="fw-step">Шаг 1</div>
              <h3 className="fw-h3">Загрузите пул кодов</h3>
            </div>

            <div className="fw-row fw-row--gap">
              <div className="fw-seg" role="tablist" aria-label="Тип файла">
                <button
                  className={`fw-seg__btn ${fileType === 'csv' ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => setFileType('csv')}
                >
                  CSV
                </button>
                <button
                  className={`fw-seg__btn ${fileType === 'pdf' ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => setFileType('pdf')}
                >
                  PDF
                </button>
              </div>

              <label className="fw-upload">
                <input type="file" accept={fileType === 'csv' ? '.csv' : '.pdf'} onChange={handleFileChange} />
                <span className="fw-upload__btn">Загрузить файл</span>
                <span className="fw-upload__hint">
                  {fileName || 'или перетащите сюда'}
                </span>
              </label>

              <button className="fw-btn fw-btn--ghost" type="button">История загрузок</button>
            </div>

            <div className="fw-stats">
              <div className="fw-stat">
                <div className="fw-stat__label">Загружено</div>
                <div className="fw-stat__value">{stats.uploaded}</div>
              </div>
              <div className="fw-stat">
                <div className="fw-stat__label">Новые</div>
                <div className="fw-stat__value">{stats.new}</div>
              </div>
              <div className="fw-stat">
                <div className="fw-stat__label">Дубли</div>
                <div className="fw-stat__value">{stats.duplicates}</div>
              </div>
              <div className="fw-stat">
                <div className="fw-stat__label">Заблокированы (WB/УПД)</div>
                <div className="fw-stat__value">{stats.blocked}</div>
              </div>
              <div className="fw-stat fw-stat--accent">
                <div className="fw-stat__label">Доступно к распределению</div>
                <div className="fw-stat__value">{stats.available}</div>
              </div>
            </div>

            {stats.duplicates > 0 && (
              <div className="fw-alert fw-alert--warn">
                <strong>Внимание:</strong> {stats.duplicates} кода уже существуют в системе и исключены из импорта.
              </div>
            )}
          </section>

          {/* Step 2 */}
          <section className="fw-section">
            <div className="fw-section__head">
              <div className="fw-step">Шаг 2</div>
              <h3 className="fw-h3">Выберите группу связанных товаров</h3>
            </div>

            <div className="fw-row fw-row--gap fw-row--wrap">
              <div className="fw-field">
                <label className="fw-label">Модель / группа</label>
                <select 
                  className="fw-input"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fw-meta">
                <div className="fw-chip">Категория: {currentProduct.category}</div>
                <div className="fw-chip">Цвет: {currentProduct.color}</div>
                <div className="fw-chip">GTIN: {currentProduct.gtin}</div>
              </div>
            </div>

            <div className="fw-sizes">
              <div className="fw-label" style={{ marginBottom: '8px' }}>Размеры</div>
              {sizeQuantities.map(({ size, enabled }) => (
                <label key={size} className="fw-check">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleSizeToggle(size)}
                  />
                  {size}
                </label>
              ))}
            </div>

            <div className="fw-alert fw-alert--info">
              Распределение доступно только между товарами с совпадением <strong>категории</strong> и <strong>цвета</strong>.
            </div>
          </section>

          {/* Step 3 */}
          <section className="fw-section">
            <div className="fw-section__head">
              <div className="fw-step">Шаг 3</div>
              <h3 className="fw-h3">Распределите количество по размерам</h3>
            </div>

            <div className="fw-table">
              <div className="fw-thead">
                <div>Размер</div>
                <div>Остаток сейчас</div>
                <div>Количество к добавлению</div>
              </div>

              {sizeQuantities.map(({ size, currentStock, toAdd, enabled }) => (
                <div key={size} className={`fw-tr ${!enabled ? 'is-disabled' : ''}`}>
                  <div className="fw-td fw-td--strong">{size}</div>
                  <div className="fw-td">{currentStock}</div>
                  <div className="fw-td">
                    <input
                      className="fw-qty"
                      type="number"
                      min="0"
                      value={toAdd}
                      disabled={!enabled}
                      onChange={(e) => handleQuantityChange(size, parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="fw-sum">
              <div className="fw-sum__item">
                <span className="fw-sum__label">Всего распределено</span>
                <span className="fw-sum__value">{totalDistributed}</span>
              </div>
              <div className="fw-sum__item">
                <span className="fw-sum__label">Осталось</span>
                <span className="fw-sum__value">{remaining}</span>
              </div>
            </div>

            {remaining === 0 ? (
              <div className="fw-alert fw-alert--ok">
                Количество совпадает с доступным пулом. Можно распределять.
              </div>
            ) : remaining < 0 ? (
              <div className="fw-alert fw-alert--warn">
                <strong>Внимание:</strong> Распределено больше кодов, чем доступно ({Math.abs(remaining)} лишних).
              </div>
            ) : (
              <div className="fw-alert fw-alert--info">
                Остаётся {remaining} кодов. Распределите их по размерам.
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="fw-modal__footer">
          <button className="fw-btn fw-btn--ghost" type="button" onClick={onClose}>
            Отмена
          </button>
          <button
            className="fw-btn fw-btn--primary"
            type="button"
            onClick={handleDistribute}
            disabled={remaining !== 0}
          >
            Распределить коды
          </button>
        </div>
      </div>
    </div>
  );
}