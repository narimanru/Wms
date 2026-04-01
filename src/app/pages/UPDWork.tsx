import { useState } from 'react';
import { FileText, Upload, Download, Search, Filter, Calendar, Package } from 'lucide-react';
import '../../styles/upd-work.css';
import React from 'react';

function UPDWork() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="upd-container">
      {/* Header */}
      <div className="upd-header">
        <div className="upd-header__content">
          <div className="upd-header__info">
            <h1 className="upd-header__title">Работа с УПД</h1>
            <p className="upd-header__subtitle">
              Управление универсальными передаточными документами
            </p>
          </div>
          <div className="upd-header__actions">
            <button className="upd-btn upd-btn--secondary">
              <Download className="w-5 h-5" />
              Экспорт
            </button>
            <button className="upd-btn upd-btn--primary">
              <Upload className="w-5 h-5" />
              Загрузить УПД
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="upd-filters">
        <div className="upd-filters__content">
          <div className="upd-search">
            <Search className="upd-search__icon" />
            <input
              type="text"
              className="upd-search__input"
              placeholder="Поиск по номеру УПД или контрагенту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="upd-filter-group">
            <button className="upd-filter-btn">
              <Calendar className="w-4 h-4" />
              Период
            </button>
            <button className="upd-filter-btn">
              <Filter className="w-4 h-4" />
              Фильтры
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="upd-content">
        <div className="upd-empty">
          <div className="upd-empty__icon">
            <FileText className="w-16 h-16" />
          </div>
          <h3 className="upd-empty__title">Нет загруженных УПД</h3>
          <p className="upd-empty__description">
            Начните работу, загрузив первый универсальный передаточный документ
          </p>
          <button className="upd-empty__btn">
            <Upload className="w-5 h-5" />
            Загрузить УПД
          </button>
        </div>
      </div>

      {/* Stats (Hidden when empty) */}
      <div className="upd-stats" style={{ display: 'none' }}>
        <div className="upd-stats__content">
          <div className="upd-stat-card">
            <div className="upd-stat-card__icon upd-stat-card__icon--blue">
              <FileText className="w-5 h-5" />
            </div>
            <div className="upd-stat-card__info">
              <div className="upd-stat-card__value">0</div>
              <div className="upd-stat-card__label">Всего УПД</div>
            </div>
          </div>
          <div className="upd-stat-card">
            <div className="upd-stat-card__icon upd-stat-card__icon--green">
              <Package className="w-5 h-5" />
            </div>
            <div className="upd-stat-card__info">
              <div className="upd-stat-card__value">0</div>
              <div className="upd-stat-card__label">Товаров принято</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UPDWork;
