import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, Upload, FileText, Clock, CheckCircle, AlertCircle, TrendingUp, Users, ChevronRight, ArrowRightLeft, FileCheck, Calendar, Sparkles, Factory } from 'lucide-react';
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
        <div className="fw-stats-grid">
          <div className="fw-stat-card fw-stat-card--primary">
            <div className="fw-stat-card__icon">
              <Package />
            </div>
            <div className="fw-stat-card__content">
              <div className="fw-stat-card__value">{totalKIZ.toLocaleString()}</div>
              <div className="fw-stat-card__label">Активных КИЗ в системе</div>
            </div>
            <div className="fw-stat-card__trend">
              <TrendingUp className="w-4 h-4" />
              <span>+12% за неделю</span>
            </div>
          </div>

          <div className="fw-stat-card fw-stat-card--success">
            <div className="fw-stat-card__icon">
              <CheckCircle />
            </div>
            <div className="fw-stat-card__content">
              <div className="fw-stat-card__value">{totalKIZAssigned.toLocaleString()}</div>
              <div className="fw-stat-card__label">Распределено кодов</div>
            </div>
            <div className="fw-stat-card__trend">
              <TrendingUp className="w-4 h-4" />
              <span>+8% за неделю</span>
            </div>
          </div>

          <div className="fw-stat-card fw-stat-card--warning">
            <div className="fw-stat-card__icon">
              <Clock />
            </div>
            <div className="fw-stat-card__content">
              <div className="fw-stat-card__value">{markedProducts.length}</div>
              <div className="fw-stat-card__label">Ожидают обработки</div>
            </div>
            <div className="fw-stat-card__trend">
              <span>В процессе</span>
            </div>
          </div>

          <div className="fw-stat-card fw-stat-card--info">
            <div className="fw-stat-card__icon">
              <Users />
            </div>
            <div className="fw-stat-card__content">
              <div className="fw-stat-card__value">3</div>
              <div className="fw-stat-card__label">Активных пользователей</div>
            </div>
            <div className="fw-stat-card__trend">
              <span>В системе</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="fw-section">
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