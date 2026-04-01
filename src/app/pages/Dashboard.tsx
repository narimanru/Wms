import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, Upload, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users, ChevronRight, ArrowRightLeft, FileCheck, Calendar, Sparkles, Factory } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../../styles/dashboard.css';
import productsData from '../data/products-demo.json';

interface RecentActivity {
  id: string;
  action: string;
  fileName: string;
  status: 'success' | 'processing' | 'error';
  user: string;
  time: string;
}

function Dashboard() {
  const navigate = useNavigate();
  
  // Calculate stats from demo data
  const markedProducts = productsData.products.filter(p => p.needsMarking);
  const totalKIZAvailable = markedProducts.reduce((sum, p) => 
    sum + p.sizes.reduce((s, size) => s + size.kiz.available, 0), 0
  );
  const totalKIZAssigned = markedProducts.reduce((sum, p) => 
    sum + p.sizes.reduce((s, size) => s + size.kiz.assigned, 0), 0
  );
  const totalKIZUsed = markedProducts.reduce((sum, p) => 
    sum + p.sizes.reduce((s, size) => s + size.kiz.used, 0), 0
  );
  const totalKIZ = totalKIZAvailable + totalKIZAssigned + totalKIZUsed;

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      action: 'Загружен пул КИЗов',
      fileName: 'брюки черн 42_gtin_04655051383518.pdf',
      status: 'success',
      user: 'Нариман',
      time: '5 мин назад'
    },
    {
      id: '2',
      action: 'Распределение завершено',
      fileName: 'Брюки черн 44_gtin_04655051383051.pdf',
      status: 'success',
      user: 'Нариман',
      time: '12 мин назад'
    },
    {
      id: '3',
      action: 'Обработка файла',
      fileName: 'брюки черн 46_gtin_04655051383068.pdf',
      status: 'processing',
      user: 'Нариман',
      time: '18 мин назад'
    }
  ]);

  // Mock data for charts
  const kizUsageData = [
    { date: '11 мар', загружено: 1200, распределено: 900, использовано: 450 },
    { date: '12 мар', загружено: 1800, распределено: 1400, использовано: 680 },
    { date: '13 мар', загружено: 2100, распределено: 1700, использовано: 920 },
    { date: '14 мар', загружено: 1900, распределено: 1500, использовано: 1100 },
    { date: '15 мар', загружено: 2400, распределено: 2000, использовано: 1350 },
    { date: '16 ар', загружено: 2800, распределено: 2300, использовано: 1580 },
    { date: '17 мар', загружено: 3200, распределено: 2700, использовано: 1820 },
  ];

  const topProductsData = [
    { name: 'Куртка зимняя', available: 450, assigned: 320, used: 180 },
    { name: 'Брюки черные', available: 380, assigned: 290, used: 150 },
    { name: 'Платье вечернее', available: 320, assigned: 240, used: 120 },
    { name: 'Джинсы мужские', available: 280, assigned: 210, used: 90 },
    { name: 'Футболка базовая', available: 250, assigned: 180, used: 85 },
  ];

  const operationsData = [
    { date: '11 мар', успешно: 45, ошибки: 2, обработка: 5 },
    { date: '12 мар', успешно: 52, ошибки: 1, обработка: 3 },
    { date: '13 мар', успешно: 48, ошибки: 3, обработка: 4 },
    { date: '14 мар', успешно: 61, ошибки: 1, обработка: 2 },
    { date: '15 мар', успешно: 58, ошибки: 2, обработка: 6 },
    { date: '16 мар', успешно: 65, ошибки: 1, обработка: 4 },
    { date: '17 мар', успешно: 72, ошибки: 0, обработка: 3 },
  ];

  const statusDistributionData = [
    { name: 'Доступно', value: totalKIZAvailable, color: '#28C76F' },
    { name: 'Распределено', value: totalKIZAssigned, color: '#7367F0' },
    { name: 'Использовано', value: totalKIZUsed, color: '#FF9F43' },
  ];

  const categoryProgressData = [
    { category: 'Верхняя одежда', total: 500, used: 350, percentage: 70 },
    { category: 'Брюки и джинсы', total: 450, used: 280, percentage: 62 },
    { category: 'Платья', total: 380, used: 190, percentage: 50 },
    { category: 'Футболки', total: 320, used: 240, percentage: 75 },
    { category: 'Обувь', total: 280, used: 112, percentage: 40 },
  ];

  const activityHeatmapData = [
    { day: 'Пн', hour0_6: 2, hour6_12: 15, hour12_18: 28, hour18_24: 8 },
    { day: 'Вт', hour0_6: 1, hour6_12: 18, hour12_18: 32, hour18_24: 6 },
    { day: 'Ср', hour0_6: 3, hour6_12: 22, hour12_18: 35, hour18_24: 10 },
    { day: 'Чт', hour0_6: 2, hour6_12: 20, hour12_18: 30, hour18_24: 7 },
    { day: 'Пт', hour0_6: 4, hour6_12: 25, hour12_18: 38, hour18_24: 12 },
    { day: 'Сб', hour0_6: 1, hour6_12: 8, hour12_18: 12, hour18_24: 3 },
    { day: 'Вс', hour0_6: 0, hour6_12: 5, hour12_18: 8, hour18_24: 2 },
  ];

  return (
    <div className="fw-dashboard">
      {/* Header */}
      <div className="fw-dashboard__header">
        <div className="fw-dashboard__header-content">
          <div>
            <h1 className="fw-dashboard__title">FASTWMS</h1>
            <p className="fw-dashboard__subtitle">Система распределения кодов маркировки</p>
          </div>
          <div className="fw-dashboard__user">
            <div className="fw-dashboard__user-avatar">Н</div>
            <div>
              <div className="fw-dashboard__user-name">Нариман</div>
              <div className="fw-dashboard__user-role">Администратор</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="fw-dashboard__content">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Активных КИЗ */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#7367F0]/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#7367F0]" />
              </div>
              <div className="flex items-center gap-1 text-[#28C76F] text-[12px] font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12%</span>
              </div>
            </div>
            <div className="text-[28px] font-semibold text-[#111827] mb-1">
              {totalKIZ.toLocaleString()}
            </div>
            <div className="text-[13px] text-[#6b7280]">
              Активных КИЗ в системе
            </div>
          </div>

          {/* Распределено кодов */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#7367F0]/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#7367F0]" />
              </div>
              <div className="flex items-center gap-1 text-[#28C76F] text-[12px] font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8%</span>
              </div>
            </div>
            <div className="text-[28px] font-semibold text-[#111827] mb-1">
              {totalKIZAssigned.toLocaleString()}
            </div>
            <div className="text-[13px] text-[#6b7280]">
              Распределено кодов
            </div>
          </div>

          {/* Ожидают обработки */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#FF9F43]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#FF9F43]" />
              </div>
              <div className="text-[12px] text-[#6b7280] font-medium">
                В процессе
              </div>
            </div>
            <div className="text-[28px] font-semibold text-[#111827] mb-1">
              {markedProducts.length}
            </div>
            <div className="text-[13px] text-[#6b7280]">
              Ожидают обработки
            </div>
          </div>

          {/* Активных пользователей */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#7367F0]/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#7367F0]" />
              </div>
              <div className="text-[12px] text-[#6b7280] font-medium">
                В системе
              </div>
            </div>
            <div className="text-[28px] font-semibold text-[#111827] mb-1">
              3
            </div>
            <div className="text-[13px] text-[#6b7280]">
              Активных пользователей
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="fw-section" style={{ marginTop: '32px' }}>
          <h2 className="fw-section__title">Быстрые действия</h2>
          <div className="fw-actions-grid">
            <button 
              className="fw-action-card fw-action-card--featured"
              onClick={() => navigate('/wizard')}
            >
              <div className="fw-action-card__icon">
                <Upload />
              </div>
              <div className="fw-action-card__content">
                <h3 className="fw-action-card__title">Загрузка КИЗов</h3>
                <p className="fw-action-card__description">
                  Загрузите КИЗы и распределите по размерам
                </p>
              </div>
              <ChevronRight className="fw-action-card__arrow" />
            </button>

            <button 
              className="fw-action-card fw-action-card--featured"
              onClick={() => navigate('/import-kiz')}
            >
              <div className="fw-action-card__icon">
                <Sparkles />
              </div>
              <div className="fw-action-card__content">
                <h3 className="fw-action-card__title">Импорт КИЗов v2</h3>
                <p className="fw-action-card__description">
                  Новый wizard с автоопределением GTIN и привязкой товаров
                </p>
              </div>
              <ChevronRight className="fw-action-card__arrow" />
            </button>

            <button 
              className="fw-action-card"
              onClick={() => navigate('/history')}
            >
              <div className="fw-action-card__icon">
                <FileText />
              </div>
              <div className="fw-action-card__content">
                <h3 className="fw-action-card__title">История загрузок</h3>
                <p className="fw-action-card__description">
                  Просмотр всех операций
                </p>
              </div>
              <ChevronRight className="fw-action-card__arrow" />
            </button>

            <button 
              className="fw-action-card"
              onClick={() => navigate('/inventory')}
            >
              <div className="fw-action-card__icon">
                <Package />
              </div>
              <div className="fw-action-card__content">
                <h3 className="fw-action-card__title">Честный знак</h3>
                <p className="fw-action-card__description">
                  Управление КИЗами по товарам
                </p>
              </div>
              <ChevronRight className="fw-action-card__arrow" />
            </button>

            <button 
              className="fw-action-card"
              onClick={() => navigate('/transfer')}
            >
              <div className="fw-action-card__icon">
                <ArrowRightLeft />
              </div>
              <div className="fw-action-card__content">
                <h3 className="fw-action-card__title">Перенос КИЗов</h3>
                <p className="fw-action-card__description">
                  История и управление переносом кодов
                </p>
              </div>
              <ChevronRight className="fw-action-card__arrow" />
            </button>

            <button 
              className="fw-action-card"
              onClick={() => navigate('/upd')}
            >
              <div className="fw-action-card__icon">
                <FileCheck />
              </div>
              <div className="fw-action-card__content">
                <h3 className="fw-action-card__title">Работа с УПД</h3>
                <p className="fw-action-card__description">
                  Универсальные передаточные документы
                </p>
              </div>
              <ChevronRight className="fw-action-card__arrow" />
            </button>

            <button 
              className="fw-action-card fw-action-card--ai"
              onClick={() => navigate('/planner')}
            >
              <div className="fw-action-card__icon">
                <Calendar />
              </div>
              <div className="fw-action-card__content">
                <div className="fw-action-card__title-wrapper">
                  <h3 className="fw-action-card__title">AI Планировщик</h3>
                  <span className="fw-action-card__badge">
                    <Sparkles className="w-3 h-3" />
                    AI
                  </span>
                </div>
                <p className="fw-action-card__description">
                  Планирует отгрузки на WB и производство
                </p>
              </div>
              <ChevronRight className="fw-action-card__arrow" />
            </button>

            <button 
              className="fw-action-card"
              onClick={() => navigate('/portal-selector')}
            >
              <div className="fw-action-card__icon">
                <Factory />
              </div>
              <div className="fw-action-card__content">
                <h3 className="fw-action-card__title">Производство</h3>
                <p className="fw-action-card__description">
                  Управление производством
                </p>
              </div>
              <ChevronRight className="fw-action-card__arrow" />
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="fw-section">
          <h2 className="fw-section__title">Аналитика</h2>
          
          {/* График использования КИЗов по времени */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-[#d1d5db] p-6">
              <h3 className="text-[16px] font-semibold text-[#111827] mb-4">
                Динамика использования КИЗов
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={kizUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Line 
                    key="line-загружено-dashboard"
                    type="monotone" 
                    dataKey="загружено" 
                    stroke="#7367F0" 
                    strokeWidth={2}
                    dot={{ fill: '#7367F0', r: 4 }}
                  />
                  <Line 
                    key="line-распределено-dashboard"
                    type="monotone" 
                    dataKey="распределено" 
                    stroke="#28C76F" 
                    strokeWidth={2}
                    dot={{ fill: '#28C76F', r: 4 }}
                  />
                  <Line 
                    key="line-использовано-dashboard"
                    type="monotone" 
                    dataKey="использовано" 
                    stroke="#FF9F43" 
                    strokeWidth={2}
                    dot={{ fill: '#FF9F43', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Статистика операций */}
            <div className="bg-white rounded-xl border border-[#d1d5db] p-6">
              <h3 className="text-[16px] font-semibold text-[#111827] mb-4">
                Статистика операций
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={operationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Area 
                    key="area-успешно"
                    type="monotone" 
                    dataKey="успешно" 
                    stackId="1"
                    stroke="#28C76F" 
                    fill="#28C76F"
                    fillOpacity={0.6}
                  />
                  <Area 
                    key="area-обработка"
                    type="monotone" 
                    dataKey="обработка" 
                    stackId="1"
                    stroke="#6366f1" 
                    fill="#6366f1"
                    fillOpacity={0.6}
                  />
                  <Area 
                    key="area-ошибки"
                    type="monotone" 
                    dataKey="ошибки" 
                    stackId="1"
                    stroke="#EA5455" 
                    fill="#EA5455"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Вторая строка графиков */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Топ товаров по КИЗам */}
            <div className="bg-white rounded-xl border border-[#d1d5db] p-6">
              <h3 className="text-[16px] font-semibold text-[#111827] mb-4">
                Топ-5 товаров по КИЗам
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" style={{ fontSize: '11px' }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#6b7280" 
                    style={{ fontSize: '11px' }}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar key="bar-available" dataKey="available" name="Доступно" fill="#28C76F" stackId="a" />
                  <Bar key="bar-assigned" dataKey="assigned" name="Распределено" fill="#7367F0" stackId="a" />
                  <Bar key="bar-used" dataKey="used" name="Использовано" fill="#FF9F43" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Распределение статусов */}
            <div className="bg-white rounded-xl border border-[#d1d5db] p-6">
              <h3 className="text-[16px] font-semibold text-[#111827] mb-4">
                Распределение КИЗов
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Активность по дням недели */}
            <div className="bg-white rounded-xl border border-[#d1d5db] p-6">
              <h3 className="text-[16px] font-semibold text-[#111827] mb-4">
                Активность по времени суток
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityHeatmapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px' }}
                  />
                  <Bar key="bar-hour0-6" dataKey="hour0_6" name="0-6" stackId="a" fill="#9ca3af" />
                  <Bar key="bar-hour6-12" dataKey="hour6_12" name="6-12" stackId="a" fill="#7367F0" />
                  <Bar key="bar-hour12-18" dataKey="hour12_18" name="12-18" stackId="a" fill="#6366f1" />
                  <Bar key="bar-hour18-24" dataKey="hour18_24" name="18-24" stackId="a" fill="#FF9F43" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Прогресс по категориям */}
          <div className="bg-white rounded-xl border border-[#d1d5db] p-6">
            <h3 className="text-[16px] font-semibold text-[#111827] mb-4">
              Использование КИЗов по категориям
            </h3>
            <div className="space-y-4">
              {categoryProgressData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] text-[#374151] font-medium">
                      {item.category}
                    </span>
                    <span className="text-[12px] text-[#6b7280]">
                      {item.used} / {item.total} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#f3f4f6] rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-[#7367F0] to-[#6355D9] h-2.5 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="fw-section">
          <div className="fw-section__header">
            <h2 className="fw-section__title">Недавняя активность</h2>
            <button 
              className="fw-link-btn"
              onClick={() => navigate('/history')}
            >
              Показать всё
            </button>
          </div>

          <div className="fw-activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="fw-activity-item">
                <div className={`fw-activity-item__status fw-activity-item__status--${activity.status}`}>
                  {activity.status === 'success' && <CheckCircle className="w-4 h-4" />}
                  {activity.status === 'processing' && <Clock className="w-4 h-4" />}
                  {activity.status === 'error' && <AlertCircle className="w-4 h-4" />}
                </div>
                <div className="fw-activity-item__content">
                  <div className="fw-activity-item__action">{activity.action}</div>
                  <div className="fw-activity-item__file">{activity.fileName}</div>
                </div>
                <div className="fw-activity-item__meta">
                  <div className="fw-activity-item__user">{activity.user}</div>
                  <div className="fw-activity-item__time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;