import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Phone, Building, MapPin, Calendar, Shield, Eye, EyeOff, Save, Edit2, Camera, Check, AlertCircle, Trash2, MessageSquare, MapPinned, Info, LogOut } from 'lucide-react';

interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  telegram: string;
  phone: string;
  address: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

interface PasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    user_id: 'usr_123456789',
    first_name: 'Александр',
    last_name: 'Иванов',
    email: 'a.ivanov@fastwms.ru',
    email_verified: true,
    telegram: '@a_ivanov',
    phone: '+7 (999) 123-45-67',
    address: 'Москва, ул. Примерная, д. 15, офис 201',
    avatar_url: 'АИ',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2025-03-15T14:20:00Z'
  });

  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Валидация имени
  const validateFirstName = (name: string): boolean => {
    return name.trim().length > 0;
  };

  // Валидация телефона
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // необязательное поле
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phone);
  };

  // Валидация пароля
  const validatePassword = (password: string): { valid: boolean, message: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Минимум 8 символов' };
    }
    if (!/[a-zA-Z]/.test(password)) {
      return { valid: false, message: 'Минимум 1 буква' };
    }
    if (!/[\d\W]/.test(password)) {
      return { valid: false, message: 'Минимум 1 цифра или спецсимвол' };
    }
    return { valid: true, message: '' };
  };

  // Сохранение профиля
  const handleSaveProfile = () => {
    // Валидация
    if (!validateFirstName(tempProfile.first_name)) {
      setProfileMessage({ type: 'error', text: 'Имя обязательно для заполнения' });
      return;
    }

    if (tempProfile.phone && !validatePhone(tempProfile.phone)) {
      setProfileMessage({ type: 'error', text: 'Некорректный формат телефона' });
      return;
    }

    // Эмуляция API запроса
    setTimeout(() => {
      setProfile({ ...tempProfile, updated_at: new Date().toISOString() });
      setIsEditing(false);
      setProfileMessage({ type: 'success', text: 'Данные обновлены' });
      
      setTimeout(() => setProfileMessage(null), 3000);
    }, 500);
  };

  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
    setProfileMessage(null);
  };

  // Смена пароля
  const handleChangePassword = () => {
    const { current_password, new_password, confirm_password } = passwordForm;

    // Проверка заполненности
    if (!current_password || !new_password || !confirm_password) {
      setPasswordMessage({ type: 'error', text: 'Все поля обязательны для заполнения' });
      return;
    }

    // Проверка совпадения
    if (new_password !== confirm_password) {
      setPasswordMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }

    // Проверка что новый пароль отличается от текущего
    if (current_password === new_password) {
      setPasswordMessage({ type: 'error', text: 'Новый пароль должен отличаться от текущего' });
      return;
    }

    // Валидация нового пароля
    const validation = validatePassword(new_password);
    if (!validation.valid) {
      setPasswordMessage({ type: 'error', text: `Пароль не соответствует требованиям: ${validation.message}` });
      return;
    }

    // Эмуляция API запроса
    setTimeout(() => {
      // В реальности здесь проверка current_password
      if (current_password !== 'demo123') {
        setPasswordMessage({ type: 'error', text: 'Неверный текущий пароль' });
        return;
      }

      setPasswordMessage({ type: 'success', text: 'Пароль успешно изменен' });
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      
      setTimeout(() => setPasswordMessage(null), 3000);
    }, 500);
  };

  // Удаление аккаунта
  const handleDeleteAccount = () => {
    if (!confirmDelete) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    // Эмуляция API запроса
    setTimeout(() => {
      alert('Аккаунт удален. Переход на страницу входа...');
      // В реальности: logout + redirect
      // window.location.href = '/login';
      setShowDeleteModal(false);
      navigate('/login');
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayValue = (value: string | undefined) => {
    return value && value.trim() !== '' ? value : 'Не указано';
  };

  return (
    <div style={{ 
      padding: '32px',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#111827', margin: '0 0 8px 0' }}>
          Личный кабинет
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
          Управление профилем и настройками аккаунта
        </p>
      </div>

      {/* БЛОК 1: ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ */}
      <div style={{ 
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0 }}>
            Профиль пользователя
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '8px 16px',
                background: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1F2937';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111827';
              }}
            >
              <Edit2 size={16} strokeWidth={1.5} />
              Редактировать
            </button>
          )}
        </div>

        {/* User Info Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#111827',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '600'
            }}>
              {profile.avatar_url}
            </div>
            {isEditing && (
              <button style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#111827',
                border: '2px solid white',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Camera size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
              {profile.first_name} {profile.last_name}
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '8px' }}>
              ID: {profile.user_id}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280' }}>
                <Mail size={14} strokeWidth={1.5} />
                {profile.email}
                {profile.email_verified && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    background: '#ECFDF5',
                    border: '1px solid #16A34A',
                    borderRadius: '3px',
                    fontSize: '11px',
                    color: '#16A34A',
                    fontWeight: '500'
                  }}>
                    <Check size={12} strokeWidth={2} />
                    Подтвержден
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '16px' }}>
          {/* First Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Имя <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={isEditing ? tempProfile.first_name : profile.first_name}
              onChange={(e) => setTempProfile({ ...tempProfile, first_name: e.target.value })}
              disabled={!isEditing}
              placeholder="Не указано"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                fontSize: '14px',
                color: '#111827',
                background: isEditing ? 'white' : '#FAFAFA',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
            />
          </div>

          {/* Last Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Фамилия
            </label>
            <input
              type="text"
              value={isEditing ? tempProfile.last_name : profile.last_name}
              onChange={(e) => setTempProfile({ ...tempProfile, last_name: e.target.value })}
              disabled={!isEditing}
              placeholder="Не указано"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                fontSize: '14px',
                color: profile.last_name ? '#111827' : '#9CA3AF',
                background: isEditing ? 'white' : '#FAFAFA',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled={true}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                fontSize: '14px',
                color: '#6B7280',
                background: '#FAFAFA',
                outline: 'none',
                cursor: 'not-allowed'
              }}
            />
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              Email не редактируется
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Телефон
            </label>
            <input
              type="tel"
              value={isEditing ? tempProfile.phone : displayValue(profile.phone)}
              onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
              disabled={!isEditing}
              placeholder="Не указано"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                fontSize: '14px',
                color: profile.phone ? '#111827' : '#9CA3AF',
                background: isEditing ? 'white' : '#FAFAFA',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
            />
          </div>

          {/* Telegram */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Telegram
            </label>
            <input
              type="text"
              value={isEditing ? tempProfile.telegram : displayValue(profile.telegram)}
              onChange={(e) => setTempProfile({ ...tempProfile, telegram: e.target.value })}
              disabled={!isEditing}
              placeholder="Не указано"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                fontSize: '14px',
                color: profile.telegram ? '#111827' : '#9CA3AF',
                background: isEditing ? 'white' : '#FAFAFA',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
            />
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Адрес
            </label>
            <input
              type="text"
              value={isEditing ? tempProfile.address : displayValue(profile.address)}
              onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })}
              disabled={!isEditing}
              placeholder="Не указано"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                fontSize: '14px',
                color: profile.address ? '#111827' : '#9CA3AF',
                background: isEditing ? 'white' : '#FAFAFA',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
            />
          </div>
        </div>

        {/* Metadata */}
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          padding: '16px', 
          background: '#FAFAFA', 
          borderRadius: '5px',
          fontSize: '13px',
          color: '#6B7280',
          marginBottom: isEditing ? '16px' : '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} strokeWidth={1.5} />
            Создан: {formatDate(profile.created_at)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} strokeWidth={1.5} />
            Обновлен: {formatDate(profile.updated_at)}
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSaveProfile}
              style={{
                padding: '8px 16px',
                background: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1F2937';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#111827';
              }}
            >
              <Save size={16} strokeWidth={1.5} />
              Сохранить
            </button>
            <button
              onClick={handleCancelEdit}
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#111827',
                border: '1px solid #E5E7EB',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
              }}
            >
              Отмена
            </button>
          </div>
        )}

        {/* Profile Message */}
        {profileMessage && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '5px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: profileMessage.type === 'success' ? '#16A34A' : '#DC2626',
              background: profileMessage.type === 'success' ? '#ECFDF5' : '#FEE2E2',
              border: profileMessage.type === 'success' ? '1px solid #16A34A' : '1px solid #DC2626'
            }}
          >
            {profileMessage.type === 'success' ? <Check size={18} strokeWidth={1.5} /> : <AlertCircle size={18} strokeWidth={1.5} />}
            {profileMessage.text}
          </div>
        )}
      </div>

      {/* БЛОК 2: СМЕНА ПАРОЛЯ */}
      <div style={{ 
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: '0 0 6px 0' }}>
          Смена пароля
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px 0' }}>
          Требования: минимум 8 символов, 1 буква, 1 цифра или спецсимвол
        </p>
        
        <div style={{ maxWidth: '500px' }}>
          {/* Current Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Текущий пароль <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Введите текущий пароль"
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 40px 8px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
              >
                {showCurrentPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Новый пароль <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Введите новый пароль"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 40px 8px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
              >
                {showNewPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '6px' }}>
              Подтвердите пароль <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Повторите новый пароль"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 40px 8px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none'
                }}
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            style={{
              padding: '8px 16px',
              background: '#111827',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: '400',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1F2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#111827';
            }}
          >
            Изменить пароль
          </button>

          {/* Password Message */}
          {passwordMessage && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                borderRadius: '5px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: passwordMessage.type === 'success' ? '#16A34A' : '#DC2626',
                background: passwordMessage.type === 'success' ? '#ECFDF5' : '#FEE2E2',
                border: passwordMessage.type === 'success' ? '1px solid #16A34A' : '1px solid #DC2626'
              }}
            >
              {passwordMessage.type === 'success' ? <Check size={18} strokeWidth={1.5} /> : <AlertCircle size={18} strokeWidth={1.5} />}
              {passwordMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* БЛОК 3: УДАЛЕНИЕ АККАУНТА */}
      <div style={{ 
        background: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#DC2626', margin: '0 0 6px 0' }}>
          Удаление аккаунта
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px 0' }}>
          После удаления аккаунта все данные будут безвозвратно утеряны
        </p>

        <div style={{ 
          padding: '16px', 
          background: '#FEF2F2', 
          border: '1px solid #FEE2E2', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Info size={16} strokeWidth={1.5} color="#DC2626" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#991B1B' }}>
              <strong>Внимание:</strong> Это действие необратимо. Будут удалены все ваши данные, заказы, КИЗы и история операций.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#111827',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            Я понимаю последствия и хочу удалить свой аккаунт
          </label>
        </div>

        <button
          onClick={handleDeleteAccount}
          disabled={!confirmDelete}
          style={{
            padding: '8px 16px',
            background: confirmDelete ? '#DC2626' : '#D1D5DB',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: '400',
            cursor: confirmDelete ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            opacity: confirmDelete ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (confirmDelete) {
              e.currentTarget.style.background = '#B91C1C';
            }
          }}
          onMouseLeave={(e) => {
            if (confirmDelete) {
              e.currentTarget.style.background = '#DC2626';
            }
          }}
        >
          <Trash2 size={16} strokeWidth={1.5} />
          Удалить аккаунт
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '450px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertCircle size={24} strokeWidth={1.5} color="#DC2626" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: '0 0 8px 0' }}>
                  Подтвердите удаление аккаунта
                </h3>
                <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                  Вы действительно хотите удалить свой аккаунт? Все ваши данные будут безвозвратно удалены. Это действие нельзя отменить.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '8px 16px',
                  background: 'white',
                  color: '#111827',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                Отмена
              </button>
              <button
                onClick={confirmDeleteAccount}
                style={{
                  padding: '8px 16px',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '14px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#B91C1C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#DC2626';
                }}
              >
                Удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div style={{
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid #E5E7EB',
        textAlign: 'center'
      }}>
        <button
          onClick={() => navigate('/logout')}
          style={{
            padding: '10px 20px',
            background: 'white',
            color: '#6B7280',
            border: '1px solid #E5E7EB',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: '400',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F9FAFB';
            e.currentTarget.style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#6B7280';
          }}
        >
          <LogOut size={18} strokeWidth={1.5} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}