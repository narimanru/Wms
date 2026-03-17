// Helper functions for production order components

function getStatusLabelFn(status: string) {
  const labels: Record<string, string> = {
    new: 'Новый',
    accepted: 'Принят',
    in_progress: 'В работе',
    qc: 'ОТК',
    ready: 'Готово',
    shipped: 'Отгружено',
    closed: 'Закрыто'
  };
  return labels[status] || status;
}

function getStatusColorFn(status: string) {
  const colors: Record<string, { bg: string; text: string }> = {
    new: { bg: '#fef3c7', text: '#92400e' },
    accepted: { bg: '#dbeafe', text: '#1e40af' },
    in_progress: { bg: '#e0e7ff', text: '#3730a3' },
    qc: { bg: '#fce7f3', text: '#831843' },
    ready: { bg: '#d1fae5', text: '#065f46' },
    shipped: { bg: '#f3f4f6', text: '#374151' },
    closed: { bg: '#f3f4f6', text: '#6b7280' }
  };
  return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
}

// Expose functions globally so OverviewTab and other components can access them
(globalThis as any).getStatusLabel = getStatusLabelFn;
(globalThis as any).getStatusColor = getStatusColorFn;

export const getStatusLabel = getStatusLabelFn;
export const getStatusColor = getStatusColorFn;
