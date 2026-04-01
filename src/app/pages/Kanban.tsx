import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Package, 
  Camera, 
  Truck, 
  Tag, 
  Clock, 
  User, 
  Calendar,
  MoreVertical,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Image,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  title: string;
  type: 'pickup' | 'photoshoot' | 'marking' | 'shipment' | 'other';
  product: {
    name: string;
    article: string;
    image?: string;
  };
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  description?: string;
  status: 'todo' | 'inProgress' | 'done';
  createdAt: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Забрать груз с производства',
    type: 'pickup',
    product: {
      name: 'Брюки палаццо классические широкие',
      article: '425182238',
    },
    priority: 'high',
    assignee: 'Алексей',
    dueDate: '2026-03-20',
    status: 'todo',
    createdAt: '2026-03-19 10:30',
    description: '120 единиц товара готовы к отгрузке'
  },
  {
    id: '2',
    title: 'Отправить на фотосессию',
    type: 'photoshoot',
    product: {
      name: 'Брюки классические палаццо с высокой посадкой',
      article: '391596776',
    },
    priority: 'medium',
    assignee: 'Марина',
    dueDate: '2026-03-21',
    status: 'todo',
    createdAt: '2026-03-19 09:15',
    description: 'Нужны фото для новой коллекции'
  },
  {
    id: '3',
    title: 'Маркировка нового поступления',
    type: 'marking',
    product: {
      name: 'Брюки утепленные палаццо с начесом',
      article: '604149436',
    },
    priority: 'high',
    assignee: 'Дмитрий',
    dueDate: '2026-03-20',
    status: 'inProgress',
    createdAt: '2026-03-18 14:20',
    description: 'Партия 200 единиц требует маркировки'
  },
  {
    id: '4',
    title: 'Отгрузка на WB склад',
    type: 'shipment',
    product: {
      name: 'Брюки классические палаццо с высокой посадкой',
      article: '447263640',
    },
    priority: 'medium',
    assignee: 'Игорь',
    status: 'inProgress',
    createdAt: '2026-03-17 11:00',
    description: 'Подготовить к отгрузке 150 единиц'
  },
  {
    id: '5',
    title: 'Проверка каства товара',
    type: 'other',
    product: {
      name: 'Брюки школьные клеш от колена в рубчик',
      article: '191053909',
    },
    priority: 'low',
    assignee: 'Ольга',
    status: 'done',
    createdAt: '2026-03-16 15:30',
    description: 'Контроль качества выполнен'
  },
  {
    id: '6',
    title: 'Забрать образцы с производства',
    type: 'pickup',
    product: {
      name: 'Брюки для девочки палаццо на резинке',
      article: '140062528',
    },
    priority: 'medium',
    status: 'done',
    createdAt: '2026-03-15 10:00'
  }
];

const TASK_TYPES = {
  pickup: { label: 'Забрать груз', icon: Truck, color: '#3B82F6' },
  photoshoot: { label: 'Фотосессия', icon: Camera, color: '#8B5CF6' },
  marking: { label: 'Маркировка', icon: Tag, color: '#F59E0B' },
  shipment: { label: 'Отгрузка', icon: Package, color: '#111827' },
  other: { label: 'Прочее', icon: AlertCircle, color: '#6B7280' }
};

const PRIORITY_COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#6B7280'
};

const COLUMNS = [
  { id: 'todo', title: 'К выполнению', color: '#6B7280' },
  { id: 'inProgress', title: 'В работе', color: '#3B82F6' },
  { id: 'done', title: 'Выполнено', color: '#10B981' }
];

const PRESET_BACKGROUNDS = [
  {
    id: 'gradient-blue',
    name: 'Синий градиент',
    url: 'https://images.unsplash.com/photo-1679193559811-b3a3a6353230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZ3JhZGllbnQlMjBhYnN0cmFjdCUyMGJsdWV8ZW58MXx8fHwxNzczOTMwODYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'pastel',
    name: 'Пастельный',
    url: 'https://images.unsplash.com/photo-1761623135057-e41b632694f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwcGFzdGVsJTIwZ3JhZGllbnQlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MzkzMDg2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'geometric',
    name: 'Геометрия',
    url: 'https://images.unsplash.com/photo-1729642946400-904c5f48e94c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwZ2VvbWV0cmljJTIwcGF0dGVybiUyMGxpZ2h0fGVufDF8fHx8MTc3MzkzMDg2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'workspace',
    name: 'Рабочее место',
    url: 'https://images.unsplash.com/photo-1657757996603-acec063f1d9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc3BhY2UlMjBkZXNrJTIwbWluaW1hbCUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NzM5MzA4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'mountain',
    name: 'Горы',
    url: 'https://images.unsplash.com/photo-1631546558035-ddad6a30eefa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMG1pbmltYWx8ZW58MXx8fHwxNzczODcyODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'purple-waves',
    name: 'Фиолетовые волны',
    url: 'https://images.unsplash.com/photo-1763311680980-816106593998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHdhdmVzJTIwZ3JhZGllbnQlMjBwdXJwbGV8ZW58MXx8fHwxNzczOTMwODYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id, currentStatus: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const taskType = TASK_TYPES[task.type];
  const Icon = taskType.icon;

  return (
    <div
      ref={drag}
      style={{
        marginBottom: '8px',
        cursor: 'grab',
      }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '5px',
          padding: '12px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
          <div 
            style={{ 
              width: '32px',
              height: '32px',
              borderRadius: '5px',
              background: `${taskType.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon size={16} strokeWidth={1.5} style={{ color: taskType.color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
              {task.title}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {task.product.name}
            </div>
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MoreVertical size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Product Article */}
        <div style={{ 
          fontSize: '11px', 
          color: '#9CA3AF', 
          marginBottom: '8px',
          fontFamily: 'monospace'
        }}>
          #{task.product.article}
        </div>

        {/* Description */}
        {task.description && (
          <div style={{ 
            fontSize: '12px', 
            color: '#6B7280', 
            marginBottom: '8px',
            lineHeight: '1.4'
          }}>
            {task.description}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Priority */}
            <div 
              style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: PRIORITY_COLORS[task.priority] 
              }} 
              title={`Приоритет: ${task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}`}
            />
            
            {/* Due Date */}
            {task.dueDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} strokeWidth={1.5} style={{ color: '#9CA3AF' }} />
                <span style={{ fontSize: '11px', color: '#6B7280' }}>
                  {new Date(task.dueDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            )}
          </div>

          {/* Assignee */}
          {task.assignee && (
            <div 
              style={{ 
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#111827',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '500'
              }}
              title={task.assignee}
            >
              {task.assignee.charAt(0)}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface ColumnProps {
  column: typeof COLUMNS[0];
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

// Custom Select Component
interface CustomSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
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
              padding: '4px'
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

const Column: React.FC<ColumnProps> = ({ column, tasks, onStatusChange }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string; currentStatus: Task['status'] }) => {
      if (item.currentStatus !== column.id) {
        onStatusChange(item.id, column.id as Task['status']);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        background: isOver ? '#F9FAFB' : '#FAFAFA',
        border: isOver ? '2px dashed #3B82F6' : '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '16px',
        minHeight: '500px',
        transition: 'all 0.2s',
        flex: 1,
        minWidth: '280px',
        maxWidth: '320px'
      }}
    >
      {/* Column Header */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: column.color 
              }} 
            />
            <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>
              {column.title}
            </h3>
            <span 
              style={{ 
                fontSize: '12px', 
                color: '#9CA3AF',
                background: '#F3F4F6',
                padding: '2px 6px',
                borderRadius: '3px'
              }}
            >
              {tasks.length}
            </span>
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Plus size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Add Task Button */}
        <button
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px dashed #E5E7EB',
            borderRadius: '5px',
            background: 'transparent',
            color: '#6B7280',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#111827';
            e.currentTarget.style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#E5E7EB';
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <Plus size={14} strokeWidth={1.5} />
          Добавить задачу
        </button>
      </div>

      {/* Tasks */}
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
      </AnimatePresence>

      {tasks.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#9CA3AF',
          fontSize: '14px'
        }}>
          Нет задач
        </div>
      )}
    </div>
  );
};

export default function Kanban() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [showBackgroundGallery, setShowBackgroundGallery] = useState(false);

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
        setShowBackgroundGallery(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    setBackgroundImage('');
    setShowBackgroundGallery(false);
  };

  const handlePresetBackground = (url: string) => {
    setBackgroundImage(url);
    setShowBackgroundGallery(false);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesProduct = task.product.name.toLowerCase().includes(query);
      const matchesArticle = task.product.article.includes(query);
      if (!matchesTitle && !matchesProduct && !matchesArticle) return false;
    }
    if (filterType !== 'all' && task.type !== filterType) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const getTasksByStatus = (status: Task['status']) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        minHeight: '100vh', 
        background: backgroundImage ? `url(${backgroundImage})` : '#FAFAFA',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}>
        {/* Header */}
        <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', padding: '16px 32px', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            {/* Page Title */}
            <div style={{ marginBottom: '16px' }}>
              
              
            </div>

            {/* Search and Filters */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                <Search 
                  size={16} 
                  strokeWidth={1.5}
                  style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#9CA3AF' 
                  }} 
                />
                <input
                  type="text"
                  placeholder="Поиск задач, товаров, артикулов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white'
                  }}
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  background: showFilters ? '#111827' : 'white',
                  color: showFilters ? 'white' : '#6B7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Filter size={14} strokeWidth={1.5} />
                Фильтры
              </button>

              {/* Background Image Upload Button */}
              {!backgroundImage ? (
                <>
                  <button
                    onClick={() => setShowBackgroundGallery(!showBackgroundGallery)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '5px',
                      background: showBackgroundGallery ? '#111827' : 'white',
                      color: showBackgroundGallery ? 'white' : '#6B7280',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '400',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Image size={14} strokeWidth={1.5} />
                    Фон доски
                  </button>
                  <label
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '5px',
                      background: 'white',
                      color: '#6B7280',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '400',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={14} strokeWidth={1.5} />
                    Загрузить
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </>
              ) : (
                <button
                  onClick={handleRemoveBackground}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    background: '#EF4444',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '400',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <X size={14} strokeWidth={1.5} />
                  Убрать фон
                </button>
              )}

              {/* Add Task Button */}
              <button
                style={{
                  padding: '8px 16px',
                  border: '1px solid #111827',
                  borderRadius: '5px',
                  background: '#111827',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={14} strokeWidth={1.5} />
                Новая задача
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: '#F9FAFB',
                  borderRadius: '5px',
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Type Filter */}
                <CustomSelect
                  label="Тип задачи"
                  value={filterType}
                  options={[
                    { value: 'all', label: 'Все типы' },
                    ...Object.entries(TASK_TYPES).map(([key, value]) => ({
                      value: key,
                      label: value.label
                    }))
                  ]}
                  onChange={setFilterType}
                />

                {/* Priority Filter */}
                <CustomSelect
                  label="Приоритет"
                  value={filterPriority}
                  options={[
                    { value: 'all', label: 'Все приоритеты' },
                    { value: 'high', label: 'Высокий' },
                    { value: 'medium', label: 'Средний' },
                    { value: 'low', label: 'Низкий' }
                  ]}
                  onChange={setFilterPriority}
                />
              </motion.div>
            )}

            {/* Background Gallery Panel */}
            {showBackgroundGallery && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  background: '#F9FAFB',
                  borderRadius: '5px'
                }}
              >
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#111827', 
                  marginBottom: '12px' 
                }}>
                  Выберите готовый фон
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '12px'
                }}>
                  {PRESET_BACKGROUNDS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => handlePresetBackground(bg.url)}
                      style={{
                        position: 'relative',
                        height: '80px',
                        border: '2px solid #E5E7EB',
                        borderRadius: '5px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: 'white',
                        padding: 0,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = '#111827';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <img 
                        src={bg.url} 
                        alt={bg.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        padding: '8px 6px 4px',
                        fontSize: '10px',
                        fontWeight: '500',
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        {bg.name}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div style={{ padding: '24px 32px' }}>
          <div>
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '16px'
            }}>
              {COLUMNS.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={getTasksByStatus(column.id as Task['status'])}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}