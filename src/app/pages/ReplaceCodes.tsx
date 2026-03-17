import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Download,
  Sparkles
} from 'lucide-react';
import '../../styles/replace-codes.css';

interface CodeItem {
  id: string;
  code: string;
  sku: string;
  size: string;
  reason: string;
}

function ReplaceCodes() {
  const navigate = useNavigate();
  const [sourceMode, setSourceMode] = useState<'sku-only' | 'all-bank'>('sku-only');
  const [showToast, setShowToast] = useState(false);

  const problematicCodes: CodeItem[] = [
    {
      id: '1',
      code: '••••4821',
      sku: 'Pants Rib',
      size: 'M',
      reason: 'Выбыл из оборота'
    },
    {
      id: '2',
      code: '••••3492',
      sku: 'Pants Rib',
      size: 'L',
      reason: 'Выбыл из оборота'
    },
    {
      id: '3',
      code: '••••7563',
      sku: 'Top Basic',
      size: 'S',
      reason: 'Выбыл из оборота'
    },
    {
      id: '4',
      code: '••••9184',
      sku: 'Top Basic',
      size: 'M',
      reason: 'Выбыл из оборота'
    },
    {
      id: '5',
      code: '••••2756',
      sku: 'Long Sleeve',
      size: 'L',
      reason: 'Выбыл из оборота'
    },
    {
      id: '6',
      code: '••••6183',
      sku: 'Long Sleeve',
      size: 'S',
      reason: 'Выбыл из оборота'
    },
    {
      id: '7',
      code: '••••4927',
      sku: 'Pants Rib',
      size: 'M',
      reason: 'Дубль'
    },
    {
      id: '8',
      code: '••••8341',
      sku: 'Top Basic',
      size: 'L',
      reason: 'Статус не подходит'
    }
  ];

  const suggestedCodes: CodeItem[] = [
    {
      id: '1',
      code: '••••5621',
      sku: 'Pants Rib',
      size: 'M',
      reason: 'Доступен'
    },
    {
      id: '2',
      code: '••••7834',
      sku: 'Pants Rib',
      size: 'L',
      reason: 'Доступен'
    },
    {
      id: '3',
      code: '••••2419',
      sku: 'Top Basic',
      size: 'S',
      reason: 'Доступен'
    },
    {
      id: '4',
      code: '••••9657',
      sku: 'Top Basic',
      size: 'M',
      reason: 'Доступен'
    },
    {
      id: '5',
      code: '••••3128',
      sku: 'Long Sleeve',
      size: 'L',
      reason: 'Доступен'
    },
    {
      id: '6',
      code: '••••8542',
      sku: 'Long Sleeve',
      size: 'S',
      reason: 'Доступен'
    },
    {
      id: '7',
      code: '••••1967',
      sku: 'Pants Rib',
      size: 'M',
      reason: 'Доступен'
    },
    {
      id: '8',
      code: '••••4753',
      sku: 'Top Basic',
      size: 'L',
      reason: 'Доступен'
    }
  ];

  const handleReplace = () => {
    setShowToast(true);
    setTimeout(() => {
      navigate('/ai/shipment-check');
    }, 2000);
  };

  return (
    <div className="replace-codes">
      {/* Toast */}
      {showToast && (
        <div className="replace-codes__toast">
          <CheckCircle2 className="w-5 h-5" />
          <span>Готово. Поставка #12345 обновлена.</span>
        </div>
      )}

      {/* Header */}
      <div className="replace-codes__header">
        <button className="replace-codes__back" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="replace-codes__header-content">
          <div className="replace-codes__title-wrapper">
            <RefreshCw className="w-6 h-6 text-emerald-600" />
            <h1 className="replace-codes__title">Замена проблемных кодов</h1>
            <span className="ai-badge">
              <Sparkles className="w-3 h-3" />
              AI
            </span>
          </div>
          <p className="replace-codes__subtitle">
            FASTWMS подберёт новые коды и сохранит привязку к поставке/УПД.
          </p>
        </div>
      </div>

      {/* Source Mode Toggle */}
      <div className="replace-codes__toggle-card">
        <div className="replace-codes__toggle-label">Брать коды из:</div>
        <div className="replace-codes__toggle-buttons">
          <button
            className={`replace-codes__toggle-btn ${sourceMode === 'sku-only' ? 'replace-codes__toggle-btn--active' : ''}`}
            onClick={() => setSourceMode('sku-only')}
          >
            Только этого SKU
          </button>
          <button
            className={`replace-codes__toggle-btn ${sourceMode === 'all-bank' ? 'replace-codes__toggle-btn--active' : ''}`}
            onClick={() => setSourceMode('all-bank')}
          >
            Из общего банка
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="replace-codes__columns">
        {/* Problematic Codes */}
        <div className="replace-codes__column">
          <div className="replace-codes__column-header replace-codes__column-header--error">
            <XCircle className="w-5 h-5" />
            <h2 className="replace-codes__column-title">
              Проблемные коды ({problematicCodes.length})
            </h2>
          </div>
          <div className="replace-codes__list">
            {problematicCodes.map((code, index) => (
              <div key={code.id} className="replace-codes__item replace-codes__item--error">
                <div className="replace-codes__item-number">{index + 1}</div>
                <div className="replace-codes__item-content">
                  <div className="replace-codes__item-code">{code.code}</div>
                  <div className="replace-codes__item-meta">
                    <span className="replace-codes__item-sku">{code.sku}</span>
                    <span className="replace-codes__item-size">{code.size}</span>
                  </div>
                  <div className="replace-codes__item-reason">{code.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Replacements */}
        <div className="replace-codes__column">
          <div className="replace-codes__column-header replace-codes__column-header--success">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="replace-codes__column-title">
              Предложенные замены ({suggestedCodes.length})
            </h2>
          </div>
          <div className="replace-codes__list">
            {suggestedCodes.map((code, index) => (
              <div key={code.id} className="replace-codes__item replace-codes__item--success">
                <div className="replace-codes__item-number">{index + 1}</div>
                <div className="replace-codes__item-content">
                  <div className="replace-codes__item-code">{code.code}</div>
                  <div className="replace-codes__item-meta">
                    <span className="replace-codes__item-sku">{code.sku}</span>
                    <span className="replace-codes__item-size">{code.size}</span>
                  </div>
                  <div className="replace-codes__item-status">{code.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="replace-codes__actions">
        <button className="replace-codes__action-btn replace-codes__action-btn--secondary">
          <Download className="w-4 h-4" />
          Скачать отчёт
        </button>
        <button 
          className="replace-codes__action-btn replace-codes__action-btn--primary"
          onClick={handleReplace}
        >
          <RefreshCw className="w-4 h-4" />
          Заменить 8 кодов
        </button>
      </div>
    </div>
  );
}

export default ReplaceCodes;
