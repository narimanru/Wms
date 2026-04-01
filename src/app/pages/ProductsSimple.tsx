import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Plus, Upload, ChevronDown, Copy, Check, Image as ImageIcon } from 'lucide-react';
import productImage from 'figma:asset/ba40144613a54091535a6657ecc22789e9d01c37.png';

// Demo data
const DEMO_PRODUCTS = [
  {
    id: 6,
    name: 'Брюки палаццо классические широкие',
    article: '425182238',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'синий',
    importSource: 'manual' as const,
    totalStock: 543,
    stockWB: 312,
    stockOwn: 180,
    stockInTransit: 51,
    stockOrdered: 0,
    tags: ['В акции'],
    image: productImage,
  },
  {
    id: 3,
    name: 'Брюки классические палаццо с высокой посадкой',
    article: '391596776',
    brand: 'Kamilek',
    category: 'Брюки',
    color: 'желтый, лимонный',
    importSource: 'wb' as const,
    totalStock: 396,
    stockWB: 245,
    stockOwn: 98,
    stockInTransit: 53,
    stockOrdered: 0,
    tags: ['Новинка'],
    image: 'https://images.unsplash.com/photo-1700411359614-485299e5e6e8',
  },
];

const TAG_DEFINITIONS = [
  { name: 'Новинка', color: '#111827' },
  { name: 'В акции', color: '#3B82F6' },
];

export default function ProductsSimple() {
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '20px 32px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#111827', margin: 0 }}>
              Товары
            </h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  background: 'white',
                  color: '#111827',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  padding: '9px 16px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Upload size={16} />
                Импортировать с WB
              </button>
              <button
                style={{
                  background: '#111827',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '9px 16px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Plus size={16} />
                Добавить товар
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                placeholder="Поиск по названию товара..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  outline: 'none',
                  fontWeight: '400',
                }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '400',
                color: '#111827',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Filter size={16} />
              Фильтры
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '20px 32px' }}>
        {/* Table */}
        <div style={{ background: 'white', borderRadius: '5px', border: '1px solid #E5E7EB', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#6B7280', width: '40px' }}>
                  <input type="checkbox" style={{ cursor: 'pointer' }} />
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#6B7280', width: '50px' }}>
                  Фото
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#6B7280', minWidth: '280px' }}>
                  Товар
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '400', color: '#6B7280', width: '100px' }}>
                  Цвет
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '400', color: '#6B7280', width: '90px' }}>
                  Склад ВБ
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '400', color: '#6B7280', width: '90px' }}>
                  Склад ФФ
                </th>
              </tr>
            </thead>
            <tbody>
              {DEMO_PRODUCTS.map(product => (
                <tr 
                  key={product.id}
                  style={{ borderBottom: '1px solid #F3F4F6' }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ImageIcon size={18} color="#9CA3AF" />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '400', color: '#111827', marginBottom: '2px' }}>
                      {product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280' }}>
                      <span>{product.brand}</span>
                      <span style={{ color: '#D1D5DB' }}>•</span>
                      <span style={{ color: '#111827' }}>{product.article}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '400' }}>{product.color}</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '400', color: '#111827' }}>{product.stockWB}</div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: '400', color: '#111827' }}>{product.stockOwn}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '400' }}>
            Показано 1-2 из 2
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
