import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Vault, 
  Upload, 
  ArrowRightLeft,
  Search,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import '../../styles/kiz-vault.css';
import productsData from '../data/products-demo.json';

type FilterStatus = 'all' | 'available' | 'assigned' | 'printed' | 'in-upd' | 'rejected' | 'retired' | 'duplicates';

interface SKUData {
  id: string;
  name: string;
  sizes: string[];
  available: number;
  assigned: number;
  printed: number;
  risk: 'low' | 'medium' | 'high';
}

function KIZVault() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

  // Calculate KPI from demo data
  const markedProducts = productsData.products.filter(p => p.needsMarking);
  const totalAvailable = markedProducts.reduce((sum, p) => 
    sum + p.sizes.reduce((s, size) => s + size.kiz.available, 0), 0
  );
  const totalAssigned = markedProducts.reduce((sum, p) => 
    sum + p.sizes.reduce((s, size) => s + size.kiz.assigned, 0), 0
  );
  const totalRejected = markedProducts.reduce((sum, p) => sum + p.kizStats.rejected, 0);
  
  const kpiData = [
    { label: 'Доступно', value: totalAvailable.toLocaleString(), color: 'green' },
    { label: 'Назначено', value: totalAssigned.toLocaleString(), color: 'blue' },
    { label: 'Отклонено', value: totalRejected.toString(), color: 'red' },
    { label: 'В УПД', value: markedProducts.reduce((sum, p) => sum + p.kizStats.inUPD, 0).toString(), color: 'yellow' }
  ];

  const filters: { id: FilterStatus; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'available', label: 'Доступны' },
    { id: 'assigned', label: 'Назначены' },
    { id: 'printed', label: 'Напечатаны' },
    { id: 'in-upd', label: 'В УПД' },
    { id: 'rejected', label: 'Отклонены' },
    { id: 'retired', label: 'Выбыли' },
    { id: 'duplicates', label: 'Дубли' }
  ];

  const skuData: SKUData[] = markedProducts.map(product => {
    const available = product.sizes.reduce((sum, size) => sum + size.kiz.available, 0);
    const assigned = product.sizes.reduce((sum, size) => sum + size.kiz.assigned, 0);
    const used = product.sizes.reduce((sum, size) => sum + size.kiz.used, 0);
    
    // Calculate risk based on available vs assigned ratio
    const ratio = available / (assigned + available);
    const risk: 'low' | 'medium' | 'high' = ratio < 0.2 ? 'high' : ratio < 0.4 ? 'medium' : 'low';
    
    return {
      id: product.id,
      name: product.name,
      sizes: product.sizes.map(s => s.rusSize),
      available,
      assigned,
      printed: used,
      risk
    };
  });

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return risk;
    }
  };

  return (
    <div className="kiz-vault">
      {/* Header */}
      <div className="kiz-vault__header">
        <div className="kiz-vault__title-wrapper">
          <Vault className="w-7 h-7 text-emerald-600" />
          <div>
            <h1 className="kiz-vault__title">Банк КИЗ</h1>
            <p className="kiz-vault__subtitle">
              Загрузите, распределите и контролируйте коды по SKU/размерам
            </p>
          </div>
        </div>
        <div className="kiz-vault__actions">
          <button className="kiz-vault__btn kiz-vault__btn--secondary">
            <ArrowRightLeft className="w-4 h-4" />
            Распределить
          </button>
          <button className="kiz-vault__btn kiz-vault__btn--primary">
            <Upload className="w-4 h-4" />
            Загрузить коды
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="kiz-vault__controls">
        <div className="kiz-vault__search">
          <Search className="w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по SKU / коду"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="kiz-vault__search-input"
          />
        </div>
        <div className="kiz-vault__filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`kiz-vault__filter ${activeFilter === filter.id ? 'kiz-vault__filter--active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kiz-vault__kpi">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`kiz-vault__kpi-card kiz-vault__kpi-card--${kpi.color}`}>
            <div className="kiz-vault__kpi-label">{kpi.label}</div>
            <div className="kiz-vault__kpi-value">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="kiz-vault__table-card">
        <div className="kiz-vault__table-header">
          <h2 className="kiz-vault__table-title">Остатки кодов по товарам</h2>
        </div>
        <div className="kiz-vault__table-container">
          <table className="kiz-vault__table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Размеры</th>
                <th>Доступно</th>
                <th>Назначено</th>
                <th>Напечатано</th>
                <th>Риск</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {skuData.map((sku) => (
                <tr key={sku.id} onClick={() => navigate(`/ai/kiz-vault/${sku.id}`)}>
                  <td>
                    <div className="kiz-vault__sku-name">{sku.name}</div>
                  </td>
                  <td>
                    <div className="kiz-vault__sizes">
                      {sku.sizes.map((size) => (
                        <span key={size} className="kiz-vault__size-chip">
                          {size}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className="kiz-vault__number kiz-vault__number--green">
                      {sku.available.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className="kiz-vault__number">
                      {sku.assigned.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className="kiz-vault__number">
                      {sku.printed.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className={`kiz-vault__risk-badge kiz-vault__risk-badge--${sku.risk}`}>
                      {getRiskLabel(sku.risk)}
                    </span>
                  </td>
                  <td>
                    <button className="kiz-vault__row-action">
                      Открыть
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default KIZVault;