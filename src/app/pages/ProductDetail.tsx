import { ArrowLeft, Package, Plus, Edit, Trash2, Tag, Clock, TrendingUp, Check, Loader, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import productsData from '../data/products-demo.json';

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);

  const product = productsData.products.find(p => p.id === id);

  if (!product) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Товар не найден</h2>
        <button onClick={() => navigate('/products')}>Вернуться к списку</button>
      </div>
    );
  }

  // Initialize tags
  React.useEffect(() => {
    setSelectedTags(product.tags);
  }, [product.tags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const getTotalKIZ = () => {
    return {
      available: product.sizes.reduce((sum, size) => sum + size.kiz.available, 0),
      assigned: product.sizes.reduce((sum, size) => sum + size.kiz.assigned, 0),
      used: product.sizes.reduce((sum, size) => sum + size.kiz.used, 0)
    };
  };

  const totals = getTotalKIZ();

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f8' }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/products')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#1f2937',
                marginBottom: '2px'
              }}>
                {product.name}
              </h1>
              <p style={{ 
                fontSize: '13px', 
                color: '#6b7280', 
                fontWeight: 400 
              }}>
                ID: {product.id} • {product.category}
              </p>
            </div>
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#1f2937',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            <Edit className="w-4 h-4" />
            Редактировать
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        gap: '24px'
      }}>
        {/* Left Column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Product Image & Info Card */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {/* Image */}
              <div style={{
                width: '200px',
                height: '240px',
                borderRadius: '10px',
                overflow: 'hidden',
                flexShrink: 0,
                background: '#f3f4f6'
              }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  Основная информация
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', width: '140px', fontWeight: 500 }}>
                      Артикул WB:
                    </span>
                    <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: 400 }}>
                      {product.wbArticle}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', width: '140px', fontWeight: 500 }}>
                      Артикул продавца:
                    </span>
                    <span style={{ fontSize: '13px', color: '#1f2937', fontFamily: 'monospace', fontWeight: 400 }}>
                      {product.vendorArticle}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', width: '140px', fontWeight: 500 }}>
                      Бренд:
                    </span>
                    <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: 400 }}>
                      {product.brand}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', width: '140px', fontWeight: 500 }}>
                      Цвет:
                    </span>
                    <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: 400 }}>
                      {product.color}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', width: '140px', fontWeight: 500 }}>
                      Состав:
                    </span>
                    <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: 400 }}>
                      {product.composition}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', width: '140px', fontWeight: 500 }}>
                      Маркировка ЧЗ:
                    </span>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: product.needsMarking ? '#d1fae5' : '#f3f4f6',
                      color: product.needsMarking ? '#065f46' : '#6b7280',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {product.needsMarking ? (
                        <>
                          <Package style={{ width: '12px', height: '12px' }} />
                          Требуется
                        </>
                      ) : 'Не требуется'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KIZ Summary Stats */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '20px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Статистика Честного знака
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, marginBottom: '6px' }}>
                  В обороте
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
                  {product.kizStats.inCirculation.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, marginBottom: '6px' }}>
                  В УПД
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#3b82f6' }}>
                  {product.kizStats.inUPD.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, marginBottom: '6px' }}>
                  Отклонено
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#ef4444' }}>
                  {product.kizStats.rejected.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500, marginBottom: '6px' }}>
                  Выбыло
                </div>
                <div style={{ fontSize: '20px', fontWeight: 600, color: '#6b7280' }}>
                  {product.kizStats.retired.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Sizes Table */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                Размеры и остатки КИЗ
              </h3>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#1f2937',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer'
              }}>
                <Plus className="w-4 h-4" />
                Добавить размер
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Баркод
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Рос. размер
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Размер
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      Статус КИЗ
                    </th>
                    <th style={{
                      padding: '12px 24px',
                      textAlign: 'right',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6b7280',
                      borderBottom: '1px solid #e5e7eb',
                      width: '80px'
                    }}>
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.sizes.map((size, idx) => (
                    <tr
                      key={size.barcode}
                      style={{
                        borderBottom: idx < product.sizes.length - 1 ? '1px solid #f3f4f6' : 'none',
                        background: hoveredSize === size.barcode ? '#f9fafb' : '#fff',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={() => setHoveredSize(size.barcode)}
                      onMouseLeave={() => setHoveredSize(null)}
                    >
                      <td style={{
                        padding: '14px 24px',
                        fontSize: '13px',
                        color: '#1f2937',
                        fontFamily: 'monospace'
                      }}>
                        {size.barcode}
                      </td>
                      <td style={{
                        padding: '14px 24px',
                        fontSize: '13px',
                        color: '#1f2937',
                        fontWeight: 500
                      }}>
                        {size.rusSize}
                      </td>
                      <td style={{
                        padding: '14px 24px',
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        {size.size}
                      </td>
                      <td style={{
                        padding: '14px 24px',
                        fontSize: '13px',
                        color: '#1f2937'
                      }}>
                        <div
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '12px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px'
                          }}>
                            <Check style={{ width: '14px', height: '14px', color: '#10a37f' }} />
                            <span style={{ color: '#10a37f', fontWeight: 600, fontSize: '13px' }}>
                              {size.kiz.available.toLocaleString()}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px'
                          }}>
                            <Loader style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                            <span style={{ color: '#3b82f6', fontWeight: 500, fontSize: '13px' }}>
                              {size.kiz.assigned.toLocaleString()}
                            </span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px'
                          }}>
                            <CheckCircle2 style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                            <span style={{ color: '#6b7280', fontWeight: 500, fontSize: '13px' }}>
                              {size.kiz.used.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{
                        padding: '14px 24px',
                        textAlign: 'right'
                      }}>
                        <button style={{
                          padding: '6px',
                          borderRadius: '6px',
                          border: 'none',
                          background: hoveredSize === size.barcode ? '#fee2e2' : 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.15s ease'
                        }}>
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr style={{ background: '#f9fafb', fontWeight: 600 }}>
                    <td colSpan={3} style={{
                      padding: '14px 24px',
                      fontSize: '13px',
                      color: '#1f2937',
                      fontWeight: 600
                    }}>
                      Всего:
                    </td>
                    <td style={{
                      padding: '14px 24px',
                      fontSize: '13px',
                      color: '#1f2937'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px'
                        }}>
                          <Check style={{ width: '14px', height: '14px', color: '#10a37f' }} />
                          <span style={{ color: '#10a37f', fontWeight: 600 }}>
                            {totals.available.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px'
                        }}>
                          <Loader style={{ width: '14px', height: '14px', color: '#3b82f6' }} />
                          <span style={{ color: '#3b82f6', fontWeight: 600 }}>
                            {totals.assigned.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px'
                        }}>
                          <CheckCircle2 style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                          <span style={{ color: '#6b7280', fontWeight: 600 }}>
                            {totals.used.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tags */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <Tag style={{ width: '16px', height: '16px', color: '#6b7280' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                Теги
              </h3>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>
                Применённые теги
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      background: '#10a37f',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
                {selectedTags.length === 0 && (
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>Теги не выбраны</span>
                )}
              </div>

              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 500, marginBottom: '4px' }}>
                Библиотека тегов
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {productsData.availableTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        border: '1px solid #e5e7eb'
                      }}
                      onClick={() => toggleTag(tag)}
                    >
                      + {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <Clock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                Последние действия
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {product.recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  style={{
                    paddingBottom: idx < product.recentActivity.length - 1 ? '12px' : '0',
                    borderBottom: idx < product.recentActivity.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}
                >
                  <div style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    fontWeight: 500,
                    marginBottom: '4px'
                  }}>
                    {activity.date} {activity.time}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#1f2937',
                    fontWeight: 400,
                    marginBottom: '2px'
                  }}>
                    {activity.action}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#10a37f'
                    }}>
                      {activity.quantity.toLocaleString()} шт
                    </span>
                    {activity.note && (
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        • {activity.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;