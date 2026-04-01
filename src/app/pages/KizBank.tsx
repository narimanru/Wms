import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Eye,
  Printer,
  Package,
  Factory,
  Trash2,
  X,
  ChevronRight,
  AlertCircle,
  Clock,
  MapPin,
  Box,
  Truck,
  RotateCcw,
  LogOut,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronDown,
  BarChart3,
  History,
  Settings,
  Move
} from 'lucide-react';

interface KizItem {
  id: string;
  kiz: string;
  kizFull: string;
  gtin: string;
  product: string;
  size: string;
  status: 'available' | 'in-work' | 'attached' | 'in-warehouse' | 'in-delivery' | 'accepted' | 'rejected' | 'withdrawn';
  process: string;
  processDetail: string;
  location: string;
  delivery?: string;
  lastAction: string;
  hasWarning?: boolean;
  hasError?: boolean;
}

interface SizeData {
  size: string;
  barcode: string;
  inStock: number;
  freeKiz: number;
  printed: number;
  total: number;
  balance: number;
  inCirculation: number;
  kizList?: KizItem[];
}

interface ProductData {
  id: string;
  name: string;
  article: string;
  color: string;
  category: string;
  image: string;
  inStock: number;
  freeKiz: number;
  printed: number;
  totalKiz: number;
  balance: number;
  inCirculation: number;
  withdrawn: number;
  blocked: number;
  hasProblems?: { notAccepted?: number; notUsed?: number };
  sizes: SizeData[];
}

interface ProcessCard {
  product: string;
  productImage: string;
  count: number;
  status: string;
  location: string;
}

const MOCK_KIZ_DATA: KizItem[] = [
  {
    id: '1',
    kiz: '01046...789',
    kizFull: '0104607001234567215abc123456789def',
    gtin: '04607001234567',
    product: 'Футболка базовая хлопок',
    size: 'L',
    status: 'accepted',
    process: 'WB',
    processDetail: 'WB-12345',
    location: 'Склад WB',
    delivery: 'WB-12345',
    lastAction: '2026-03-27 10:30'
  },
  {
    id: '2',
    kiz: '01046...123',
    kizFull: '0104607001234567215xyz987654321abc',
    gtin: '04607001234567',
    product: 'Футболка базовая хлопок',
    size: 'M',
    status: 'in-delivery',
    process: 'Поставка',
    processDetail: 'WB-12345',
    location: 'В пути',
    delivery: 'WB-12345',
    lastAction: '2026-03-27 08:15'
  },
  {
    id: '3',
    kiz: '01046...456',
    kizFull: '0104607001234567215qwe456789012345',
    gtin: '04607001234567',
    product: 'Футболка базовая хлопок',
    size: 'S',
    status: 'rejected',
    process: 'WB',
    processDetail: 'WB-12345',
    location: 'Склад WB',
    delivery: 'WB-12345',
    lastAction: '2026-03-26 14:20',
    hasError: true
  },
  {
    id: '4',
    kiz: '01046...890',
    kizFull: '0104607007654321215lmn890123456789',
    gtin: '04607007654321',
    product: 'Джинсы классические',
    size: '32',
    status: 'in-warehouse',
    process: 'Склад',
    processDetail: 'Ячейка A-12',
    location: 'Ячейка A-12',
    lastAction: '2026-03-25 16:45'
  },
  {
    id: '5',
    kiz: '01046...234',
    kizFull: '0104607007654321215rst234567890123',
    gtin: '04607007654321',
    product: 'Джинсы классические',
    size: '34',
    status: 'attached',
    process: 'Производство',
    processDetail: 'Фабрика 1',
    location: 'Фабрика 1',
    lastAction: '2026-03-24 11:00'
  },
  {
    id: '6',
    kiz: '01046...567',
    kizFull: '0104607009876543215uvw567890123456',
    gtin: '04607009876543',
    product: 'Свитшот оверсайз',
    size: 'XL',
    status: 'attached',
    process: 'Производство',
    processDetail: 'Фабрика 2',
    location: 'Фабрика 2',
    lastAction: '2026-03-23 09:00',
    hasWarning: true
  },
  {
    id: '7',
    kiz: '01046...678',
    kizFull: '0104607009876543215hij678901234567',
    gtin: '04607009876543',
    product: 'Свитшот оверсайз',
    size: 'L',
    status: 'in-warehouse',
    process: 'Склад',
    processDetail: 'Без коробки',
    location: 'Ячейка B-05',
    lastAction: '2026-03-22 15:30',
    hasWarning: true
  },
  {
    id: '8',
    kiz: '01046...999',
    kizFull: '0104607001234567215aaa999888777666',
    gtin: '04607001234567',
    product: 'Футболка базовая хлопок',
    size: 'XL',
    status: 'available',
    process: 'Банк',
    processDetail: 'Свободен',
    location: 'Банк КИЗов',
    lastAction: '2026-03-20 09:00'
  }
];

const MOCK_PRODUCTS: ProductData[] = [
  {
    id: '1',
    name: 'Футболка базовая хлопок',
    article: 'TS-001',
    color: 'Белый',
    category: 'Футболки',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    inStock: 150,
    freeKiz: 45,
    printed: 120,
    totalKiz: 165,
    balance: 15,
    inCirculation: 140,
    withdrawn: 0,
    blocked: 5,
    hasProblems: { notAccepted: 2, notUsed: 5 },
    sizes: [
      { size: 'S', barcode: '2000000123456', inStock: 30, freeKiz: 10, printed: 25, total: 35, balance: 5, inCirculation: 28 },
      { size: 'M', barcode: '2000000123457', inStock: 50, freeKiz: 15, printed: 40, total: 55, balance: 5, inCirculation: 45 },
      { size: 'L', barcode: '2000000123458', inStock: 45, freeKiz: 12, printed: 35, total: 47, balance: 2, inCirculation: 42 },
      { size: 'XL', barcode: '2000000123459', inStock: 25, freeKiz: 8, printed: 20, total: 28, balance: 3, inCirculation: 25 }
    ]
  },
  {
    id: '2',
    name: 'Джинсы классические',
    article: 'JN-002',
    color: 'Синий',
    category: 'Джинсы',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop',
    inStock: 85,
    freeKiz: 25,
    printed: 70,
    totalKiz: 95,
    balance: 10,
    inCirculation: 80,
    withdrawn: 0,
    blocked: 5,
    sizes: [
      { size: '30', barcode: '2000000234567', inStock: 20, freeKiz: 6, printed: 18, total: 24, balance: 4, inCirculation: 20 },
      { size: '32', barcode: '2000000234568', inStock: 35, freeKiz: 10, printed: 30, total: 40, balance: 5, inCirculation: 35 },
      { size: '34', barcode: '2000000234569', inStock: 30, freeKiz: 9, printed: 22, total: 31, balance: 1, inCirculation: 25 }
    ]
  },
  {
    id: '3',
    name: 'Свитшот оверсайз',
    article: 'SW-003',
    color: 'Черный',
    category: 'Свитшоты',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop',
    inStock: 60,
    freeKiz: 18,
    printed: 50,
    totalKiz: 68,
    balance: 8,
    inCirculation: 55,
    withdrawn: 3,
    blocked: 2,
    sizes: [
      { size: 'M', barcode: '2000000345678', inStock: 25, freeKiz: 7, printed: 20, total: 27, balance: 2, inCirculation: 22 },
      { size: 'L', barcode: '2000000345679', inStock: 20, freeKiz: 6, printed: 18, total: 24, balance: 4, inCirculation: 20 },
      { size: 'XL', barcode: '2000000345680', inStock: 15, freeKiz: 5, printed: 12, total: 17, balance: 2, inCirculation: 13 }
    ]
  }
];

const STATUS_CONFIG = {
  available: { label: 'Доступен', color: '#6B7280', bg: '#F3F4F6', description: 'КИЗ не назначен' },
  'in-work': { label: 'В работе', color: '#3B82F6', bg: '#EFF6FF', description: 'КИЗ в процессе обработки' },
  attached: { label: 'Наклеен', color: '#8B5CF6', bg: '#F5F3FF', description: 'КИЗ наклеен на товар' },
  'in-warehouse': { label: 'На складе', color: '#06B6D4', bg: '#ECFEFF', description: 'КИЗ на складе' },
  'in-delivery': { label: 'В поставке', color: '#F59E0B', bg: '#FEF3C7', description: 'КИЗ в пути к маркетплейсу' },
  accepted: { label: 'Принят WB', color: '#10B981', bg: '#ECFDF5', description: 'КИЗ успешно принят WB' },
  rejected: { label: 'Не принят WB', color: '#EF4444', bg: '#FEF2F2', description: 'КИЗ отклонён WB' },
  withdrawn: { label: 'Выведен', color: '#1F2937', bg: '#F9FAFB', description: 'КИЗ выведен из оборота' }
};

const ATTENTION_ITEMS = [
  { type: 'error', label: 'Не принят WB', count: 12, action: 'Разобрать', icon: '❗' },
  { type: 'warning', label: 'Не использованы', count: 30, action: 'Обработать', icon: '⚠️' },
  { type: 'warning', label: 'Без коробки', count: 20, action: 'Упаковать', icon: '📦' }
];

const PROCESS_KPI = [
  { key: 'production', label: 'В производстве', count: 89, icon: '🏭', color: '#8B5CF6' },
  { key: 'warehouse', label: 'На складе', count: 567, icon: '📦', color: '#06B6D4' },
  { key: 'boxes', label: 'В коробках', count: 432, icon: '📦', color: '#3B82F6' },
  { key: 'delivery', label: 'В поставке', count: 234, icon: '🚚', color: '#F59E0B' },
  { key: 'wb', label: 'В WB', count: 1240, icon: '✅', color: '#10B981' },
  { key: 'rejected', label: 'Не принят WB', count: 12, icon: '❌', color: '#EF4444' },
  { key: 'withdrawal', label: 'Под вывод', count: 3, icon: '🗑️', color: '#6B7280' }
];

const PROCESS_COLUMNS = [
  {
    id: 'production',
    title: 'Производство',
    icon: '🏭',
    color: '#8B5CF6',
    cards: [
      { product: 'Футболка базовая хлопок', productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop', count: 45, status: 'Фабрика 1', location: 'Цех 2' },
      { product: 'Свитшот оверсайз', productImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=60&h=60&fit=crop', count: 32, status: 'Фабрика 2', location: 'Цех 1' },
      { product: 'Джинсы классические', productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=60&h=60&fit=crop', count: 12, status: 'Фабрика 1', location: 'Цех 3' }
    ]
  },
  {
    id: 'warehouse',
    title: 'Склад',
    icon: '📦',
    color: '#06B6D4',
    cards: [
      { product: 'Футболка базовая хлопок', productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop', count: 120, status: 'Ячейка A-12', location: 'Зона А' },
      { product: 'Джинсы классические', productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=60&h=60&fit=crop', count: 85, status: 'Ячейка B-05', location: 'Зона B' },
      { product: 'Свитшот оверсайз', productImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=60&h=60&fit=crop', count: 60, status: 'Ячейка C-08', location: 'Зона C' }
    ]
  },
  {
    id: 'delivery',
    title: 'Поставка',
    icon: '🚚',
    color: '#F59E0B',
    cards: [
      { product: 'Футболка базовая хлопок', productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop', count: 150, status: 'WB-12345', location: 'В пути' },
      { product: 'Джинсы классические', productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=60&h=60&fit=crop', count: 84, status: 'WB-67890', location: 'В пути' }
    ]
  },
  {
    id: 'wb',
    title: 'WB',
    icon: '✅',
    color: '#10B981',
    cards: [
      { product: 'Футболка базовая хлопок', productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop', count: 850, status: 'Принято', location: 'Склад WB' },
      { product: 'Джинсы классические', productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=60&h=60&fit=crop', count: 320, status: 'Принято', location: 'Склад WB' },
      { product: 'Свитшот оверсайз', productImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=60&h=60&fit=crop', count: 70, status: 'Принято', location: 'Склад WB' }
    ]
  },
  {
    id: 'problems',
    title: 'Проблемы',
    icon: '⚠️',
    color: '#EF4444',
    cards: [
      { product: 'Футболка базовая хлопок', productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=60&h=60&fit=crop', count: 2, status: 'Не принят WB', location: 'WB-12345' },
      { product: 'Свитшот оверсайз', productImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=60&h=60&fit=crop', count: 5, status: 'Ошибка', location: 'Конфликт' }
    ]
  }
];

type GroupingMode = 'products' | 'kiz' | 'process';

export default function KizBank() {
  const [products] = useState<ProductData[]>(MOCK_PRODUCTS);
  const [kizData] = useState<KizItem[]>(MOCK_KIZ_DATA);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [groupingMode, setGroupingMode] = useState<GroupingMode>('products');
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [dateFilterType, setDateFilterType] = useState('upload');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [hoveredKiz, setHoveredKiz] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState<string>('all');

  const totalItems = groupingMode === 'kiz' ? 10240 : 240;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const toggleProductExpand = (productId: string) => {
    setExpandedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleAllItems = () => {
    if (selectedItems.length === kizData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(kizData.map(k => k.id));
    }
  };

  const setQuickDate = (days: number) => {
    const today = new Date();
    const past = new Date();
    past.setDate(today.getDate() - days);
    setDateFrom(past.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  };

  const copyKiz = (kiz: string) => {
    navigator.clipboard.writeText(kiz);
  };

  const getAvailableActions = (status: KizItem['status']) => {
    switch (status) {
      case 'rejected':
        return ['Восстановить', 'Перепечатать'];
      case 'available':
        return ['Привязать', 'В производство'];
      case 'accepted':
        return ['🔒 Только просмотр'];
      default:
        return ['Печать', 'В производство', 'В поставку'];
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FB' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '24px 32px', borderBottom: '1px solid #E6E8EC' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0,
                marginBottom: '4px'
              }}>
                Честный знак
              </h1>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                Управление кодами маркировки
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  padding: '10px 18px',
                  background: 'white',
                  color: '#1F2937',
                  border: '1px solid #E6E8EC',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F8F9FB';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#E6E8EC';
                }}
              >
                <BarChart3 size={16} strokeWidth={1.5} />
                Статистика
              </button>
              <button
                style={{
                  padding: '10px 18px',
                  background: 'white',
                  color: '#1F2937',
                  border: '1px solid #E6E8EC',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F8F9FB';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#E6E8EC';
                }}
              >
                <Settings size={16} strokeWidth={1.5} />
                Настройки
              </button>
              <button
                style={{
                  padding: '10px 18px',
                  background: 'white',
                  color: '#1F2937',
                  border: '1px solid #E6E8EC',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F8F9FB';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#E6E8EC';
                }}
              >
                <Download size={16} strokeWidth={1.5} />
                Экспорт
              </button>
              <button
                style={{
                  padding: '10px 18px',
                  background: '#1F2937',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#111827';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1F2937';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                }}
              >
                <Upload size={16} strokeWidth={1.5} />
                Импорт КИЗов
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 32px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Filters */}
          <div style={{
            background: 'white',
            borderRadius: '14px',
            border: '1px solid #E6E8EC',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 320px', minWidth: '280px' }}>
                <Search
                  size={18}
                  strokeWidth={1.5}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF'
                  }}
                />
                <input
                  type="text"
                  placeholder="Поиск по КИЗ, GTIN или товару..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 42px',
                    border: '1px solid #E6E8EC',
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white',
                    color: '#1F2937',
                    transition: 'border 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#E6E8EC'}
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #E6E8EC',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  color: '#1F2937',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <option value="all">Все категории</option>
                <option value="tshirts">Футболки</option>
                <option value="jeans">Джинсы</option>
                <option value="sweatshirts">Свитшоты</option>
              </select>

              {/* Color Filter */}
              <select
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #E6E8EC',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  color: '#1F2937',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <option value="all">Все цвета</option>
                <option value="white">Белый</option>
                <option value="black">Черный</option>
                <option value="blue">Синий</option>
              </select>

              {/* Warehouse Filter */}
              <select
                value={warehouseFilter}
                onChange={(e) => setWarehouseFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #E6E8EC',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  color: '#1F2937',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <option value="all">Все склады</option>
                <option value="main">Основной склад</option>
                <option value="wb">Склад WB</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #E6E8EC',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  color: '#1F2937',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <option value="all">Все статусы</option>
                <option value="available">Доступен</option>
                <option value="in-work">В работе</option>
                <option value="accepted">Принят WB</option>
              </select>
            </div>

            {/* Date Filter */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={dateFilterType}
                onChange={(e) => setDateFilterType(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #E6E8EC',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  color: '#1F2937',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <option value="upload">Загрузка</option>
                <option value="print">Печать</option>
                <option value="shipment">Отгрузка</option>
                <option value="wb">WB</option>
              </select>

              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #E6E8EC',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  color: '#1F2937'
                }}
              />

              <span style={{ color: '#9CA3AF', fontWeight: '500' }}>—</span>

              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #E6E8EC',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'white',
                  color: '#1F2937'
                }}
              />

              {/* Quick Dates */}
              {[
                { label: 'Сегодня', days: 0 },
                { label: '7 дней', days: 7 },
                { label: '30 дней', days: 30 }
              ].map((quick) => (
                <button
                  key={quick.days}
                  onClick={() => setQuickDate(quick.days)}
                  style={{
                    padding: '10px 16px',
                    background: 'white',
                    color: '#6B7280',
                    border: '1px solid #E6E8EC',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F8F9FB';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#6B7280';
                  }}
                >
                  {quick.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grouping Mode Switcher */}
          <div style={{
            background: 'white',
            borderRadius: '14px',
            border: '1px solid #E6E8EC',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>Группировка:</span>
              <div style={{ display: 'flex', gap: '6px', background: '#F8F9FB', padding: '4px', borderRadius: '10px' }}>
                {([
                  { mode: 'products', label: 'По товарам' },
                  { mode: 'kiz', label: 'По КИЗам' },
                  { mode: 'process', label: 'По процессам' }
                ] as { mode: GroupingMode; label: string }[]).map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setGroupingMode(item.mode)}
                    style={{
                      padding: '8px 16px',
                      background: groupingMode === item.mode ? 'white' : 'transparent',
                      color: groupingMode === item.mode ? '#1F2937' : '#6B7280',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: groupingMode === item.mode ? '0 1px 2px rgba(0, 0, 0, 0.06)' : 'none'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Filters (for KIZ mode) */}
          {groupingMode === 'kiz' && (
            <div style={{
              background: 'white',
              borderRadius: '14px',
              border: '1px solid #E6E8EC',
              padding: '16px 20px',
              marginBottom: '20px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'Все КИЗы', icon: null },
                  { key: 'problems', label: 'Только проблемы', icon: AlertTriangle },
                  { key: 'rejected', label: 'Не принят WB', icon: X },
                  { key: 'production', label: 'В производстве', icon: Factory },
                  { key: 'warehouse', label: 'На складе', icon: Box },
                  { key: 'no-box', label: 'Без коробки', icon: Package }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setQuickFilter(filter.key)}
                    style={{
                      padding: '8px 14px',
                      background: quickFilter === filter.key ? '#EFF6FF' : 'white',
                      color: quickFilter === filter.key ? '#3B82F6' : '#6B7280',
                      border: `1px solid ${quickFilter === filter.key ? '#3B82F6' : '#E6E8EC'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {filter.icon && <filter.icon size={14} strokeWidth={1.5} />}
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ТРЕБУЕТ ВНИМАНИЯ */}
          {groupingMode !== 'process' && (
            <div style={{
              background: 'white',
              borderRadius: '14px',
              border: '1px solid #E6E8EC',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
            }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: '600', 
                color: '#6B7280', 
                marginBottom: '18px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Требует внимания
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {ATTENTION_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px 18px',
                      background: item.type === 'error' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                      border: `1px solid ${item.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = item.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = item.type === 'error' ? 'rgba(239, 68, 68, 0.06)' : 'rgba(245, 158, 11, 0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937', marginBottom: '2px' }}>
                          {item.count} {item.label}
                        </div>
                      </div>
                    </div>
                    <button
                      style={{
                        padding: '6px 14px',
                        background: 'white',
                        color: item.type === 'error' ? '#EF4444' : '#F59E0B',
                        border: `1px solid ${item.type === 'error' ? '#EF4444' : '#F59E0B'}`,
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Process KPI (for process mode) */}
          {groupingMode === 'process' && (
            <div style={{
              background: 'white',
              borderRadius: '14px',
              border: '1px solid #E6E8EC',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '14px' }}>
                {PROCESS_KPI.map((kpi) => (
                  <div
                    key={kpi.key}
                    style={{
                      padding: '18px',
                      background: `${kpi.color}08`,
                      border: `1px solid ${kpi.color}30`,
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>{kpi.icon}</div>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: kpi.color, marginBottom: '6px' }}>
                      {kpi.count}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
                      {kpi.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedItems.length > 0 && groupingMode === 'kiz' && (
            <div style={{
              background: 'rgba(59, 130, 246, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '14px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
            }}>
              <span style={{ fontSize: '15px', color: '#1E40AF', fontWeight: '600' }}>
                Выбрано: {selectedItems.length} КИЗов
              </span>
              <div style={{ flex: 1 }} />
              {[
                { label: 'Печать', icon: Printer },
                { label: 'В производство', icon: Factory },
                { label: 'В поставку', icon: Package },
                { label: 'Переместить', icon: Move },
                { label: 'Удалить', icon: Trash2, danger: true }
              ].map((action, idx) => (
                <button
                  key={idx}
                  style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: action.danger ? '#EF4444' : '#1E40AF',
                    border: `1px solid ${action.danger ? '#EF4444' : '#3B82F6'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <action.icon size={14} strokeWidth={1.5} />
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Products View (По товарам) */}
          {groupingMode === 'products' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '14px', 
              border: '1px solid #E6E8EC', 
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
            }}>
              {products.map((product, idx) => {
                const isExpanded = expandedProducts.includes(product.id);
                return (
                  <div key={product.id} style={{ borderTop: idx > 0 ? '1px solid #E6E8EC' : 'none' }}>
                    {/* Product Row */}
                    <div style={{ 
                      padding: '24px', 
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8F9FB'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                        {/* Expand Button */}
                        <button
                          onClick={() => toggleProductExpand(product.id)}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#F8F9FB',
                            border: '1px solid #E6E8EC',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#6B7280',
                            transition: 'all 0.2s'
                          }}
                        >
                          <ChevronRight 
                            size={18} 
                            strokeWidth={2} 
                            style={{ 
                              transform: isExpanded ? 'rotate(90deg)' : 'none',
                              transition: 'transform 0.2s'
                            }} 
                          />
                        </button>

                        {/* Product Image */}
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: '1px solid #E6E8EC'
                          }}
                        />

                        {/* Product Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                            <h3 style={{ 
                              fontSize: '16px', 
                              fontWeight: '600', 
                              color: '#1F2937', 
                              margin: 0 
                            }}>
                              {product.name}
                            </h3>
                            <span style={{ 
                              fontSize: '13px', 
                              color: '#6B7280',
                              background: '#F8F9FB',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontWeight: '500'
                            }}>
                              {product.article}
                            </span>
                            <span style={{ 
                              fontSize: '13px', 
                              color: '#6B7280' 
                            }}>
                              • {product.color}
                            </span>
                          </div>

                          {/* Problems */}
                          {product.hasProblems && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                              {product.hasProblems.notAccepted && (
                                <span style={{
                                  fontSize: '13px',
                                  color: '#EF4444',
                                  background: 'rgba(239, 68, 68, 0.08)',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontWeight: '500'
                                }}>
                                  ⚠️ {product.hasProblems.notAccepted} не приняты WB
                                </span>
                              )}
                              {product.hasProblems.notUsed && (
                                <span style={{
                                  fontSize: '13px',
                                  color: '#F59E0B',
                                  background: 'rgba(245, 158, 11, 0.08)',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontWeight: '500'
                                }}>
                                  ⚠️ {product.hasProblems.notUsed} не использованы
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* KPI Metrics */}
                        <div style={{ display: 'flex', gap: '24px' }}>
                          {[
                            { label: 'На складе', value: product.inStock },
                            { label: 'Свободные КИЗ', value: product.freeKiz, highlight: true },
                            { label: 'Распечатано', value: product.printed },
                            { label: 'Всего КИЗ', value: product.totalKiz },
                            { 
                              label: 'Баланс', 
                              value: product.balance,
                              color: product.balance < 0 ? '#EF4444' : product.balance > 10 ? '#10B981' : '#F59E0B'
                            },
                            { label: 'В обороте', value: product.inCirculation }
                          ].map((metric, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                              <div style={{ 
                                fontSize: '20px', 
                                fontWeight: '600', 
                                color: metric.color || (metric.highlight ? '#3B82F6' : '#1F2937'),
                                marginBottom: '4px'
                              }}>
                                {metric.value}
                              </div>
                              <div style={{ fontSize: '12px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px', paddingLeft: '52px' }}>
                        {[
                          { label: 'История загрузок', icon: History },
                          { label: 'Загрузить КИЗы', icon: Upload },
                          { label: 'Печать', icon: Printer },
                          { label: 'В поставку', icon: Package },
                          { label: 'В производство', icon: Factory },
                          { label: 'Выгрузить', icon: Download }
                        ].map((action, i) => (
                          <button
                            key={i}
                            style={{
                              padding: '8px 14px',
                              background: 'white',
                              color: '#6B7280',
                              border: '1px solid #E6E8EC',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#F8F9FB';
                              e.currentTarget.style.color = '#1F2937';
                              e.currentTarget.style.borderColor = '#D1D5DB';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.color = '#6B7280';
                              e.currentTarget.style.borderColor = '#E6E8EC';
                            }}
                          >
                            <action.icon size={14} strokeWidth={1.5} />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sizes Table (Expanded) */}
                    {isExpanded && (
                      <div style={{ 
                        background: '#F8F9FB',
                        padding: '16px 24px 16px 76px',
                        borderTop: '1px solid #E6E8EC'
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #E6E8EC' }}>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'left',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>Размер</th>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'left',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>ШК</th>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>На складе</th>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>Свободные КИЗ</th>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>Распечатано</th>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>Всего</th>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>Баланс</th>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'center',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>В обороте</th>
                              <th style={{ 
                                padding: '10px 16px', 
                                textAlign: 'right',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>Действия</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.sizes.map((size, sizeIdx) => (
                              <tr 
                                key={sizeIdx}
                                style={{
                                  background: 'white',
                                  borderBottom: sizeIdx < product.sizes.length - 1 ? '1px solid #E6E8EC' : 'none'
                                }}
                              >
                                <td style={{ padding: '14px 16px' }}>
                                  <span style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#1F2937' 
                                  }}>
                                    {size.size}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  <span style={{ 
                                    fontSize: '13px', 
                                    color: '#6B7280',
                                    fontFamily: 'monospace'
                                  }}>
                                    {size.barcode}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                  <span style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                                    {size.inStock}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                  <span style={{ fontSize: '14px', color: '#3B82F6', fontWeight: '600' }}>
                                    {size.freeKiz}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                  <span style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                                    {size.printed}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                  <span style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                                    {size.total}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                  <span style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '600',
                                    color: size.balance < 0 ? '#EF4444' : size.balance > 5 ? '#10B981' : '#F59E0B'
                                  }}>
                                    {size.balance > 0 ? '+' : ''}{size.balance}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                  <span style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                                    {size.inCirculation}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 16px' }}>
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                    <button
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'white',
                                        border: '1px solid #E6E8EC',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: '#6B7280',
                                        transition: 'all 0.2s'
                                      }}
                                      title="Печать"
                                    >
                                      <Printer size={14} strokeWidth={1.5} />
                                    </button>
                                    <button
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'white',
                                        border: '1px solid #E6E8EC',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        color: '#6B7280',
                                        transition: 'all 0.2s'
                                      }}
                                      title="В поставку"
                                    >
                                      <Package size={14} strokeWidth={1.5} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pagination */}
              <div style={{
                padding: '18px 20px',
                borderTop: '1px solid #E6E8EC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8F9FB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>Показать:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #E6E8EC',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'white',
                      color: '#1F2937',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                      border: '1px solid #E6E8EC',
                      borderRadius: '8px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      color: currentPage === 1 ? '#D1D5DB' : '#6B7280',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>

                  {[1, 2, 3, 4].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: currentPage === page ? '#1F2937' : 'white',
                        color: currentPage === page ? 'white' : '#6B7280',
                        border: `1px solid ${currentPage === page ? '#1F2937' : '#E6E8EC'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                      border: '1px solid #E6E8EC',
                      borderRadius: '8px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      color: currentPage === totalPages ? '#D1D5DB' : '#6B7280',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ChevronRightIcon size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
                  Всего товаров: <span style={{ color: '#1F2937', fontWeight: '600' }}>{totalItems}</span>
                </div>
              </div>
            </div>
          )}

          {/* KIZ View (По КИЗам) */}
          {groupingMode === 'kiz' && (
            <div style={{ 
              background: 'white', 
              borderRadius: '14px', 
              border: '1px solid #E6E8EC', 
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8F9FB' }}>
                    <th style={{ padding: '14px 20px', width: '48px' }}>
                      <input
                        type="checkbox"
                        checked={selectedItems.length === kizData.length}
                        onChange={toggleAllItems}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      КИЗ
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      GTIN
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Товар
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: '90px'
                    }}>
                      Размер
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: '150px'
                    }}>
                      Статус
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Процесс
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Локация
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Поставка
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: '150px'
                    }}>
                      Дата
                    </th>
                    <th style={{
                      padding: '14px 20px',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      width: '140px'
                    }}>
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kizData.map((kiz, index) => {
                    const statusConfig = STATUS_CONFIG[kiz.status];
                    const bgColor = kiz.hasError ? 'rgba(239, 68, 68, 0.05)' : kiz.hasWarning ? 'rgba(245, 158, 11, 0.05)' : 'transparent';
                    const hoverBg = kiz.hasError ? 'rgba(239, 68, 68, 0.08)' : kiz.hasWarning ? 'rgba(245, 158, 11, 0.08)' : '#F8F9FB';
                    
                    return (
                      <tr
                        key={kiz.id}
                        style={{
                          borderTop: '1px solid #E6E8EC',
                          transition: 'background 0.15s',
                          background: bgColor
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = bgColor;
                        }}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(kiz.id)}
                            onChange={() => toggleItemSelection(kiz.id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '16px 20px', position: 'relative' }}>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                            onMouseEnter={() => setHoveredKiz(kiz.id)}
                            onMouseLeave={() => setHoveredKiz(null)}
                          >
                            <span style={{ fontSize: '14px', color: '#1F2937', fontFamily: 'monospace', fontWeight: '500' }}>
                              {kiz.kiz}
                            </span>
                            <button
                              onClick={() => copyKiz(kiz.kizFull)}
                              style={{
                                padding: '5px',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#6B7280',
                                borderRadius: '6px',
                                transition: 'all 0.2s'
                              }}
                              title="Копировать КИЗ"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F8F9FB';
                                e.currentTarget.style.color = '#1F2937';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#6B7280';
                              }}
                            >
                              <Copy size={13} strokeWidth={1.5} />
                            </button>
                            
                            {/* Tooltip with full code */}
                            {hoveredKiz === kiz.id && (
                              <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: '20px',
                                marginTop: '6px',
                                background: '#1F2937',
                                color: 'white',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                whiteSpace: 'nowrap',
                                zIndex: 1000,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                              }}>
                                {kiz.kizFull}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <button
                            onClick={() => {/* Navigate to product */}}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: '#3B82F6',
                              fontFamily: 'monospace',
                              fontWeight: '500',
                              textDecoration: 'none',
                              transition: 'color 0.2s'
                            }}
                            title="Перейти к товару"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#3B82F6'}
                          >
                            {kiz.gtin}
                          </button>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500' }}>
                            {kiz.product}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '14px', color: '#1F2937' }}>
                            {kiz.size}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', position: 'relative' }}>
                          <span 
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '500',
                              color: statusConfig.color,
                              background: statusConfig.bg,
                              cursor: 'help'
                            }}
                            title={statusConfig.description}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: '14px', color: '#1F2937', fontWeight: '500', marginBottom: '3px' }}>
                            {kiz.process}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6B7280' }}>
                            {kiz.processDetail}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '14px', color: '#6B7280' }}>
                            {kiz.location}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          {kiz.delivery ? (
                            <span style={{ fontSize: '14px', color: '#3B82F6', fontWeight: '500' }}>
                              {kiz.delivery}
                            </span>
                          ) : (
                            <span style={{ fontSize: '14px', color: '#D1D5DB' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '13px', color: '#6B7280' }}>
                            {kiz.lastAction}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white',
                                border: '1px solid #E6E8EC',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: '#6B7280',
                                transition: 'all 0.2s'
                              }}
                              title={getAvailableActions(kiz.status).join(', ')}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F8F9FB';
                                e.currentTarget.style.color = '#1F2937';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#6B7280';
                              }}
                            >
                              <Eye size={14} strokeWidth={1.5} />
                            </button>
                            {kiz.status !== 'accepted' && (
                              <>
                                <button
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'white',
                                    border: '1px solid #E6E8EC',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: '#6B7280',
                                    transition: 'all 0.2s'
                                  }}
                                  title="Печать"
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#F8F9FB';
                                    e.currentTarget.style.color = '#1F2937';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.color = '#6B7280';
                                  }}
                                >
                                  <Printer size={14} strokeWidth={1.5} />
                                </button>
                                <button
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'white',
                                    border: '1px solid #E6E8EC',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: '#6B7280',
                                    transition: 'all 0.2s'
                                  }}
                                  title="Удалить"
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#FEF2F2';
                                    e.currentTarget.style.color = '#EF4444';
                                    e.currentTarget.style.borderColor = '#FCA5A5';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.color = '#6B7280';
                                    e.currentTarget.style.borderColor = '#E6E8EC';
                                  }}
                                >
                                  <Trash2 size={14} strokeWidth={1.5} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{
                padding: '18px 20px',
                borderTop: '1px solid #E6E8EC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#F8F9FB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>Показать:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #E6E8EC',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      background: 'white',
                      color: '#1F2937',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                      border: '1px solid #E6E8EC',
                      borderRadius: '8px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      color: currentPage === 1 ? '#D1D5DB' : '#6B7280',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>

                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: currentPage === page ? '#1F2937' : 'white',
                        color: currentPage === page ? 'white' : '#6B7280',
                        border: `1px solid ${currentPage === page ? '#1F2937' : '#E6E8EC'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                      border: '1px solid #E6E8EC',
                      borderRadius: '8px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      color: currentPage === totalPages ? '#D1D5DB' : '#6B7280',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ChevronRightIcon size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
                  Всего КИЗов: <span style={{ color: '#1F2937', fontWeight: '600' }}>{totalItems.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Process View (По процессам) - Kanban Style */}
          {groupingMode === 'process' && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '16px',
              overflowX: 'auto'
            }}>
              {PROCESS_COLUMNS.map((column) => (
                <div 
                  key={column.id}
                  style={{
                    background: 'white',
                    borderRadius: '14px',
                    border: `2px solid ${column.color}30`,
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                    minWidth: '280px'
                  }}
                >
                  {/* Column Header */}
                  <div style={{
                    padding: '16px',
                    background: `${column.color}15`,
                    borderBottom: `2px solid ${column.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{column.icon}</span>
                      <h3 style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#1F2937',
                        margin: 0
                      }}>
                        {column.title}
                      </h3>
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: column.color,
                      background: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px'
                    }}>
                      {column.cards.reduce((sum, card) => sum + card.count, 0)}
                    </span>
                  </div>

                  {/* Column Cards */}
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {column.cards.map((card, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '14px',
                          background: '#F8F9FB',
                          border: '1px solid #E6E8EC',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = column.color;
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#F8F9FB';
                          e.currentTarget.style.borderColor = '#E6E8EC';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Card Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <img
                            src={card.productImage}
                            alt={card.product}
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid #E6E8EC'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1F2937',
                              marginBottom: '3px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {card.product}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              {card.status}
                            </div>
                          </div>
                        </div>

                        {/* Card Stats */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>
                            {card.location}
                          </span>
                          <span style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: column.color
                          }}>
                            {card.count}
                          </span>
                        </div>

                        {/* Card Actions */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            style={{
                              flex: 1,
                              padding: '6px',
                              background: 'white',
                              border: '1px solid #E6E8EC',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#6B7280',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'all 0.2s'
                            }}
                            title="Печать"
                          >
                            <Printer size={12} strokeWidth={1.5} />
                          </button>
                          <button
                            style={{
                              flex: 1,
                              padding: '6px',
                              background: 'white',
                              border: '1px solid #E6E8EC',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#6B7280',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'all 0.2s'
                            }}
                            title="Переместить"
                          >
                            <Move size={12} strokeWidth={1.5} />
                          </button>
                          <button
                            style={{
                              flex: 1,
                              padding: '6px',
                              background: 'white',
                              border: '1px solid #E6E8EC',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#6B7280',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              transition: 'all 0.2s'
                            }}
                            title="Подробнее"
                          >
                            <Eye size={12} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
