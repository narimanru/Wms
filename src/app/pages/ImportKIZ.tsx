import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Plus, Trash2, Package, Sparkles, Info, AlertTriangle, RefreshCw, Home, X, Search, Image } from 'lucide-react';
import { useNavigate } from 'react-router';

// Add animation styles
const style = document.createElement('style');
style.innerHTML = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;
if (!document.head.querySelector('style[data-toast-animations]')) {
  style.setAttribute('data-toast-animations', 'true');
  document.head.appendChild(style);
}

interface FileUpload {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'success' | 'error' | 'attention';
  progress: number;
  analyzedData?: AnalyzedFileData;
}

interface AnalyzedFileData {
  gtin: string | null;
  productName: string | null;
  color: string | null;
  size: string | null;
  kizCount: number;
  confidence: 'high' | 'medium' | 'low';
  source: 'gtin' | 'pdf' | 'filename' | 'manual';
}

interface Product {
  id: string;
  name: string;
  article: string;
  sellerArticle?: string;
  sku?: string;
  category: string;
  color: string;
  sizes: string[];
  photo?: string;
  gtin?: string;
  colors?: string[]; // For multi-color products
}

interface ProductInGroup {
  product: Product;
  selectedSizes: string[];
}

interface Distribution {
  id: string;
  fileId: string;
  fileName: string;
  product: Product | null;
  size: string;
  quantity: number;
  source: 'auto' | 'manual' | 'gtin' | 'pdf' | 'filename';
  warnings: Warning[];
}

interface Warning {
  type: 'product_type' | 'color' | 'size' | 'confidence';
  severity: 'high' | 'medium' | 'low';
  message: string;
  confirmed: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Брюки палаццо классические широкие с высокой посадкой', 
    article: '529940427',
    sellerArticle: 'Bruki-bez-zashipov-bordo',
    sku: 'SKU-001',
    category: 'Брюки женские', 
    color: 'бордовый',
    colors: ['бордовый', 'сливовый', 'красновато-бордовый', 'бургунди'],
    sizes: ['40', '42', '44', '46', '48', '50'],
    gtin: '4607034763114',
    photo: 'https://images.unsplash.com/photo-1763558978011-55404124a148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWVuJTIwdHJvdXNlcnMlMjBwYW50c3xlbnwxfHx8fDE3NzM2MjgxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '2', 
    name: 'Брюки женские', 
    article: '529940428',
    sellerArticle: 'Bruki-chernie',
    sku: 'SKU-002',
    category: 'Брюки женские', 
    color: 'Черный',
    sizes: ['40', '42', '44', '46', '48'],
    gtin: '4607034763121',
    photo: 'https://images.unsplash.com/photo-1763558978011-55404124a148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWVuJTIwdHJvdXNlcnMlMjBwYW50c3xlbnwxfHx8fDE3NzM2MjgxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '3', 
    name: 'Брюки женские классические', 
    article: '529940429',
    sellerArticle: 'Bruki-klassika',
    sku: 'SKU-003',
    category: 'Брюки женские', 
    color: 'Черный',
    sizes: ['42', '44', '46', '48', '50'],
    gtin: '4607034763138',
    photo: 'https://images.unsplash.com/photo-1551374332-2c48196ae690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNsYXNzaWMlMjBibGFjayUyMHRyb3VzZXJzfGVufDF8fHx8MTc3MzYyODE5MXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '4', 
    name: 'Брюки женские зауженные', 
    article: '529940430',
    sellerArticle: 'Bruki-zaujen',
    sku: 'SKU-004',
    category: 'Брюки женские', 
    color: 'Черный',
    sizes: ['40', '42', '44', '46', '48'],
    gtin: '4607034763145',
    photo: 'https://images.unsplash.com/photo-1587028971442-aa483a05136a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNsaW0lMjBmaXQlMjBibGFjayUyMHBhbnRzfGVufDF8fHx8MTc3MzYyODE5MXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '5', 
    name: 'Брюки женские прямые', 
    article: '529940431',
    sellerArticle: 'Bruki-prjamie',
    sku: 'SKU-005',
    category: 'Брюки женские', 
    color: 'Черный',
    sizes: ['42', '44', '46', '48', '50'],
    gtin: '4607034763152',
    photo: 'https://images.unsplash.com/photo-1763558978011-55404124a148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHdvbWVuJTIwdHJvdXNlcnMlMjBwYW50c3xlbnwxfHx8fDE3NzM2MjgxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '6', 
    name: 'Брюки женские', 
    article: '529940432',
    sellerArticle: 'Bruki-seri',
    sku: 'SKU-006',
    category: 'Брюки женские', 
    color: 'Серый',
    sizes: ['40', '42', '44', '46', '48'],
    gtin: '4607034763169',
    photo: 'https://images.unsplash.com/photo-1651895884377-5f631be84282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmV5JTIwd29tZW4lMjB0cm91c2VycyUyMHBhbnRzfGVufDF8fHx8MTc3MzYyODE5MHww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '7', 
    name: 'Брюки женские', 
    article: '529940433',
    sellerArticle: 'Bruki-bejevie',
    sku: 'SKU-007',
    category: 'Брюки женские', 
    color: 'Бежевый',
    sizes: ['40', '42', '44', '46', '48', '50'],
    gtin: '4607034763176',
    photo: 'https://images.unsplash.com/photo-1565728769229-e6e5b989a824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHdvbWVuJTIwdHJvdXNlcnMlMjBwYW50c3xlbnwxfHx8fDE3NzM2MjgxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  { 
    id: '8', 
    name: 'Футболка женская', 
    article: '529940434',
    sellerArticle: 'Futbolka-black',
    sku: 'SKU-008',
    category: 'Футболки', 
    color: 'Черный',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    gtin: '4607034763183'
  },
  { 
    id: '9', 
    name: 'Джинсы женские', 
    article: '529940435',
    sellerArticle: 'Djinsi-blue',
    sku: 'SKU-009',
    category: 'Джинсы', 
    color: 'Синий',
    sizes: ['40', '42', '44', '46', '48', '50'],
    gtin: '4607034763190'
  },
];

// Helper function to group products by name, category and color
type ProductGroup = {
  key: string;
  name: string;
  category: string;
  color: string;
  products: Product[];
};

function groupProducts(products: Product[]): ProductGroup[] {
  const groups = new Map<string, ProductGroup>();
  
  products.forEach(product => {
    const key = `${product.name}-${product.category}-${product.color}`;
    
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: product.name,
        category: product.category,
        color: product.color,
        products: []
      });
    }
    
    groups.get(key)!.products.push(product);
  });
  
  return Array.from(groups.values());
}

function ImportKIZ() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productGroup, setProductGroup] = useState<ProductInGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showChangeProductModal, setShowChangeProductModal] = useState(false);
  const [changeProductSearch, setChangeProductSearch] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [addProductSearch, setAddProductSearch] = useState('');
  const [showWarningModal, setShowWarningModal] = useState<Warning | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  const steps = [
    { num: 1, title: 'Загрузка файлов' },
    { num: 2, title: 'Анализ' },
    { num: 3, title: 'Подтверждение товара' },
    { num: 4, title: 'Проверка размеров' },
    { num: 5, title: 'Распределение' },
    { num: 6, title: 'Подтверждение' },
    { num: 7, title: 'Результат' }
  ];

  // Play success sound
  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant success sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Pleasant C and E notes
      oscillator1.frequency.value = 523.25; // C5
      oscillator2.frequency.value = 659.25; // E5
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.5);
      oscillator2.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Show toast notification
  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast({ message: '', show: false });
    }, 3000);
  };

  // Step 1: File Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files: File[]) => {
    const newFiles: FileUpload[] = files.map((file, idx) => ({
      id: Date.now().toString() + idx,
      file,
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simulate upload and processing
    newFiles.forEach((fileUpload, idx) => {
      // Upload simulation
      let progress = 0;
      const uploadInterval = setInterval(() => {
        progress += 10;
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileUpload.id ? { ...f, progress } : f
        ));
        if (progress >= 100) {
          clearInterval(uploadInterval);
          // Start processing
          setTimeout(() => {
            setUploadedFiles(prev => prev.map(f => 
              f.id === fileUpload.id ? { ...f, status: 'processing' } : f
            ));
            
            // Simulate analysis
            setTimeout(() => {
              const analyzedData = analyzeFile(fileUpload.file);
              setUploadedFiles(prev => prev.map(f => 
                f.id === fileUpload.id ? { 
                  ...f, 
                  status: 'success',
                  analyzedData 
                } : f
              ));
              
              // Play sound and show notification
              playSuccessSound();
              const fileName = fileUpload.file.name.length > 30 
                ? fileUpload.file.name.substring(0, 27) + '...' 
                : fileUpload.file.name;
              showToast(`Файл "${fileName}" успешно обработан`);
            }, 1500);
          }, 500);
        }
      }, 200);
    });
  };

  const analyzeFile = (file: File): AnalyzedFileData => {
    const fileName = file.name.toLowerCase();
    
    // Simulate different scenarios
    const hasGtin = Math.random() > 0.3;
    const scenarios = [
      {
        gtin: '4607034763114',
        productName: 'Брюки женские',
        color: 'Черный',
        size: '48',
        kizCount: 120,
        confidence: 'high' as const,
        source: 'gtin' as const
      },
      {
        gtin: '4607034763121',
        productName: 'Брюки женски��',
        color: 'Черный',
        size: '42',
        kizCount: 85,
        confidence: 'high' as const,
        source: 'gtin' as const
      },
      {
        gtin: null,
        productName: 'Брюки женские',
        color: 'Черный',
        size: fileName.includes('48') ? '48' : '40',
        kizCount: 150,
        confidence: 'medium' as const,
        source: 'pdf' as const
      }
    ];

    return scenarios[Math.floor(Math.random() * scenarios.length)];
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const retryFile = (fileId: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'processing' as const, progress: 0 } : f
    ));
    
    setTimeout(() => {
      const file = uploadedFiles.find(f => f.id === fileId);
      if (file) {
        const analyzedData = analyzeFile(file.file);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'success', analyzedData } : f
        ));
      }
    }, 2000);
  };

  // Step 2: Analysis - auto-select product
  const autoSelectProduct = () => {
    const firstFile = uploadedFiles[0];
    if (firstFile?.analyzedData?.productName) {
      const matchedProduct = MOCK_PRODUCTS.find(p => 
        p.name === firstFile.analyzedData?.productName &&
        p.color === firstFile.analyzedData?.color
      );
      setSelectedProduct(matchedProduct || null);
    }
  };

  // Step 3: Product selection - just select, no validation modal
  const handleProductChange = (product: Product) => {
    setSelectedProduct(product);
    setSearchQuery('');
  };

  // Validate product match when moving to next step
  const validateProductMatch = (): boolean => {
    if (!selectedProduct) return true;
    if (dontShowAgain) return true; // User chose not to show again
    
    const firstFile = uploadedFiles[0]?.analyzedData;
    if (!firstFile) return true;

    // Check if GTIN matches
    if (firstFile.gtin && selectedProduct.gtin && firstFile.gtin === selectedProduct.gtin) {
      return true; // Perfect match
    }

    // Check if category differs
    if (firstFile.productName) {
      const detectedProduct = MOCK_PRODUCTS.find(p => p.name === firstFile.productName);
      if (detectedProduct && detectedProduct.category !== selectedProduct.category) {
        return false; // Show warning
      }
    }

    // Check if color differs significantly
    if (firstFile.color && selectedProduct.color !== firstFile.color) {
      // Only show warning if it's not a multi-color product
      if (!selectedProduct.colors || !selectedProduct.colors.some(c => c.toLowerCase().includes(firstFile.color.toLowerCase()))) {
        return false;
      }
    }

    return true; // All checks passed
  };

  // Get product match status for badge
  const getProductMatchStatus = (): 'confirmed' | 'check' | null => {
    if (!selectedProduct) return null;
    
    const firstFile = uploadedFiles[0]?.analyzedData;
    if (!firstFile) return null;

    // Check GTIN match
    if (firstFile.gtin && selectedProduct.gtin && firstFile.gtin === selectedProduct.gtin) {
      return 'confirmed';
    }

    // Check category match
    if (firstFile.productName) {
      const detectedProduct = MOCK_PRODUCTS.find(p => p.name === firstFile.productName);
      if (detectedProduct && detectedProduct.category !== selectedProduct.category) {
        return 'check';
      }
    }

    // Check color match
    if (firstFile.color && selectedProduct.color !== firstFile.color) {
      if (!selectedProduct.colors || !selectedProduct.colors.some(c => c.toLowerCase().includes(firstFile.color.toLowerCase()))) {
        return 'check';
      }
    }

    return 'confirmed';
  };

  const confirmWarning = () => {
    setShowWarningModal(null);
  };

  const clearAutoSelection = () => {
    setSelectedProduct(null);
  };

  // Step 3: Product Group Management
  const addProductToGroup = (product: Product) => {
    // Check if product can be added (same category only - colors can differ for multicolor groups)
    if (selectedProduct) {
      if (product.category !== selectedProduct.category) {
        alert('Можно добавлять только товары из той же категории.');
        return;
      }
    }

    // Check if product already in group
    if (productGroup.some(pg => pg.product.id === product.id)) {
      alert('Этот товар уже добавлен в группу.');
      return;
    }

    setProductGroup([...productGroup, {
      product,
      selectedSizes: []
    }]);
    setShowAddProductModal(false);
    setAddProductSearch('');
  };

  const removeProductFromGroup = (productId: string) => {
    setProductGroup(productGroup.filter(pg => pg.product.id !== productId));
  };

  // Determine if group is single-color or multi-color
  const getGroupType = (): 'single' | 'multi' | null => {
    if (!selectedProduct) return null;
    
    const allProducts = [selectedProduct, ...productGroup.map(pg => pg.product)];
    const uniqueColors = new Set(allProducts.map(p => p.color));
    
    return uniqueColors.size === 1 ? 'single' : 'multi';
  };

  const getUniqueColors = (): string[] => {
    if (!selectedProduct) return [];
    
    const allProducts = [selectedProduct, ...productGroup.map(pg => pg.product)];
    return Array.from(new Set(allProducts.map(p => p.color)));
  };

  // Size selection removed - sizes are now display-only

  const getTotalProductsInGroup = () => {
    return (selectedProduct ? 1 : 0) + productGroup.length;
  };

  // Total selected sizes removed - sizes are now display-only

  const isStep3Valid = () => {
    // Need at least 1 product
    const hasProducts = getTotalProductsInGroup() >= 1;
    return hasProducts;
  };

  // Step 5: Distribution initialization
  const initializeDistribution = () => {
    const newDistributions: Distribution[] = uploadedFiles.map(file => {
      const warnings: Warning[] = [];
      
      // Check size mismatch
      if (file.analyzedData?.size && selectedProduct?.sizes.includes(file.analyzedData.size)) {
        // Size matches
      } else if (file.analyzedData?.size) {
        warnings.push({
          type: 'size',
          severity: 'medium',
          message: `В загруженном файле система нашла размер ${file.analyzedData.size}, но этот размер отличается от доступных размеров товара.`,
          confirmed: false
        });
      }

      return {
        id: file.id,
        fileId: file.id,
        fileName: file.file.name,
        product: selectedProduct,
        size: file.analyzedData?.size || '',
        quantity: file.analyzedData?.kizCount || 0,
        source: file.analyzedData?.source || 'manual',
        warnings
      };
    });

    setDistributions(newDistributions);
  };

  const getTotalKIZ = () => {
    return uploadedFiles.reduce((sum, f) => sum + (f.analyzedData?.kizCount || 0), 0);
  };

  const getTotalDistributed = () => {
    return distributions.reduce((sum, d) => sum + d.quantity, 0);
  };

  const getDistributionStatus = () => {
    const total = getTotalKIZ();
    const distributed = getTotalDistributed();
    if (distributed === total && distributed > 0) return 'success';
    if (distributed > total) return 'error';
    return 'warning';
  };

  const addDistributionRow = () => {
    setDistributions([...distributions, {
      id: Date.now().toString(),
      fileId: '',
      fileName: 'Добавлен вручную',
      product: selectedProduct,
      size: '',
      quantity: 0,
      source: 'manual',
      warnings: []
    }]);
  };

  const removeDistributionRow = (id: string) => {
    setDistributions(distributions.filter(d => d.id !== id));
  };

  const updateDistributionSize = (id: string, size: string) => {
    setDistributions(distributions.map(d => {
      if (d.id === id) {
        const warnings: Warning[] = [];
        const fileData = uploadedFiles.find(f => f.id === d.fileId)?.analyzedData;
        
        if (fileData?.size && fileData.size !== size) {
          warnings.push({
            type: 'size',
            severity: 'medium',
            message: `Размер, найденный системой (${fileData.size}), не совпадает с выбранным (${size}).`,
            confirmed: false
          });
        }

        return { ...d, size, warnings };
      }
      return d;
    }));
  };

  const updateDistributionQuantity = (id: string, quantity: number) => {
    setDistributions(distributions.map(d => 
      d.id === id ? { ...d, quantity } : d
    ));
  };

  const handleNextStep = () => {
    if (step === 1 && uploadedFiles.length > 0) {
      setStep(2);
    } else if (step === 2) {
      autoSelectProduct();
      setStep(3);
    } else if (step === 3 && isStep3Valid()) {
      // Validate product match before proceeding
      const isValid = validateProductMatch();
      if (!isValid) {
        setShowValidationModal(true);
        return; // Stop here and show modal
      }
      setStep(4);
    } else if (step === 4) {
      initializeDistribution();
      setStep(5);
    } else if (step === 5 && getDistributionStatus() === 'success') {
      setStep(6);
    } else if (step === 6) {
      setImportSuccess(true);
      setStep(7);
    } else {
      setStep(step + 1);
    }
  };

  const proceedWithValidation = () => {
    setShowValidationModal(false);
    setStep(4);
  };

  const goBackToEditProduct = () => {
    setShowValidationModal(false);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Determine which steps are accessible
  const getMaxAccessibleStep = () => {
    if (step === 7) return 7; // If completed, can navigate anywhere
    if (uploadedFiles.length === 0) return 1;
    if (!uploadedFiles.every(f => f.status === 'success')) return 1;
    if (!selectedProduct && productGroup.length === 0) return 2;
    if (!isStep3Valid() && step <= 3) return 3;
    if (distributions.length === 0) return 4;
    return step; // Current step is the max
  };

  const handleStepClick = (targetStep: number) => {
    const maxStep = getMaxAccessibleStep();
    
    // Can only go to steps that are completed or current step
    if (targetStep <= maxStep) {
      // Special handling when going to step 3 from step 2
      if (targetStep === 3 && step === 2) {
        autoSelectProduct();
      }
      // Special handling when going to step 5 from step 4
      if (targetStep === 5 && step === 4) {
        initializeDistribution();
      }
      setStep(targetStep);
    }
  };

  const isStepAccessible = (stepNum: number) => {
    const maxStep = getMaxAccessibleStep();
    return stepNum <= maxStep;
  };

  // Enhanced search - search by name, article, seller article, SKU, category
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.article.toLowerCase().includes(query) ||
      (p.sellerArticle && p.sellerArticle.toLowerCase().includes(query)) ||
      (p.sku && p.sku.toLowerCase().includes(query)) ||
      p.category.toLowerCase().includes(query) ||
      p.color.toLowerCase().includes(query)
    );
  });

  const getSourceBadge = (source: string) => {
    const badges = {
      'auto': { text: 'Автоматически', color: '#10a37f' },
      'manual': { text: 'Вручную', color: '#6b7280' },
      'gtin': { text: 'По GTIN', color: '#10a37f' },
      'pdf': { text: 'По PDF', color: '#3b82f6' },
      'filename': { text: 'По названию файла', color: '#f59e0b' }
    };
    return badges[source as keyof typeof badges] || badges.manual;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f7f8',
      padding: '40px 20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '40px'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px 40px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#111827', margin: 0 }}>
              Импорт кодов маркировки
            </h1>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              <Home size={16} />
              На главную
            </button>
          </div>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            Загрузите файлы, система автоматически определит формат, GTIN, товар, размер и КИЗы
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          padding: '24px 40px',
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'space-between' }}>
            {steps.map((s, idx) => {
              const accessible = isStepAccessible(s.num);
              const stepElement = (
                <div 
                  key={`step-${s.num}`}
                  onClick={() => accessible && handleStepClick(s.num)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    flex: 1,
                    cursor: accessible ? 'pointer' : 'not-allowed',
                    opacity: accessible ? 1 : 0.5
                  }}
                >
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: s.num === step ? '#10a37f' : s.num < step ? '#d1fae5' : '#e5e7eb',
                      color: s.num === step ? '#fff' : s.num < step ? '#065f46' : '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 600,
                      transition: 'all 0.3s',
                      border: accessible && s.num !== step ? '2px solid transparent' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (accessible && s.num !== step) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.border = '2px solid #10a37f';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (accessible && s.num !== step) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.border = '2px solid transparent';
                      }
                    }}
                  >
                    {s.num < step ? <CheckCircle2 size={16} /> : s.num}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: s.num === step ? '#111827' : '#6b7280',
                    fontWeight: s.num === step ? 600 : 400,
                    textAlign: 'center',
                    maxWidth: '100px'
                  }}>
                    {s.title}
                  </div>
                </div>
              );

              const separator = idx < steps.length - 1 ? (
                <div 
                  key={`sep-${s.num}`}
                  style={{
                    flex: 0.3,
                    height: '2px',
                    background: s.num < step ? '#10a37f' : '#e5e7eb',
                    marginBottom: '24px',
                    transition: 'all 0.3s'
                  }} 
                />
              ) : null;

              return separator ? [stepElement, separator] : stepElement;
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '40px',
          minHeight: '500px'
        }}>
          {/* Step 1: File Upload */}
          {step === 1 && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '12px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  background: '#f9fafb',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  marginBottom: '24px'
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload size={48} style={{ color: '#10a37f', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
                  Перетащите файлы сюда или нажмите для выбора
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                  Можно загружать PDF, CSV и другие поддерживаемые форматы
                </p>
                <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
                  Допускается загрузка нескольких файлов одновременно
                </p>
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  multiple
                  style={{ display: 'none' }}
                />
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6b7280'
                  }}>
                    <div>Имя файла</div>
                    <div>Формат</div>
                    <div>Размер</div>
                    <div>Статус</div>
                    <div>Прогресс</div>
                    <div>Действие</div>
                  </div>

                  {/* Table Rows */}
                  {uploadedFiles.map((fileUpload) => (
                    <div
                      key={fileUpload.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px',
                        gap: '12px',
                        padding: '16px',
                        background: '#fff',
                        borderBottom: '1px solid #f3f4f6',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                          {fileUpload.file.name}
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {fileUpload.file.name.split('.').pop()?.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {(fileUpload.file.size / 1024).toFixed(2)} KB
                      </div>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 500,
                          background: fileUpload.status === 'success' ? '#d1fae5' : 
                                     fileUpload.status === 'error' ? '#fee2e2' : '#fef3c7',
                          color: fileUpload.status === 'success' ? '#065f46' : 
                                fileUpload.status === 'error' ? '#991b1b' : '#92400e'
                        }}>
                          {fileUpload.status === 'uploading' && 'Загружается'}
                          {fileUpload.status === 'processing' && 'Обрабатывается'}
                          {fileUpload.status === 'success' && 'Успешно'}
                          {fileUpload.status === 'error' && 'Ошибка'}
                          {fileUpload.status === 'attention' && 'Требует внимания'}
                        </span>
                      </div>
                      <div>
                        {fileUpload.status === 'uploading' && (
                          <div style={{
                            width: '100%',
                            height: '6px',
                            background: '#e5e7eb',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${fileUpload.progress}%`,
                              height: '100%',
                              background: '#10a37f',
                              transition: 'width 0.3s'
                            }} />
                          </div>
                        )}
                        {fileUpload.status === 'processing' && (
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>Анализ...</div>
                        )}
                        {fileUpload.status === 'success' && fileUpload.analyzedData && (
                          <div style={{ fontSize: '12px', color: '#10a37f', fontWeight: 500 }}>
                            {fileUpload.analyzedData.kizCount} КИЗ
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {fileUpload.status === 'error' && (
                          <button
                            onClick={() => retryFile(fileUpload.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '6px',
                              cursor: 'pointer',
                              color: '#3b82f6',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Повторить"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => removeFile(fileUpload.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '6px',
                            cursor: 'pointer',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Analysis */}
          {step === 2 && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
                Результаты анализа файлов
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {uploadedFiles.map(file => (
                  <div
                    key={file.id}
                    style={{
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                        {file.file.name}
                      </div>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: file.analyzedData?.confidence === 'high' ? '#d1fae5' : 
                                   file.analyzedData?.confidence === 'medium' ? '#fef3c7' : '#fee2e2',
                        color: file.analyzedData?.confidence === 'high' ? '#065f46' : 
                              file.analyzedData?.confidence === 'medium' ? '#92400e' : '#991b1b'
                      }}>
                        {file.analyzedData?.confidence === 'high' && 'Определено автоматически'}
                        {file.analyzedData?.confidence === 'medium' && 'Нужно проверить'}
                        {file.analyzedData?.confidence === 'low' && 'Требуется ручной выбор'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>GTIN</div>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                          {file.analyzedData?.gtin || (
                            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertCircle size={14} /> Не найден
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Товар</div>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                          {file.analyzedData?.productName || '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Цвет</div>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                          {file.analyzedData?.color || '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Размер</div>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                          {file.analyzedData?.size || '—'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Количество КИЗ</div>
                        <div style={{ fontSize: '14px', color: '#10a37f', fontWeight: 600 }}>
                          {file.analyzedData?.kizCount || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Product Group Confirmation */}
          {step === 3 && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
                Подтверждение товаров
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px 0' }}>
                Проверьте найденный товар и добавьте связанные товары. Если в группе есть несколько цветов, система покажет предупреждение.
              </p>

              {/* Found Product */}
              {selectedProduct && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                      Найденный товар
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getProductMatchStatus() === 'confirmed' && (
                        <span style={{ 
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: '#d1fae5',
                          color: '#065f46',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          🟢 Совпадение подтверждено
                        </span>
                      )}
                      {getProductMatchStatus() === 'check' && (
                        <span style={{ 
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: '#fef3c7',
                          color: '#92400e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          🟡 Проверьте товар
                        </span>
                      )}
                      <span style={{ 
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #10a37f 0%, #0d8968 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Sparkles size={12} />
                        AI 96%
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                      {selectedProduct.photo ? (
                        <img 
                          src={selectedProduct.photo} 
                          alt={selectedProduct.name}
                          style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '64px',
                          height: '64px',
                          background: '#f3f4f6',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Package size={24} style={{ color: '#9ca3af' }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                          {selectedProduct.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                          Артикул: {selectedProduct.article} • Цвет: {selectedProduct.color} • Категория: {selectedProduct.category}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '4px' }}>Размеры:</span>
                          {selectedProduct.sizes.map(size => (
                            <span
                              key={size}
                              style={{
                                padding: '4px 10px',
                                background: '#f9fafb',
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#6b7280'
                              }}
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: '#d1fae5',
                        color: '#065f46'
                      }}>
                        Найден автоматически
                      </div>
                    </div>

                    {/* Data from file */}
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #bbf7d0',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px', color: '#065f46' }}>
                        Данные из файла:
                      </div>
                      <div>
                        Брюки женские • 529940427 • Черный • Размеры: 40, 42, 44, 46, 48
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        onClick={clearAutoSelection}
                        style={{
                          padding: '8px 16px',
                          background: '#fff',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#374151',
                          cursor: 'pointer'
                        }}
                      >
                        Сбросить автоподбор
                      </button>
                      <button
                        onClick={() => setShowChangeProductModal(true)}
                        style={{
                          padding: '8px 16px',
                          background: '#fff',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#374151',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Search size={14} />
                        Найти другой товар
                      </button>
                    </div>
                  </div>

                  {/* Similar Products */}
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', margin: '0 0 12px 0' }}>
                      Похожие товары (если текущий не подходит)
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {MOCK_PRODUCTS.filter(p => 
                        p.category === selectedProduct.category && 
                        p.id !== selectedProduct.id
                      ).slice(0, 2).map((product) => (
                        <div
                          key={product.id}
                          style={{
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#10a37f';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 163, 127, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductDropdown(false);
                          }}
                        >
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            {product.photo ? (
                              <img 
                                src={product.photo} 
                                alt={product.name}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  flexShrink: 0
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '40px',
                                height: '40px',
                                background: '#f3f4f6',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <Package size={16} style={{ color: '#9ca3af' }} />
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {product.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                {product.article}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>
                            {product.color} • {product.category}
                          </div>
                          <button style={{
                            width: '100%',
                            padding: '6px 12px',
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#374151',
                            cursor: 'pointer'
                          }}>
                            Выбрать
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(!selectedProduct || showProductDropdown) && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
                    Выбор товара
                  </h4>
                  <div style={{ marginBottom: '16px' }}>
                    <input
                      type="text"
                      placeholder="Поиск товара или артикула…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10a37f'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    />
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                      Поиск по названию, артикулу WB, артикулу продавца, SKU или категории
                    </div>
                  </div>
                  
                  {filteredProducts.length === 0 && searchQuery && (
                    <div style={{
                      padding: '40px 24px',
                      textAlign: 'center',
                      background: '#f9fafb',
                      border: '1px dashed #d1d5db',
                      borderRadius: '8px'
                    }}>
                      <AlertCircle size={32} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
                        Товар не найден
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                        Попробуйте:<br />
                        • изменить название<br />
                        • искать по артикулу<br />
                        • выбрать товар вручную
                      </div>
                      <button
                        onClick={() => setSearchQuery('')}
                        style={{
                          padding: '10px 20px',
                          background: '#10a37f',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        Открыть каталог товаров
                      </button>
                    </div>
                  )}
                  
                  {filteredProducts.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflow: 'auto' }}>
                      {filteredProducts.slice(0, 10).map(product => {
                        const isAutoFound = uploadedFiles[0]?.analyzedData?.productName === product.name;
                        const hasMultiColors = product.colors && product.colors.length > 1;
                        const displayColors = product.colors || [product.color];
                        const colorText = displayColors.length > 4 
                          ? `${displayColors.slice(0, 4).join(', ')} +${displayColors.length - 4}`
                          : displayColors.join(', ');
                        
                        return (
                          <div
                            key={product.id}
                            onClick={() => {
                              handleProductChange(product);
                              setShowProductDropdown(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px',
                              background: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              minHeight: '80px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#f9fafb';
                              e.currentTarget.style.borderColor = '#10a37f';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#fff';
                              e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                          >
                            {/* Photo */}
                            {product.photo ? (
                              <img 
                                src={product.photo} 
                                alt={product.name}
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  flexShrink: 0
                                }}
                              />
                            ) : (
                              <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#f3f4f6',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <Package size={24} style={{ color: '#9ca3af' }} />
                              </div>
                            )}
                            
                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                                {product.name}
                              </div>
                              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                {colorText}
                              </div>
                              <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                                {product.article} • {product.sellerArticle || 'N/A'}
                              </div>
                            </div>
                            
                            {/* Badges */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                              {isAutoFound && (
                                <span style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  background: '#dcfce7',
                                  color: '#166534',
                                  whiteSpace: 'nowrap'
                                }}>
                                  Найден автоматически
                                </span>
                              )}
                              {hasMultiColors && (
                                <span 
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    background: '#fef3c7',
                                    color: '#92400e',
                                    whiteSpace: 'nowrap',
                                    cursor: 'help'
                                  }}
                                  title="У товара несколько цветов. Проверьте соответствие кодов маркировки."
                                >
                                  Мультицвет
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Related Products Section */}
              {selectedProduct && (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>
                      Связанные товары
                    </h4>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px 0' }}>
                      Добавьте товары, между которыми нужно распределить загруженные коды маркировки.
                    </p>
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        background: '#10a37f',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={18} />
                      Добавить товар
                    </button>
                  </div>

                  {/* Product Group List */}
                  {productGroup.length > 0 && (
                    <div style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      marginBottom: '16px'
                    }}>
                      {/* Table Header */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 2fr 1.5fr 1fr 2fr 80px',
                        gap: '12px',
                        padding: '12px 16px',
                        background: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#6b7280'
                      }}>
                        <div>Фото</div>
                        <div>Товар</div>
                        <div>Артикул</div>
                        <div>Цвет</div>
                        <div>Размеры</div>
                        <div></div>
                      </div>

                      {/* Table Rows */}
                      {productGroup.map((pg, idx) => (
                        <div
                          key={pg.product.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 2fr 1.5fr 1fr 2fr 80px',
                            gap: '12px',
                            padding: '16px',
                            background: '#fff',
                            borderBottom: idx < productGroup.length - 1 ? '1px solid #f3f4f6' : 'none',
                            alignItems: 'center'
                          }}
                        >
                          {pg.product.photo ? (
                            <img 
                              src={pg.product.photo} 
                              alt={pg.product.name}
                              style={{
                                width: '48px',
                                height: '48px',
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                            />
                          ) : (
                            <div style={{
                              width: '48px',
                              height: '48px',
                              background: '#f3f4f6',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Image size={20} style={{ color: '#9ca3af' }} />
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                              {pg.product.name}
                            </div>
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>
                            {pg.product.article}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>
                            {pg.product.color}
                          </div>
                          <div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {pg.product.sizes.map(size => (
                                <span
                                  key={size}
                                  style={{
                                    padding: '4px 10px',
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#6b7280'
                                  }}
                                >
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <button
                              onClick={() => removeProductFromGroup(pg.product.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '8px',
                                cursor: 'pointer',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title="Удалить товар из группы"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {productGroup.length === 0 && (
                    <div style={{
                      padding: '32px',
                      textAlign: 'center',
                      background: '#f9fafb',
                      border: '1px dashed #d1d5db',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}>
                      <Info size={24} style={{ color: '#9ca3af', margin: '0 auto 12px' }} />
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        Вы можете добавить связанные товары, чтобы распределить коды между ними.
                      </p>
                    </div>
                  )}

                  {/* Total and Group Type */}
                  <div style={{
                    padding: '16px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: getGroupType() ? '12px' : 0
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>
                        Всего товаров в группе
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>
                        {getTotalProductsInGroup()} {getTotalProductsInGroup() === 1 ? 'товар' : getTotalProductsInGroup() < 5 ? 'товара' : 'товаров'}
                      </span>
                    </div>
                    
                    {getGroupType() && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: '#6b7280' }}>
                          Тип группы:
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: getGroupType() === 'single' ? '#d1fae5' : '#fef3c7',
                          color: getGroupType() === 'single' ? '#065f46' : '#92400e',
                          border: `1px solid ${getGroupType() === 'single' ? '#10a37f' : '#f59e0b'}`
                        }}>
                          {getGroupType() === 'single' ? '✓ Одноцветная группа' : '⚠ Мультицветная группа'}
                        </span>
                        {getGroupType() === 'multi' && (
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            ({getUniqueColors().join(', ')})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Multi-color Warning */}
                  {getGroupType() === 'multi' && (
                    <div style={{
                      marginTop: '16px',
                      padding: '12px 16px',
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '8px',
                      display: 'flex',
                      gap: '8px',
                      fontSize: '13px',
                      color: '#78350f'
                    }}>
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                          В группе есть товары разных цветов
                        </div>
                        <div>
                          Проверьте, что распределение кодов допустимо для этих товаров.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Size Verification */}
          {step === 4 && selectedProduct && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px 0' }}>
                Проверка размеров
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {uploadedFiles.map(file => {
                  const fileSize = file.analyzedData?.size;
                  const hasSize = selectedProduct.sizes.includes(fileSize || '');
                  
                  return (
                    <div
                      key={file.id}
                      style={{
                        background: '#f9fafb',
                        border: `1px solid ${hasSize ? '#bbf7d0' : '#fde68a'}`,
                        borderRadius: '8px',
                        padding: '16px'
                      }}
                    >
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                            {file.file.name}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Размер в файле
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                            {fileSize || '—'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                            Доступные размеры
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                            {selectedProduct.sizes.join(', ')}
                          </div>
                        </div>
                        <div>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                            background: hasSize ? '#d1fae5' : '#fef3c7',
                            color: hasSize ? '#065f46' : '#92400e'
                          }}>
                            {hasSize ? (
                              <>
                                <CheckCircle2 size={14} /> Совпадает
                              </>
                            ) : (
                              <>
                                <AlertCircle size={14} /> Есть расхождение
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {!hasSize && fileSize && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: '#fffbeb',
                          border: '1px solid #fde68a',
                          borderRadius: '6px',
                          display: 'flex',
                          gap: '8px',
                          fontSize: '13px',
                          color: '#78350f'
                        }}>
                          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            {file.analyzedData?.source === 'pdf' 
                              ? `В загруженном PDF система нашла размер ${fileSize}, но этот размер отсутствует в выбранном товаре. Проверьте соответствие файла и выбранного товара.`
                              : `По названию файла предполагается размер ${fileSize}. Проверьте соответствие.`}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Distribution */}
          {step === 5 && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              {/* Summary */}
              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Всего найдено КИЗов</div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>
                      {getTotalKIZ()}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Распределено</div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#10a37f' }}>
                      {getTotalDistributed()}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Осталось</div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      color: getDistributionStatus() === 'success' ? '#10a37f' : 
                             getDistributionStatus() === 'error' ? '#ef4444' : '#f59e0b'
                    }}>
                      {getTotalKIZ() - getTotalDistributed()}
                    </div>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: getDistributionStatus() === 'success' ? '#d1fae5' : 
                               getDistributionStatus() === 'error' ? '#fee2e2' : '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getDistributionStatus() === 'success' ? (
                      <CheckCircle2 size={24} style={{ color: '#10a37f' }} />
                    ) : (
                      <AlertCircle size={24} style={{ color: getDistributionStatus() === 'error' ? '#ef4444' : '#f59e0b' }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Distribution Table */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 12px 0' }}>
                  Распределение КИЗ по размерам
                </h3>
                
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1.5fr 80px',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6b7280'
                  }}>
                    <div>Файл</div>
                    <div>Товар</div>
                    <div>Цвет</div>
                    <div>Размер</div>
                    <div>Количество КИЗ</div>
                    <div>Основание выбора</div>
                    <div></div>
                  </div>

                  {/* Table Rows */}
                  {distributions.map((dist, idx) => {
                    const badge = getSourceBadge(dist.source);
                    return (
                      <div
                        key={dist.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1.5fr 80px',
                          gap: '12px',
                          padding: '16px',
                          background: '#fff',
                          borderBottom: idx < distributions.length - 1 ? '1px solid #f3f4f6' : 'none',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ fontSize: '13px', color: '#111827' }}>
                          {dist.fileName}
                        </div>
                        <div style={{ fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                          {dist.product?.name || '—'}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {dist.product?.color || '—'}
                        </div>
                        <div>
                          <select
                            value={dist.size}
                            onChange={(e) => updateDistributionSize(dist.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '13px'
                            }}
                          >
                            <option value="">Выбрать...</option>
                            {selectedProduct?.sizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            value={dist.quantity}
                            onChange={(e) => updateDistributionQuantity(dist.id, parseInt(e.target.value) || 0)}
                            min="0"
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '13px'
                            }}
                          />
                        </div>
                        <div>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                            background: `${badge.color}15`,
                            color: badge.color
                          }}>
                            {badge.text}
                          </span>
                        </div>
                        <div>
                          {distributions.length > 1 && (
                            <button
                              onClick={() => removeDistributionRow(dist.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: '8px',
                                cursor: 'pointer',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Size Button */}
              <button
                onClick={addDistributionRow}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: '#fff',
                  border: '1px dashed #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#10a37f',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}
              >
                <Plus size={18} />
                Добавить размер
              </button>

              {/* Warnings */}
              {distributions.some(d => d.warnings.length > 0) && (
                <div style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#78350f' }}>
                      Обнаружены предупреждения
                    </div>
                  </div>
                  {distributions.filter(d => d.warnings.length > 0).map(dist => (
                    <div key={dist.id} style={{ marginLeft: '28px', marginTop: '8px' }}>
                      <div style={{ fontSize: '13px', color: '#92400e', marginBottom: '4px', fontWeight: 500 }}>
                        {dist.fileName}:
                      </div>
                      {dist.warnings.map((warning, idx) => (
                        <div key={idx} style={{ fontSize: '13px', color: '#78350f', marginLeft: '12px' }}>
                          • {warning.message}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {getDistributionStatus() !== 'success' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  background: getDistributionStatus() === 'error' ? '#fef2f2' : '#fffbeb',
                  border: `1px solid ${getDistributionStatus() === 'error' ? '#fecaca' : '#fde68a'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '8px',
                  fontSize: '13px',
                  color: getDistributionStatus() === 'error' ? '#991b1b' : '#78350f'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    {getDistributionStatus() === 'error' 
                      ? 'Количество КИЗ превышает найденное в файлах'
                      : 'Количество КИЗ распределено не полностью'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Confirmation */}
          {step === 6 && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <Sparkles size={20} style={{ color: '#10a37f', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>
                      Финальная проверка
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                      Проверьте данные перед импортом в систему
                    </p>
                  </div>
                </div>
              </div>

              {/* Files */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', margin: '0 0 8px 0' }}>
                  Загруженные файлы
                </h4>
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={file.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: idx < uploadedFiles.length - 1 ? '1px solid #e5e7eb' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ fontSize: '14px', color: '#111827' }}>{file.file.name}</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#10a37f' }}>
                        {file.analyzedData?.kizCount} КИЗ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distribution Summary */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', margin: '0 0 8px 0' }}>
                  Распределение
                </h4>
                <div style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {distributions.map((dist, idx) => (
                    <div
                      key={dist.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: idx < distributions.length - 1 ? '1px solid #e5e7eb' : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500 }}>
                          {dist.product?.name} • {dist.product?.color} • Размер {dist.size}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                          {dist.fileName}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#10a37f'
                      }}>
                        {dist.quantity} КИЗ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                  Итого к импорту
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#10a37f' }}>
                  {getTotalDistributed()} КИЗ
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Result */}
          {step === 7 && (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle2 size={40} style={{ color: '#10a37f' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
                Импорт завершен успешно!
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 32px 0' }}>
                Все коды маркировки успешно импортированы в систему
              </p>

              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'left',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Обработано файлов
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#111827' }}>
                      {uploadedFiles.length}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      Импортировано КИЗов
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#10a37f' }}>
                      {getTotalDistributed()}
                    </div>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    Распределено по товарам и размерам
                  </div>
                  {distributions.map((dist, idx) => (
                    <div
                      key={dist.id}
                      style={{
                        fontSize: '13px',
                        color: '#111827',
                        marginBottom: idx < distributions.length - 1 ? '6px' : 0
                      }}
                    >
                      • {dist.product?.name} ({dist.product?.color}, размер {dist.size}) — {dist.quantity} КИЗ
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px 40px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          background: '#f9fafb'
        }}>
          <div>
            {step > 1 && step < 7 && (
              <button
                onClick={handlePrevStep}
                style={{
                  padding: '10px 20px',
                  background: '#fff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={16} />
                Назад
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {step === 7 ? (
              <>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    padding: '10px 20px',
                    background: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  На главную
                </button>
                <button
                  onClick={() => navigate('/inventory')}
                  style={{
                    padding: '10px 20px',
                    background: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Открыть Честный знак
                </button>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '10px 20px',
                    background: '#10a37f',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Импортировать еще
                </button>
              </>
            ) : (
              <button
                onClick={handleNextStep}
                disabled={
                  (step === 1 && uploadedFiles.length === 0) ||
                  (step === 1 && uploadedFiles.some(f => f.status === 'uploading' || f.status === 'processing')) ||
                  (step === 3 && !isStep3Valid()) ||
                  (step === 5 && getDistributionStatus() !== 'success')
                }
                style={{
                  padding: '10px 20px',
                  background: 
                    (step === 1 && uploadedFiles.length === 0) ||
                    (step === 1 && uploadedFiles.some(f => f.status === 'uploading' || f.status === 'processing')) ||
                    (step === 3 && !isStep3Valid()) ||
                    (step === 5 && getDistributionStatus() !== 'success')
                      ? '#d1d5db' 
                      : '#10a37f',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#fff',
                  cursor: 
                    (step === 1 && uploadedFiles.length === 0) ||
                    (step === 1 && uploadedFiles.some(f => f.status === 'uploading' || f.status === 'processing')) ||
                    (step === 3 && !isStep3Valid()) ||
                    (step === 5 && getDistributionStatus() !== 'success')
                      ? 'not-allowed' 
                      : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {step === 6 ? 'Импортировать' : 'Далее'}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <AlertTriangle size={24} style={{ 
                color: showWarningModal.severity === 'high' ? '#ef4444' : '#f59e0b',
                flexShrink: 0 
              }} />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 8px 0' }}>
                  {showWarningModal.severity === 'high' ? 'Внимание!' : 'Предупреждение'}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {showWarningModal.message}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowWarningModal(null);
                  setSelectedProduct(null);
                }}
                style={{
                  padding: '10px 20px',
                  background: '#fff',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Вернуться и проверить
              </button>
              <button
                onClick={confirmWarning}
                style={{
                  padding: '10px 20px',
                  background: showWarningModal.severity === 'high' ? '#ef4444' : '#f59e0b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Product Modal */}
      {showChangeProductModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                Найти другой товар
              </h3>
              <button
                onClick={() => {
                  setShowChangeProductModal(false);
                  setChangeProductSearch('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Поиск по названию или артикулу"
                  value={changeProductSearch}
                  onChange={(e) => setChangeProductSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>
            </div>

            {/* Products List */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
              {MOCK_PRODUCTS
                .filter(p => 
                  (p.name.toLowerCase().includes(changeProductSearch.toLowerCase()) ||
                  p.article.toLowerCase().includes(changeProductSearch.toLowerCase())) &&
                  p.id !== selectedProduct?.id
                )
                .length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {MOCK_PRODUCTS
                    .filter(p => 
                      (p.name.toLowerCase().includes(changeProductSearch.toLowerCase()) ||
                      p.article.toLowerCase().includes(changeProductSearch.toLowerCase())) &&
                      p.id !== selectedProduct?.id
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowChangeProductModal(false);
                          setChangeProductSearch('');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f9fafb';
                          e.currentTarget.style.borderColor = '#10a37f';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.borderColor = '#e5e7eb';
                        }}
                      >
                        {product.photo ? (
                          <img 
                            src={product.photo} 
                            alt={product.name}
                            style={{
                              width: '48px',
                              height: '48px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: '#f3f4f6',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Package size={20} style={{ color: '#9ca3af' }} />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>
                            {product.article} • {product.color} • {product.category}
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {product.sizes.slice(0, 3).map((size, i) => (
                              <span
                                key={i}
                                style={{
                                  padding: '2px 6px',
                                  background: '#f9fafb',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  color: '#6b7280'
                                }}
                              >
                                {size}
                              </span>
                            ))}
                            {product.sizes.length > 3 && (
                              <span style={{ fontSize: '11px', color: '#9ca3af', padding: '2px 6px' }}>
                                +{product.sizes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <Search size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    {changeProductSearch ? 'Товары не найдены' : 'Введите запрос для поиска'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}
        onClick={() => setShowAddProductModal(false)}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>
                    Добавить товар
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    Выберите товар или группу связанных товаров для распределения кодов маркировки
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Search */}
              <div style={{ marginBottom: '16px', position: 'relative' }}>
                <Search size={18} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Поиск товара, артикула или категории"
                  value={addProductSearch}
                  onChange={(e) => setAddProductSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Product Groups */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(() => {
                  const filteredProducts = MOCK_PRODUCTS
                    .filter(p => 
                      (p.name.toLowerCase().includes(addProductSearch.toLowerCase()) ||
                      p.article.toLowerCase().includes(addProductSearch.toLowerCase()) ||
                      p.category.toLowerCase().includes(addProductSearch.toLowerCase())) &&
                      !productGroup.some(pg => pg.product.id === p.id) &&
                      p.id !== selectedProduct?.id
                    );
                  
                  const groups = groupProducts(filteredProducts);
                  
                  return groups.map((group) => {
                    const isCompatible = selectedProduct ? 
                      (group.category === selectedProduct.category) : 
                      true;
                    
                    const canAddGroup = isCompatible && group.products.every(p => 
                      !productGroup.some(pg => pg.product.id === p.id)
                    );

                    const colorMatches = selectedProduct ? 
                      (group.color === selectedProduct.color) : 
                      true;
                    
                    return (
                      <div
                        key={group.key}
                        style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          opacity: isCompatible ? 1 : 0.6
                        }}
                      >
                        {/* Group Header */}
                        <div style={{
                          padding: '16px 20px',
                          background: '#fff',
                          borderBottom: '1px solid #e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontSize: '15px', 
                              fontWeight: 600, 
                              color: '#111827',
                              marginBottom: '4px'
                            }}>
                              {group.name}
                            </div>
                            <div style={{ 
                              fontSize: '13px', 
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span>{group.category} • {group.color}</span>
                              {!colorMatches && selectedProduct && (
                                <span style={{
                                  padding: '2px 8px',
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  borderRadius: '4px'
                                }}>
                                  Другой цвет
                                </span>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              padding: '4px 10px',
                              background: colorMatches ? '#d1fae5' : '#fef3c7',
                              color: colorMatches ? '#065f46' : '#92400e',
                              fontSize: '12px',
                              fontWeight: 600,
                              borderRadius: '6px'
                            }}>
                              Группа товаров
                            </span>
                            {group.products.length > 1 && canAddGroup && (
                              <button
                                onClick={() => {
                                  group.products.forEach(p => addProductToGroup(p));
                                }}
                                style={{
                                  padding: '8px 16px',
                                  background: '#10a37f',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: '#fff',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                Добавить группу
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Group Table */}
                        <div>
                          {/* Table Header */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '60px 2fr 1.2fr 1.5fr 120px',
                            gap: '12px',
                            padding: '12px 20px',
                            background: '#f3f4f6',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#6b7280'
                          }}>
                            <div>Фото</div>
                            <div>Товар</div>
                            <div>Артикул</div>
                            <div>Размеры</div>
                            <div></div>
                          </div>

                          {/* Table Rows */}
                          {group.products.map((product, idx) => {
                            const canAdd = isCompatible && 
                              !productGroup.some(pg => pg.product.id === product.id);
                            
                            return (
                              <div
                                key={product.id}
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: '60px 2fr 1.2fr 1.5fr 120px',
                                  gap: '12px',
                                  padding: '16px 20px',
                                  background: '#fff',
                                  borderTop: idx > 0 ? '1px solid #f3f4f6' : 'none',
                                  alignItems: 'center'
                                }}
                              >
                                {product.photo ? (
                                  <img 
                                    src={product.photo} 
                                    alt={product.name}
                                    style={{
                                      width: '44px',
                                      height: '44px',
                                      objectFit: 'cover',
                                      borderRadius: '6px'
                                    }}
                                  />
                                ) : (
                                  <div style={{
                                    width: '44px',
                                    height: '44px',
                                    background: '#f3f4f6',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <Package size={18} style={{ color: '#9ca3af' }} />
                                  </div>
                                )}
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                                  {product.name}
                                </div>
                                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                  {product.article}
                                </div>
                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                  {product.sizes.slice(0, 4).map((size, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        padding: '3px 8px',
                                        background: '#f9fafb',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: '#374151'
                                      }}
                                    >
                                      {size}
                                    </span>
                                  ))}
                                  {product.sizes.length > 4 && (
                                    <span style={{ 
                                      fontSize: '12px', 
                                      color: '#9ca3af',
                                      padding: '3px 4px',
                                      fontWeight: 500
                                    }}>
                                      +{product.sizes.length - 4}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <button
                                    onClick={() => canAdd && addProductToGroup(product)}
                                    disabled={!canAdd}
                                    title={!isCompatible ? 'Товар не может быть добавлен в эту группу' : ''}
                                    style={{
                                      width: '100%',
                                      padding: '8px 16px',
                                      background: canAdd ? '#10a37f' : '#e5e7eb',
                                      border: 'none',
                                      borderRadius: '6px',
                                      fontSize: '13px',
                                      fontWeight: 500,
                                      color: canAdd ? '#fff' : '#9ca3af',
                                      cursor: canAdd ? 'pointer' : 'not-allowed'
                                    }}
                                  >
                                    Добавить
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* No Results */}
              {(() => {
                const filteredProducts = MOCK_PRODUCTS.filter(p => 
                  (p.name.toLowerCase().includes(addProductSearch.toLowerCase()) ||
                  p.article.toLowerCase().includes(addProductSearch.toLowerCase()) ||
                  p.category.toLowerCase().includes(addProductSearch.toLowerCase())) &&
                  !productGroup.some(pg => pg.product.id === p.id) &&
                  p.id !== selectedProduct?.id
                );
                
                return filteredProducts.length === 0 && (
                  <div style={{
                    padding: '60px 40px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <Search size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                    <p style={{ fontSize: '14px', margin: 0, fontWeight: 500 }}>
                      {addProductSearch ? 'Товары не найдены' : 'Введите запрос для поиска товаров'}
                    </p>
                    {addProductSearch && (
                      <p style={{ fontSize: '13px', margin: '8px 0 0 0', color: '#9ca3af' }}>
                        Попробуйте изменить поисковый запрос
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Info Message */}
              {selectedProduct && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#1e40af'
                }}>
                  <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                      Можно добавлять товары из той же категории
                    </div>
                    <div>
                      Категория: <strong>{selectedProduct.category}</strong>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '12px', opacity: 0.9 }}>
                      ℹ️ Товары могут быть разных цветов — система покажет тип группы после добавления
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Validation Modal */}
      {showValidationModal && selectedProduct && uploadedFiles[0]?.analyzedData && (() => {
        const detectedData = uploadedFiles[0].analyzedData;
        const detectedProduct = MOCK_PRODUCTS.find(p => p.name === detectedData.productName);
        
        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '700px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              {/* Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <AlertTriangle size={24} style={{ color: '#f59e0b' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                    ⚠️ Проверьте соответствие товара
                  </h3>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Система определила, что импортируемые коды маркировки могут относиться к другому товару.
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                {/* Detected Product */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
                    Обнаружено:
                  </div>
                  <div style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                  }}>
                    {detectedProduct?.photo ? (
                      <img 
                        src={detectedProduct.photo} 
                        alt={detectedData.productName || ''}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Package size={24} style={{ color: '#9ca3af' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                        {detectedData.productName || 'Не определено'}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {detectedData.color || '—'} • {detectedData.gtin || 'GTIN не найден'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Product */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
                    Вы выбрали:
                  </div>
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                  }}>
                    {selectedProduct.photo ? (
                      <img 
                        src={selectedProduct.photo} 
                        alt={selectedProduct.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Package size={24} style={{ color: '#9ca3af' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
                        {selectedProduct.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {selectedProduct.color} • {selectedProduct.gtin || 'GTIN не указан'}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '12px 16px',
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#78350f',
                  marginBottom: '16px'
                }}>
                  <strong>Внимание:</strong> Проверьте соответствие товара перед продолжением импорта.
                </div>

                {/* Checkbox */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '6px'
                }}>
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  Больше не показывать для этой группы товаров
                </label>
              </div>

              {/* Footer */}
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={goBackToEditProduct}
                  style={{
                    padding: '10px 20px',
                    background: '#fff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Вернуться и изменить
                </button>
                <button
                  onClick={proceedWithValidation}
                  style={{
                    padding: '10px 20px',
                    background: '#10a37f',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Продолжить импорт
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
          color: '#fff',
          padding: '18px 24px',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(16, 163, 127, 0.4), 0 0 0 1px rgba(255,255,255,0.15) inset, 0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '14px',
          fontWeight: 500,
          zIndex: 3000,
          animation: 'slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          maxWidth: '450px',
          minWidth: '320px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            animation: 'pulse 2s ease-in-out infinite',
            boxShadow: '0 0 0 4px rgba(255,255,255,0.1)'
          }}>
            <CheckCircle2 size={22} style={{ color: '#fff' }} />
          </div>
          <div style={{ flex: 1, lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, marginBottom: '2px', fontSize: '15px' }}>
              Отлично!
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
              {toast.message}
            </div>
          </div>
          <button
            onClick={() => setToast({ message: '', show: false })}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ImportKIZ;
