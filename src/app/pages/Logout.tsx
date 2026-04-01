import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, LogOut } from 'lucide-react';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Небольшая задержка для плавности
    const timer = setTimeout(() => {
      // Очистка данных аутентификации
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('remember_me');
      
      // Перенаправление на страницу входа
      navigate('/login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

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
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          position: 'relative'
        }}>
          <LogOut size={32} strokeWidth={1.5} color="#111827" />
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            right: '-10px',
            width: '36px',
            height: '36px',
            background: '#111827',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Loader2 size={20} strokeWidth={2} color="white" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        </div>
        
        <h1 style={{
          fontSize: '20px',
          fontWeight: '500',
          color: '#111827',
          margin: '0 0 8px 0'
        }}>
          Выход из системы
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: 0
        }}>
          Пожалуйста, подождите...
        </p>
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
