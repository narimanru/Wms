import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Package, Filter, Plus, Upload, ChevronDown, ChevronUp, X, Copy, Check, Edit2, Trash2, Tag, ExternalLink, Image as ImageIcon, MoreVertical, ArrowUp, ArrowDown, QrCode, Settings, SlidersHorizontal, RefreshCw, MessageSquare, Send, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import productImage from 'figma:asset/ba40144613a54091535a6657ecc22789e9d01c37.png';
import { motion, AnimatePresence } from 'motion/react';

// Demo data based on specification
const DEMO_PRODUCTS = [
  {
    id: 6,
    name: 'Брюки палаццо классические широкие',
    article: '425182238',
    sellerArticle: 'KML-WIDE-BLUE-40',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'синий',
    composition: 'вискоза 65%, полиэстер 30%, эластан 5%',
    importSource: 'manual' as const,
    needsMarking: false,
    dateAdded: '2026-03-17 12:05',
    dateUpdated: '2026-03-17 12:05',
    totalStock: 543,
    stockWB: 312,
    stockOwn: 180,
    stockInTransit: 51,
    stockOrdered: 0,
    tags: ['В акции'],
    ktr: 1.02,
    ktrData: {
      localOrders: 48,
      localizationIndex: 25,
      avgDelivery: '1д 12ч',
      period: '7 дней',
    },
    sizes: [
      { size: '40', barcode: '2051182200001', gtin: '14620032810016', kizCount: 0, stockWB: 78, stockOwn: 45, stockInTransit: 12, stockOrdered: 0 },
      { size: '44', barcode: '2051182200002', gtin: '14620032810023', kizCount: 0, stockWB: 98, stockOwn: 56, stockInTransit: 15, stockOrdered: 0 },
      { size: '46', barcode: '2051182200003', kizCount: 0, stockWB: 87, stockOwn: 51, stockInTransit: 14, stockOrdered: 0 },
      { size: '48', barcode: '2051182200004', kizCount: 0, stockWB: 49, stockOwn: 28, stockInTransit: 10, stockOrdered: 0 },
    ],
    image: productImage,
  },
  {
    id: 3,
    name: 'Брюки классические палаццо с высокой посадкой',
    article: '391596776',
    sellerArticle: 'KML-PLZ-YLW-46',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'желтый, лимонный',
    composition: 'полиэстер 74%, вискоза 22%, эластан 4%',
    importSource: 'wb' as const,
    needsMarking: true,
    dateAdded: '2026-03-17 08:30',
    dateUpdated: '2026-03-17 08:30',
    totalStock: 396,
    stockWB: 245,
    stockOwn: 98,
    stockInTransit: 53,
    stockOrdered: 0,
    tags: ['Новинка'],
    newUntil: '2026-03-31',
    ktr: 1.35,
    ktrData: {
      localOrders: 67,
      localizationIndex: 42,
      avgDelivery: '1д 3ч',
      period: '7 дней',
    },
    sizes: [
      { size: '42', barcode: '2043692115711', gtin: '14620032810047', kizCount: 19, stockWB: 38, stockOwn: 15, stockInTransit: 8, stockOrdered: 0 },
      { size: '46', barcode: '2043692115728', gtin: '14620032810054', kizCount: 34, stockWB: 75, stockOwn: 30, stockInTransit: 16, stockOrdered: 0 },
      { size: '48', barcode: '2043692115735', kizCount: 27, stockWB: 65, stockOwn: 28, stockInTransit: 15, stockOrdered: 0 },
      { size: '50', barcode: '2043692115742', gtin: '14620032810061', kizCount: 15, stockWB: 42, stockOwn: 16, stockInTransit: 9, stockOrdered: 0 },
      { size: '52', barcode: '2043692115759', kizCount: 11, stockWB: 25, stockOwn: 9, stockInTransit: 5, stockOrdered: 0 },
    ],
    image: 'https://images.unsplash.com/photo-1700411359614-485299e5e6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBsZW1vbiUyMHBhbGF6em8lMjBwYW50c3xlbnwxfHx8fDE3NzM3OTMzMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 1,
    name: 'Брюки классические палаццо с высокой посадкой',
    article: '447263640',
    sellerArticle: 'KML-PLZ-BLK-42',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'черный',
    composition: 'вискоза 70%, полиэстер 27%, эластан 3%',
    importSource: 'wb' as const,
    needsMarking: true,
    dateAdded: '2026-03-16 09:20',
    dateUpdated: '2026-03-17 11:40',
    totalStock: 1061,
    stockWB: 687,
    stockOwn: 234,
    stockInTransit: 140,
    stockOrdered: 0,
    tags: ['Продвигаем'],
    wbLink: 'https://www.wildberries.ru/catalog/447263640/detail.aspx',
    ktr: 1.07,
    ktrData: {
      localOrders: 56,
      localizationIndex: 30,
      avgDelivery: '1д 7ч',
      period: '7 дней',
    },
    sizes: [
      { size: '40', barcode: '2044498130731', gtin: '14620032810078', kizCount: 0, stockWB: 102, stockOwn: 35, stockInTransit: 21, stockOrdered: 0 },
      { size: '42', barcode: '2044497815189', kizCount: 0, stockWB: 125, stockOwn: 42, stockInTransit: 25, stockOrdered: 0 },
      { size: '44', barcode: '2044497815196', gtin: '14620032810085', kizCount: 0, stockWB: 145, stockOwn: 50, stockInTransit: 28, stockOrdered: 0 },
      { size: '46', barcode: '2044497815202', kizCount: 0, stockWB: 138, stockOwn: 47, stockInTransit: 27, stockOrdered: 0 },
      { size: '48', barcode: '2044497815219', kizCount: 0, stockWB: 115, stockOwn: 39, stockInTransit: 24, stockOrdered: 0 },
      { size: '50', barcode: '2044497815226', gtin: '14620032810092', kizCount: 0, stockWB: 62, stockOwn: 21, stockInTransit: 15, stockOrdered: 0 },
    ],
    image: 'https://images.unsplash.com/photo-1768803968211-a7f04e1effd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBhbGF6em8lMjBwYW50cyUyMHdvbWVufGVufDF8fHx8MTc3Mzc5MzMyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 7,
    name: 'Брюки палаццо классические широкие',
    article: '723473057',
    sellerArticle: 'KML-WIDE-SKY-42',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'синий, голубой',
    composition: 'вискоза 67%, полиэстер 29%, эластан 4%',
    importSource: 'manual' as const,
    needsMarking: false,
    dateAdded: '2026-03-13 15:00',
    dateUpdated: '2026-03-15 18:45',
    totalStock: 2,
    stockWB: 0,
    stockOwn: 2,
    stockInTransit: 0,
    stockOrdered: 50,
    tags: [],
    ktr: 0.82,
    ktrData: {
      localOrders: 34,
      localizationIndex: 18,
      avgDelivery: '2д 4ч',
      period: '7 дней',
    },
    sizes: [
      { size: '42', barcode: '2051182200011', kizCount: 0, stockWB: 0, stockOwn: 1, stockInTransit: 0, stockOrdered: 15 },
      { size: '44', barcode: '2051182200012', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 15 },
      { size: '46', barcode: '2051182200013', kizCount: 0, stockWB: 0, stockOwn: 1, stockInTransit: 0, stockOrdered: 10 },
      { size: '48', barcode: '2051182200014', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 10 },
    ],
    image: 'https://images.unsplash.com/photo-1768900315814-4b0d61011edb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza3klMjBibHVlJTIwcGFsYXp6byUyMHBhbnRzfGVufDF8fHx8MTc3Mzc5MzMyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Брюки классические палаццо с высокой посадкой',
    article: '338473867',
    sellerArticle: 'KML-PLZ-GRY-40',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'серый, графитовый, антрацит',
    composition: 'вискоза 68%, полиэстер 28%, эластан 4%',
    importSource: 'wb' as const,
    needsMarking: true,
    dateAdded: '2026-03-10 14:10',
    dateUpdated: '2026-03-17 10:15',
    totalStock: 25,
    stockWB: 15,
    stockOwn: 5,
    stockInTransit: 5,
    stockOrdered: 0,
    tags: ['Сливаем'],
    ktr: 0.65,
    ktrData: {
      localOrders: 22,
      localizationIndex: 12,
      avgDelivery: '2д 18ч',
      period: '7 дней',
    },
    sizes: [
      { size: '40', barcode: '2043692115667', kizCount: 5, stockWB: 3, stockOwn: 1, stockInTransit: 1, stockOrdered: 0 },
      { size: '42', barcode: '2043692115674', kizCount: 4, stockWB: 3, stockOwn: 1, stockInTransit: 1, stockOrdered: 0 },
      { size: '44', barcode: '2043692115681', kizCount: 3, stockWB: 3, stockOwn: 1, stockInTransit: 1, stockOrdered: 0 },
      { size: '46', barcode: '2043692115698', kizCount: 2, stockWB: 3, stockOwn: 1, stockInTransit: 1, stockOrdered: 0 },
      { size: '48', barcode: '2043692115704', kizCount: 1, stockWB: 3, stockOwn: 1, stockInTransit: 1, stockOrdered: 0 },
    ],
    image: 'https://images.unsplash.com/photo-1559658565-c3d776872a20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwd2lkZSUyMGxlZyUyMHRyb3VzZXJzJTIwd29tZW58ZW58MXx8fHwxNzczNzkzMzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 8,
    name: 'Брюки для девочки палаццо на резинке, широкие',
    article: '140062528',
    sellerArticle: 'KIDS-PLZ-BLK-7',
    brand: 'Kamilek Kids',
    category: 'Брюки',
    color: 'черный',
    composition: 'полиэстер 80%, вискоза 20%',
    importSource: 'wb' as const,
    needsMarking: true,
    dateAdded: '2026-03-05 11:30',
    dateUpdated: '2026-03-16 10:50',
    totalStock: 1,
    stockWB: 1,
    stockOwn: 0,
    stockInTransit: 0,
    stockOrdered: 0,
    tags: [],
    ktr: 0.95,
    ktrData: {
      localOrders: 41,
      localizationIndex: 28,
      avgDelivery: '1д 15ч',
      period: '7 дней',
    },
    sizes: [
      { size: '7-8', barcode: '2040001111001', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '13-14', barcode: '2040001111002', kizCount: 0, stockWB: 1, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '15-16', barcode: '2040001111003', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
    ],
    image: 'https://images.unsplash.com/photo-1697677913862-ba6af4f2f024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwYmxhY2slMjBwYWxhenpvJTIwcGFudHN8ZW58MXx8fHwxNzczNzkzMzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 5,
    name: 'Брюки утепленные палаццо с начесом',
    article: '604149436',
    sellerArticle: 'KML-WARM-CHOC-44',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'коричневый, шоколадный',
    composition: 'хлопок 60%, полиэстер 35%, эластан 5%',
    importSource: 'wb' as const,
    needsMarking: true,
    dateAdded: '2026-03-01 13:10',
    dateUpdated: '2026-03-12 17:40',
    totalStock: 0,
    stockWB: 0,
    stockOwn: 0,
    stockInTransit: 0,
    stockOrdered: 0,
    tags: ['ТОП'],
    ktr: 1.28,
    ktrData: {
      localOrders: 71,
      localizationIndex: 45,
      avgDelivery: '18ч',
      period: '7 дней',
    },
    sizes: [
      { size: '44', barcode: '2039028090258', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '46', barcode: '2039028090265', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '48', barcode: '2039028090272', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '50', barcode: '2039028090289', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
    ],
    image: 'https://images.unsplash.com/photo-1718115690443-cd8b7f6c112b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGNob2NvbGF0ZSUyMHdhcm0lMjBwYW50c3xlbnwxfHx8fDE3NzM3OTMzMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 4,
    name: 'Брюки школьные клеш от колена в рубчик',
    article: '191053909',
    sellerArticle: 'KBruki-Closh-Leto-black',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'черный',
    composition: 'полиэстер, акрил',
    importSource: 'wb' as const,
    needsMarking: true,
    dateAdded: '2026-02-28 16:45',
    dateUpdated: '2026-03-16 19:20',
    totalStock: 22,
    stockWB: 22,
    stockOwn: 0,
    stockInTransit: 0,
    stockOrdered: 0,
    tags: [],
    ktr: 1.15,
    ktrData: {
      localOrders: 58,
      localizationIndex: 35,
      avgDelivery: '1д 5ч',
      period: '7 дней',
    },
    sizes: [
      { size: '10-11', rusSize: '140-146', barcode: '2039028090296', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '11-12', rusSize: '146-152', barcode: '2039028090302', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '12-13', rusSize: '152-158', barcode: '2039028090319', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '13-14', rusSize: '158-164', barcode: '2039470761942', kizCount: 22, stockWB: 22, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '44', rusSize: 'M', barcode: '2039470761966', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '46', rusSize: 'L', barcode: '2039470761973', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '48', rusSize: 'XL', barcode: '2039470761980', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
      { size: '50', rusSize: 'XXL', barcode: '2039470761997', kizCount: 0, stockWB: 0, stockOwn: 0, stockInTransit: 0, stockOrdered: 0 },
    ],
    image: 'https://images.unsplash.com/photo-1664099570115-744e07b42437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBmbGFyZWQlMjBwYW50cyUyMGtpZHN8ZW58MXx8fHwxNzczNzkzMzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

// Tag definitions with colors
const TAG_DEFINITIONS = [
  { name: 'Новинка', color: '#111827', count: 12, isSystem: true },
  { name: 'В акции', color: '#3B82F6', count: 8, isSystem: true },
  { name: 'Продвигаем', color: '#8B5CF6', count: 6, isSystem: true },
  { name: 'ТОП', color: '#111827', outline: true, count: 4, isSystem: true },
  { name: 'Сливаем', color: '#F59E0B', count: 3, isSystem: true },
  { name: 'Хит', color: '#EF4444', count: 5, isSystem: true },
  { name: 'Премиум', color: '#111827', count: 2, isSystem: true },
];

interface Product {
  id: number;
  name: string;
  article: string;
  sellerArticle: string;
  brand: string;
  category: string;
  color: string;
  composition: string;
  importSource: 'wb' | 'manual';
  needsMarking: boolean;
  dateAdded: string;
  dateUpdated: string;
  totalStock: number;
  stockWB: number;
  stockOwn: number;
  stockInTransit: number;
  stockOrdered: number;
  tags: string[];
  wbLink?: string;
  newUntil?: string;
  ktr?: number;
  ktrData?: {
    localOrders: number;
    localizationIndex: number;
    avgDelivery: string;
    period: string;
  };
  sizes: Array<{
    size: string;
    rusSize?: string;
    barcode: string;
    kizCount: number;
    stockWB: number;
    stockOwn: number;
    stockInTransit: number;
    stockOrdered: number;
  }>;
  image: string | null;
}

// Custom Select Component
interface CustomSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  minWidth?: string;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, minWidth = '160px', icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div style={{ position: 'relative', minWidth }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #E5E7EB',
          borderRadius: '5px',
          background: '#FFFFFF',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '400',
          color: '#111827',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          textAlign: 'left',
          transition: 'all 0.15s ease',
          boxShadow: 'none',
          outline: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F9FAFB';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#FFFFFF';
        }}
      >
        {icon && <span style={{ display: 'flex', alignItems: 'center', color: '#6B7280' }}>{icon}</span>}
        <span style={{ flex: 1, color: '#111827' }}>
          {selectedOption?.label || label}
        </span>
        <ChevronDown 
          size={14} 
          strokeWidth={1.5} 
          style={{ 
            color: '#9CA3AF', 
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40
            }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
              zIndex: 50,
              overflow: 'hidden',
              padding: '4px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: 'none',
                  background: value === option.value ? '#F3F4F6' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#374151',
                  textAlign: 'left',
                  transition: 'background 0.1s ease',
                  display: 'block',
                  borderRadius: '5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F3F4F6';
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.background = 'transparent';
                  } else {
                    e.currentTarget.style.background = '#F3F4F6';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [searchName, setSearchName] = useState('');
  const [searchArticle, setSearchArticle] = useState('');
  const [searchTable, setSearchTable] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterColor, setFilterColor] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterMarking, setFilterMarking] = useState('all');
  const [filterZeroStock, setFilterZeroStock] = useState(false);
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [stockFilterMode, setStockFilterMode] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [stockWarehouse, setStockWarehouse] = useState<'wb' | 'own'>('wb');
  const [stockOperator, setStockOperator] = useState('=');
  const [stockValue, setStockValue] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [filterKtr, setFilterKtr] = useState<'all' | 'high' | 'normal' | 'low'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagFilterMode, setTagFilterMode] = useState<'include' | 'exclude'>('include');
  const [showFilters, setShowFilters] = useState(true);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [copiedBarcode, setCopiedBarcode] = useState<string | null>(null);
  const [copiedArticle, setCopiedArticle] = useState<string | null>(null);
  const [warehouseDetailPanel, setWarehouseDetailPanel] = useState<{
    product: Product;
    size?: string;
    stockType: 'wb' | 'own' | 'transit' | 'ordered';
  } | null>(null);
  const [tagModalProduct, setTagModalProduct] = useState<Product | null>(null);
  const [customTags, setCustomTags] = useState<Array<{ name: string; color: string; isSystem: boolean }>>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [showCreateTag, setShowCreateTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#111827');
  const [addedTagId, setAddedTagId] = useState<string | null>(null);
  const [removedTagId, setRemovedTagId] = useState<string | null>(null);
  const [imageModalSrc, setImageModalSrc] = useState<string | null>(null);
  const [colorTooltipProduct, setColorTooltipProduct] = useState<number | null>(null);
  const [warehouseType, setWarehouseType] = useState<'wb' | 'ff'>('wb');
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [chatTab, setChatTab] = useState<'chat' | 'tasks' | 'shipments'>('chat');
  const [chatMessage, setChatMessage] = useState('');

  // Filter and sort products
  const filteredProducts = products
    .filter(p => {
      if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (searchArticle && !p.article.includes(searchArticle)) return false;
      if (searchTable) {
        const query = searchTable.toLowerCase();
        const matchesSellerArticle = p.sellerArticle.toLowerCase().includes(query);
        const matchesWBArticle = p.article.toLowerCase().includes(query);
        const matchesBarcode = p.sizes.some(size => size.barcode.includes(searchTable));
        if (!matchesSellerArticle && !matchesWBArticle && !matchesBarcode) return false;
      }
      if (filterCategory !== 'all' && p.category !== filterCategory) return false;
      if (filterColor !== 'all' && !p.color.toLowerCase().includes(filterColor.toLowerCase())) return false;
      if (filterStock === 'inStock' && p.totalStock === 0) return false;
      if (filterStock === 'outOfStock' && p.totalStock > 0) return false;
      if (filterSource === 'wb' && p.importSource !== 'wb') return false;
      if (filterSource === 'manual' && p.importSource !== 'manual') return false;
      if (filterMarking === 'needed' && !p.needsMarking) return false;
      if (filterMarking === 'notNeeded' && p.needsMarking) return false;
      
      // Stock filter logic
      const currentStock = stockWarehouse === 'wb' ? p.stockWB : p.stockOwn;
      if (stockFilterMode === 'inStock' && currentStock === 0) return false;
      if (stockFilterMode === 'outOfStock' && currentStock > 0) return false;
      if (stockValue) {
        const value = parseInt(stockValue);
        if (!isNaN(value)) {
          if (stockOperator === '=' && currentStock !== value) return false;
          if (stockOperator === '<' && currentStock >= value) return false;
          if (stockOperator === '>' && currentStock <= value) return false;
          if (stockOperator === '<=' && currentStock > value) return false;
          if (stockOperator === '>=' && currentStock < value) return false;
        }
      }
      
      if (selectedTags.length > 0) {
        const hasAnyTag = selectedTags.some(tag => p.tags.includes(tag));
        if (tagFilterMode === 'include' && !hasAnyTag) return false;
        if (tagFilterMode === 'exclude' && hasAnyTag) return false;
      }
      
      // KTR filter logic
      if (filterKtr !== 'all' && p.ktr !== undefined) {
        if (filterKtr === 'high' && p.ktr <= 1.1) return false;
        if (filterKtr === 'normal' && (p.ktr < 0.9 || p.ktr > 1.1)) return false;
        if (filterKtr === 'low' && p.ktr >= 0.9) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dateAdded') {
        comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      } else if (sortBy === 'dateUpdated') {
        comparison = new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime();
      } else if (sortBy === 'ktr') {
        const aKtr = a.ktr ?? 0;
        const bKtr = b.ktr ?? 0;
        comparison = aKtr - bKtr;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Calculate stock counts for filter buttons
  const allProductsCount = products.length;
  const inStockCountWB = products.filter(p => p.stockWB > 0).length;
  const outOfStockCountWB = products.filter(p => p.stockWB === 0).length;
  const inStockCountOwn = products.filter(p => p.stockOwn > 0).length;
  const outOfStockCountOwn = products.filter(p => p.stockOwn === 0).length;
  
  const inStockCount = stockWarehouse === 'wb' ? inStockCountWB : inStockCountOwn;
  const outOfStockCount = stockWarehouse === 'wb' ? outOfStockCountWB : outOfStockCountOwn;

  const categories = Array.from(new Set(products.map(p => p.category)));
  const colors = Array.from(new Set(products.flatMap(p => p.color.split(',').map(c => c.trim()))));

  const copyArticle = async (article: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(article);
        setCopiedArticle(article);
        setTimeout(() => setCopiedArticle(null), 2000);
      }
    } catch (err) {
      console.log('Clipboard operation failed');
    }
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  };

  const addTagToProduct = (productId: number, tagName: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId && !p.tags.includes(tagName)
        ? { ...p, tags: [...p.tags, tagName] }
        : p
    ));
  };

  const removeTagFromProduct = (productId: number, tagName: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId
        ? { ...p, tags: p.tags.filter(t => t !== tagName) }
        : p
    ));
    setRemovedTagId(tagName);
    setTimeout(() => setRemovedTagId(null), 300);
  };

  const clearAllTags = (productId: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, tags: [] } : p
    ));
  };

  const createCustomTag = () => {
    if (newTagName.trim()) {
      const newTag = { name: newTagName.trim(), color: newTagColor, isSystem: false };
      setCustomTags(prev => [...prev, newTag]);
      setNewTagName('');
      setNewTagColor('#111827');
      setShowCreateTag(false);
    }
  };

  const getAllTags = () => {
    return [...TAG_DEFINITIONS, ...customTags];
  };

  const getProductCountForTag = (tagName: string) => {
    return products.filter(p => p.tags.includes(tagName)).length;
  };

  const getKtrColor = (ktr: number) => {
    if (ktr > 1.1) return '#10B981'; // Зелёный - высокий спрос
    if (ktr >= 0.9 && ktr <= 1.1) return '#F59E0B'; // Жёлтый/оранжевый - баланс
    return '#EF4444'; // Красный - залежи
  };

  const getKtrLabel = (ktr: number) => {
    if (ktr > 1.1) return 'Высокий спрос';
    if (ktr >= 0.9 && ktr <= 1.1) return 'Баланс';
    return 'Залежи';
  };

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imageModalSrc) {
          setImageModalSrc(null);
        } else if (showCreateTag) {
          setShowCreateTag(false);
        } else if (tagModalProduct) {
          setTagModalProduct(null);
        } else if (warehouseDetailPanel) {
          setWarehouseDetailPanel(null);
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [imageModalSrc, showCreateTag, tagModalProduct, warehouseDetailPanel]);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '16px 32px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Page Title */}
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '500', 
            color: '#111827', 
            margin: '0 0 24px 0'
          }}>
            Товары
          </h1>
          
          {/* Search and Filters Toggle */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowStockDropdown(!showStockDropdown)}
                style={{ 
                  fontSize: '14px', 
                  fontWeight: '400', 
                  color: (stockFilterMode !== 'all' || stockValue) ? 'white' : '#111827',
                  border: (stockFilterMode !== 'all' || stockValue) ? '1px solid #111827' : '1px solid #E5E7EB',
                  borderRadius: '5px',
                  padding: '8px 12px',
                  whiteSpace: 'nowrap',
                  background: (stockFilterMode !== 'all' || stockValue) ? '#111827' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (stockFilterMode === 'all' && !stockValue) {
                    e.currentTarget.style.background = '#F9FAFB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (stockFilterMode === 'all' && !stockValue) {
                    e.currentTarget.style.background = '#FFFFFF';
                  }
                }}
              >
                <SlidersHorizontal size={14} strokeWidth={1.5} />
                <span style={{ flex: 1 }}>
                  {stockFilterMode === 'outOfStock' 
                    ? `Нет на ${stockWarehouse === 'wb' ? 'ВБ' : 'ФФ'} ${outOfStockCount}` 
                    : stockFilterMode === 'inStock' 
                      ? `Есть на ${stockWarehouse === 'wb' ? 'ВБ' : 'ФФ'} ${inStockCount}` 
                      : `Все товары ${allProductsCount}`}
                </span>
                <ChevronDown 
                  size={14} 
                  strokeWidth={1.5} 
                  style={{ 
                    color: (stockFilterMode !== 'all' || stockValue) ? 'white' : '#9CA3AF',
                    flexShrink: 0,
                    transform: showStockDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </button>
              
              {/* Stock Filter Dropdown */}
              {showStockDropdown && (
                <>
                  <div 
                    style={{ 
                      position: 'fixed', 
                      inset: 0, 
                      zIndex: 40 
                    }} 
                    onClick={() => setShowStockDropdown(false)}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    padding: '16px',
                    zIndex: 50,
                    minWidth: '400px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '10px' }}>
                        Склад:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setStockWarehouse('wb')}
                          style={{
                            padding: '8px 16px',
                            border: stockWarehouse === 'wb' ? '2px solid #111827' : '1px solid #E5E7EB',
                            borderRadius: '5px',
                            background: stockWarehouse === 'wb' ? '#111827' : 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: stockWarehouse === 'wb' ? 'white' : '#111827',
                          }}
                        >
                          ВБ
                        </button>
                        <button
                          onClick={() => setStockWarehouse('own')}
                          style={{
                            padding: '8px 16px',
                            border: stockWarehouse === 'own' ? '2px solid #111827' : '1px solid #E5E7EB',
                            borderRadius: '5px',
                            background: stockWarehouse === 'own' ? '#111827' : 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: stockWarehouse === 'own' ? 'white' : '#111827',
                          }}
                        >
                          ФФ
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '10px' }}>
                        Быстрый выбор:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setStockFilterMode('all')}
                          style={{
                            padding: '8px 16px',
                            border: stockFilterMode === 'all' ? '2px solid #111827' : '1px solid #E5E7EB',
                            borderRadius: '5px',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: stockFilterMode === 'all' ? '500' : '400',
                            color: '#111827',
                          }}
                        >
                          Все {allProductsCount}
                        </button>
                        <button
                          onClick={() => setStockFilterMode('inStock')}
                          style={{
                            padding: '8px 16px',
                            border: stockFilterMode === 'inStock' ? '2px solid #111827' : '1px solid #E5E7EB',
                            borderRadius: '5px',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: stockFilterMode === 'inStock' ? '500' : '400',
                            color: '#111827',
                          }}
                        >Есть в наличии {inStockCount}</button>
                        <button
                          onClick={() => setStockFilterMode('outOfStock')}
                          style={{
                            padding: '8px 16px',
                            border: stockFilterMode === 'outOfStock' ? '2px solid #111827' : '1px solid #E5E7EB',
                            borderRadius: '5px',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: stockFilterMode === 'outOfStock' ? '500' : '400',
                            color: '#111827',
                          }}
                        >Нет в наличии {outOfStockCount}</button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '10px' }}>
                        Настроить:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <CustomSelect
                          label="="
                          value={stockOperator}
                          options={[
                            { value: '=', label: '=' },
                            { value: '<', label: '<' },
                            { value: '>', label: '>' },
                            { value: '<=', label: '<=' },
                            { value: '>=', label: '>=' }
                          ]}
                          onChange={setStockOperator}
                          minWidth="100px"
                        />
                        <input
                          type="text"
                          value={stockValue}
                          onChange={(e) => setStockValue(e.target.value)}
                          placeholder="Значение"
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '1px solid #E5E7EB',
                            borderRadius: '5px',
                            fontSize: '14px',
                            outline: 'none',
                            fontWeight: '400',
                          }}
                        />
                        <button
                          onClick={() => setShowStockDropdown(false)}
                          style={{
                            padding: '8px 16px',
                            background: '#111827',
                            border: 'none',
                            borderRadius: '5px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Применить
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <CustomSelect
              label="Все категории"
              value={filterCategory}
              options={[
                { value: 'all', label: 'Все категории' },
                ...categories.map(cat => ({ value: cat, label: cat }))
              ]}
              onChange={setFilterCategory}
              minWidth="160px"
            />

            {/* Tags filter dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#111827',
                  background: selectedTags.length > 0 ? '#F3F4F6' : 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Tag size={14} strokeWidth={1.5} />
                Ярлыки
                {selectedTags.length > 0 && (
                  <span style={{
                    background: '#111827',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    minWidth: '18px',
                    textAlign: 'center',
                  }}>
                    {selectedTags.length}
                  </span>
                )}
                <ChevronDown size={14} strokeWidth={1.5} style={{ 
                  transform: showTagsDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }} />
              </button>

              {showTagsDropdown && (
                <>
                  <div 
                    onClick={() => setShowTagsDropdown(false)}
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    background: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    zIndex: 1000,
                    minWidth: '240px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                  }}>
                    <div style={{
                      padding: '12px',
                      borderBottom: '1px solid #E5E7EB',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        Фильтр по ярлыкам
                      </span>
                      {selectedTags.length > 0 && (
                        <button
                          onClick={() => setSelectedTags([])}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#6B7280',
                            fontSize: '13px',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            fontWeight: '400',
                          }}
                        >
                          Сбросить
                        </button>
                      )}
                    </div>
                    
                    <div style={{ padding: '8px' }}>
                      {TAG_DEFINITIONS.map(tag => (
                        <label
                          key={tag.name}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (!selectedTags.includes(tag.name)) {
                              e.currentTarget.style.background = '#F9FAFB';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!selectedTags.includes(tag.name)) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag.name)}
                            onChange={() => toggleTag(tag.name)}
                            style={{
                              width: '16px',
                              height: '16px',
                              marginRight: '8px',
                              cursor: 'pointer',
                              accentColor: '#111827',
                            }}
                          />
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '13px',
                              fontWeight: '400',
                              background: tag.outline ? 'white' : tag.color,
                              color: tag.outline ? tag.color : 'white',
                              border: tag.outline ? `1px solid ${tag.color}` : 'none',
                            }}
                          >
                            {tag.name}
                          </span>
                          <span style={{
                            marginLeft: 'auto',
                            fontSize: '13px',
                            color: '#9CA3AF',
                            fontWeight: '400',
                          }}>
                            {tag.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* KTR filter dropdown */}
            <CustomSelect
              label="Все КТР"
              value={filterKtr}
              options={[
                { value: 'all', label: 'Все КТР' },
                { value: 'high', label: '> 1.1 (дефицит)' },
                { value: 'normal', label: '0.9–1.1 (норма)' },
                { value: 'low', label: '< 0.9 (перелив)' }
              ]}
              onChange={(value) => setFilterKtr(value as 'all' | 'high' | 'normal' | 'low')}
              minWidth="120px"
            />
            
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button
                onClick={() => {/* TODO: Import from WB */}}
                style={{
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#111827',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <RefreshCw size={14} strokeWidth={1.5} />
                Обновить с WB
              </button>
              <button
                onClick={() => {/* TODO: Add product */}}
                style={{
                  background: '#111827',
                  border: '1px solid #111827',
                  borderRadius: '5px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Plus size={14} strokeWidth={1.5} />
                Добавить товар
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', margin: '0 auto', padding: '0', background: 'white' }}>
        {/* Filters */}
        {showFilters && (
          null
        )}

        {/* Products Table */}
        <div style={{ background: 'white', borderRadius: '0', border: 'none', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', overflowX: 'auto', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', marginLeft: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white' }}>
              <tr style={{ background: 'white', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '400', color: '#6B7280', width: '70px' }}>
                  
                </th>
                <th colSpan={2} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '400', color: '#6B7280', width: '350px', position: 'sticky', left: 0, background: 'white', zIndex: 11 }}>
                  <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <input
                      type="text"
                      value={searchTable}
                      onChange={e => setSearchTable(e.target.value)}
                      placeholder="Артикул продавца, артикул WB, баркод"
                      style={{
                        width: '100%',
                        padding: '8px 40px 8px 16px',
                        border: '1.5px solid #D1D5DB',
                        borderRadius: '5px',
                        fontSize: '15px',
                        outline: 'none',
                        fontWeight: '400',
                        background: 'white',
                        color: '#111827',
                        transition: 'all 0.15s',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#111827';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(17, 24, 39, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#D1D5DB';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                      }}
                    />
                    <Search 
                      size={16} 
                      strokeWidth={1.5}
                      style={{ 
                        position: 'absolute', 
                        right: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        color: '#9CA3AF',
                        pointerEvents: 'none'
                      }} 
                    />
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '400', color: '#6B7280', width: '100px' }}>
                  Цвет
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '400', color: '#6B7280', width: '90px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#111827' }}></div>
                    <span style={{ whiteSpace: 'nowrap' }}>Склад ВБ</span>
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '400', color: '#6B7280', width: '90px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3B82F6' }}></div>
                    <span style={{ whiteSpace: 'nowrap' }}>Склад ФФ</span>
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '400', color: '#6B7280', width: '90px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B' }}></div>
                    <span style={{ whiteSpace: 'nowrap' }}>В пути</span>
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '400', color: '#6B7280', width: '90px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#8B5CF6' }}></div>
                    <span style={{ whiteSpace: 'nowrap' }}>Заказ</span>
                  </div>
                </th>
                <th 
                  style={{ 
                    padding: '12px 16px', 
                    textAlign: 'center', 
                    fontSize: '14px', 
                    fontWeight: '400', 
                    color: sortBy === 'ktr' ? '#111827' : '#6B7280', 
                    width: '80px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s',
                  }}
                  onClick={() => {
                    if (sortBy === 'ktr') {
                      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
                    } else {
                      setSortBy('ktr');
                      setSortOrder('desc');
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span style={{ whiteSpace: 'nowrap' }}>КТР</span>
                    {sortBy === 'ktr' && (
                      sortOrder === 'desc' ? <ArrowDown size={14} strokeWidth={1.5} /> : <ArrowUp size={14} strokeWidth={1.5} />
                    )}
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '400', color: '#6B7280', width: '140px' }}>
                  Ярлыки
                </th>
                <th 
                  style={{ 
                    padding: '12px 16px', 
                    textAlign: 'left', 
                    fontSize: '14px', 
                    fontWeight: '400', 
                    color: sortBy === 'dateUpdated' ? '#111827' : '#6B7280', 
                    width: '120px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.15s',
                  }}
                  onClick={() => {
                    if (sortBy === 'dateUpdated') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('dateUpdated');
                      setSortOrder('desc');
                    }
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                  onMouseLeave={(e) => e.currentTarget.style.color = sortBy === 'dateUpdated' ? '#111827' : '#6B7280'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Изменено</span>
                    {sortBy === 'dateUpdated' && (
                      sortOrder === 'desc' 
                        ? <ArrowDown size={14} strokeWidth={1.5} /> 
                        : <ArrowUp size={14} strokeWidth={1.5} />
                    )}
                  </div>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '400', color: '#6B7280', width: '100px' }}>
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <React.Fragment key={`product-${product.id}`}>
                  <tr 
                    style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s', cursor: 'pointer' }}
                    onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    {/* Expand */}
                    <td style={{ padding: '9px 11px', textAlign: 'center', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setExpandedProduct(expandedProduct === product.id ? null : product.id); }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '5px',
                        backgroundColor: 'transparent',
                      }}>
                        <ChevronDown 
                          size={18} 
                          style={{ 
                            color: '#111827',
                            transform: expandedProduct === product.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                          }} 
                        />
                      </div>
                    </td>

                    {/* Image */}
                    <td style={{ padding: '9px 10px 9px 10px', width: '92px', position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>
                      <div 
                        style={{ width: '75px', height: '100px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', overflow: 'hidden', cursor: product.image ? 'pointer' : 'default', transition: 'all 0.15s' }}
                        onClick={(e) => {
                          if (product.image) {
                            e.stopPropagation();
                            setImageModalSrc(product.image);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (product.image) {
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (product.image) {
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                        ) : (
                          <ImageIcon size={30} color="#9CA3AF" />
                        )}
                      </div>
                    </td>

                    {/* Product Info */}
                    <td style={{ padding: '9px 11px 9px 0px', width: '260px', position: 'sticky', left: '92px', background: 'white', zIndex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: '15px', fontWeight: '400', color: '#111827', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '320px' }}>
                        {product.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6B7280', marginBottom: '6px' }}>
                        <span>{product.brand}</span>
                        <span style={{ color: '#D1D5DB' }}>•</span>
                        <span>{product.category}</span>
                        <span style={{ color: '#D1D5DB' }}>•</span>
                        {product.importSource === 'wb' && (
                          <img 
                            src="https://app.truestats.ru/images/wildberries.svg" 
                            alt="WB" 
                            title="Импортировано с Wildberries"
                            style={{ width: '13px', height: '13px', flexShrink: 0 }}
                          />
                        )}
                        <span style={{ color: '#111827' }}>{product.article}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyArticle(product.article); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: copiedArticle === product.article ? '#28C76F' : '#9CA3AF' }}
                        >
                          {copiedArticle === product.article ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
                        Артикул продавца: <span style={{ color: '#111827' }}>{product.sellerArticle || 'KВruki-Closh-Leto-black'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatProduct(product);
                            setShowChatModal(true);
                          }}
                          style={{
                            padding: '5px 8px',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s',
                            whiteSpace: 'nowrap',
                            position: 'relative'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
                        >
                          <MessageSquare size={13} />
                          <span style={{
                            background: '#059669',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '1px 5px',
                            borderRadius: '10px'
                          }}>
                            +3
                          </span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatProduct(product);
                            setShowChatModal(true);
                          }}
                          style={{
                            padding: '5px 8px',
                            background: '#F59E0B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s',
                            whiteSpace: 'nowrap',
                            position: 'relative'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#D97706'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#F59E0B'}
                        >
                          <ListTodo size={13} />
                          <span style={{
                            background: '#D97706',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '1px 5px',
                            borderRadius: '10px'
                          }}>
                            +1
                          </span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          style={{ 
                            background: '#111827', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '5px', 
                            padding: '4px 10px', 
                            fontSize: '13px', 
                            fontWeight: '500', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#111827'}
                        >
                          <QrCode size={13} />
                          Маркировка
                        </button>
                      </div>
                    </td>

                    {/* Color */}
                    <td style={{ padding: '9px 11px', position: 'relative' }}>
                      {(() => {
                        const colors = product.color.split(',').map(c => c.trim());
                        const firstColor = colors[0];
                        const remainingCount = colors.length - 1;
                        
                        if (colors.length === 1) {
                          return <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>{firstColor}</span>;
                        }
                        
                        return (
                          <>
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                setColorTooltipProduct(colorTooltipProduct === product.id ? null : product.id);
                              }}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {firstColor}
                              </span>
                              <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '400' }}>
                                +{remainingCount}
                              </span>
                            </div>
                            
                            {colorTooltipProduct === product.id && (
                              <>
                                <div 
                                  style={{ 
                                    position: 'fixed', 
                                    top: 0, 
                                    left: 0, 
                                    right: 0, 
                                    bottom: 0, 
                                    zIndex: 999 
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setColorTooltipProduct(null);
                                  }}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '0',
                                    marginTop: '8px',
                                    background: 'white',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '5px',
                                    padding: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    zIndex: 1000,
                                    minWidth: '160px',
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {colors.map((color, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        fontSize: '14px',
                                        color: '#111827',
                                        fontWeight: '400',
                                        padding: '6px 10px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s',
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                      {color}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </td>

                    {/* Stock WB */}
                    <td 
                      style={{ padding: '9px 11px', textAlign: 'center', cursor: product.stockWB > 0 ? 'pointer' : 'default' }}
                      onClick={(e) => {
                        if (product.stockWB > 0) {
                          e.stopPropagation();
                          setWarehouseDetailPanel({ product, stockType: 'wb' });
                        }
                      }}
                    >
                      <div 
                        style={{ 
                          fontSize: '15px', 
                          fontWeight: '400', 
                          color: product.stockWB > 0 ? '#111827' : '#9CA3AF',
                          textDecoration: product.stockWB > 0 ? 'underline' : 'none',
                          textDecorationStyle: 'solid',
                          textDecorationColor: '#111827',
                          textDecorationThickness: '1.5px',
                          textUnderlineOffset: '3px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          if (product.stockWB > 0) {
                            e.currentTarget.style.color = '#3B82F6';
                            e.currentTarget.style.textDecorationColor = '#3B82F6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#111827';
                          e.currentTarget.style.textDecorationColor = '#111827';
                        }}
                      >
                        {product.stockWB}
                      </div>
                    </td>

                    {/* Stock Own */}
                    <td 
                      style={{ padding: '9px 11px', textAlign: 'center', cursor: product.stockOwn > 0 ? 'pointer' : 'default' }}
                      onClick={(e) => {
                        if (product.stockOwn > 0) {
                          e.stopPropagation();
                          setWarehouseType('ff');
                          setWarehouseDetailPanel({ product, stockType: 'own' });
                        }
                      }}
                    >
                      <div 
                        style={{ 
                          fontSize: '15px', 
                          fontWeight: '400', 
                          color: product.stockOwn > 0 ? '#111827' : '#9CA3AF',
                          textDecoration: product.stockOwn > 0 ? 'underline' : 'none',
                          textDecorationStyle: 'solid',
                          textDecorationColor: '#111827',
                          textDecorationThickness: '1.5px',
                          textUnderlineOffset: '3px',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          if (product.stockOwn > 0) {
                            e.currentTarget.style.color = '#3B82F6';
                            e.currentTarget.style.textDecorationColor = '#3B82F6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#111827';
                          e.currentTarget.style.textDecorationColor = '#111827';
                        }}
                      >
                        {product.stockOwn}
                      </div>
                    </td>

                    {/* Stock In Transit */}
                    <td style={{ padding: '9px 11px', textAlign: 'center' }}>
                      <div style={{ fontSize: '15px', fontWeight: '400', color: '#111827' }}>{product.stockInTransit}</div>
                    </td>

                    {/* Stock Ordered */}
                    <td style={{ padding: '9px 11px', textAlign: 'center' }}>
                      <div style={{ fontSize: '15px', fontWeight: '400', color: '#111827' }}>{product.stockOrdered}</div>
                    </td>

                    {/* KTR */}
                    <td 
                      style={{ padding: '9px 11px', textAlign: 'center', position: 'relative' }}
                      onMouseEnter={(e) => {
                        if (product.ktr !== undefined && product.ktrData) {
                          const cell = e.currentTarget;
                          const existingTooltip = cell.querySelector('.ktr-tooltip');
                          if (!existingTooltip) {
                            const tooltip = document.createElement('div');
                            tooltip.className = 'ktr-tooltip';
                            tooltip.style.cssText = `
                              position: absolute;
                              bottom: calc(100% + 8px);
                              left: 50%;
                              transform: translateX(-50%);
                              background: #111827;
                              color: white;
                              padding: 10px 12px;
                              border-radius: 5px;
                              font-size: 13px;
                              white-space: nowrap;
                              z-index: 1000;
                              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                              pointer-events: none;
                            `;
                            tooltip.innerHTML = `
                              <div style="font-weight: 500; margin-bottom: 6px;">КТР: ${product.ktr.toFixed(2)}</div>
                              <div style="font-weight: 400; color: #D1D5DB; line-height: 1.4;">
                                Локальные заказы: ${product.ktrData.localOrders}%<br/>
                                Индекс локализации: ${product.ktrData.localizationIndex}%<br/>
                                Средняя доставка: ${product.ktrData.avgDelivery}<br/>
                                Период: ${product.ktrData.period}
                              </div>
                            `;
                            cell.appendChild(tooltip);
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.querySelector('.ktr-tooltip');
                        if (tooltip) {
                          tooltip.remove();
                        }
                      }}
                    >
                      {product.ktr !== undefined ? (
                        <div 
                          style={{ 
                            fontSize: '15px', 
                            fontWeight: '500', 
                            color: getKtrColor(product.ktr),
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {product.ktr.toFixed(2)}
                        </div>
                      ) : (
                        <div style={{ fontSize: '15px', fontWeight: '400', color: '#D1D5DB' }}>—</div>
                      )}
                    </td>

                    {/* Tags */}
                    <td style={{ padding: '9px 11px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                        {product.tags.map(tagName => {
                          const tagDef = TAG_DEFINITIONS.find(t => t.name === tagName);
                          return (
                            <span key={tagName} style={{ background: 'transparent', color: tagDef?.color, border: `1.5px solid ${tagDef?.color}`, padding: '4px 8px', borderRadius: '5px', fontSize: '13px', fontWeight: '500' }}>
                              {tagName}
                            </span>
                          );
                        })}
                        <button
                          onClick={() => setTagModalProduct(product)}
                          style={{
                            background: 'transparent',
                            color: '#9CA3AF',
                            border: '1.5px dashed #E5E7EB',
                            borderRadius: '5px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '28px',
                            height: '26px',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#111827';
                            e.currentTarget.style.color = '#111827';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#E5E7EB';
                            e.currentTarget.style.color = '#9CA3AF';
                          }}
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Updated Date */}
                    <td style={{ padding: '9px 11px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '400', color: '#6B7280' }}>
                        {(() => {
                          const date = new Date(product.dateUpdated.replace(' ', 'T'));
                          const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
                          const day = date.getDate();
                          const month = months[date.getMonth()];
                          const hours = String(date.getHours()).padStart(2, '0');
                          const minutes = String(date.getMinutes()).padStart(2, '0');
                          return `${day} ${month} ${hours}:${minutes}`;
                        })()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '9px 11px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            padding: '4px',
                            color: '#6B7280',
                            transition: 'color 0.15s',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer', 
                            padding: '4px',
                            color: '#6B7280',
                            transition: 'color 0.15s',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row - Size Details */}
                  {expandedProduct === product.id && (
                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                      <td colSpan={11} style={{ paddingTop: '16px', paddingBottom: '16px', paddingLeft: '88px', paddingRight: '24px' }}>
                        <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '500', marginBottom: '16px', letterSpacing: '0.5px' }}>
                          Детализация по размерам
                        </div>
                        
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ background: 'white', borderBottom: '1px solid #E5E7EB' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                  Размер
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                  Баркод
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                  GTIN
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#111827' }}></div>
                                    Склад ВБ
                                  </div>
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6' }}></div>
                                    Склад ФФ
                                  </div>
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }}></div>
                                    В пути
                                  </div>
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#8B5CF6' }}></div>
                                    Заказ
                                  </div>
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '500', color: '#6B7280' }}>
                                  Всего
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.sizes.map((size) => {
                                const totalSize = size.stockWB + size.stockOwn + size.stockInTransit + size.stockOrdered;
                                if (totalSize === 0) return null;
                                
                                return (
                                  <tr 
                                    key={size.barcode} 
                                    style={{ borderBottom: '1px solid #E5E7EB', transition: 'background 0.15s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  >
                                    <td style={{ padding: '12px 16px', fontSize: '16px', fontWeight: '500', color: '#111827', background: '#F3F4F6' }}>
                                      {size.size}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '400', color: '#6B7280', fontFamily: 'monospace', background: '#F3F4F6' }}>
                                      {size.barcode}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: '400', color: '#6B7280', fontFamily: 'monospace', background: '#F3F4F6' }}>
                                      {size.gtin || '—'}
                                    </td>
                                    <td 
                                      style={{ padding: '12px 16px', textAlign: 'center', fontSize: '15px', fontWeight: '400', color: '#111827', cursor: size.stockWB > 0 ? 'pointer' : 'default' }}
                                      onClick={(e) => {
                                        if (size.stockWB > 0) {
                                          e.stopPropagation();
                                          setWarehouseDetailPanel({ product, size: size.size, stockType: 'wb' });
                                        }
                                      }}
                                    >
                                      <span 
                                        style={{ 
                                          textDecoration: size.stockWB > 0 ? 'underline' : 'none',
                                          textDecorationStyle: 'solid',
                                          textDecorationColor: '#111827',
                                          textDecorationThickness: '1.5px',
                                          textUnderlineOffset: '4px',
                                          transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={(e) => {
                                          if (size.stockWB > 0) {
                                            e.currentTarget.style.color = '#3B82F6';
                                            e.currentTarget.style.textDecorationColor = '#3B82F6';
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.color = '#111827';
                                          e.currentTarget.style.textDecorationColor = '#111827';
                                        }}
                                      >
                                        {size.stockWB > 0 ? size.stockWB : '—'}
                                      </span>
                                    </td>
                                    <td 
                                      onClick={() => {
                                        if (size.stockOwn > 0) {
                                          setShowStockModal(true);
                                          setWarehouseType('ff');
                                        }
                                      }}
                                      style={{ 
                                        padding: '12px 16px', 
                                        textAlign: 'center', 
                                        fontSize: '15px', 
                                        fontWeight: '400', 
                                        color: size.stockOwn > 0 ? '#111827' : '#111827',
                                        cursor: size.stockOwn > 0 ? 'pointer' : 'default',
                                        transition: 'background 0.15s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (size.stockOwn > 0) {
                                          e.currentTarget.style.background = '#F3F4F6';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                      }}
                                    >
                                      {size.stockOwn > 0 ? size.stockOwn : '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '15px', fontWeight: '400', color: '#111827' }}>
                                      {size.stockInTransit > 0 ? size.stockInTransit : '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '15px', fontWeight: '400', color: '#111827' }}>
                                      {size.stockOrdered > 0 ? size.stockOrdered : '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '15px', fontWeight: '500', color: '#111827' }}>
                                      {totalSize}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '400' }}>Показывать по:</span>
              <CustomSelect
                label="10"
                value="10"
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' }
                ]}
                onChange={() => {}}
                minWidth="80px"
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '400' }}>
                1-{Math.min(filteredProducts.length, 10)} из {filteredProducts.length}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    padding: '6px 8px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    background: 'white',
                    cursor: 'not-allowed',
                    opacity: 0.5,
                  }}
                >
                  <ChevronDown size={14} style={{ transform: 'rotate(90deg)' }} />
                </button>
                <button
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    background: '#111827',
                    color: 'white',
                    fontWeight: '400',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  1
                </button>
                <button
                  style={{
                    padding: '6px 8px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    background: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronDown size={14} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div style={{ background: 'white', borderRadius: '5px', padding: '48px', textAlign: 'center', color: '#9CA3AF', border: '1px solid #E5E7EB' }}>
            <Package size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p style={{ fontSize: '16px', margin: 0, fontWeight: '400' }}>Товары не найдены</p>
            <p style={{ fontSize: '14px', margin: '8px 0 0', color: '#D1D5DB', fontWeight: '400' }}>
              Попробуйте изменить параметры фильтрации
            </p>
          </div>
        )}
      </div>

      {/* Tag Management Modal */}
      {tagModalProduct && (
        <>
          {/* Overlay */}
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(17, 24, 39, 0.5)', 
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setTagModalProduct(null)}
          />
          
          {/* Modal */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            maxHeight: '80vh',
            background: 'white',
            zIndex: 1000,
            borderRadius: '5px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease-out',
          }}>
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: '0 0 4px 0' }}>
                  Управление ярлыками
                </h2>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '400' }}>
                  {tagModalProduct.name}
                </div>
              </div>
              <button
                onClick={() => setTagModalProduct(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* Applied Tags */}
              {tagModalProduct.tags.length > 0 ? (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '500', letterSpacing: '0.5px' }}>
                      Примененные ярлыки
                    </div>
                    {tagModalProduct.tags.length > 0 && (
                      <button
                        onClick={() => {
                          clearAllTags(tagModalProduct.id);
                          setTagModalProduct({ ...tagModalProduct, tags: [] });
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          padding: '4px 8px',
                        }}
                      >
                        Очистить все
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {tagModalProduct.tags.map(tagName => {
                      const allTags = getAllTags();
                      const tagDef = allTags.find(t => t.name === tagName);
                      return (
                        <div 
                          key={tagName} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            background: '#FAFAFA', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '5px', 
                            padding: '6px 10px',
                            animation: removedTagId === tagName ? 'tagRemove 0.3s ease-out' : addedTagId === tagName ? 'tagAdd 0.3s ease-out' : 'none',
                          }}
                        >
                          <span style={{ fontSize: '14px', color: tagDef?.color || '#111827', fontWeight: '500' }}>{tagName}</span>
                          <button
                            onClick={() => {
                              removeTagFromProduct(tagModalProduct.id, tagName);
                              setTagModalProduct({ ...tagModalProduct, tags: tagModalProduct.tags.filter(t => t !== tagName) });
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Удалить ярлык"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: '28px', padding: '24px', background: '#FAFAFA', borderRadius: '5px', textAlign: 'center' }}>
                  <Tag size={32} color="#D1D5DB" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>
                    Нет примененных ярлыков
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
                    Выберите ярлыки из библиотеки ниже
                  </div>
                </div>
              )}

              {/* Search */}
              {getAllTags().length > 5 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                      type="text"
                      placeholder="Поиск ярлыков..."
                      value={tagSearchQuery}
                      onChange={(e) => setTagSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 36px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '5px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Tag Library */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '500', letterSpacing: '0.5px' }}>
                    Библиотека ярлыков
                  </div>
                  <button
                    onClick={() => setShowCreateTag(!showCreateTag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#111827',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={14} />
                    Создать
                  </button>
                </div>

                {/* Create Custom Tag Form */}
                {showCreateTag && (
                  <div style={{ marginBottom: '16px', padding: '16px', background: '#FAFAFA', borderRadius: '5px', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>
                      Новый ярлык
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder="Назв��ние..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') createCustomTag();
                          if (e.key === 'Escape') setShowCreateTag(false);
                        }}
                        autoFocus
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '5px',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                      <input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        style={{
                          width: '48px',
                          height: '36px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setShowCreateTag(false)}
                        style={{
                          padding: '6px 12px',
                          border: '1px solid #E5E7EB',
                          borderRadius: '5px',
                          background: 'white',
                          color: '#6B7280',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        Отмена
                      </button>
                      <button
                        onClick={createCustomTag}
                        disabled={!newTagName.trim()}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '5px',
                          background: newTagName.trim() ? '#111827' : '#E5E7EB',
                          color: newTagName.trim() ? 'white' : '#9CA3AF',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: newTagName.trim() ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Создать
                      </button>
                    </div>
                  </div>
                )}

                {/* System Tags */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500', marginBottom: '8px', letterSpacing: '0.5px' }}>
                    СИСТЕМНЫЕ
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {getAllTags()
                      .filter(tag => tag.isSystem && tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()))
                      .map(tag => {
                        const isApplied = tagModalProduct.tags.includes(tag.name);
                        const productCount = getProductCountForTag(tag.name);
                        return (
                          <button
                            key={tag.name}
                            onClick={() => {
                              if (!isApplied) {
                                addTagToProduct(tagModalProduct.id, tag.name);
                                setTagModalProduct({ ...tagModalProduct, tags: [...tagModalProduct.tags, tag.name] });
                                setAddedTagId(tag.name);
                                setTimeout(() => setAddedTagId(null), 300);
                              }
                            }}
                            disabled={isApplied}
                            title={`${productCount} ${productCount === 1 ? 'товар' : 'товаров'}`}
                            style={{
                              background: isApplied ? '#F3F4F6' : 'transparent',
                              color: isApplied ? '#9CA3AF' : tag.color,
                              border: `1.5px solid ${isApplied ? '#E5E7EB' : tag.color}`,
                              borderRadius: '5px',
                              padding: '8px 14px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: isApplied ? 'not-allowed' : 'pointer',
                              opacity: isApplied ? 0.5 : 1,
                              transition: 'all 0.15s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                            onMouseEnter={(e) => {
                              if (!isApplied) {
                                e.currentTarget.style.background = `${tag.color}10`;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isApplied) {
                                e.currentTarget.style.background = 'transparent';
                              }
                            }}
                          >
                            {tag.name}
                            <span style={{ fontSize: '11px', opacity: 0.7 }}>· {productCount}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Custom Tags */}
                {customTags.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500', marginBottom: '8px', letterSpacing: '0.5px' }}>
                      ПОЛЬЗОВАТЕЛЬСКИЕ
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {customTags
                        .filter(tag => tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()))
                        .map(tag => {
                          const isApplied = tagModalProduct.tags.includes(tag.name);
                          const productCount = getProductCountForTag(tag.name);
                          return (
                            <button
                              key={tag.name}
                              onClick={() => {
                                if (!isApplied) {
                                  addTagToProduct(tagModalProduct.id, tag.name);
                                  setTagModalProduct({ ...tagModalProduct, tags: [...tagModalProduct.tags, tag.name] });
                                  setAddedTagId(tag.name);
                                  setTimeout(() => setAddedTagId(null), 300);
                                }
                              }}
                              disabled={isApplied}
                              title={`${productCount} ${productCount === 1 ? 'товар' : 'товаров'}`}
                              style={{
                                background: isApplied ? '#F3F4F6' : 'transparent',
                                color: isApplied ? '#9CA3AF' : tag.color,
                                border: `1.5px solid ${isApplied ? '#E5E7EB' : tag.color}`,
                                borderRadius: '5px',
                                padding: '8px 14px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: isApplied ? 'not-allowed' : 'pointer',
                                opacity: isApplied ? 0.5 : 1,
                                transition: 'all 0.15s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                              onMouseEnter={(e) => {
                                if (!isApplied) {
                                  e.currentTarget.style.background = `${tag.color}10`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isApplied) {
                                  e.currentTarget.style.background = 'transparent';
                                }
                              }}
                            >
                              {tag.name}
                              <span style={{ fontSize: '11px', opacity: 0.7 }}>· {productCount}</span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', background: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                <kbd style={{ padding: '2px 6px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '3px', fontSize: '11px', fontFamily: 'monospace' }}>ESC</kbd>
                {' '}для закрытия
              </div>
              <button
                onClick={() => setTagModalProduct(null)}
                style={{
                  padding: '8px 16px',
                  background: '#111827',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Готово
              </button>
            </div>
          </div>
        </>
      )}

      {/* Warehouse Detail Panel */}
      {warehouseDetailPanel && (
        <>
          {/* Overlay */}
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(17, 24, 39, 0.5)', 
              zIndex: 999 
            }}
            onClick={() => setWarehouseDetailPanel(null)}
          />
          
          {/* Side Panel */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '480px',
            background: 'white',
            zIndex: 1000,
            boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.2s ease-out',
          }}>
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: '0 0 8px 0' }}>
                  {warehouseDetailPanel.product.name}
                </h2>
                <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '400' }}>
                  {warehouseDetailPanel.size ? `Размер ${warehouseDetailPanel.size}` : 'Все размеры'}
                </div>
              </div>
              <button
                onClick={() => setWarehouseDetailPanel(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '20px', fontWeight: '400' }}>
                Данные актуальны на 18.03.2026 03:42
              </div>

              {/* Warehouse Type Switcher */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', padding: '4px', background: '#F3F4F6', borderRadius: '6px', width: 'fit-content' }}>
                  <button
                    onClick={() => setWarehouseType('wb')}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: warehouseType === 'wb' ? '#111827' : '#6B7280',
                      background: warehouseType === 'wb' ? '#FFFFFF' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: warehouseType === 'wb' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    Склад ВБ
                  </button>
                  <button
                    onClick={() => setWarehouseType('ff')}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: warehouseType === 'ff' ? '#111827' : '#6B7280',
                      background: warehouseType === 'ff' ? '#FFFFFF' : 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: warehouseType === 'ff' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    }}
                  >
                    Склад ФФ
                  </button>
                </div>
              </div>

              {/* Warehouse WB Content */}
              {warehouseType === 'wb' && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '500', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    Склады Wildberries
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { name: 'Коледино', quantity: 187 },
                      { name: 'Электросталь', quantity: 125 },
                      { name: 'Казань', quantity: 78 },
                      { name: 'Санкт-Петербург', quantity: 42 },
                      { name: 'Екатеринбург', quantity: 40 },
                    ].map((warehouse, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#FAFAFA', borderRadius: '5px' }}>
                        <span style={{ fontSize: '14px', color: '#111827', fontWeight: '400' }}>{warehouse.name}</span>
                        <span style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{warehouse.quantity} шт.</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warehouse FF Content - Address Storage */}
              {warehouseType === 'ff' && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '500', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    Адресное хранение
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { address: 'А-12-34', quantity: 45, packer: 'Иванов И.П.', date: '16.03.2026 14:23' },
                      { address: 'А-12-35', quantity: 38, packer: 'Петров А.С.', date: '16.03.2026 15:10' },
                      { address: 'Б-08-21', quantity: 52, packer: 'Сидорова М.В.', date: '17.03.2026 09:45' },
                      { address: 'Б-08-22', quantity: 41, packer: 'Иванов И.П.', date: '17.03.2026 10:12' },
                      { address: 'В-15-18', quantity: 29, packer: 'Козлов Д.А.', date: '17.03.2026 16:30' },
                    ].map((storage, idx) => (
                      <div key={idx} style={{ padding: '14px', background: '#FAFAFA', borderRadius: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{storage.address}</span>
                            <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '400' }}>Короб 60×40×40</span>
                          </div>
                          <span style={{ fontSize: '15px', color: '#111827', fontWeight: '500' }}>{storage.quantity} шт.</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px' }}>
                          Размеры: <span style={{ color: '#111827' }}>42 (12 шт), 46 (18 шт), 48 (15 шт)</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '2px' }}>
                          Упаковщик: <span style={{ color: '#111827' }}>{storage.packer}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#6B7280' }}>
                          Размещено: <span style={{ color: '#111827' }}>{storage.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Summary */}
            <div style={{ padding: '24px', borderTop: '1px solid #E5E7EB', background: '#FAFAFA' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {warehouseType === 'wb' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>Всего на складах:</span>
                      <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>472 шт.</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>В пути к клиенту:</span>
                      <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>1 069 шт.</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>В пути от клиента:</span>
                      <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>470 шт.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>Всего на складе ФФ:</span>
                      <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>205 шт.</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>Количество адресов:</span>
                      <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>5 ячеек</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '400' }}>Последнее размещение:</span>
                      <span style={{ fontSize: '16px', color: '#111827', fontWeight: '500' }}>17.03.2026 16:30</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes tagAdd {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes tagRemove {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }
      `}</style>

      {/* Image Modal */}
      <AnimatePresence>
        {imageModalSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              cursor: 'zoom-out',
            }}
            onClick={() => setImageModalSrc(null)}
          >
            <button
              onClick={() => setImageModalSrc(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s',
                zIndex: 10000,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
              }}
            >
              <img
                src={imageModalSrc}
                alt="Product"
                style={{
                  height: '600px',
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChatModal && chatProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
            onClick={() => setShowChatModal(false)}
          >
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '450px',
                height: '100vh',
                background: 'white',
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Header */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', background: '#FAFAFA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MessageSquare size={20} color="#111827" />
                    <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>
                      Чат по товару
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowChatModal(false)}
                    style={{
                      padding: '6px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#E5E7EB')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <X size={18} color="#6B7280" />
                  </button>
                </div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  {chatProduct.name}
                </div>
                <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
                  Артикул WB: {chatProduct.article}
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', background: 'white' }}>
                <button
                  onClick={() => setChatTab('chat')}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: chatTab === 'chat' ? '2px solid #111827' : '2px solid transparent',
                    fontSize: '14px',
                    fontWeight: chatTab === 'chat' ? '500' : '400',
                    color: chatTab === 'chat' ? '#111827' : '#6B7280',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Чат
                </button>
                <button
                  onClick={() => setChatTab('tasks')}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: chatTab === 'tasks' ? '2px solid #111827' : '2px solid transparent',
                    fontSize: '14px',
                    fontWeight: chatTab === 'tasks' ? '500' : '400',
                    color: chatTab === 'tasks' ? '#111827' : '#6B7280',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Задачи
                </button>
                <button
                  onClick={() => setChatTab('shipments')}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: chatTab === 'shipments' ? '2px solid #111827' : '2px solid transparent',
                    fontSize: '14px',
                    fontWeight: chatTab === 'shipments' ? '500' : '400',
                    color: chatTab === 'shipments' ? '#111827' : '#6B7280',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  Отгрузки
                </button>
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
                {chatTab === 'chat' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Demo messages */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: '#E5E7EB', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#6B7280',
                        flexShrink: 0
                      }}>
                        АИ
                      </div>
                      <div>
                        <div style={{ 
                          background: '#F3F4F6', 
                          padding: '10px 14px', 
                          borderRadius: '10px',
                          fontSize: '14px',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          Проверьте остатки этого товара на складе ФФ. Возможно, нужно сделать пересорт по размерам.
                        </div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          Сегодня, 09:15
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          background: '#111827', 
                          color: 'white',
                          padding: '10px 14px', 
                          borderRadius: '10px',
                          fontSize: '14px',
                          marginBottom: '4px',
                          display: 'inline-block',
                          textAlign: 'left'
                        }}>
                          Проверил, все в порядке. 205 шт распределены по 5 ячейкам.
                        </div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          Сегодня, 09:30
                        </div>
                      </div>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: '#111827', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        ВА
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: '#E5E7EB', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#6B7280',
                        flexShrink: 0
                      }}>
                        АИ
                      </div>
                      <div>
                        <div style={{ 
                          background: '#F3F4F6', 
                          padding: '10px 14px', 
                          borderRadius: '10px',
                          fontSize: '14px',
                          color: '#111827',
                          marginBottom: '4px'
                        }}>
                          Отлично! Не забудьте проверить КИЗы для следующей отгрузки.
                        </div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                          Сегодня, 09:32
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {chatTab === 'tasks' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Demo tasks */}
                    <div style={{ 
                      padding: '14px', 
                      background: '#FAFAFA', 
                      borderRadius: '5px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CheckCircle2 size={16} color="#10B981" />
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            Проверить остатки на складе ФФ
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginLeft: '24px' }}>
                        Завершено: 17.03.2026 09:30
                      </div>
                    </div>

                    <div style={{ 
                      padding: '14px', 
                      background: '#FAFAFA', 
                      borderRadius: '5px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={16} color="#F59E0B" />
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            Подготовить КИЗы для отгрузки
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginLeft: '24px' }}>
                        Срок: 18.03.2026
                      </div>
                    </div>

                    <div style={{ 
                      padding: '14px', 
                      background: '#FAFAFA', 
                      borderRadius: '5px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Clock size={16} color="#F59E0B" />
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            Обновить карточку товара на WB
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginLeft: '24px' }}>
                        Срок: 20.03.2026
                      </div>
                    </div>
                  </div>
                )}

                {chatTab === 'shipments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Demo shipments */}
                    <div style={{ 
                      padding: '14px', 
                      background: '#FAFAFA', 
                      borderRadius: '5px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>
                          Отгрузка #2847
                        </span>
                        <span style={{ 
                          padding: '4px 8px', 
                          background: '#10B981', 
                          color: 'white', 
                          borderRadius: '5px', 
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Завершена
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                        Количество: 45 шт
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                        Размеры: 40 (12), 44 (18), 46 (15)
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        Дата: 15.03.2026 14:20
                      </div>
                    </div>

                    <div style={{ 
                      padding: '14px', 
                      background: '#FAFAFA', 
                      borderRadius: '5px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>
                          Отгрузка #2921
                        </span>
                        <span style={{ 
                          padding: '4px 8px', 
                          background: '#F59E0B', 
                          color: 'white', 
                          borderRadius: '5px', 
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          В процессе
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                        Количество: 38 шт
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                        Размеры: 42 (15), 46 (13), 48 (10)
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        Дата: 17.03.2026 11:05
                      </div>
                    </div>

                    <div style={{ 
                      padding: '14px', 
                      background: '#FAFAFA', 
                      borderRadius: '5px',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>
                          Отгрузка #2953
                        </span>
                        <span style={{ 
                          padding: '4px 8px', 
                          background: '#6B7280', 
                          color: 'white', 
                          borderRadius: '5px', 
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          Запланирована
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                        Количество: 52 шт
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>
                        Размеры: 40 (18), 44 (20), 46 (14)
                      </div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        Дата: 19.03.2026 10:00
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input (only for chat tab) */}
              {chatTab === 'chat' && (
                <div style={{ 
                  padding: '16px 24px', 
                  borderTop: '1px solid #E5E7EB',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Написать сообщение..."
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '5px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border 0.15s'
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#111827')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
                    />
                    <button
                      onClick={() => {
                        if (chatMessage.trim()) {
                          // Here you would send the message
                          setChatMessage('');
                        }
                      }}
                      style={{
                        padding: '10px 16px',
                        background: '#111827',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#374151')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#111827')}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}