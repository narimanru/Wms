import { useState } from 'react';
import { X, XCircle } from 'lucide-react';
import '../../styles/distribution.css';

interface SizeCorrespondenceModalProps {
  onClose: () => void;
  onSave: (mappings: SizeMapping[]) => void;
}

interface SizeMapping {
  id: string;
  fileName: string;
  productName: string;
  selectedSize: string;
  availableSizes: string[];
}

export function SizeCorrespondenceModal({ onClose, onSave }: SizeCorrespondenceModalProps) {
  const [mappings, setMappings] = useState<SizeMapping[]>([
    {
      id: '1',
      fileName: '40_gtin_04655051383501_quantity_210.pdf',
      productName: 'брюки черн',
      selectedSize: '40',
      availableSizes: ['40', '42', '44', '46', '48', '50']
    },
    {
      id: '2',
      fileName: 'gtin_04655051383518_quantity_400.pdf',
      productName: 'брюки черн 42',
      selectedSize: '42',
      availableSizes: ['40', '42', '44', '46', '48', '50']
    },
    {
      id: '3',
      fileName: '44_gtin_04655051383051_quantity_400.pdf',
      productName: 'Брюки черн',
      selectedSize: '44',
      availableSizes: ['40', '42', '44', '46', '48', '50']
    },
    {
      id: '4',
      fileName: 'gtin_04655051383068_quantity_10.pdf',
      productName: 'брюки черн 46_1',
      selectedSize: '46',
      availableSizes: ['40', '42', '44', '46', '48', '50']
    },
    {
      id: '5',
      fileName: '46_gtin_04655051383068_quantity_500.pdf',
      productName: 'брюки черн',
      selectedSize: '46',
      availableSizes: ['40', '42', '44', '46', '48', '50']
    },
    {
      id: '6',
      fileName: '48_gtin_04655051383075_quantity_400.pdf',
      productName: 'брюки черн',
      selectedSize: '48',
      availableSizes: ['40', '42', '44', '46', '48', '50']
    },
    {
      id: '7',
      fileName: '50_gtin_04655051383082_quantity_400.pdf',
      productName: 'брюки черн',
      selectedSize: '50',
      availableSizes: ['40', '42', '44', '46', '48', '50']
    }
  ]);

  const handleSizeChange = (id: string, newSize: string) => {
    setMappings(prev =>
      prev.map(m => m.id === id ? { ...m, selectedSize: newSize } : m)
    );
  };

  const handleRemove = (id: string) => {
    setMappings(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = () => {
    onSave(mappings);
    onClose();
  };

  return (
    <div className="fw-overlay" role="dialog" aria-modal="true" aria-labelledby="sizeCorrTitle">
      <div className="fw-modal fw-modal--narrow">
        {/* Header */}
        <div className="fw-modal__header">
          <h2 id="sizeCorrTitle" className="fw-title">Соответствие размеров</h2>
          <button className="fw-icon-btn" aria-label="Закрыть" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="fw-modal__body fw-modal__body--compact">
          <div className="fw-size-list">
            {mappings.map((mapping) => (
              <div key={mapping.id} className="fw-size-item">
                <div className="fw-size-item__info">
                  <div className="fw-size-item__file">{mapping.fileName}</div>
                </div>
                <div className="fw-size-item__controls">
                  <div className="fw-size-select-wrapper">
                    <select
                      className="fw-size-select"
                      value={mapping.selectedSize}
                      onChange={(e) => handleSizeChange(mapping.id, e.target.value)}
                    >
                      {mapping.availableSizes.map(size => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="fw-remove-btn"
                    onClick={() => handleRemove(mapping.id)}
                    aria-label="Удалить"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="fw-modal__footer">
          <button className="fw-btn fw-btn--ghost" type="button" onClick={onClose}>
            Закрыть
          </button>
          <button className="fw-btn fw-btn--primary" type="button" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}