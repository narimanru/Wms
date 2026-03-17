import { useState } from 'react';
import { useNavigate } from 'react-router';
import { DistributionModal } from '../components/DistributionModal';
import { SizeCorrespondenceModal } from '../components/SizeCorrespondenceModal';
import { UploadResultModal } from '../components/UploadResultModal';
import { Sparkles, Factory, ArrowRight } from 'lucide-react';

type ModalType = 'distribution' | 'size-correspondence' | 'upload-result' | null;

function Home() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<ModalType>(null);

  const uploadedFiles = [
    'брюки черн 40_gtin_04655051383501_quantity_210.pdf',
    'брюки черн 42 gtin_04655051383518_quantity_400.pdf',
    'Брюки черн 44_gtin_04655051383051_quantity_400.pdf',
    'брюки черн 46_1 gtin_04655051383068_quantity_10.pdf',
    'брюки черн 46_gtin_04655051383068_quantity_500.pdf',
    'брюки черн 48_gtin_04655051383075_quantity_400.pdf',
    'брюки черн 50_gtin_04655051383082_quantity_400.pdf'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="text-center space-y-8">
        {/* Notice about new modal */}
        <div 
          onClick={() => navigate('/portal-selector')}
          style={{
            maxWidth: '600px',
            margin: '0 auto 32px auto',
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #10a37f 0%, #0d8968 100%)',
            borderRadius: '16px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(16, 163, 127, 0.25)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(16, 163, 127, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 163, 127, 0.25)';
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles style={{ width: '20px', height: '20px' }} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>
                Новая модалка принятия заказов!
              </div>
              <div style={{ fontSize: '13px', fontWeight: 400, opacity: 0.95 }}>
                Протестируйте трёхшаговый процесс в производственном портале
              </div>
            </div>
            <ArrowRight style={{ width: '20px', height: '20px', flexShrink: 0 }} />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            FASTWMS — Система распределения КИЗ
          </h1>
          <p className="text-lg text-gray-600">
            Прототип массового распределения кодов маркировки (Честный знак)
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setOpenModal('distribution')}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            Массовое распределение
          </button>
          <button
            onClick={() => setOpenModal('upload-result')}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            Результат обработки
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            История загрузок
          </button>
          <button
            onClick={() => setOpenModal('size-correspondence')}
            className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            Соответствие размеров
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
            <div className="text-sm text-gray-600">Шага распределения</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-2">1200</div>
            <div className="text-sm text-gray-600">Кодов в примере</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-gray-900 mb-2">CSV/PDF</div>
            <div className="text-sm text-gray-600">Форматы загрузки</div>
          </div>
        </div>
      </div>

      {openModal === 'distribution' && (
        <DistributionModal onClose={() => setOpenModal(null)} />
      )}
      
      {openModal === 'upload-result' && (
        <UploadResultModal
          files={uploadedFiles}
          onClose={() => setOpenModal(null)}
          onShowHistory={() => {
            setOpenModal(null);
            navigate('/history');
          }}
        />
      )}
      
      {openModal === 'size-correspondence' && (
        <SizeCorrespondenceModal
          onClose={() => setOpenModal(null)}
          onSave={(mappings) => {
            console.log('Saved mappings:', mappings);
            setOpenModal(null);
          }}
        />
      )}
    </div>
  );
}

export default Home;