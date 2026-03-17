import { ShoppingCart, Plus, Search, Filter, Package, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import productsData from '../data/products-demo.json';

function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const products = productsData.products;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.vendorArticle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.wbArticle.includes(searchQuery)
  );

  const getTotalKIZ = (product: typeof products[0]) => {
    return product.sizes.reduce((sum, size) => sum + size.kiz.available, 0);
  };

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
              Товары
            </h1>
            <p style={{ 
              fontSize: '13px', 
              color: '#6b7280', 
              fontWeight: 400 
            }}>
              Управление товарным каталогом
            </p>
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: 'none',
            background: '#1f2937',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            <Plus className="w-5 h-5" />
            Добавить товар
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
              placeholder="Поиск товаров..."
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
              <ShoppingCart className="w-16 h-16" />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              Нет товаров
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '32px',
              maxWidth: '400px',
              fontWeight: 400
            }}>
              {searchQuery ? 'По вашему запросу ничего не найдено' : 'Начните работу, добавив первый товар в каталог'}
            </p>
            {!searchQuery && (
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '10px',
                background: '#1f2937',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}>
                <Plus className="w-5 h-5" />
                Добавить товар
              </button>
            )}
          </div>
        ) : (
          /* Products Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                <div style={{
                  width: '100%',
                  height: '240px',
                  background: '#f3f4f6',
                  position: 'relative',
                  overflow: 'hidden'
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
                  {/* Tags Badge */}
                  {product.tags.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap'
                    }}>
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.95)',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: '#1f2937',
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Marking Badge */}
                  {product.needsMarking && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(16, 163, 127, 0.95)',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: '#fff',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Package style={{ width: '12px', height: '12px' }} />
                      ЧЗ
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {product.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginBottom: '14px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#6b7280'
                    }}>
                      <span style={{ fontWeight: 500 }}>Артикул WB:</span>
                      <span style={{ fontWeight: 400 }}>{product.wbArticle}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#6b7280'
                    }}>
                      <span style={{ fontWeight: 500 }}>Артикул:</span>
                      <span style={{ fontWeight: 400, fontFamily: 'monospace' }}>{product.vendorArticle}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#6b7280'
                    }}>
                      <span style={{ fontWeight: 500 }}>Бренд:</span>
                      <span style={{ fontWeight: 400 }}>{product.brand}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    paddingTop: '14px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        fontWeight: 500,
                        marginBottom: '4px'
                      }}>
                        Размеров
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1f2937'
                      }}>
                        {product.sizes.length}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        fontWeight: 500,
                        marginBottom: '4px'
                      }}>
                        КИЗ доступно
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#10a37f'
                      }}>
                        {getTotalKIZ(product).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
