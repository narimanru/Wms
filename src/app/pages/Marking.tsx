import { Tag, Plus, Search, Filter, Barcode, Package, ChevronRight, Check, Loader, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import productsData from '../data/products-demo.json';

function Marking() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only products that need marking
  const markedProducts = productsData.products.filter(p => p.needsMarking);

  const filteredProducts = markedProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.vendorArticle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.wbArticle.includes(searchQuery)
  );

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '32px 24px 24px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#1f2937', 
              marginBottom: '4px' 
            }}>
              Маркировка
            </h1>
            <p style={{ 
              fontSize: '13px', 
              color: '#6b7280', 
              fontWeight: 400 
            }}>
              Управление системой маркировки товаров
            </p>
          </div>
          <button 
            onClick={() => navigate('/wizard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#10a37f',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Plus className="w-5 h-5" />
            Распределить КИЗы
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
            <Search style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Поиск товаров с маркировкой..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 14px 0 44px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#1f2937',
                fontSize: '14px'
              }}
            />
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            background: '#fff',
            color: '#6b7280',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            <Filter className="w-4 h-4" />
            Фильтры
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '24px'
      }}>
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '80px 20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              marginBottom: '24px',
              color: '#d1d5db',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
              background: '#f9fafb'
            }}>
              <Barcode className="w-16 h-16" />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              {searchQuery ? 'Ничего не найдено' : 'Нет товаров с маркировкой'}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '32px',
              maxWidth: '400px',
              fontWeight: 400
            }}>
              {searchQuery ? 'По вашему запросу ничего не найдено' : 'Добавьте товары, требующие маркировки Честным знаком'}
            </p>
          </div>
        ) : (
          <div>
            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10a37f'
                  }}>
                    <Package style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: 500
                  }}>
                    Товаров с ЧЗ
                  </div>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  {markedProducts.length}
                </div>
              </div>

              <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6'
                  }}>
                    <Barcode style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: 500
                  }}>
                    Всего размеров
                  </div>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  {markedProducts.reduce((sum, p) => sum + p.sizes.length, 0)}
                </div>
              </div>

              <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10a37f'
                  }}>
                    <Tag style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: 500
                  }}>
                    КИЗ доступно
                  </div>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#10a37f'
                }}>
                  {markedProducts
                    .reduce((sum, p) => sum + p.sizes.reduce((s, size) => s + size.kiz.available, 0), 0)
                    .toLocaleString()}
                </div>
              </div>

              <div style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6366f1'
                  }}>
                    <Tag style={{ width: '18px', height: '18px' }} />
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    fontWeight: 500
                  }}>
                    КИЗ назначено
                  </div>
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  {markedProducts
                    .reduce((sum, p) => sum + p.sizes.reduce((s, size) => s + size.kiz.assigned, 0), 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>

            {/* Products List */}
            <div style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h2 style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#1f2937'
                }}>
                  Товары с маркировкой
                </h2>
              </div>

              <div>
                {filteredProducts.map((product, idx) => {
                  const totalAvailable = product.sizes.reduce((sum, size) => sum + size.kiz.available, 0);
                  const totalAssigned = product.sizes.reduce((sum, size) => sum + size.kiz.assigned, 0);
                  const totalUsed = product.sizes.reduce((sum, size) => sum + size.kiz.used, 0);

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/products/${product.id}`)}
                      style={{
                        padding: '20px 24px',
                        borderBottom: idx < filteredProducts.length - 1 ? '1px solid #f3f4f6' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
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
                        <div style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#1f2937',
                          marginBottom: '6px'
                        }}>
                          {product.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '13px',
                          color: '#6b7280',
                          marginBottom: '8px'
                        }}>
                          <span>Артикул WB: <span style={{ fontWeight: 500, color: '#1f2937' }}>{product.wbArticle}</span></span>
                          <span>•</span>
                          <span>Бренд: <span style={{ fontWeight: 500, color: '#1f2937' }}>{product.brand}</span></span>
                          <span>•</span>
                          <span>Размеров: <span style={{ fontWeight: 500, color: '#1f2937' }}>{product.sizes.length}</span></span>
                        </div>

                        {/* Tags */}
                        {product.tags.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {product.tags.map(tag => (
                              <span
                                key={tag}
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '5px',
                                  background: '#f3f4f6',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: '#6b7280'
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* KIZ Stats */}
                      <div style={{
                        display: 'flex',
                        gap: '20px',
                        alignItems: 'center',
                        paddingRight: '12px'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px'
                        }}>
                          <Check style={{ width: '16px', height: '16px', color: '#10a37f' }} />
                          <div>
                            <div style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                              fontWeight: 500,
                              marginBottom: '2px'
                            }}>
                              Доступно
                            </div>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: '#10a37f'
                            }}>
                              {totalAvailable.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px'
                        }}>
                          <Loader style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                          <div>
                            <div style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                              fontWeight: 500,
                              marginBottom: '2px'
                            }}>
                              Назначено
                            </div>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: '#3b82f6'
                            }}>
                              {totalAssigned.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px'
                        }}>
                          <CheckCircle2 style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                          <div>
                            <div style={{
                              fontSize: '11px',
                              color: '#9ca3af',
                              fontWeight: 500,
                              marginBottom: '2px'
                            }}>
                              Использовано
                            </div>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: '#6b7280'
                            }}>
                              {totalUsed.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <ChevronRight style={{
                          width: '20px',
                          height: '20px',
                          color: '#d1d5db',
                          marginLeft: '12px'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Marking;
