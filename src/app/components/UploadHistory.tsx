import { 
  RefreshCw, ChevronLeft, ChevronRight, Search, X, ChevronDown, ChevronUp,
  Download, Trash2, Eye, FileDown, CheckSquare, Square, Calendar,
  Filter, ArrowUpDown, Clock, User, MessageSquare, Package, ExternalLink, HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import '../../styles/history.css';
import { KIZDetailsModal } from './KIZDetailsModal';

interface UploadRecord {
  id: string;
  fileName: string;
  productName: string;
  articleNumber: string;
  color: string;
  colorHex: string;
  category: string;
  sizes: string[];
  fileSize: string;
  kizCount: number;
  usedKizCount: number;
  status: 'completed' | 'processing' | 'error';
  uploadedBy: string;
  uploadedByAvatar: string;
  batchNumber: string;
  createdAt: string;
  completedAt: string | null;
  processingTime: string | null;
  comment: string;
  progress: number;
}

interface GroupedProduct {
  productName: string;
  articleNumber: string;
  color: string;
  colorHex: string;
  category: string;
  image: string;
  allSizes: string[];
  records: UploadRecord[];
  totalFiles: number;
  completedFiles: number;
  processingFiles: number;
  errorFiles: number;
  totalKizCount: number;
}

interface UploadHistoryProps {
  onBack: () => void;
}

type FilterStatus = 'all' | 'completed' | 'processing' | 'error';
type FilterDate = 'all' | 'today' | 'week' | 'month' | 'custom';
type SortField = 'date' | 'name' | 'files' | 'status';
type SortOrder = 'asc' | 'desc';

export function UploadHistory({ onBack }: UploadHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterDate, setFilterDate] = useState<FilterDate>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [detailsModal, setDetailsModal] = useState<UploadRecord | null>(null);
  const [selectedSize, setSelectedSize] = useState<{ record: UploadRecord; size: string } | null>(null);
  const [kizSearchQuery, setKizSearchQuery] = useState('');
  const [kizStatusFilter, setKizStatusFilter] = useState<'all' | 'available' | 'used' | 'reserved' | 'rejected'>('all');
  const [kizDateFilter, setKizDateFilter] = useState<FilterDate>('all');
  
  const records: UploadRecord[] = [
    {
      id: '1',
      fileName: 'брюки черн 42\ngtin_04655051383518_quantity_400.pdf',
      productName: 'Брюки классические',
      articleNumber: 'BR-2024-001',
      color: 'черный',
      colorHex: '#000000',
      category: 'Брюки',
      sizes: ['42'],
      fileSize: '5.5 МБ',
      kizCount: 400,
      usedKizCount: 245,
      status: 'completed',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '26.02.2026, 14:14:59',
      completedAt: '26.02.2026, 11:18:10',
      processingTime: '3 мин 11 сек',
      comment: 'Первая партия КИЗов для размера 42',
      progress: 100
    },
    {
      id: '2',
      fileName: 'брюки черн\n40_gtin_04655051383501_quantity_210.pdf',
      productName: 'Брюки классические',
      articleNumber: 'BR-2024-001',
      color: 'черный',
      colorHex: '#000000',
      category: 'Брюки',
      sizes: ['40'],
      fileSize: '2.9 МБ',
      kizCount: 210,
      usedKizCount: 210,
      status: 'completed',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '26.02.2026, 14:14:59',
      completedAt: '26.02.2026, 11:16:08',
      processingTime: '1 мин 9 сек',
      comment: '',
      progress: 100
    },
    {
      id: '3',
      fileName: 'Брюки черн\n44_gtin_04655051383051_quantity_400.pdf',
      productName: 'Брюки классические',
      articleNumber: 'BR-2024-001',
      color: 'черный',
      colorHex: '#000000',
      category: 'Брюки',
      sizes: ['44'],
      fileSize: '5.5 МБ',
      kizCount: 400,
      usedKizCount: 0,
      status: 'processing',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '26.02.2026, 14:14:59',
      completedAt: null,
      processingTime: null,
      comment: '',
      progress: 65
    },
    {
      id: '4',
      fileName: 'брюки черн 46_1\ngtin_04655051383068_quantity_10.pdf',
      productName: 'Брюки классические',
      articleNumber: 'BR-2024-001',
      color: 'черный',
      colorHex: '#000000',
      category: 'Брюки',
      sizes: ['46'],
      fileSize: '164.6 КБ',
      kizCount: 10,
      usedKizCount: 0,
      status: 'processing',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '26.02.2026, 14:14:59',
      completedAt: null,
      processingTime: null,
      comment: '',
      progress: 35
    },
    {
      id: '5',
      fileName: 'брюки черн\n46_gtin_04655051383068_quantity_500.pdf',
      productName: 'Брюки классические',
      articleNumber: 'BR-2024-001',
      color: 'черный',
      colorHex: '#000000',
      category: 'Брюки',
      sizes: ['46'],
      fileSize: '6.9 МБ',
      kizCount: 500,
      usedKizCount: 0,
      status: 'processing',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '26.02.2026, 14:14:59',
      completedAt: null,
      processingTime: null,
      comment: '',
      progress: 80
    },
    {
      id: '6',
      fileName: 'брюки черн\n48_gtin_04655051383075_quantity_400.pdf',
      productName: 'Брюки классическе',
      articleNumber: 'BR-2024-001',
      color: 'черный',
      colorHex: '#000000',
      category: 'Брюки',
      sizes: ['48'],
      fileSize: '5.5 МБ',
      kizCount: 400,
      usedKizCount: 0,
      status: 'processing',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '26.02.2026, 14:14:59',
      completedAt: null,
      processingTime: null,
      comment: '',
      progress: 45
    },
    {
      id: '7',
      fileName: 'брюки черн\n50_gtin_04655051383082_quantity_400.pdf',
      productName: 'Брюки классические',
      articleNumber: 'BR-2024-001',
      color: 'черный',
      colorHex: '#000000',
      category: 'Брюки',
      sizes: ['50'],
      fileSize: '5.5 МБ',
      kizCount: 400,
      usedKizCount: 0,
      status: 'error',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '26.02.2026, 14:14:59',
      completedAt: null,
      processingTime: null,
      comment: 'Ошибка при обработке файла',
      progress: 0
    },
    {
      id: '8',
      fileName: 'Размер XS.pdf',
      productName: 'Футболка базовая',
      articleNumber: 'FT-2024-015',
      color: 'белый',
      colorHex: '#FFFFFF',
      category: 'Футболки',
      sizes: ['XS'],
      fileSize: '4.9 МБ',
      kizCount: 350,
      usedKizCount: 150,
      status: 'completed',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '16.02.2026, 21:26:07',
      completedAt: '16.02.2026, 18:32:27',
      processingTime: '2 мин 54 сек',
      comment: '',
      progress: 100
    },
    {
      id: '9',
      fileName: 'Размер S.pdf',
      productName: 'Футблка базовая',
      articleNumber: 'FT-2024-015',
      color: 'белый',
      colorHex: '#FFFFFF',
      category: 'Футболки',
      sizes: ['S'],
      fileSize: '6.7 МБ',
      kizCount: 480,
      usedKizCount: 480,
      status: 'completed',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '16.02.2026, 21:26:07',
      completedAt: '16.02.2026, 18:30:39',
      processingTime: '4 мин 28 сек',
      comment: '',
      progress: 100
    },
    {
      id: '10',
      fileName: 'Размер M.pdf',
      productName: 'Футболка базовая',
      articleNumber: 'FT-2024-015',
      color: 'белый',
      colorHex: '#FFFFFF',
      category: 'Футболки',
      sizes: ['M'],
      fileSize: '1.0 МБ',
      kizCount: 120,
      usedKizCount: 85,
      status: 'completed',
      uploadedBy: 'Нариман',
      uploadedByAvatar: 'N',
      batchNumber: 'B12345',
      createdAt: '16.02.2026, 21:26:07',
      completedAt: '16.02.2026, 18:28:16',
      processingTime: '2 мин 23 сек',
      comment: '',
      progress: 100
    },
    {
      id: '11',
      fileName: 'Куртка зимняя\nmulti_size_batch.pdf',
      productName: 'Куртка зимняя',
      articleNumber: 'KR-2024-042',
      color: 'синий',
      colorHex: '#1E40AF',
      category: 'Куртки',
      sizes: ['S', 'M', 'L', 'XL'],
      fileSize: '8.2 МБ',
      kizCount: 800,
      usedKizCount: 320,
      status: 'completed',
      uploadedBy: 'Алексей',
      uploadedByAvatar: 'А',
      batchNumber: 'B12345',
      createdAt: '25.02.2026, 10:30:45',
      completedAt: '25.02.2026, 10:35:12',
      processingTime: '4 мин 27 сек',
      comment: 'Зимняя коллекция 2026',
      progress: 100
    }
  ];

  const handleRefresh = () => {
    console.log('Refreshing list...');
  };

  // Фильтрация записей
  const filteredRecords = records.filter(record => {
    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        record.productName.toLowerCase().includes(query) ||
        record.articleNumber.toLowerCase().includes(query) ||
        record.fileName.toLowerCase().includes(query) ||
        record.sizes.some(size => size.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Фильтр по статусу
    if (filterStatus !== 'all' && record.status !== filterStatus) {
      return false;
    }

    // Фильтр по категории
    if (filterCategory !== 'all' && record.category !== filterCategory) {
      return false;
    }

    // Фильтр по дате
    if (filterDate !== 'all') {
      const recordDate = new Date(record.createdAt.split(', ')[0].split('.').reverse().join('-'));
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (filterDate === 'today') {
        if (recordDate < todayStart) return false;
      } else if (filterDate === 'week') {
        const weekAgo = new Date(todayStart);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (recordDate < weekAgo) return false;
      } else if (filterDate === 'month') {
        const monthAgo = new Date(todayStart);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (recordDate < monthAgo) return false;
      }
    }

    return true;
  });

  // Группировка записей по товару
  const groupedProducts: GroupedProduct[] = [];
  const productMap = new Map<string, GroupedProduct>();
  
  const productImages: Record<string, string> = {
    'BR-2024-001': 'https://images.unsplash.com/photo-1655755933366-4fa97ec5e307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGNsYXNzaWMlMjB0cm91c2VycyUyMHBhbnRzfGVufDF8fHx8MTc3MjU0ODM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    'FT-2024-015': 'https://images.unsplash.com/photo-1712145176570-6cb1d98a126a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNpYyUyMHdoaXRlJTIwdC1zaGlydHxlbnwxfHx8fDE3NzI1NDgzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'KR-2024-042': 'https://images.unsplash.com/photo-1740932427710-b87ab5d6d8c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBqYWNrZXQlMjBjb2F0fGVufDF8fHx8MTc3MjU0ODM1MHww&ixlib=rb-4.1.0&q=80&w=1080'
  };

  filteredRecords.forEach(record => {
    const key = `${record.productName}-${record.articleNumber}`;
    
    if (!productMap.has(key)) {
      const group: GroupedProduct = {
        productName: record.productName,
        articleNumber: record.articleNumber,
        color: record.color,
        colorHex: record.colorHex,
        category: record.category,
        image: productImages[record.articleNumber] || '',
        allSizes: [],
        records: [],
        totalFiles: 0,
        completedFiles: 0,
        processingFiles: 0,
        errorFiles: 0,
        totalKizCount: 0
      };
      productMap.set(key, group);
      groupedProducts.push(group);
    }
    
    const group = productMap.get(key)!;
    group.records.push(record);
    group.totalFiles++;
    group.totalKizCount += record.kizCount;
    
    record.sizes.forEach(size => {
      if (!group.allSizes.includes(size)) {
        group.allSizes.push(size);
      }
    });
    
    if (record.status === 'completed') {
      group.completedFiles++;
    } else if (record.status === 'processing') {
      group.processingFiles++;
    } else if (record.status === 'error') {
      group.errorFiles++;
    }
  });

  // Сортировка
  groupedProducts.sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.productName.localeCompare(b.productName);
    } else if (sortField === 'files') {
      comparison = a.totalFiles - b.totalFiles;
    } else if (sortField === 'status') {
      comparison = a.completedFiles - b.completedFiles;
    } else if (sortField === 'date') {
      const dateA = new Date(a.records[0].createdAt.split(', ')[0].split('.').reverse().join('-'));
      const dateB = new Date(b.records[0].createdAt.split(', ')[0].split('.').reverse().join('-'));
      comparison = dateA.getTime() - dateB.getTime();
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Статистика
  const stats = {
    totalUploads: records.length,
    completed: records.filter(r => r.status === 'completed').length,
    processing: records.filter(r => r.status === 'processing').length,
    totalKiz: records.reduce((sum, r) => sum + r.kizCount, 0)
  };

  const categories = ['all', ...Array.from(new Set(records.map(r => r.category)))];

  const clearSearch = () => setSearchQuery('');
  
  const toggleProduct = (key: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedProducts(newExpanded);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleDownload = (record: UploadRecord) => {
    console.log('Downloading:', record.fileName);
  };

  const handleDelete = (record: UploadRecord) => {
    console.log('Deleting:', record.id);
  };

  const handleViewDetails = (record: UploadRecord) => {
    setDetailsModal(record);
  };

  const handleExport = () => {
    console.log('Exporting selected records:', Array.from(selectedRecords));
  };

  const handleBulkDelete = () => {
    console.log('Bulk deleting:', Array.from(selectedRecords));
  };

  const handleGoToProduct = (articleNumber: string) => {
    console.log('Navigating to product:', articleNumber);
    // Здесь будет переход на страницу товара
    // Например: navigate(`/inventory?article=${articleNumber}`);
  };

  return (
    <div className="fw-history-page">
      {/* Header */}
      <div className="fw-history-header">
        <div className="fw-history-header-content">
          <button className="fw-back-btn" onClick={onBack} aria-label="Назад">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="fw-history-title">История загрузок</h1>
          <button className="fw-refresh-btn" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            Обновить Список
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="fw-history-filter">
        <div className="fw-history-filter-content">
          {/* Search */}
          <div className="fw-search-box">
            <Search className="fw-search-icon" />
            <input
              type="text"
              className="fw-search-input"
              placeholder="Поиск по названию товара, артикулу, размеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="fw-search-clear" onClick={clearSearch} aria-label="Очистить поиск">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button 
            className={`fw-filter-toggle ${showFilterPanel ? 'fw-filter-toggle--active' : ''}`}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <Filter className="w-4 h-4" />
            Фильтры
          </button>
        </div>

        {/* Search Results */}
        {(searchQuery || filterStatus !== 'all' || filterDate !== 'all' || filterCategory !== 'all') && (
          <div className="fw-search-results">
            Найдено товаров: <strong>{groupedProducts.length}</strong> ({filteredRecords.length} {filteredRecords.length === 1 ? 'файл' : filteredRecords.length < 5 ? 'айла' : 'файлов'})
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      {showFilterPanel && (
        <>
          {/* Overlay */}
          <div 
            className="fw-filter-overlay"
            onClick={() => setShowFilterPanel(false)}
          />
          
          {/* Sidebar */}
          <div className="fw-filter-sidebar">
            <div className="fw-filter-sidebar__header">
              <h3>Фильтры</h3>
              <button 
                className="fw-filter-sidebar__close"
                onClick={() => setShowFilterPanel(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="fw-filter-sidebar__content">
              {/* Status Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Статус загрузки</label>
                <select
                  className="fw-filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                >
                  <option value="all">Все статусы</option>
                  <option value="completed">✓ Завершено</option>
                  <option value="processing">⟳ В процессе</option>
                  <option value="error">✕ С ошибками</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Период загрузки</label>
                <select
                  className="fw-filter-select"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value as FilterDate)}
                >
                  <option value="all">Все время</option>
                  <option value="today">Сегодня</option>
                  <option value="week">Последние 7 дней</option>
                  <option value="month">Последний месяц</option>
                  <option value="custom">Произвольный диапазон</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Категория товара</label>
                <select
                  className="fw-filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'Все категории' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fw-filter-sidebar__footer">
              <button 
                className="fw-filter-sidebar__reset"
                onClick={() => {
                  setFilterStatus('all');
                  setFilterDate('all');
                  setFilterCategory('all');
                }}
              >
                Сбросить фильтры
              </button>
              <button 
                className="fw-filter-sidebar__apply"
                onClick={() => setShowFilterPanel(false)}
              >
                Применить
              </button>
            </div>
          </div>
        </>
      )}

      {/* Table */}
      <div className="fw-history-table-wrapper">
        <table className="fw-history-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th style={{ width: '60px' }}></th>
              <th>
                <button className="fw-sort-header" onClick={() => handleSort('name')}>
                  ТОВАР
                  {sortField === 'name' && <ArrowUpDown className="w-3 h-3" />}
                </button>
              </th>
              <th>
                <button className="fw-sort-header" onClick={() => handleSort('files')}>
                  ФАЙЛОВ
                  {sortField === 'files' && <ArrowUpDown className="w-3 h-3" />}
                </button>
              </th>
              <th style={{ fontSize: '12px' }}>РАЗМЕРЫ</th>
              <th>КИЗов</th>
              <th>
                <button className="fw-sort-header" onClick={() => handleSort('status')}>
                  СТАТУС
                  {sortField === 'status' && <ArrowUpDown className="w-3 h-3" />}
                </button>
              </th>
              <th style={{ width: '120px' }}>ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {groupedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="fw-no-results">
                  {searchQuery ? `Ничего не найдено по запросу "${searchQuery}"` : 'Нет записей для отображения'}
                </td>
              </tr>
            ) : (
              groupedProducts.map((group) => {
                const key = `${group.productName}-${group.articleNumber}`;
                const isExpanded = expandedProducts.has(key);
                const latestRecord = group.records[0];
                
                const rows = [
                  <tr key={key} className="fw-history-table__row--group">
                    <td>
                      <button className="fw-expand-btn" onClick={() => toggleProduct(key)}>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td onClick={() => toggleProduct(key)}>
                      {group.image && (
                        <div className="fw-product-image">
                          <img src={group.image} alt={group.productName} />
                        </div>
                      )}
                    </td>
                    <td onClick={() => toggleProduct(key)}>
                      <div className="fw-product-cell">
                        <div className="fw-product-cell__name">{group.productName}</div>
                        <div className="fw-product-cell__meta">
                          <span className="fw-product-cell__category">{group.category}</span>
                          <span className="fw-product-cell__separator">•</span>
                          <span className="fw-product-cell__article">{group.articleNumber}</span>
                          <button
                            className="fw-article-copy-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Fallback method for copying text
                              const textarea = document.createElement('textarea');
                              textarea.value = group.articleNumber;
                              textarea.style.position = 'fixed';
                              textarea.style.opacity = '0';
                              document.body.appendChild(textarea);
                              textarea.select();
                              try {
                                document.execCommand('copy');
                              } catch (err) {
                                console.error('Failed to copy:', err);
                              }
                              document.body.removeChild(textarea);
                            }}
                            title="Копировать артикул"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                          <span className="fw-product-cell__separator">•</span>
                          <span className="fw-product-cell__color">
                            {group.color}
                          </span>
                          <span className="fw-product-cell__separator">•</span>
                          <button 
                            className="fw-batch-number"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Batch clicked:', latestRecord.batchNumber);
                            }}
                            title="Номер партии"
                          >
                            <Package className="w-3 h-3" />
                            {latestRecord.batchNumber}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-file-count">
                        <div className="fw-file-count__number">
                          {group.totalFiles} {group.totalFiles === 1 ? 'файл' : group.totalFiles < 5 ? 'файла' : 'файлов'}
                        </div>
                        <div className="fw-details-cell__meta">
                          <User className="w-3 h-3" />
                          <span>{latestRecord.uploadedBy}</span>
                          <span className="fw-details-cell__separator">·</span>
                          <Clock className="w-3 h-3" />
                          <span>{latestRecord.createdAt}</span>
                        </div>
                      </div>
                    </td>
                    <td onClick={() => toggleProduct(key)}>
                      <div className="fw-sizes-badges">
                        {group.allSizes.slice(0, 2).map((size, idx) => (
                          <span
                            key={idx}
                            className="fw-size-badge-group"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSize({ record: group.records[0], size });
                            }}
                            style={{ cursor: 'pointer' }}
                            title={`Посмотреть КИЗы размера ${size}`}
                          >
                            {size}
                          </span>
                        ))}
                        {group.allSizes.length > 2 && (
                          <span className="fw-size-badge-more">
                            +{group.allSizes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td onClick={() => toggleProduct(key)}>
                      <div className="fw-kiz-count text-[14px]">
                        {group.totalKizCount.toLocaleString()}
                      </div>
                    </td>
                    <td onClick={() => toggleProduct(key)}>
                      <div className="fw-status-group">
                        {group.completedFiles > 0 && (
                          <span className="fw-status fw-status--completed text-[13px]">
                            ✓ {group.completedFiles}
                          </span>
                        )}
                        {group.processingFiles > 0 && (
                          <span className="fw-status fw-status--processing text-[13px]">
                            ⟳ {group.processingFiles}
                          </span>
                        )}
                        {group.errorFiles > 0 && (
                          <span className="fw-status fw-status--error text-[13px]">
                            ✕ {group.errorFiles}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="fw-action-buttons">
                        <button 
                          className="fw-action-btn fw-action-btn--icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(latestRecord);
                          }}
                          title="Просмотр деталей"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="fw-action-btn fw-action-btn--icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(latestRecord);
                          }}
                          title="Скачать"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          className="fw-action-btn fw-action-btn--icon fw-action-btn--danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(latestRecord);
                          }}
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ];
                
                if (isExpanded) {
                  group.records.forEach((record) => {
                    rows.push(
                      <tr key={record.id} className="fw-history-table__row--detail">
                        <td></td>
                        <td></td>
                        <td>
                          <div className="fw-detail-filename">{record.fileName}</div>
                        </td>
                        <td>
                          <div className="fw-file-count">{record.fileSize}</div>
                        </td>
                        <td>
                          <div className="fw-sizes-badges">
                            {record.sizes.slice(0, 2).map((size, idx) => (
                              <span
                                key={idx}
                                className="fw-size-badge-group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSize({ record, size });
                                }}
                                style={{ cursor: 'pointer' }}
                                title={`Посмотреть КИЗы размера ${size}`}
                              >
                                {size}
                              </span>
                            ))}
                            {record.sizes.length > 2 && (
                              <span className="fw-size-badge-more">
                                +{record.sizes.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="fw-kiz-detail">
                            <div className="fw-kiz-detail__total">{record.kizCount.toLocaleString()}</div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-status-detail">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className={`fw-status fw-status--${record.status}`}>
                                {record.status === 'completed' ? 'Выполнено' : 
                                 record.status === 'processing' ? 'В процессе' : 'Ошибка'}
                              </span>
                              {record.status === 'error' && record.comment && (
                                <div className="fw-error-indicator">
                                  <HelpCircle className="w-4 h-4" />
                                  <div className="fw-error-tooltip">{record.comment}</div>
                                </div>
                              )}
                            </div>
                            {record.status === 'processing' && (
                              <div className="fw-progress-bar">
                                <div 
                                  className="fw-progress-bar__fill" 
                                  style={{ width: `${record.progress}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="fw-action-buttons">
                            <button 
                              className="fw-action-btn fw-action-btn--icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(record);
                              }}
                              title="Просмотр деталей"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="fw-action-btn fw-action-btn--icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(record);
                              }}
                              title="Скачать"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              className="fw-action-btn fw-action-btn--icon fw-action-btn--danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(record);
                              }}
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                }
                
                return rows;
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="fw-pagination">
        <button className="fw-pagination-btn" aria-label="Предыдущая страница">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="fw-pagination-btn fw-pagination-btn--active">1</button>
        <button className="fw-pagination-btn">2</button>
        <button className="fw-pagination-btn">3</button>
        <button className="fw-pagination-btn" aria-label="Следующая страница">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <div className="fw-modal-overlay" onClick={() => setDetailsModal(null)}>
          <div className="fw-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fw-modal__header">
              <h2 className="fw-modal__title">Детали загрузки</h2>
              <button 
                className="fw-modal__close"
                onClick={() => setDetailsModal(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="fw-modal__body">
              <div className="fw-modal-section">
                <h3 className="fw-modal-section__title">Файл</h3>
                <div className="fw-modal-field">
                  <label>Название:</label>
                  <div>{detailsModal.fileName}</div>
                </div>
                <div className="fw-modal-field">
                  <label>Размер:</label>
                  <div>{detailsModal.fileSize}</div>
                </div>
              </div>

              <div className="fw-modal-section">
                <h3 className="fw-modal-section__title">Товар</h3>
                <div className="fw-modal-field">
                  <label>Название:</label>
                  <div>{detailsModal.productName}</div>
                </div>
                <div className="fw-modal-field">
                  <label>Артикул:</label>
                  <div>{detailsModal.articleNumber}</div>
                </div>
                <div className="fw-modal-field">
                  <label>Категория:</label>
                  <div>{detailsModal.category}</div>
                </div>
                <div className="fw-modal-field">
                  <label>Цвет:</label>
                  <div className="fw-product-cell__color">
                    <span 
                      className="fw-color-indicator" 
                      style={{ backgroundColor: detailsModal.colorHex }}
                    ></span>
                    <span>{detailsModal.color}</span>
                  </div>
                </div>
                <div className="fw-modal-field">
                  <label>Размеры:</label>
                  <div className="fw-sizes-list">
                    {detailsModal.sizes.map((size, idx) => (
                      <span key={idx} className="fw-size-badge text-[12px]">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="fw-modal-section">
                <h3 className="fw-modal-section__title">КИЗы</h3>
                <div className="fw-modal-field">
                  <label>Всего КИЗов:</label>
                  <div>{detailsModal.kizCount.toLocaleString()}</div>
                </div>
                <div className="fw-modal-field">
                  <label>Использовано:</label>
                  <div>{detailsModal.usedKizCount.toLocaleString()}</div>
                </div>
                <div className="fw-modal-field">
                  <label>Доступно:</label>
                  <div>{(detailsModal.kizCount - detailsModal.usedKizCount).toLocaleString()}</div>
                </div>
              </div>

              <div className="fw-modal-section">
                <h3 className="fw-modal-section__title">Статус и время</h3>
                <div className="fw-modal-field">
                  <label>Статус:</label>
                  <span className={`fw-status fw-status--${detailsModal.status}`}>
                    {detailsModal.status === 'completed' ? 'Выполнено' : 
                     detailsModal.status === 'processing' ? 'В процессе' : 'Ошибка'}
                  </span>
                </div>
                <div className="fw-modal-field">
                  <label>Создан:</label>
                  <div>{detailsModal.createdAt}</div>
                </div>
                {detailsModal.completedAt && (
                  <div className="fw-modal-field">
                    <label>Завершён:</label>
                    <div>{detailsModal.completedAt}</div>
                  </div>
                )}
                {detailsModal.processingTime && (
                  <div className="fw-modal-field">
                    <label>Время обработки:</label>
                    <div>{detailsModal.processingTime}</div>
                  </div>
                )}
                {detailsModal.status === 'processing' && (
                  <div className="fw-modal-field">
                    <label>Прогресс:</label>
                    <div className="fw-progress-bar fw-progress-bar--large">
                      <div 
                        className="fw-progress-bar__fill" 
                        style={{ width: `${detailsModal.progress}%` }}
                      ></div>
                      <span className="fw-progress-bar__text">{detailsModal.progress}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="fw-modal-section">
                <h3 className="fw-modal-section__title">Пользователь</h3>
                <div className="fw-modal-field">
                  <label>Загружено:</label>
                  <div className="fw-user-info">
                    <div className="fw-user-avatar">{detailsModal.uploadedByAvatar}</div>
                    <span>{detailsModal.uploadedBy}</span>
                  </div>
                </div>
              </div>

              {detailsModal.comment && (
                <div className="fw-modal-section">
                  <h3 className="fw-modal-section__title">Комментарий</h3>
                  <div className="fw-modal-comment">
                    {detailsModal.comment}
                  </div>
                </div>
              )}
            </div>
            <div className="fw-modal__footer">
              <button 
                className="fw-modal-btn fw-modal-btn--secondary"
                onClick={() => setDetailsModal(null)}
              >
                Закрыть
              </button>
              <button 
                className="fw-modal-btn fw-modal-btn--primary"
                onClick={() => {
                  handleDownload(detailsModal);
                  setDetailsModal(null);
                }}
              >
                <Download className="w-4 h-4" />
                Скачать файл
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KIZ Details Modal */}
      {selectedSize && (
        <KIZDetailsModal
          onClose={() => setSelectedSize(null)}
          productName={selectedSize.record.productName}
          size={selectedSize.size}
          totalKiz={selectedSize.record.kizCount}
        />
      )}
    </div>
  );
}