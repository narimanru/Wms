import { CheckCircle2, X, History } from 'lucide-react';
import '../../styles/distribution.css';

interface UploadResultModalProps {
  onClose: () => void;
  onShowHistory: () => void;
  files: string[];
}

export function UploadResultModal({ onClose, onShowHistory, files }: UploadResultModalProps) {
  return (
    <div className="fw-overlay" role="dialog" aria-modal="true" aria-labelledby="uploadResultTitle">
      <div className="fw-modal fw-modal--narrow">
        {/* Header */}
        <div className="fw-modal__header">
          <h2 id="uploadResultTitle" className="fw-title">Результат обработки PDF</h2>
          <button className="fw-icon-btn" aria-label="Закрыть" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="fw-modal__body">
          <div className="fw-upload-result">
            <div className="fw-upload-result__title">Файлы приняты в обработку:</div>
            
            <div className="fw-upload-result__list">
              {files.map((file, index) => (
                <div key={index} className="fw-upload-result__item">
                  <CheckCircle2 className="fw-upload-result__icon" />
                  <span className="fw-upload-result__text">{file}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fw-modal__footer">
          <button 
            className="fw-btn fw-btn--ghost" 
            type="button" 
            onClick={onShowHistory}
          >
            <History className="w-4 h-4 mr-2" />
            История Загрузок
          </button>
          <button 
            className="fw-btn fw-btn--primary" 
            type="button" 
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
