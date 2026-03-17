import { Check, Loader, CheckCircle2 } from 'lucide-react';

interface KIZStatusProps {
  available: number;
  assigned: number;
  used: number;
  layout?: 'horizontal' | 'vertical' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

export function KIZStatus({ 
  available, 
  assigned, 
  used, 
  layout = 'horizontal',
  size = 'md'
}: KIZStatusProps) {
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;
  const fontSize = size === 'sm' ? '13px' : size === 'md' ? '18px' : '20px';
  const labelSize = size === 'sm' ? '10px' : '11px';
  const gap = layout === 'compact' ? '12px' : '20px';

  if (layout === 'compact') {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px'
        }}>
          <Check style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: '#10a37f' }} />
          <span style={{ color: '#10a37f', fontWeight: 600, fontSize: size === 'sm' ? '13px' : '15px' }}>
            {available.toLocaleString()}
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px'
        }}>
          <Loader style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: '#3b82f6' }} />
          <span style={{ color: '#3b82f6', fontWeight: 500, fontSize: size === 'sm' ? '13px' : '15px' }}>
            {assigned.toLocaleString()}
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px'
        }}>
          <CheckCircle2 style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: '#6b7280' }} />
          <span style={{ color: '#6b7280', fontWeight: 500, fontSize: size === 'sm' ? '13px' : '15px' }}>
            {used.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      gap,
      alignItems: 'center',
      flexDirection: layout === 'vertical' ? 'column' : 'row'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px'
      }}>
        <Check style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: '#10a37f' }} />
        <div>
          <div style={{
            fontSize: labelSize,
            color: '#9ca3af',
            fontWeight: 500,
            marginBottom: '2px'
          }}>
            Доступно
          </div>
          <div style={{
            fontSize,
            fontWeight: 600,
            color: '#10a37f'
          }}>
            {available.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px'
      }}>
        <Loader style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: '#3b82f6' }} />
        <div>
          <div style={{
            fontSize: labelSize,
            color: '#9ca3af',
            fontWeight: 500,
            marginBottom: '2px'
          }}>
            Назначено
          </div>
          <div style={{
            fontSize,
            fontWeight: 600,
            color: '#3b82f6'
          }}>
            {assigned.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px'
      }}>
        <CheckCircle2 style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: '#6b7280' }} />
        <div>
          <div style={{
            fontSize: labelSize,
            color: '#9ca3af',
            fontWeight: 500,
            marginBottom: '2px'
          }}>
            Использовано
          </div>
          <div style={{
            fontSize,
            fontWeight: 600,
            color: '#6b7280'
          }}>
            {used.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
