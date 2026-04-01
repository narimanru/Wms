import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  ChevronRight, 
  Copy, 
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface HistoryAction {
  id: string;
  date: string;
  time: string;
  actionType: 'discount' | 'price' | 'manual';
  actionValue: string;
  status: 'success' | 'error' | 'skipped';
  productName: string;
  nmId: string;
  sku: string;
  reason: string;
  oldValue?: string;
  newValue?: string;
  wbResponse?: string;
}

const mockHistory: HistoryAction[] = [
  {
    id: '1',
    date: '15.03.2026',
    time: '08:00:08',
    actionType: 'discount',
    actionValue: '20%',
    status: 'success',
    productName: 'Куртка зимняя удлиненная с капюшоном',
    nmId: '182077164',
    sku: 'NKurtka-men-w-beige',
    reason: 'По стратегии репрайсера',
    oldValue: '40%',
    newValue: '20%',
    wbResponse: 'Изменение успешно применено'
  },
  {
    id: '2',
    date: '15.03.2026',
    time: '07:45:12',
    actionType: 'price',
    actionValue: '1890 ₽',
    status: 'success',
    productName: 'Джинсы мужские прямого кроя',
    nmId: '182077165',
    sku: 'NJeans-men-straight-blue',
    reason: 'Порог минимальной цены',
    oldValue: '1790 ₽',
    newValue: '1890 ₽',
    wbResponse: 'Изменение успешно применено'
  },
  {
    id: '3',
    date: '15.03.2026',
    time: '07:30:45',
    actionType: 'discount',
    actionValue: '15%',
    status: 'error',
    productName: 'Футболка хлопковая базовая',
    nmId: '182077166',
    sku: 'NTshirt-basic-white',
    reason: 'Ручной запуск',
    oldValue: '10%',
    newValue: '15%',
    wbResponse: 'Ошибка: превышен лимит изменений в день'
  },
  {
    id: '4',
    date: '15.03.2026',
    time: '07:15:22',
    actionType: 'discount',
    actionValue: '25%',
    status: 'skipped',
    productName: 'Свитер вязаный с узором',
    nmId: '182077167',
    sku: 'NSweater-knit-pattern-grey',
    reason: 'Ответ Wildberries',
    oldValue: '30%',
    newValue: '25%',
    wbResponse: 'Пропущено: товар снят с продажи'
  },
  {
    id: '5',
    date: '15.03.2026',
    time: '07:00:03',
    actionType: 'price',
    actionValue: '2490 ₽',
    status: 'success',
    productName: 'Платье вечернее длинное',
    nmId: '182077168',
    sku: 'NDress-evening-long-black',
    reason: 'По стратегии репрайсера',
    oldValue: '2390 ₽',
    newValue: '2490 ₽',
    wbResponse: 'Изменение успешно применено'
  }
];

export default function RepricerHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState('7 дней');
  const [statusFilter, setStatusFilter] = useState('Все');
  const [actionTypeFilter, setActionTypeFilter] = useState('Все');
  const [selectedAction, setSelectedAction] = useState<HistoryAction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-[#28C76F]/10 text-[#28C76F]';
      case 'error':
        return 'bg-[#EA5455]/10 text-[#EA5455]';
      case 'skipped':
        return 'bg-[#82868B]/10 text-[#82868B]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Успешно';
      case 'error':
        return 'Ошибка';
      case 'skipped':
        return 'Пропущено';
      default:
        return status;
    }
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (err) {
      console.log('Clipboard not available');
    }
  };

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nmId.includes(searchQuery) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'Все' || 
      (statusFilter === 'Успешно' && item.status === 'success') ||
      (statusFilter === 'Ошибка' && item.status === 'error') ||
      (statusFilter === 'Пропущено' && item.status === 'skipped');

    const matchesActionType = actionTypeFilter === 'Все' ||
      (actionTypeFilter === 'Изменение скидки' && item.actionType === 'discount') ||
      (actionTypeFilter === 'Изменение цены' && item.actionType === 'price') ||
      (actionTypeFilter === 'Ручное изменение' && item.actionType === 'manual');

    return matchesSearch && matchesStatus && matchesActionType;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#f7f7f8] p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-[#2d3748] mb-2">
            История действий репрайсера
          </h1>
          <p className="text-[15px] text-[#718096]">
            История изменений цен и скидок, применённых системой.
          </p>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Поиск */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0aec0]" />
                <input
                  type="text"
                  placeholder="Поиск товара или nmId"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7367F0]/20 focus:border-[#7367F0] transition-all"
                />
              </div>
            </div>

            {/* Период */}
            <div>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7367F0]/20 focus:border-[#7367F0] transition-all bg-white"
              >
                <option>Сегодня</option>
                <option>7 дней</option>
                <option>30 дней</option>
                <option>Выбрать период</option>
              </select>
            </div>

            {/* Статус */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7367F0]/20 focus:border-[#7367F0] transition-all bg-white"
              >
                <option>Все</option>
                <option>Успешно</option>
                <option>Ошибка</option>
                <option>Пропущено</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Тип действия */}
            <div>
              <select
                value={actionTypeFilter}
                onChange={(e) => setActionTypeFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7367F0]/20 focus:border-[#7367F0] transition-all bg-white"
              >
                <option>Все</option>
                <option>Изменение скидки</option>
                <option>Изменение цены</option>
                <option>Ручное изменение</option>
              </select>
            </div>
          </div>

          {/* Быстрые фильтры */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPeriodFilter('Сегодня')}
              className="px-4 py-2 bg-[#f7fafc] border border-[#e2e8f0] rounded-lg text-[14px] text-[#4a5568] hover:bg-[#edf2f7] transition-colors"
            >
              Сегодня
            </button>
            <button
              onClick={() => setStatusFilter('Ошибка')}
              className="px-4 py-2 bg-[#EA5455]/5 border border-[#EA5455]/20 rounded-lg text-[14px] text-[#EA5455] hover:bg-[#EA5455]/10 transition-colors"
            >
              Ошибки
            </button>
            <button
              className="px-4 py-2 bg-[#7367F0]/5 border border-[#7367F0]/20 rounded-lg text-[14px] text-[#7367F0] hover:bg-[#7367F0]/10 transition-colors"
            >
              По этому товару
            </button>
          </div>
        </div>

        {/* Таблица */}
        <div className="bg-white rounded-xl border border-[#d1d5db] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#d1d5db]">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#6b7280] tracking-wide">
                    Дата и время
                  </th>
                  <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#6b7280] tracking-wide">
                    Действие
                  </th>
                  <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#6b7280] tracking-wide">
                    Статус
                  </th>
                  <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#6b7280] tracking-wide">
                    Товар
                  </th>
                  <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#6b7280] tracking-wide">
                    Причина
                  </th>
                  <th className="px-6 py-3.5 text-left text-[12px] font-medium text-[#6b7280] tracking-wide">
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((action, index) => (
                  <tr 
                    key={action.id}
                    onClick={() => setSelectedAction(action)}
                    className={`hover:bg-[#f9fafb] transition-colors cursor-pointer ${index !== paginatedHistory.length - 1 ? 'border-b border-[#e5e7eb]' : ''}`}
                  >
                    {/* Дата и время */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[13px] text-[#374151] font-medium">{action.date}</div>
                      <div className="text-[12px] text-[#9ca3af] mt-0.5">{action.time}</div>
                    </td>

                    {/* Действие */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#6b7280]">
                          {action.actionType === 'discount' ? 'Скидка' : 'Цена'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#9ca3af]" />
                        <span className="px-2 py-0.5 bg-[#10a37f]/10 text-[#10a37f] rounded text-[12px] font-medium">
                          {action.actionValue}
                        </span>
                      </div>
                    </td>

                    {/* Статус */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[12px] font-medium ${getStatusBadgeClass(action.status)}`}>
                        {getStatusText(action.status)}
                      </span>
                    </td>

                    {/* Товар */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Изображение товара */}
                        <div className="w-12 h-12 bg-[#f3f4f6] rounded-md flex-shrink-0 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-[#e5e7eb] to-[#d1d5db]"></div>
                        </div>
                        
                        {/* Информация о товаре */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] text-[#111827] font-medium mb-1.5 line-clamp-1">
                            {action.productName}
                          </div>
                          <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
                            <span>Брюки</span>
                            <span>•</span>
                            <span className="font-mono">{action.nmId}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(action.nmId);
                              }}
                              className="p-0.5 hover:bg-[#f3f4f6] rounded transition-colors"
                              title="Копировать nmId"
                            >
                              <Copy className="w-3 h-3 text-[#9ca3af]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Причина */}
                    <td className="px-6 py-4">
                      <div className="text-[13px] text-[#6b7280]">{action.reason}</div>
                    </td>

                    {/* Подробнее */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAction(action);
                        }}
                        className="text-[#10a37f] hover:text-[#0d8c6f] transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Пагинация */}
          <div className="px-6 py-3.5 border-t border-[#d1d5db] bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#6b7280]">Показать:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 border border-[#d1d5db] rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[#10a37f] focus:border-[#10a37f] bg-white"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md hover:bg-[#f3f4f6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsLeft className="w-4 h-4 text-[#6b7280]" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md hover:bg-[#f3f4f6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] h-[32px] px-2 rounded-md text-[13px] font-medium transition-colors ${currentPage === pageNum ? 'bg-[#10a37f] text-white' : 'hover:bg-[#f3f4f6] text-[#374151]'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md hover:bg-[#f3f4f6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-4 h-4 text-[#6b7280]" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md hover:bg-[#f3f4f6] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronsRight className="w-4 h-4 text-[#6b7280]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Боковая панель с деталями */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <div className="w-full max-w-[500px] bg-white h-full shadow-2xl overflow-y-auto">
            {/* Заголовок панели */}
            <div className="sticky top-0 bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-[20px] font-semibold text-[#2d3748]">Детали изменения</h2>
              <button
                onClick={() => setSelectedAction(null)}
                className="p-2 hover:bg-[#f7fafc] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#4a5568]" />
              </button>
            </div>

            {/* Содержимое панели */}
            <div className="p-6 space-y-6">
              {/* Товар */}
              <div>
                <h3 className="text-[13px] font-semibold text-[#a0aec0] uppercase tracking-wider mb-3">
                  Товар
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-[14px] text-[#718096] mb-1">Название</div>
                    <div className="text-[15px] text-[#2d3748] font-medium">
                      {selectedAction.productName}
                    </div>
                  </div>
                  <div>
                    <div className="text-[14px] text-[#718096] mb-1">nmId</div>
                    <div className="flex items-center gap-2">
                      <div className="text-[15px] text-[#2d3748] font-mono">
                        {selectedAction.nmId}
                      </div>
                      <button
                        onClick={() => copyToClipboard(selectedAction.nmId)}
                        className="p-1.5 hover:bg-[#f7fafc] rounded transition-colors"
                        title="Копировать nmId"
                      >
                        <Copy className="w-4 h-4 text-[#7367F0]" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-[14px] text-[#718096] mb-1">SKU</div>
                    <div className="flex items-center gap-2">
                      <div className="text-[15px] text-[#2d3748] font-mono">
                        {selectedAction.sku}
                      </div>
                      <button
                        onClick={() => copyToClipboard(selectedAction.sku)}
                        className="p-1.5 hover:bg-[#f7fafc] rounded transition-colors"
                        title="Копировать SKU"
                      >
                        <Copy className="w-4 h-4 text-[#7367F0]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Изменение */}
              <div>
                <h3 className="text-[13px] font-semibold text-[#a0aec0] uppercase tracking-wider mb-3">
                  Изменение
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f7fafc] rounded-lg p-4">
                    <div className="text-[13px] text-[#718096] mb-2">
                      {selectedAction.actionType === 'discount' ? 'Старая скидка' : 'Старая цена'}
                    </div>
                    <div className="text-[20px] font-semibold text-[#4a5568]">
                      {selectedAction.oldValue}
                    </div>
                  </div>
                  <div className="bg-[#7367F0]/5 rounded-lg p-4 border-2 border-[#7367F0]/20">
                    <div className="text-[13px] text-[#7367F0] mb-2">
                      {selectedAction.actionType === 'discount' ? 'Новая скидка' : 'Новая цена'}
                    </div>
                    <div className="text-[20px] font-semibold text-[#7367F0]">
                      {selectedAction.newValue}
                    </div>
                  </div>
                </div>
              </div>

              {/* Причина */}
              <div>
                <h3 className="text-[13px] font-semibold text-[#a0aec0] uppercase tracking-wider mb-3">
                  Причина изменения
                </h3>
                <div className="bg-[#f7fafc] rounded-lg p-4">
                  <div className="text-[15px] text-[#2d3748]">{selectedAction.reason}</div>
                </div>
              </div>

              {/* Ответ Wildberries */}
              <div>
                <h3 className="text-[13px] font-semibold text-[#a0aec0] uppercase tracking-wider mb-3">
                  Ответ Wildberries
                </h3>
                <div className={`rounded-lg p-4 ${
                  selectedAction.status === 'success' 
                    ? 'bg-[#28C76F]/5 border border-[#28C76F]/20' 
                    : selectedAction.status === 'error'
                    ? 'bg-[#EA5455]/5 border border-[#EA5455]/20'
                    : 'bg-[#82868B]/5 border border-[#82868B]/20'
                }`}>
                  <div className={`text-[15px] ${
                    selectedAction.status === 'success'
                      ? 'text-[#28C76F]'
                      : selectedAction.status === 'error'
                      ? 'text-[#EA5455]'
                      : 'text-[#82868B]'
                  }`}>
                    {selectedAction.wbResponse}
                  </div>
                </div>
              </div>

              {/* Дата */}
              <div>
                <h3 className="text-[13px] font-semibold text-[#a0aec0] uppercase tracking-wider mb-3">
                  Дата и время
                </h3>
                <div className="bg-[#f7fafc] rounded-lg p-4">
                  <div className="text-[15px] text-[#2d3748]">
                    {selectedAction.date} в {selectedAction.time}
                  </div>
                </div>
              </div>

              {/* Статус */}
              <div>
                <h3 className="text-[13px] font-semibold text-[#a0aec0] uppercase tracking-wider mb-3">
                  Статус
                </h3>
                <div>
                  <span className={`inline-block px-4 py-2 rounded-lg text-[14px] font-medium ${getStatusBadgeClass(selectedAction.status)}`}>
                    {getStatusText(selectedAction.status)}
                  </span>
                </div>
              </div>

              {/* Кнопка закрытия */}
              <div className="pt-4 border-t border-[#e2e8f0]">
                <button
                  onClick={() => setSelectedAction(null)}
                  className="w-full px-6 py-3 bg-[#10a37f] text-white rounded-lg font-medium hover:bg-[#0d8c6f] transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}