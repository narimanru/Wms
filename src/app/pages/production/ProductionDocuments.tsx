import { FileText, Download, Upload, Eye, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import ProductionLayout from '../../components/ProductionLayout';
import ordersData from '../../data/production-orders.json';

type DocumentType = 'act' | 'invoice' | 'photo' | 'certificate' | 'other';

interface Document {
  id: string;
  orderId: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  size: string;
  uploadedBy: string;
}

function ProductionDocuments() {
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [orderFilter, setOrderFilter] = useState('all');

  const documents: Document[] = [
    {
      id: 'DOC-001',
      orderId: 'PO-2026-00039',
      name: 'Акт приёмки партии №1.pdf',
      type: 'act',
      uploadDate: '2026-03-05',
      size: '1.2 МБ',
      uploadedBy: 'Иванов П.'
    },
    {
      id: 'DOC-002',
      orderId: 'PO-2026-00039',
      name: 'Фото готовой продукции.jpg',
      type: 'photo',
      uploadDate: '2026-03-04',
      size: '3.5 МБ',
      uploadedBy: 'Сидорова А.'
    },
    {
      id: 'DOC-003',
      orderId: 'PO-2026-00039',
      name: 'Накладная на отгрузку.pdf',
      type: 'invoice',
      uploadDate: '2026-03-06',
      size: '0.8 МБ',
      uploadedBy: 'Петров С.'
    }
  ];

  const getTypeLabel = (type: DocumentType) => {
    const labels: Record<DocumentType, string> = {
      act: 'Акт',
      invoice: 'Накладная',
      photo: 'Фото',
      certificate: 'Сертификат',
      other: 'Другое'
    };
    return labels[type];
  };

  const getTypeColor = (type: DocumentType) => {
    const colors: Record<DocumentType, { bg: string; text: string }> = {
      act: { bg: '#dbeafe', text: '#1e40af' },
      invoice: { bg: '#fef3c7', text: '#92400e' },
      photo: { bg: '#fce7f3', text: '#831843' },
      certificate: { bg: '#d1fae5', text: '#065f46' },
      other: { bg: '#f3f4f6', text: '#6b7280' }
    };
    return colors[type];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesOrder = orderFilter === 'all' || doc.orderId === orderFilter;
    return matchesType && matchesOrder;
  });

  const uniqueOrders = Array.from(new Set(documents.map(d => d.orderId)));

  return (
    <ProductionLayout>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '32px 24px 24px 24px'
        }}>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#1f2937', 
            marginBottom: '4px' 
          }}>
            Документы
          </h1>
          <p style={{ 
            fontSize: '13px', 
            color: '#6b7280', 
            fontWeight: 400 
          }}>
            Все документы по заказам
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Actions Bar */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1
          }}>
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#1f2937',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <option value="all">Все типы</option>
              <option value="act">Акты</option>
              <option value="invoice">Накладные</option>
              <option value="photo">Фото</option>
              <option value="certificate">Сертификаты</option>
              <option value="other">Другое</option>
            </select>

            {/* Order Filter */}
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#1f2937',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <option value="all">Все заказы</option>
              {uniqueOrders.map(orderId => (
                <option key={orderId} value={orderId}>{orderId}</option>
              ))}
            </select>
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#10a37f',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0e8a6d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#10a37f';
            }}
          >
            <Upload style={{ width: '16px', height: '16px' }} />
            Загрузить документ
          </button>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <FileText style={{ 
              width: '48px', 
              height: '48px', 
              margin: '0 auto 16px', 
              color: '#d1d5db' 
            }} />
            <p style={{ 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#9ca3af' 
            }}>
              Документов не найдено
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {filteredDocuments.map(doc => {
              const typeColors = getTypeColor(doc.type);
              
              return (
                <div
                  key={doc.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#10a37f';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 163, 127, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon & Type */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: typeColors.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileText style={{ 
                        width: '22px', 
                        height: '22px', 
                        color: typeColors.text 
                      }} />
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: typeColors.bg,
                      color: typeColors.text
                    }}>
                      {getTypeLabel(doc.type)}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1f2937',
                    marginBottom: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {doc.name}
                  </h3>

                  {/* Details */}
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginBottom: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div>Заказ: <span style={{ fontWeight: 600, color: '#1f2937' }}>{doc.orderId}</span></div>
                    <div>Размер: {doc.size}</div>
                    <div>Загружен: {new Date(doc.uploadDate).toLocaleDateString('ru-RU')}</div>
                    <div>Автор: {doc.uploadedBy}</div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <button
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                    >
                      <Eye style={{ width: '14px', height: '14px' }} />
                      Открыть
                    </button>
                    <button
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                    >
                      <Download style={{ width: '14px', height: '14px' }} />
                      Скачать
                    </button>
                    <button
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fff';
                      }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                      Удалить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProductionLayout>
  );
}

export default ProductionDocuments;