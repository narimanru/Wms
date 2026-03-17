import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, 
  AlertTriangle,
  XCircle,
  Download,
  Printer,
  RefreshCw
} from 'lucide-react';
import '../../styles/sku-details.css';

interface CodeData {
  id: string;
  code: string;
  status: 'available' | 'assigned' | 'printed' | 'in-upd' | 'accepted' | 'rejected' | 'retired' | 'duplicate';
  source: string;
  lastAction: string;
  user: string;
}

function SKUDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSize, setActiveSize] = useState('M');

  // Mock data
  const skuName = 'Pants Rib';
  const sizes = ['S', 'M', 'L'];

  const risks = [
    {
      id: '1',
      type: 'warning',
      message: 'Размер M: закончится через 4–6 дней'
    },
    {
      id: '2',
      type: 'error',
      message: '2 кода выбыло из оборота (нельзя использовать)'
    }
  ];

  const codesData: CodeData[] = [
    {
      id: '1',
      code: '••••4821',
      status: 'available',
      source: 'Загрузка 15.03',
      lastAction: 'Загружен',
      user: 'Нариман'
    },
    {
      id: '2',
      code: '••••3492',
      status: 'assigned',
      source: 'Загрузка 15.03',
      lastAction: 'Назначен на поставку #12345',
      user: 'Нариман'
    },
    {
      id: '3',
      code: '••••7563',
      status: 'printed',
      source: 'Загрузка 14.03',
      lastAction: 'Напечатан',
      user: 'Система'
    },
    {
      id: '4',
      code: '••••9184',
      status: 'in-upd',
      source: 'Загрузка 14.03',
      lastAction: 'Отправлен в УПД #7891',
      user: 'Нариман'
    },
    {
      id: '5',
      code: '••••2756',
      status: 'accepted',
      source: 'Загрузка 13.03',
      lastAction: 'Принят маркетплейсом',
      user: 'WB API'
    },
    {
      id: '6',
      code: '••••6183',
      status: 'retired',
      source: 'Загрузка 12.03',
      lastAction: 'Выбыл из оборота',
      user: 'ЧЗ API'
    },
    {
      id: '7',
      code: '••••4927',
      status: 'rejected',
      source: 'Загрузка 15.03',
      lastAction: 'Отклонён в УПД',
      user: 'ЧЗ API'
    },
    {
      id: '8',
      code: '••••8341',
      status: 'duplicate',
      source: 'Загрузка 15.03',
      lastAction: 'Обнаружен дубль',
      user: 'Система'
    },
    {
      id: '9',
      code: '••••5612',
      status: 'available',
      source: 'Загрузка 15.03',
      lastAction: 'Загружен',
      user: 'Нариман'
    },
    {
      id: '10',
      code: '••••9273',
      status: 'assigned',
      source: 'Загрузка 15.03',
      lastAction: 'Назначен на поставку #12346',
      user: 'Нариман'
    }
  ];

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'available': 'Доступен',
      'assigned': 'Назначен',
      'printed': 'Напечатан',
      'in-upd': 'В УПД',
      'accepted': 'Принят',
      'rejected': 'Отклонён',
      'retired': 'Выбыл',
      'duplicate': 'Дубль'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="sku-details">
      {/* Header */}
      <div className="sku-details__header">
        <button className="sku-details__back" onClick={() => navigate('/ai/kiz-vault')}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="sku-details__header-content">
          <h1 className="sku-details__title">{skuName} — коды</h1>
          <p className="sku-details__subtitle">Управление кодами маркировки по размерам</p>
        </div>
      </div>

      {/* Size Tabs */}
      <div className="sku-details__tabs">
        {sizes.map((size) => (
          <button
            key={size}
            className={`sku-details__tab ${activeSize === size ? 'sku-details__tab--active' : ''}`}
            onClick={() => setActiveSize(size)}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Risks */}
      {risks.length > 0 && (
        <div className="sku-details__risks">
          <div className="sku-details__risks-header">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="sku-details__risks-title">Риски</h2>
          </div>
          <div className="sku-details__risks-list">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className={`sku-details__risk sku-details__risk--${risk.type}`}
              >
                {risk.type === 'error' ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                <span>{risk.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="sku-details__actions">
        <button 
          className="sku-details__action-btn sku-details__action-btn--primary"
          onClick={() => navigate('/ai/kiz-vault/replace')}
        >
          <RefreshCw className="w-4 h-4" />
          Заменить проблемные коды
        </button>
        <button className="sku-details__action-btn sku-details__action-btn--secondary">
          <XCircle className="w-4 h-4" />
          Снять назначение
        </button>
        <button className="sku-details__action-btn sku-details__action-btn--secondary">
          <Printer className="w-4 h-4" />
          Отправить на печать
        </button>
      </div>

      {/* Codes Table */}
      <div className="sku-details__table-card">
        <div className="sku-details__table-header">
          <h2 className="sku-details__table-title">
            Коды для размера {activeSize}
          </h2>
          <button className="sku-details__export">
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        </div>
        <div className="sku-details__table-container">
          <table className="sku-details__table">
            <thead>
              <tr>
                <th>КИЗ</th>
                <th>Статус</th>
                <th>Источник</th>
                <th>Последнее действие</th>
                <th>Кто</th>
              </tr>
            </thead>
            <tbody>
              {codesData.map((code) => (
                <tr key={code.id}>
                  <td>
                    <code className="sku-details__code">{code.code}</code>
                  </td>
                  <td>
                    <span className={`sku-details__status sku-details__status--${code.status}`}>
                      {getStatusLabel(code.status)}
                    </span>
                  </td>
                  <td className="sku-details__source">{code.source}</td>
                  <td className="sku-details__action">{code.lastAction}</td>
                  <td className="sku-details__user">{code.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SKUDetails;
