import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, AlertCircle, Loader2, Package } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Валидация email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Обработка входа
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация
    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Некорректный формат email');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    // Эмуляция API запроса
    setTimeout(() => {
      // Демо-данные для входа: demo@fastwms.ru / demo123
      if (formData.email === 'demo@fastwms.ru' && formData.password === 'demo123') {
        // Сохраняем токен (в реальности это будет JWT)
        localStorage.setItem('auth_token', 'demo_token_12345');
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }
        localStorage.setItem('user_email', formData.email);
        
        // Перенаправляем на главную
        navigate('/');
      } else {
        setError('Неверный email или пароль');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAFA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#111827',
            color: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            <Package size={32} strokeWidth={1.5} />
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '500',
            color: '#111827',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em'
          }}>
            FastWMS
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: 0
          }}>
            Система управления маркировкой
          </p>
        </div>

        {/* Login Form */}
        <div style={{
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '32px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '500',
            color: '#111827',
            margin: '0 0 24px 0'
          }}>
            Вход в систему
          </h2>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '6px'
              }}>
                Email <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '5px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  background: isLoading ? '#F9FAFB' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#111827';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '6px'
              }}>
                Пароль <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '5px',
                    fontSize: '14px',
                    color: '#111827',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                    background: isLoading ? '#F9FAFB' : 'white'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#111827';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    padding: 0,
                    display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#6B7280',
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                />
                Запомнить меня
              </label>
              <button
                type="button"
                onClick={() => alert('Функция восстановления пароля в разработке')}
                disabled={isLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '13px',
                  color: '#111827',
                  textDecoration: 'underline',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  padding: 0,
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                Забыли пароль?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: '5px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#DC2626',
                background: '#FEE2E2',
                border: '1px solid #DC2626'
              }}>
                <AlertCircle size={16} strokeWidth={1.5} />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 16px',
                background: isLoading ? '#6B7280' : '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#1F2937';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = '#111827';
                }
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: '24px',
            padding: '12px',
            background: '#F9FAFB',
            borderRadius: '5px',
            fontSize: '12px',
            color: '#6B7280',
            textAlign: 'center'
          }}>
            <strong>Демо-доступ:</strong> demo@fastwms.ru / demo123
          </div>
        </div>

        {/* Register Link */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6B7280'
        }}>
          Нет аккаунта?{' '}
          <button
            onClick={() => alert('Функция регистрации в разработке')}
            style={{
              background: 'none',
              border: 'none',
              color: '#111827',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              padding: 0
            }}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>

      {/* CSS Animation for Loader */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}
