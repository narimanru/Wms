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
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-5xl">
        {/* Notice about new modal */}
        <div 
          onClick={() => navigate('/portal-selector')}
          className="max-w-[600px] mx-auto mb-8 p-5 bg-white border border-[#E5E7EB] rounded-xl cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#7367F0]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#7367F0]" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[15px] font-semibold text-[#111827] mb-1">
                Новая модалка принятия заказов!
              </div>
              <div className="text-[13px] text-[#6b7280]">
                Протестируйте трёхшаговый процесс в производственном портале
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#6b7280] flex-shrink-0" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-[36px] font-semibold text-[#111827]">
            FASTWMS — Система распределения КИЗ
          </h1>
          <p className="text-[15px] text-[#6b7280]">
            Прототип массового распределения кодов маркировки (Честный знак)
          </p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => setOpenModal('distribution')}
            className="px-6 py-3 bg-[#7367F0] text-white rounded-lg text-[14px] font-medium hover:bg-[#6355D9] transition-all shadow-sm hover:shadow-md"
          >
            Массовое распределение
          </button>
          <button
            onClick={() => setOpenModal('upload-result')}
            className="px-6 py-3 bg-white text-[#111827] border border-[#E5E7EB] rounded-lg text-[14px] font-medium hover:shadow-md transition-all"
          >
            Результат обработки
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-6 py-3 bg-white text-[#111827] border border-[#E5E7EB] rounded-lg text-[14px] font-medium hover:shadow-md transition-all"
          >
            История загрузок
          </button>
          <button
            onClick={() => setOpenModal('size-correspondence')}
            className="px-6 py-3 bg-white text-[#111827] border border-[#E5E7EB] rounded-lg text-[14px] font-medium hover:shadow-md transition-all"
          >
            Соответствие размеров
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow">
            <div className="text-[32px] font-semibold text-[#111827] mb-1">3</div>
            <div className="text-[13px] text-[#6b7280]">Шага распределения</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow">
            <div className="text-[32px] font-semibold text-[#111827] mb-1">1200</div>
            <div className="text-[13px] text-[#6b7280]">Кодов в примере</div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow">
            <div className="text-[32px] font-semibold text-[#111827] mb-1">CSV/PDF</div>
            <div className="text-[13px] text-[#6b7280]">Форматы загрузки</div>
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