import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Search, Filter, Download, ArrowLeft, X, Package, Info, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp, Copy, Check, ArrowRight, Clock, Upload, User as UserIcon, Calendar, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router';
import '../../styles/products-inventory.css';

interface ProductSize {
  size: string;
  barcode: string;
  gtin?: string;
  stock: number;
  unused: number;
  used: number;
  total: number;
  inCirculation?: number;
  withdrawn?: number;
  blocked?: number;
}

interface ProductGroup {
  id: string;
  name: string;
  article: string;
  color: string;
  colorHex: string;
  image: string;
  sizes: ProductSize[];
  unusedCodes: number;
  usedCodes: number;
  totalCodes: number;
}

type SortField = 'name' | 'stock' | 'unused' | 'used' | 'total' | null;
type SortDirection = 'asc' | 'desc';

function ProductsInventory() {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showStats, setShowStats] = useState(false);
  const [copiedArticle, setCopiedArticle] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  // Advanced Filters State
  const [advancedFilters, setAdvancedFilters] = useState({
    markingStatus: '', // Статус маркировки
    stockLevel: '', // Остатки на складе
    kizRatio: '', // Соотношение КИЗы/Товар
    selectedSizesFilter: [] as string[],
    quantityMin: '',
    quantityMax: '',
    dateFilter: ''
  });
  const [transferSource, setTransferSource] = useState<{
    product: ProductGroup;
    sizes: ProductSize[]; // Changed from single size to array
  } | null>(null);
  const [transferTarget, setTransferTarget] = useState<{
    product: ProductGroup;
    sizes: ProductSize[];
  } | null>(null);
  const [showSizeSelector, setShowSizeSelector] = useState<{
    show: boolean;
    product: ProductGroup | null;
  }>({
    show: false,
    product: null
  });
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [transferModal, setTransferModal] = useState<{
    show: boolean;
    sourceProduct: ProductGroup | null;
    sourceSizes: ProductSize[]; // Changed to array
    targetProduct: ProductGroup | null
  }>({
    show: false,
    sourceProduct: null,
    sourceSizes: [],
    targetProduct: null
  });
  const [targetDistribution, setTargetDistribution] = useState<Record<string, number>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showKizStats, setShowKizStats] = useState(false);

  // Internal transfer within same product (size to sizes)
  const [internalTransferModal, setInternalTransferModal] = useState<{
    show: boolean;
    product: ProductGroup | null;
    sourceSize: ProductSize | null;
  }>({
    show: false,
    product: null,
    sourceSize: null
  });
  const [internalDistribution, setInternalDistribution] = useState<Record<string, number>>({});
  
  // KIZ Details View State
  const [selectedSizeForKiz, setSelectedSizeForKiz] = useState<{
    product: ProductGroup;
    size: ProductSize;
  } | null>(null);
  const [kizSearchQuery, setKizSearchQuery] = useState('');
  const [kizStatusFilter, setKizStatusFilter] = useState<'all' | 'available' | 'used' | 'blocked' | 'withdrawn'>('all');
  const [kizDateFilter, setKizDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const [productData, setProductData] = useState<ProductGroup[]>([
    {
      id: '1',
      name: 'Брюки палаццо классические широкие...',
      article: '529940427',
      color: 'Черный',
      colorHex: '#000000',
      image: 'https://images.unsplash.com/photo-1768221677435-3bb38477f09b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxhenpvJTIwcGFudHMlMjBlTGегальныJTIwd29tYW58ZW58MXx8fHwxNzcyMjYwMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      totalCodes: 498,
      usedCodes: 103,
      unusedCodes: 395,
      sizes: [
        { size: '46', barcode: '2045935398110', gtin: '(01)04670503600845', total: 110, used: 35, unused: 75, stock: 100, inCirculation: 32, withdrawn: 2, blocked: 1 },
        { size: '42', barcode: '2045935398097', gtin: '(01)04670503600838', total: 75, used: 40, unused: 35, stock: 50, inCirculation: 38, withdrawn: 1, blocked: 1 },
        { size: '44', barcode: '2045935398103', gtin: '(01)04670503600821', total: 92, used: 22, unused: 70, stock: 70, inCirculation: 20, withdrawn: 2, blocked: 0 },
        { size: '48', barcode: '2045935398127', gtin: '(01)04670503600852', total: 153, used: 6, unused: 147, stock: 120, inCirculation: 5, withdrawn: 0, blocked: 1 },
        { size: '50', barcode: '2047648456675', gtin: '(01)04670503600869', total: 68, used: 0, unused: 68, stock: 40, inCirculation: 0, withdrawn: 0, blocked: 0 }
      ]
    },
    {
      id: '2',
      name: 'Брюки классические палаццо...',
      article: '269975285',
      color: 'Синий',
      colorHex: '#0000FF',
      image: 'https://images.unsplash.com/photo-1768794521439-5315a232a0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwd2lkZSUyMHBhbnRzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NzIyNjAyODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      totalCodes: 40,
      usedCodes: 0,
      unusedCodes: 40,
      sizes: [
        { size: '48', barcode: '2041293803679', gtin: '(01)04670503700542', total: 20, used: 0, unused: 20, stock: 15, inCirculation: 0, withdrawn: 0, blocked: 0 },
        { size: '42', barcode: '2041293803648', gtin: '(01)04670503700535', total: 20, used: 0, unused: 20, stock: 15, inCirculation: 0, withdrawn: 0, blocked: 0 }
      ]
    },
    {
      id: '3',
      name: 'Лонгслив облегающий...',
      article: '612609956',
      color: 'Красный',
      colorHex: '#FF0000',
      image: 'https://images.unsplash.com/photo-1627323109059-485bce47aed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXR0ZWQlMjBsb25nc2xlZXZlJTIwc2hpcnQlMjB3b21hbnxlbnwxfHx8fDE3NzIyNjAyODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      totalCodes: 131,
      usedCodes: 31,
      unusedCodes: 100,
      sizes: [
        { size: 'M', barcode: '2047248215399', gtin: '(01)04670503800235', total: 65, used: 15, unused: 50, stock: 50, inCirculation: 14, withdrawn: 1, blocked: 0 },
        { size: 'S', barcode: '2047248215405', gtin: '(01)04670503800228', total: 44, used: 14, unused: 30, stock: 30, inCirculation: 13, withdrawn: 0, blocked: 1 },
        { size: 'XL', barcode: '2047248215429', gtin: '(01)04670503800242', total: 22, used: 2, unused: 20, stock: 10, inCirculation: 2, withdrawn: 0, blocked: 0 }
      ]
    },
    {
      id: '4',
      name: 'Джинсы прямые...',
      article: '751234567',
      color: 'Зеленый',
      colorHex: '#008000',
      image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhaWdodCUyMGplYW5zJTIwZGVuaW0lMjB3b21hbnxlbnwxfHx8fDE3NzIyNjAyODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      totalCodes: 285,
      usedCodes: 120,
      unusedCodes: 165,
      sizes: [
        { size: '26', barcode: '2047248215501', gtin: '(01)04670503900144', total: 45, used: 20, unused: 25, stock: 30, inCirculation: 18, withdrawn: 1, blocked: 1 },
        { size: '27', barcode: '2047248215518', gtin: '(01)04670503900151', total: 60, used: 25, unused: 35, stock: 40, inCirculation: 23, withdrawn: 2, blocked: 0 },
        { size: '28', barcode: '2047248215525', gtin: '(01)04670503900168', total: 80, used: 35, unused: 45, stock: 50, inCirculation: 33, withdrawn: 1, blocked: 1 },
        { size: '29', barcode: '2047248215532', gtin: '(01)04670503900175', total: 55, used: 20, unused: 35, stock: 35, inCirculation: 19, withdrawn: 0, blocked: 1 },
        { size: '30', barcode: '2047248215549', gtin: '(01)04670503900182', total: 45, used: 20, unused: 25, stock: 25, inCirculation: 18, withdrawn: 2, blocked: 0 }
      ]
    },
    {
      id: '5',
      name: 'Футболка базовая...',
      article: '892456123',
      color: 'Желтый',
      colorHex: '#FFFF00',
      image: 'https://images.unsplash.com/photo-1659355750876-17fd99551641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdmVyc2l6ZWQlMjB0c2hpcnQlMjBiYXNpYyUyMHdvbWFufGVufDF8fHx8MTc3MjI2MDI4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      totalCodes: 420,
      usedCodes: 210,
      unusedCodes: 210,
      sizes: [
        { size: 'XS', barcode: '2047248215601', gtin: '(01)04670503100356', total: 60, used: 30, unused: 30, stock: 40, inCirculation: 28, withdrawn: 1, blocked: 1 },
        { size: 'S', barcode: '2047248215618', gtin: '(01)04670503100363', total: 90, used: 45, unused: 45, stock: 60, inCirculation: 42, withdrawn: 2, blocked: 1 },
        { size: 'M', barcode: '2047248215625', gtin: '(01)04670503100370', total: 120, used: 60, unused: 60, stock: 80, inCirculation: 57, withdrawn: 2, blocked: 1 },
        { size: 'L', barcode: '2047248215632', gtin: '(01)04670503100387', total: 90, used: 45, unused: 45, stock: 60, inCirculation: 43, withdrawn: 1, blocked: 1 },
        { size: 'XL', barcode: '2047248215649', gtin: '(01)04670503100394', total: 60, used: 30, unused: 30, stock: 40, inCirculation: 28, withdrawn: 2, blocked: 0 }
      ]
    }
  ]);

  // Handle ESC key to close modals and block body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedSizeForKiz) {
          setSelectedSizeForKiz(null);
        }
      }
    };
    
    // Block body scroll when modal is open
    if (selectedSizeForKiz) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedSizeForKiz]);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Count active advanced filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (advancedFilters.markingStatus) count++;
    if (advancedFilters.stockLevel) count++;
    if (advancedFilters.kizRatio) count++;
    if (advancedFilters.selectedSizesFilter.length > 0) count++;
    if (advancedFilters.quantityMin || advancedFilters.quantityMax) count++;
    if (advancedFilters.dateFilter) count++;
    return count;
  };

  const filteredProducts = productData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.article.includes(searchQuery);
    const matchesCategory = !selectedCategory || selectedCategory === 'Брюки'; // Placeholder - all products are Брюки for now
    const matchesColor = !selectedColor || product.color === selectedColor;
    
    // Advanced filters
    // 1. Статус маркировки
    let matchesMarkingStatus = true;
    if (advancedFilters.markingStatus) {
      const usagePercent = product.totalCodes > 0 ? (product.usedCodes / product.totalCodes) * 100 : 0;
      const hasBlockedOrRejected = product.sizes.some(size => (size.blocked || 0) > 0 || (size.withdrawn || 0) > 0);
      
      if (advancedFilters.markingStatus === 'fully-marked') {
        matchesMarkingStatus = usagePercent === 100;
      } else if (advancedFilters.markingStatus === 'partially-marked') {
        matchesMarkingStatus = usagePercent > 0 && usagePercent < 100;
      } else if (advancedFilters.markingStatus === 'not-marked') {
        matchesMarkingStatus = usagePercent === 0;
      } else if (advancedFilters.markingStatus === 'has-problems') {
        matchesMarkingStatus = hasBlockedOrRejected;
      }
    }

    // 2. Остатки на складе
    let matchesStock = true;
    if (advancedFilters.stockLevel) {
      const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
      if (advancedFilters.stockLevel === 'critical') matchesStock = totalStock > 0 && totalStock < 20;
      else if (advancedFilters.stockLevel === 'low') matchesStock = totalStock >= 20 && totalStock < 50;
      else if (advancedFilters.stockLevel === 'normal') matchesStock = totalStock >= 50 && totalStock <= 200;
      else if (advancedFilters.stockLevel === 'excess') matchesStock = totalStock > 200;
      else if (advancedFilters.stockLevel === 'out-of-stock') matchesStock = totalStock === 0;
    }

    // 3. Соотношение КИЗы/Товар
    let matchesKizRatio = true;
    if (advancedFilters.kizRatio) {
      const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
      const unusedKiz = product.unusedCodes;
      const ratio = totalStock > 0 ? unusedKiz / totalStock : 0;
      
      if (advancedFilters.kizRatio === 'enough') {
        matchesKizRatio = ratio >= 0.8 && ratio <= 1.2; // ±20%
      } else if (advancedFilters.kizRatio === 'shortage') {
        matchesKizRatio = ratio < 0.8; // Не хватает КИЗов
      } else if (advancedFilters.kizRatio === 'surplus') {
        matchesKizRatio = ratio > 1.3; // Есть запас 30%+
      }
    }

    let matchesSizes = true;
    if (advancedFilters.selectedSizesFilter.length > 0) {
      matchesSizes = product.sizes.some(size => advancedFilters.selectedSizesFilter.includes(size.size));
    }

    let matchesQuantity = true;
    const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
    if (advancedFilters.quantityMin) {
      matchesQuantity = matchesQuantity && totalStock >= parseInt(advancedFilters.quantityMin);
    }
    if (advancedFilters.quantityMax) {
      matchesQuantity = matchesQuantity && totalStock <= parseInt(advancedFilters.quantityMax);
    }

    return matchesSearch && matchesCategory && matchesColor && matchesMarkingStatus && matchesStock && matchesKizRatio && matchesSizes && matchesQuantity;
  });

  const categories = Array.from(new Set(productData.map(p => 'Брюки'))); // Category would be actual category field
  const colors = Array.from(new Set(productData.map(p => p.color)));

  const copyToClipboard = (text: string, fieldId: string) => {
    // Fallback method for environments where Clipboard API is blocked
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    textArea.remove();
  };

  const sortProducts = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedProducts = () => {
    if (!sortField) return filteredProducts;
    
    return [...filteredProducts].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'stock':
          aValue = a.sizes.reduce((sum, s) => sum + s.stock, 0);
          bValue = b.sizes.reduce((sum, s) => sum + s.stock, 0);
          break;
        case 'unused':
          aValue = a.unusedCodes;
          bValue = b.unusedCodes;
          break;
        case 'used':
          aValue = a.usedCodes;
          bValue = b.usedCodes;
          break;
        case 'total':
          aValue = a.totalCodes;
          bValue = b.totalCodes;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const sortedProducts = getSortedProducts();

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  const copyArticle = async (article: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Use textarea method (Clipboard API blocked by permissions policy)
      const textArea = document.createElement('textarea');
      textArea.value = article;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedArticle(article);
        setTimeout(() => setCopiedArticle(null), 2000);
      } finally {
        textArea.remove();
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openSizeSelector = (product: ProductGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.unusedCodes === 0) return;
    
    setShowSizeSelector({
      show: true,
      product
    });
    setSelectedSizes(new Set());
  };

  const closeSizeSelector = () => {
    setShowSizeSelector({
      show: false,
      product: null
    });
    setSelectedSizes(new Set());
  };

  const toggleSizeSelection = (barcode: string) => {
    const newSelected = new Set(selectedSizes);
    if (newSelected.has(barcode)) {
      newSelected.delete(barcode);
    } else {
      newSelected.add(barcode);
    }
    setSelectedSizes(newSelected);
  };

  const selectAllSizes = () => {
    if (!showSizeSelector.product) return;
    const allBarcodes = showSizeSelector.product.sizes
      .filter(s => s.unused > 0)
      .map(s => s.barcode);
    setSelectedSizes(new Set(allBarcodes));
  };

  const confirmSizeSelection = () => {
    if (!showSizeSelector.product || selectedSizes.size === 0) return;
    
    const selectedSizesArray = showSizeSelector.product.sizes.filter(s => 
      selectedSizes.has(s.barcode)
    );
    
    setTransferSource({
      product: showSizeSelector.product,
      sizes: selectedSizesArray
    });
    
    closeSizeSelector();
  };

  const cancelTransferSelection = () => {
    setTransferSource(null);
  };

  const closeTransferModal = () => {
    setTransferModal({
      show: false,
      sourceProduct: null,
      sourceSizes: [],
      targetProduct: null
    });
    setTransferSource(null);
    setTargetDistribution({});
  };

  const handleTransferClick = (product: ProductGroup, size: ProductSize, e: React.MouseEvent) => {
    e.stopPropagation();
    if (size.unused === 0) return;
    
    // If no source selected yet, set this single size as source
    if (!transferSource) {
      setTransferSource({ product, sizes: [size] });
      return;
    }
    
    // If clicking the same item from same product, deselect it
    if (transferSource.product.id === product.id && transferSource.sizes.some(s => s.barcode === size.barcode)) {
      setTransferSource(null);
      return;
    }
    
    // If source is from the same product but different size, open internal transfer
    if (transferSource.product.id === product.id) {
      // Open internal transfer modal
      setInternalTransferModal({
        show: true,
        product: product,
        sourceSize: transferSource.sizes[0] // Use first size from selected
      });
      
      // Initialize distribution for target sizes
      const initialDistribution: Record<string, number> = {};
      product.sizes.forEach(s => {
        if (s.barcode !== transferSource.sizes[0].barcode) {
          initialDistribution[s.barcode] = 0;
        }
      });
      setInternalDistribution(initialDistribution);
      
      // Clear transfer source
      setTransferSource(null);
      return;
    }
    
    // Check if multiple sizes selected and target has different number of sizes
    if (transferSource.sizes.length > 1 && transferSource.sizes.length !== product.sizes.length) {
      setTransferError(`Невозможно перенести ${transferSource.sizes.length} размеров в товар с ${product.sizes.length} размерами. Для переноса между товарами с разным количеством размеров переносите размеры по одному.`);
      return;
    }
    
    // Clear any previous error
    setTransferError(null);
    
    // If different product selected, open distribution modal
    setTransferModal({
      show: true,
      sourceProduct: transferSource.product,
      sourceSizes: transferSource.sizes,
      targetProduct: product
    });
    
    // Initialize distribution for target sizes
    const initialDistribution: Record<string, number> = {};
    
    // If same number of sizes, auto-map them
    if (transferSource.sizes.length === product.sizes.length) {
      product.sizes.forEach((targetSize, idx) => {
        const sourceSize = transferSource.sizes[idx];
        initialDistribution[targetSize.barcode] = sourceSize ? sourceSize.unused : 0;
      });
    } else {
      // Otherwise, initialize with zeros
      product.sizes.forEach(s => {
        initialDistribution[s.barcode] = 0;
      });
    }
    
    setTargetDistribution(initialDistribution);
  };

  // Handle transfer to entire product (not specific size)
  const handleProductTransferClick = (product: ProductGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!transferSource) {
      // If no source selected, open size selector for this product
      openSizeSelector(product, e);
      return;
    }
    
    // If source is from the same product, ignore
    if (transferSource.product.id === product.id) {
      return;
    }
    
    // Check if multiple sizes selected and target has different number of sizes
    if (transferSource.sizes.length > 1 && transferSource.sizes.length !== product.sizes.length) {
      setTransferError(`Невозможно перенести ${transferSource.sizes.length} размеров в товар с ${product.sizes.length} размерами. Для п��реноса между товарами с разным количеством размеров переносите размеры по одному.`);
      return;
    }
    
    // Clear any previous error
    setTransferError(null);
    
    // Open distribution modal
    setTransferModal({
      show: true,
      sourceProduct: transferSource.product,
      sourceSizes: transferSource.sizes,
      targetProduct: product
    });
    
    // Initialize distribution for target sizes
    const initialDistribution: Record<string, number> = {};
    
    // If same number of sizes, auto-map them
    if (transferSource.sizes.length === product.sizes.length) {
      product.sizes.forEach((targetSize, idx) => {
        const sourceSize = transferSource.sizes[idx];
        initialDistribution[targetSize.barcode] = sourceSize ? sourceSize.unused : 0;
      });
    } else {
      // Otherwise, initialize with zeros
      product.sizes.forEach(s => {
        initialDistribution[s.barcode] = 0;
      });
    }
    
    setTargetDistribution(initialDistribution);
  };

  const handleDistributeEvenly = () => {
    if (!transferModal.targetProduct || !transferModal.sourceSizes) return;
    
    const totalAvailable = transferModal.sourceSizes.reduce((sum, s) => sum + s.unused, 0);
    const targetSizes = transferModal.targetProduct.sizes;
    const perSize = Math.floor(totalAvailable / targetSizes.length);
    const remainder = totalAvailable % targetSizes.length;
    
    const newDistribution: Record<string, number> = {};
    targetSizes.forEach((size, idx) => {
      newDistribution[size.barcode] = perSize + (idx < remainder ? 1 : 0);
    });
    
    setTargetDistribution(newDistribution);
  };

  const updateDistribution = (barcode: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setTargetDistribution(prev => ({
      ...prev,
      [barcode]: numValue
    }));
  };

  const getTotalDistributed = () => {
    return Object.values(targetDistribution).reduce((sum, val) => sum + val, 0);
  };

  const getTotalAvailable = () => {
    if (!transferModal.sourceSizes) return 0;
    return transferModal.sourceSizes.reduce((sum, s) => sum + s.unused, 0);
  };

  const executeTransfer = () => {
    if (!transferModal.sourceProduct || !transferModal.sourceSizes || !transferModal.targetProduct) return;
    
    const totalDistributed = getTotalDistributed();
    const totalAvailable = getTotalAvailable();
    
    if (totalDistributed === 0) {
      alert('Распределите КИЗы по размерам');
      return;
    }
    
    if (totalDistributed > totalAvailable) {
      alert(`Невозможно распределить ${totalDistributed} КИЗов. Доступно только ${totalAvailable}`);
      return;
    }

    // Update product data
    setProductData(prevData => {
      return prevData.map(product => {
        // Update source product - remove distributed amount from each source size proportionally
        if (product.id === transferModal.sourceProduct!.id) {
          let remainingToRemove = totalDistributed;
          const newSizes = product.sizes.map(size => {
            const sourceSize = transferModal.sourceSizes!.find(s => s.barcode === size.barcode);
            if (sourceSize && remainingToRemove > 0) {
              const toRemove = Math.min(sourceSize.unused, remainingToRemove);
              remainingToRemove -= toRemove;
              return {
                ...size,
                unused: size.unused - toRemove,
                total: size.total - toRemove
              };
            }
            return size;
          });
          
          return {
            ...product,
            sizes: newSizes,
            unusedCodes: product.unusedCodes - totalDistributed,
            totalCodes: product.totalCodes - totalDistributed
          };
        }
        
        // Update target product - add distributed amounts to each target size
        if (product.id === transferModal.targetProduct!.id) {
          const newSizes = product.sizes.map(size => {
            const distributedAmount = targetDistribution[size.barcode] || 0;
            return {
              ...size,
              unused: size.unused + distributedAmount,
              total: size.total + distributedAmount
            };
          });
          
          return {
            ...product,
            sizes: newSizes,
            unusedCodes: product.unusedCodes + totalDistributed,
            totalCodes: product.totalCodes + totalDistributed
          };
        }
        
        return product;
      });
    });

    closeTransferModal();
  };

  // Internal transfer functions
  const closeInternalTransferModal = () => {
    setInternalTransferModal({
      show: false,
      product: null,
      sourceSize: null
    });
    setInternalDistribution({});
  };

  const updateInternalDistribution = (barcode: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setInternalDistribution(prev => ({
      ...prev,
      [barcode]: numValue
    }));
  };

  const getTotalInternalDistributed = () => {
    return Object.values(internalDistribution).reduce((sum, val) => sum + val, 0);
  };

  const getTotalInternalAvailable = () => {
    if (!internalTransferModal.sourceSize) return 0;
    return internalTransferModal.sourceSize.unused;
  };

  const handleInternalDistributeEvenly = () => {
    if (!internalTransferModal.product || !internalTransferModal.sourceSize) return;
    
    const totalAvailable = getTotalInternalAvailable();
    const targetSizes = internalTransferModal.product.sizes.filter(
      s => s.barcode !== internalTransferModal.sourceSize!.barcode
    );
    const perSize = Math.floor(totalAvailable / targetSizes.length);
    const remainder = totalAvailable % targetSizes.length;
    
    const newDistribution: Record<string, number> = {};
    targetSizes.forEach((size, idx) => {
      newDistribution[size.barcode] = perSize + (idx < remainder ? 1 : 0);
    });
    
    setInternalDistribution(newDistribution);
  };

  const executeInternalTransfer = () => {
    if (!internalTransferModal.product || !internalTransferModal.sourceSize) return;
    
    const totalDistributed = getTotalInternalDistributed();
    const totalAvailable = getTotalInternalAvailable();
    
    if (totalDistributed === 0) {
      alert('Распределите КИЗы по размерам');
      return;
    }
    
    if (totalDistributed > totalAvailable) {
      alert(`Невозможно распределить ${totalDistributed} КИЗов. Доступно только ${totalAvailable}`);
      return;
    }

    // Update product data - transfer within same product
    setProductData(prevData => {
      return prevData.map(product => {
        if (product.id === internalTransferModal.product!.id) {
          const newSizes = product.sizes.map(size => {
            // Remove from source size
            if (size.barcode === internalTransferModal.sourceSize!.barcode) {
              return {
                ...size,
                unused: size.unused - totalDistributed,
                total: size.total - totalDistributed
              };
            }
            
            // Add to target sizes
            const distributedAmount = internalDistribution[size.barcode] || 0;
            if (distributedAmount > 0) {
              return {
                ...size,
                unused: size.unused + distributedAmount,
                total: size.total + distributedAmount
              };
            }
            
            return size;
          });
          
          return {
            ...product,
            sizes: newSizes
          };
        }
        
        return product;
      });
    });

    closeInternalTransferModal();
  };

  return (
    <div className="fw-inventory">
      {/* Header */}
      <div className="fw-inventory__header">
        <div className="fw-inventory__header-content">
          <div>
            <h1 className="fw-inventory__title">Честный знак</h1>
            <p className="fw-inventory__subtitle">Управление кодами маркировки по товарам</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="fw-inventory__filters">
        <div className="fw-inventory__filters-content">
          <div className="fw-search-row">
            <div className="fw-search">
              <Search className="fw-search__icon" />
              <input
                type="text"
                className="fw-search__input"
                placeholder="Поиск по товару или артикулу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="fw-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="fw-filter-select"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              <option value="">Все цвета</option>
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="fw-action-buttons">
            <button 
              className={`fw-filter-btn ${showStats ? 'fw-filter-btn--active' : ''}`}
              onClick={() => setShowStats(!showStats)}
            >
              <TrendingUp className="w-4 h-4" />
              Статистика
            </button>

            <button 
              className={`fw-filter-btn ${showFilterPanel ? 'fw-filter-btn--active' : ''}`}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="w-4 h-4" />
              Фильтры
              {getActiveFiltersCount() > 0 && (
                <span className="fw-filter-badge">{getActiveFiltersCount()}</span>
              )}
            </button>

            <button className="fw-export-btn" onClick={() => navigate('/wizard')}>
              <Upload className="w-4 h-4" />
              Импорт КИЗов
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Error Banner */}
      {transferError && (
        <div className="fw-transfer-error-banner fw-transfer-error-banner--fixed">
          <div className="fw-transfer-error-banner__content">
            <div className="fw-transfer-error-banner__icon">
              <Info className="w-5 h-5" />
            </div>
            <div className="fw-transfer-error-banner__message">
              {transferError}
            </div>
            <button 
              className="fw-transfer-error-banner__close"
              onClick={() => setTransferError(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      {showStats && (
        <div className="fw-inventory__stats">
          <div className="fw-inventory__stats-content">
            <div className="fw-stat-item">
              <div className="fw-stat-item__label">Всего товаров</div>
              <div className="fw-stat-item__value">{filteredProducts.length}</div>
            </div>
            <div className="fw-stat-item">
              <div className="fw-stat-item__label">Всего КИЗ</div>
              <div className="fw-stat-item__value">
                {filteredProducts.reduce((sum, p) => sum + p.totalCodes, 0)}
              </div>
            </div>
            <div className="fw-stat-item">
              <div className="fw-stat-item__label">Использовано</div>
              <div className="fw-stat-item__value fw-stat-item__value--success">
                {filteredProducts.reduce((sum, p) => sum + p.usedCodes, 0)}
              </div>
            </div>
            <div className="fw-stat-item">
              <div className="fw-stat-item__label">Не использовано</div>
              <div className="fw-stat-item__value fw-stat-item__value--warning">
                {filteredProducts.reduce((sum, p) => sum + p.unusedCodes, 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="fw-inventory__table-wrapper">
        <table className="fw-inventory-table">
          <thead>
            <tr>
              <th className="fw-sticky-col fw-sticky-col-1" style={{ width: '40px' }}></th>
              <th className="fw-sticky-col fw-sticky-col-2" style={{ width: '80px' }}>
                <div className="fw-table-header">Фото</div>
              </th>
              <th className="fw-sortable fw-sticky-col fw-sticky-col-3" style={{ width: '380px' }} onClick={() => sortProducts('name')}>
                <div className="fw-sortable-header">
                  <div className="fw-table-header fw-table-header--with-tooltip">
                    <span>Товар</span>
                    <div className="fw-tooltip-wrapper">
                      <Info className="fw-tooltip-icon" />
                      <div className="fw-tooltip">
                        <div className="fw-tooltip__text">
                          Название товара, артикул и цвет. Нажмите, чтобы открыть детализацию по размерам.
                        </div>
                      </div>
                    </div>
                  </div>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                style={{ width: '150px' }} 
                className="fw-sortable fw-sticky-col fw-sticky-col-4"
                onClick={() => sortProducts('stock')}
              >
                <div className="fw-sortable-header">
                  <div className="fw-table-header fw-table-header--with-icon fw-table-header--with-tooltip">
                    <Package className="w-4 h-4" />
                    <span>Товаров на складе</span>
                    <div className="fw-tooltip-wrapper">
                      <Info className="fw-tooltip-icon" />
                      <div className="fw-tooltip">
                        <div className="fw-tooltip__text">
                          Количество товара на складе, доступное для упаковки или отгрузки.
                        </div>
                      </div>
                    </div>
                  </div>
                  {getSortIcon('stock')}
                </div>
              </th>
              <th 
                style={{ width: '130px' }} 
                className="fw-table-divider fw-sortable"
                onClick={() => sortProducts('unused')}
              >
                <div className="fw-sortable-header">
                  <div className="fw-table-header fw-table-header--orange fw-table-header--with-tooltip">
                    <span>Свободные КИЗ</span>
                    <div className="fw-tooltip-wrapper">
                      <Info className="fw-tooltip-icon" />
                      <div className="fw-tooltip">
                        <div className="fw-tooltip__text">
                          Коды маркировки, которые загружены в систему и доступны для печати.
                          Эти коды ещё не использовались и не отправлены в УПД.
                        </div>
                      </div>
                    </div>
                  </div>
                  {getSortIcon('unused')}
                </div>
              </th>
              <th 
                style={{ width: '120px' }}
                className="fw-sortable"
                onClick={() => sortProducts('used')}
              >
                <div className="fw-sortable-header">
                  <div className="fw-table-header fw-table-header--muted fw-table-header--with-tooltip">
                    <span>Распечатанные</span>
                    <div className="fw-tooltip-wrapper">
                      <Info className="fw-tooltip-icon" />
                      <div className="fw-tooltip">
                        <div className="fw-tooltip__text">
                          Коды, которые уже были распечатаны и использованы для маркировки товара.
                        </div>
                      </div>
                    </div>
                  </div>
                  {getSortIcon('used')}
                </div>
              </th>
              <th 
                style={{ width: '100px' }}
                className="fw-sortable"
                onClick={() => sortProducts('total')}
              >
                <div className="fw-sortable-header">
                  <div className="fw-table-header fw-table-header--with-tooltip">
                    <span>Всего КИЗ</span>
                    <div className="fw-tooltip-wrapper">
                      <Info className="fw-tooltip-icon" />
                      <div className="fw-tooltip">
                        <div className="fw-tooltip__text">
                          Общее количество кодов маркировки по товару.
                          Включает свободные и распечатанные КИЗы.
                        </div>
                      </div>
                    </div>
                  </div>
                  {getSortIcon('total')}
                </div>
              </th>
              <th style={{ width: '110px' }}>
                <div className="fw-table-header fw-table-header--with-tooltip">
                  <span>Баланс КИЗ</span>
                  <div className="fw-tooltip-wrapper">
                    <Info className="fw-tooltip-icon" />
                    <div className="fw-tooltip">
                      <div className="fw-tooltip__text" style={{ marginBottom: '8px' }}>
                        Разница между свободными КИЗами и количеством товара на складе.
                        Показывает, хватает ли кодов маркировки.
                      </div>
                      <div className="fw-tooltip__row">
                        <span className="fw-tooltip__badge fw-tooltip__badge--negative">-25</span>
                        <span className="fw-tooltip__text">Кодов не хватает</span>
                      </div>
                      <div className="fw-tooltip__row">
                        <span className="fw-tooltip__badge fw-tooltip__badge--positive">+27</span>
                        <span className="fw-tooltip__text">Кодов больше, чем товара</span>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th style={{ width: '110px' }}>
                <div className="fw-table-header fw-table-header--with-icon fw-table-header--green">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>В обороте</span>
                  <div className="fw-tooltip-wrapper">
                    <Info className="fw-tooltip-icon" />
                    <div className="fw-tooltip">
                      <div className="fw-tooltip__text">
                        Коды со статусом «В обороте» в системе «Честный знак».
                        Эти коды активны и могут находиться на складе, у маркетплейса или у покупателя.
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th style={{ width: '110px' }}>
                <div className="fw-table-header fw-table-header--with-icon fw-table-header--muted fw-table-header--with-tooltip">
                  <Clock className="w-4 h-4" />
                  <span>Выведены</span>
                  <div className="fw-tooltip-wrapper">
                    <Info className="fw-tooltip-icon" />
                    <div className="fw-tooltip">
                      <div className="fw-tooltip__text">
                        Коды, выведенные из оборота (например: проданы, списаны или утилизированы).
                        Исполь��овать такие КИЗы повторно нельзя.
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th style={{ width: '110px' }}>
                <div className="fw-table-header fw-table-header--with-icon fw-table-header--red fw-table-header--with-tooltip">
                  <AlertCircle className="w-4 h-4" />
                  <span>Заблокир.</span>
                  <div className="fw-tooltip-wrapper">
                    <Info className="fw-tooltip-icon" />
                    <div className="fw-tooltip">
                      <div className="fw-tooltip__text">
                        Коды, которые нельзя использовать.
                        Например, если они уже были переданы в УПД, использованы ранее или имеют конфликт.
                      </div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => {
              const isExpanded = expandedRows.has(product.id);
              const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
              
              const rows = [
                // Main Row
                <tr
                  key={product.id}
                  className="fw-inventory-table__row--group"
                >
                  <td className="fw-sticky-col fw-sticky-col-1" onClick={() => toggleRow(product.id)}>
                    <button className="fw-expand-btn">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="fw-sticky-col fw-sticky-col-2">
                    <div 
                      className="fw-product-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(product.image);
                      }}
                    >
                      <img src={product.image} alt={product.name} />
                    </div>
                  </td>
                  <td className="fw-sticky-col fw-sticky-col-3" onClick={() => toggleRow(product.id)}>
                    <div className="fw-product-cell">
                      <div className="fw-product-cell__name text-[14px]">{product.name}</div>
                      <div className="fw-product-cell__meta">
                        <span className="fw-product-cell__category text-[13px]">Брюки</span>
                        <span className="fw-product-cell__separator">·</span>
                        <button 
                          className="fw-product-cell__article fw-product-cell__article--copyable text-[12px]"
                          onClick={(e) => copyArticle(product.article, e)}
                          title="Нажмите, чтобы скопировать"
                        >
                          {product.article}
                          {copiedArticle === product.article ? (
                            <Check className="fw-copy-icon fw-copy-icon--success" />
                          ) : (
                            <Copy className="fw-copy-icon" />
                          )}
                        </button>
                        <span className="fw-product-cell__separator">·</span>
                        <span className="fw-product-cell__color-text text-[13px]">{product.color}</span>
                      </div>
                      <div className="fw-product-cell__actions">
                        <button 
                          className="fw-history-btn text-[12px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Кнопка "История загрузок" - функционал будет добавлен позже
                            console.log('История загрузок для товара:', product);
                          }}
                          title="История загрузок"
                        >
                          <Clock size={14} />
                          История загрузок
                        </button>
                        <button 
                          className="fw-upload-kiz-btn text-[12px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Открыть модальное окно загрузки КИЗов
                            console.log('Загрузить КИЗы для товара:', product);
                          }}
                          title="Загрузить КИЗы"
                        >
                          <Upload size={14} />
                          Загрузить КИЗы
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="fw-sticky-col fw-sticky-col-4" onClick={() => toggleRow(product.id)}>
                    <span className="fw-table-value">{totalStock}</span>
                  </td>
                  <td onClick={() => toggleRow(product.id)} className="fw-table-divider">
                    <div className="fw-unused-cell">
                      <span className="fw-table-value">
                        {product.unusedCodes}
                      </span>
                      {product.unusedCodes > 0 && (
                        <button
                          className="fw-transfer-btn fw-transfer-btn--group"
                          onClick={(e) => handleProductTransferClick(product, e)}
                          title="Выбрать размеры для переноса"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td onClick={() => toggleRow(product.id)}>
                    <span className="fw-table-value fw-table-value--muted">
                      {product.usedCodes}
                    </span>
                  </td>
                  <td onClick={() => toggleRow(product.id)}>
                    <span className="fw-table-value fw-table-value--muted">{product.totalCodes}</span>
                  </td>
                  <td onClick={() => toggleRow(product.id)}>
                    {(() => {
                      const balance = product.unusedCodes - totalStock;
                      const isNegative = balance < 0;
                      const isPositive = balance > 0;
                      const isZero = balance === 0;
                      
                      return (
                        <span 
                          className="fw-table-value" 
                          style={{ 
                            color: isZero ? '#10a37f' : isNegative ? '#ef4444' : '#10a37f',
                            fontWeight: 600
                          }}
                        >
                          {isZero ? '0' : isPositive ? `+${balance}` : balance}
                        </span>
                      );
                    })()}
                  </td>
                  <td onClick={() => toggleRow(product.id)}>
                    <span className="fw-table-value" style={{ color: '#10a37f', fontWeight: 500 }}>
                      {product.sizes.reduce((sum, s) => sum + (s.inCirculation || 0), 0)}
                    </span>
                  </td>
                  <td onClick={() => toggleRow(product.id)}>
                    <span className="fw-table-value" style={{ color: '#9ca3af' }}>
                      {product.sizes.reduce((sum, s) => sum + (s.withdrawn || 0), 0)}
                    </span>
                  </td>
                  <td onClick={() => toggleRow(product.id)}>
                    <span className="fw-table-value" style={{ color: '#ef4444', fontWeight: 500 }}>
                      {product.sizes.reduce((sum, s) => sum + (s.blocked || 0), 0)}
                    </span>
                  </td>
                </tr>
              ];

              // Add expanded size rows if expanded
              if (isExpanded) {
                product.sizes.forEach((size) => {
                  const isSelected = transferSource?.product.id === product.id && transferSource?.sizes.some(s => s.barcode === size.barcode);
                  
                  rows.push(
                    <tr
                      key={`${product.id}-${size.size}`}
                      className={`fw-inventory-table__row--size ${isSelected ? 'fw-inventory-table__row--selected-source' : ''}`}
                    >
                      <td className="fw-sticky-col fw-sticky-col-1"></td>
                      <td className="fw-sticky-col fw-sticky-col-2"></td>
                      <td className="fw-sticky-col fw-sticky-col-3">
                        <div 
                          className="fw-size-container"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            paddingLeft: '24px',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setSelectedSizeForKiz({ product, size });
                          }}
                          title="Посмотреть детали КИЗов"
                        >
                          <span 
                            className="fw-size-badge"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 600,
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#3b82f6',
                              border: '1px solid rgba(59, 130, 246, 0.2)'
                            }}
                          >
                            {size.size}
                          </span>
                          <span 
                            className="fw-barcode-text"
                            style={{
                              fontFamily: "'SF Mono', 'Monaco', 'Courier New', monospace",
                              fontSize: '12px',
                              color: '#9ca3af',
                              fontWeight: 400
                            }}
                          >
                            {size.barcode}
                          </span>
                        </div>
                      </td>
                      <td className="fw-sticky-col fw-sticky-col-4">
                        <span className="fw-table-value">{size.stock}</span>
                      </td>
                      <td className="fw-table-divider">
                        <div className="fw-unused-cell">
                          <span className="fw-table-value">{size.unused}</span>
                          {size.unused > 0 && (
                            <button
                              className="fw-transfer-btn"
                              onClick={(e) => handleTransferClick(product, size, e)}
                              title="Перенести КИЗы"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="fw-table-value fw-table-value--muted">{size.used}</span>
                      </td>
                      <td>
                        <span className="fw-table-value fw-table-value--muted">{size.total}</span>
                      </td>
                      <td>
                        {(() => {
                          const balance = size.unused - size.stock;
                          const isNegative = balance < 0;
                          const isPositive = balance > 0;
                          const isZero = balance === 0;
                          
                          return (
                            <span 
                              className="fw-table-value" 
                              style={{ 
                                color: isZero ? '#10a37f' : isNegative ? '#ef4444' : '#10a37f',
                                fontWeight: 600
                              }}
                            >
                              {isZero ? '0' : isPositive ? `+${balance}` : balance}
                            </span>
                          );
                        })()}
                      </td>
                      <td>
                        <span className="fw-table-value" style={{ color: '#10a37f', fontWeight: 500 }}>
                          {size.inCirculation || 0}
                        </span>
                      </td>
                      <td>
                        <span className="fw-table-value" style={{ color: '#9ca3af' }}>
                          {size.withdrawn || 0}
                        </span>
                      </td>
                      <td>
                        <span className="fw-table-value" style={{ color: '#ef4444', fontWeight: 500 }}>
                          {size.blocked || 0}
                        </span>
                      </td>
                    </tr>
                  );
                });
              }

              return rows;
            })}
          </tbody>
        </table>
      </div>

      {/* Transfer Selection Banner */}
      {transferSource && (
        <div className="fw-transfer-banner fw-transfer-banner--fixed">
          <div className="fw-transfer-banner__content">
            <div className="fw-transfer-banner__products">
              {/* Source Product */}
              <div className="fw-transfer-banner__product">
                <img src={transferSource.product.image} alt="" className="fw-transfer-banner__product-image" />
                <div className="fw-transfer-banner__product-info">
                  <div className="fw-transfer-banner__product-name">{transferSource.product.name}</div>
                  <div className="fw-transfer-banner__product-meta">
                    <span>{transferSource.product.article}</span>
                    <span>·</span>
                    <span>Размер {transferSource.sizes.map(size => size.size).join(', ')}</span>
                    <span>·</span>
                    <span className="fw-transfer-banner__product-codes">{transferSource.sizes.reduce((sum, size) => sum + size.unused, 0)} КИЗов</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="fw-transfer-banner__arrow">
                <ArrowRight className="w-6 h-6" />
              </div>

              {/* Target Product Placeholder */}
              <div className="fw-transfer-banner__product fw-transfer-banner__product--placeholder">
                <div className="fw-transfer-banner__product-image fw-transfer-banner__product-image--placeholder">
                  <Package className="w-8 h-8" />
                </div>
                <div className="fw-transfer-banner__product-info">
                  <div className="fw-transfer-banner__product-name">Выберите товар для переноса</div>
                  <div className="fw-transfer-banner__product-meta">
                    Нажмите на кнопку переноса у целевого товара
                  </div>
                </div>
              </div>
            </div>

            <div className="fw-transfer-banner__actions">
              <button 
                className="fw-transfer-banner__cancel"
                onClick={cancelTransferSelection}
              >
                <X className="w-5 h-5" />
                Отменить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="fw-image-modal" onClick={() => setZoomedImage(null)}>
          <div className="fw-image-modal__overlay"></div>
          <button className="fw-image-modal__close">
            <X className="w-6 h-6" />
          </button>
          <div className="fw-image-modal__content" onClick={(e) => e.stopPropagation()}>
            <img src={zoomedImage} alt="Увеличенное фото" />
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModal.show && transferModal.sourceProduct && transferModal.sourceSizes && (
        <div className="fw-transfer-modal" onClick={closeTransferModal}>
          <div className="fw-transfer-modal__overlay"></div>
          <div className="fw-transfer-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="fw-transfer-modal__close" onClick={closeTransferModal}>
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="fw-transfer-modal__title">Перенос КИЗов</h2>
            
            {/* Source Info */}
            <div className="fw-transfer-modal__section">
              <div className="fw-transfer-modal__label">Откуда переносим:</div>
              <div className="fw-transfer-source">
                <img src={transferModal.sourceProduct.image} alt="" className="fw-transfer-source__image" />
                <div className="fw-transfer-source__info">
                  <div className="fw-transfer-source__name">{transferModal.sourceProduct.name}</div>
                  <div className="fw-transfer-source__meta">
                    <span className="fw-transfer-source__article">{transferModal.sourceProduct.article}</span>
                    <span className="fw-transfer-source__size">Размер: {transferModal.sourceSizes.map(size => size.size).join(', ')}</span>
                  </div>
                  <div className="fw-transfer-source__available">
                    Доступно для переноса: <strong>{transferModal.sourceSizes.reduce((sum, size) => sum + size.unused, 0)}</strong> КИЗов
                  </div>
                </div>
              </div>
            </div>

            {/* Target Info */}
            {transferModal.targetProduct && (
              <>
                <div className="fw-transfer-modal__section">
                  <div className="fw-transfer-modal__label">Куда переносим:</div>
                  <div className="fw-transfer-source">
                    <img src={transferModal.targetProduct.image} alt="" className="fw-transfer-source__image" />
                    <div className="fw-transfer-source__info">
                      <div className="fw-transfer-source__name">{transferModal.targetProduct.name}</div>
                      <div className="fw-transfer-source__meta">
                        <span className="fw-transfer-source__article">{transferModal.targetProduct.article}</span>
                      </div>
                      <div className="fw-transfer-source__available">
                        Доступно для распределения: <strong>{getTotalAvailable()}</strong> КИЗов
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distribution Controls */}
                <div className="fw-transfer-modal__section">
                  <div className="fw-distribution-header">
                    <div className="fw-transfer-modal__label">Распределите КИЗы по размерам:</div>
                    <button 
                      className="fw-distribute-evenly-btn"
                      onClick={handleDistributeEvenly}
                    >
                      Расп��еделить равномерно
                    </button>
                  </div>

                  <div className="fw-distribution-grid">
                    {transferModal.targetProduct.sizes.map((size) => (
                      <div key={size.barcode} className="fw-distribution-item">
                        <div className="fw-distribution-item__header">
                          <span className="fw-distribution-item__size">Размер {size.size}</span>
                          <span className="fw-distribution-item__current">Текущих: {size.unused}</span>
                        </div>
                        <input
                          type="number"
                          className="fw-distribution-item__input"
                          placeholder="0"
                          min="0"
                          max={getTotalAvailable()}
                          value={targetDistribution[size.barcode] || ''}
                          onChange={(e) => updateDistribution(size.barcode, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Distribution Summary */}
                  <div className={`fw-distribution-summary ${getTotalDistributed() > getTotalAvailable() ? 'fw-distribution-summary--error' : ''}`}>
                    <div className="fw-distribution-summary__row">
                      <span>Распределено:</span>
                      <strong>{getTotalDistributed()} КИЗов</strong>
                    </div>
                    <div className="fw-distribution-summary__row">
                      <span>Осталось:</span>
                      <strong>{getTotalAvailable() - getTotalDistributed()} КИЗов</strong>
                    </div>
                    {getTotalDistributed() > getTotalAvailable() && (
                      <div className="fw-distribution-summary__error">
                        Превышен лимит! Уменьшите количество.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="fw-transfer-modal__actions">
              <button className="fw-transfer-modal__btn fw-transfer-modal__btn--cancel" onClick={closeTransferModal}>
                Отмена
              </button>
              <button 
                className="fw-transfer-modal__btn fw-transfer-modal__btn--confirm" 
                onClick={executeTransfer}
                disabled={getTotalDistributed() === 0 || getTotalDistributed() > getTotalAvailable()}
              >
                <ArrowRight className="w-4 h-4" />
                Перенести
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size Selector Modal */}
      {showSizeSelector.show && showSizeSelector.product && (
        <div className="fw-size-selector-modal" onClick={closeSizeSelector}>
          <div className="fw-size-selector-modal__overlay"></div>
          <div className="fw-size-selector-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="fw-size-selector-modal__close" onClick={closeSizeSelector}>
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="fw-size-selector-modal__title">Выбор размеров для переноса</h2>
            <p className="fw-size-selector-modal__subtitle">
              {showSizeSelector.product.name} ({showSizeSelector.product.article})
            </p>
            
            {/* Size Selection Grid */}
            <div className="fw-size-selector-modal__grid">
              {showSizeSelector.product.sizes
                .filter(size => size.unused > 0)
                .map((size) => (
                  <div
                    key={size.barcode}
                    className={`fw-size-option ${selectedSizes.has(size.barcode) ? 'fw-size-option--selected' : ''}`}
                    onClick={() => toggleSizeSelection(size.barcode)}
                  >
                    <div className="fw-size-option__header">
                      <span className="fw-size-option__size">{size.size}</span>
                      <div className={`fw-size-option__checkbox ${selectedSizes.has(size.barcode) ? 'fw-size-option__checkbox--checked' : ''}`}>
                        {selectedSizes.has(size.barcode) && <Check className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="fw-size-option__info">
                      <div className="fw-size-option__label">Неиспользовано:</div>
                      <div className="fw-size-option__value">{size.unused} КИЗов</div>
                    </div>
                  </div>
                ))}
            </div>
            
            {/* Summary */}
            {selectedSizes.size > 0 && (
              <div className="fw-size-selector-modal__summary">
                <div className="fw-size-selector-modal__summary-label">
                  Выбрано размеров: <strong>{selectedSizes.size}</strong>
                </div>
                <div className="fw-size-selector-modal__summary-value">
                  Всего КИЗов: <strong>
                    {showSizeSelector.product.sizes
                      .filter(s => selectedSizes.has(s.barcode))
                      .reduce((sum, s) => sum + s.unused, 0)}
                  </strong>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="fw-size-selector-modal__actions">
              <button 
                className="fw-size-selector-modal__btn fw-size-selector-modal__btn--select-all"
                onClick={selectAllSizes}
              >
                Выбрать все размеры
              </button>
              <div className="fw-size-selector-modal__actions-right">
                <button className="fw-size-selector-modal__btn fw-size-selector-modal__btn--cancel" onClick={closeSizeSelector}>
                  Отмена
                </button>
                <button 
                  className="fw-size-selector-modal__btn fw-size-selector-modal__btn--confirm" 
                  onClick={confirmSizeSelection}
                  disabled={selectedSizes.size === 0}
                >
                  Продолжить
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internal Transfer Modal (Within Same Product) */}
      {internalTransferModal.show && internalTransferModal.product && internalTransferModal.sourceSize && (
        <div className="fw-transfer-modal" onClick={closeInternalTransferModal}>
          <div className="fw-transfer-modal__overlay"></div>
          <div className="fw-transfer-modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="fw-transfer-modal__close" onClick={closeInternalTransferModal}>
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="fw-transfer-modal__title">Перенос КИЗов между размерами</h2>
            
            {/* Source Size Info */}
            <div className="fw-transfer-modal__section">
              <div className="fw-transfer-modal__label">Откуда переносим:</div>
              <div className="fw-transfer-source">
                <img src={internalTransferModal.product.image} alt="" className="fw-transfer-source__image" />
                <div className="fw-transfer-source__info">
                  <div className="fw-transfer-source__name">{internalTransferModal.product.name}</div>
                  <div className="fw-transfer-source__meta">
                    <span className="fw-transfer-source__article">{internalTransferModal.product.article}</span>
                    <span className="fw-transfer-source__size">Размер: {internalTransferModal.sourceSize.size}</span>
                  </div>
                  <div className="fw-transfer-source__available">
                    Доступно ��ля переноса: <strong>{getTotalInternalAvailable()}</strong> КИЗов
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Controls */}
            <div className="fw-transfer-modal__section">
              <div className="fw-distribution-header">
                <div className="fw-transfer-modal__label">Распределите КИЗы по другим размерам:</div>
                <button 
                  className="fw-distribute-evenly-btn"
                  onClick={handleInternalDistributeEvenly}
                >
                  Распределить равномерно
                </button>
              </div>

              <div className="fw-distribution-grid">
                {internalTransferModal.product.sizes
                  .filter(size => size.barcode !== internalTransferModal.sourceSize!.barcode)
                  .map((size) => (
                    <div key={size.barcode} className="fw-distribution-item">
                      <div className="fw-distribution-item__header">
                        <span className="fw-distribution-item__size">Размер {size.size}</span>
                        <span className="fw-distribution-item__current">Текущих: {size.unused}</span>
                      </div>
                      <input
                        type="number"
                        className="fw-distribution-item__input"
                        placeholder="0"
                        min="0"
                        max={getTotalInternalAvailable()}
                        value={internalDistribution[size.barcode] || ''}
                        onChange={(e) => updateInternalDistribution(size.barcode, e.target.value)}
                      />
                    </div>
                  ))}
              </div>

              {/* Distribution Summary */}
              <div className={`fw-distribution-summary ${getTotalInternalDistributed() > getTotalInternalAvailable() ? 'fw-distribution-summary--error' : ''}`}>
                <div className="fw-distribution-summary__row">
                  <span>Распределено:</span>
                  <strong>{getTotalInternalDistributed()} КИЗов</strong>
                </div>
                <div className="fw-distribution-summary__row">
                  <span>Осталось:</span>
                  <strong>{getTotalInternalAvailable() - getTotalInternalDistributed()} КИЗов</strong>
                </div>
                {getTotalInternalDistributed() > getTotalInternalAvailable() && (
                  <div className="fw-distribution-summary__error">
                    Превышен лимит! Уменьшите количество.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="fw-transfer-modal__actions">
              <button className="fw-transfer-modal__btn fw-transfer-modal__btn--cancel" onClick={closeInternalTransferModal}>
                Отмена
              </button>
              <button 
                className="fw-transfer-modal__btn fw-transfer-modal__btn--confirm" 
                onClick={executeInternalTransfer}
                disabled={getTotalInternalDistributed() === 0 || getTotalInternalDistributed() > getTotalInternalAvailable()}
              >
                <ArrowRight className="w-4 h-4" />
                Перенести
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Panel Sidebar */}
      {showFilterPanel && (
        <>
          {/* Overlay */}
          <div 
            className="fw-filter-overlay"
            onClick={() => setShowFilterPanel(false)}
          />
          
          {/* Sidebar */}
          <div className="fw-filter-sidebar">
            <div className="fw-filter-sidebar__header">
              <h3>Расширенные фильтры</h3>
              <button 
                className="fw-filter-sidebar__close"
                onClick={() => setShowFilterPanel(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="fw-filter-sidebar__content">
              {/* Marking Status Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Статус маркировки</label>
                <select
                  className="fw-filter-select"
                  value={advancedFilters.markingStatus}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, markingStatus: e.target.value})}
                >
                  <option value="">Все товары</option>
                  <option value="fully-marked">✅ Полностью промаркировано</option>
                  <option value="partially-marked">⚠️ Частично промаркировано</option>
                  <option value="not-marked">❌ Не промаркировано</option>
                  <option value="has-problems">🔴 Есть проблемы с КИЗами</option>
                </select>
              </div>

              {/* Stock Level Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Остатки на складе</label>
                <select
                  className="fw-filter-select"
                  value={advancedFilters.stockLevel}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, stockLevel: e.target.value})}
                >
                  <option value="">Все уровни</option>
                  <option value="critical">🔴 Критический (&lt;20 единиц)</option>
                  <option value="low">🟡 Низкий (20-50 единиц)</option>
                  <option value="normal">🟢 Нормальный (50-200 единиц)</option>
                  <option value="excess">🔵 Избыток (&gt;200 единиц)</option>
                  <option value="out-of-stock">⚪ Нет в наличии (0 единиц)</option>
                </select>
              </div>

              {/* KIZ Ratio Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Соотношение КИЗы/Товар</label>
                <select
                  className="fw-filter-select"
                  value={advancedFilters.kizRatio}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, kizRatio: e.target.value})}
                >
                  <option value="">Все товары</option>
                  <option value="enough">✅ Достаточно КИЗов</option>
                  <option value="shortage">⚠️ Не хватает КИЗов</option>
                  <option value="surplus">📦 Есть запас КИЗов</option>
                </select>
              </div>

              {/* Size Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Фильтр по размерам</label>
                <div className="fw-filter-sizes">
                  {['S', 'M', 'L', 'XL', 'XXL', '42', '44', '46', '48', '50'].map(size => (
                    <label key={size} className="fw-filter-size-checkbox">
                      <input
                        type="checkbox"
                        checked={advancedFilters.selectedSizesFilter.includes(size)}
                        onChange={(e) => {
                          const newSizes = e.target.checked
                            ? [...advancedFilters.selectedSizesFilter, size]
                            : advancedFilters.selectedSizesFilter.filter(s => s !== size);
                          setAdvancedFilters({...advancedFilters, selectedSizesFilter: newSizes});
                        }}
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity Range Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Диапазон количества</label>
                <div className="fw-filter-range">
                  <input
                    type="number"
                    placeholder="От"
                    className="fw-filter-input"
                    value={advancedFilters.quantityMin}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, quantityMin: e.target.value})}
                  />
                  <span className="fw-filter-range-separator">—</span>
                  <input
                    type="number"
                    placeholder="До"
                    className="fw-filter-input"
                    value={advancedFilters.quantityMax}
                    onChange={(e) => setAdvancedFilters({...advancedFilters, quantityMax: e.target.value})}
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div className="fw-filter-group">
                <label className="fw-filter-label">Дата последнего обновления</label>
                <select
                  className="fw-filter-select"
                  value={advancedFilters.dateFilter}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, dateFilter: e.target.value})}
                >
                  <option value="">Все даты</option>
                  <option value="today">Сегодня</option>
                  <option value="week">Последние 7 дней</option>
                  <option value="month">Последние 30 дней</option>
                </select>
              </div>
            </div>

            <div className="fw-filter-sidebar__footer">
              <button 
                className="fw-filter-sidebar__reset"
                onClick={() => setAdvancedFilters({
                  markingStatus: '',
                  stockLevel: '',
                  kizRatio: '',
                  selectedSizesFilter: [],
                  quantityMin: '',
                  quantityMax: '',
                  dateFilter: ''
                })}
              >
                Сбросить
              </button>
              <button 
                className="fw-filter-sidebar__apply"
                onClick={() => setShowFilterPanel(false)}
              >
                Применить фильтры
              </button>
            </div>
          </div>
        </>
      )}

      {/* KIZ Details View */}
      {selectedSizeForKiz && (() => {
        const { product, size } = selectedSizeForKiz;
        
        // Генерация моковых данных КИЗов
        const generateKIZ = (index: number, status: 'available' | 'used' | 'reserved' | 'rejected') => {
          const baseCode = `01046550513835${String(1000 + index).padStart(4, '0')}`;
          const maskedCode = `••••${String(1000 + index).slice(-4)}`;
          
          let usedDate = null;
          let usedBy = null;
          let wbAccepted = false;
          let comment = '';

          if (status === 'used') {
            const daysAgo = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            usedDate = date.toLocaleDateString('ru-RU');
            usedBy = ['Иван Иванов', 'Петр Петров', 'Сидорова А.'][Math.floor(Math.random() * 3)];
            wbAccepted = Math.random() > 0.3;
            comment = wbAccepted ? 'Принято WB' : 'Ожидает принятия WB';
          } else if (status === 'blocked') {
            usedDate = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU');
            comment = ['Заблокирован ФНС', 'Технические работы', 'Требуется проверка', 'Дубликат в системе'][Math.floor(Math.random() * 4)];
          } else if (status === 'withdrawn') {
            usedDate = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU');
            usedBy = ['Иван Иванов', 'Петр Петров', 'Сидорова А.'][Math.floor(Math.random() * 3)];
            wbAccepted = false;
            comment = ['Брак товара', 'Повреждена упаковка', 'Ошибка маркировки', 'Списан со склада'][Math.floor(Math.random() * 4)];
          }

          return {
            id: `kiz-${index}`,
            code: maskedCode,
            fullCode: baseCode,
            status,
            usedDate,
            usedBy,
            uploadDate: '26.02.2026',
            orderId: status === 'used' ? `ORD-${1000 + Math.floor(Math.random() * 9000)}` : null,
            wbAccepted,
            comment
          };
        };

        // Генерация данных
        const allKizRecords = [];
        const totalKiz = size.total;
        const availableCount = size.unused;
        const usedCount = size.used;
        const blockedCount = size.blocked || 0;
        const withdrawnCount = size.withdrawn || 0;

        for (let i = 0; i < availableCount; i++) {
          allKizRecords.push(generateKIZ(i, 'available'));
        }
        for (let i = availableCount; i < availableCount + usedCount; i++) {
          allKizRecords.push(generateKIZ(i, 'used'));
        }
        for (let i = availableCount + usedCount; i < availableCount + usedCount + blockedCount; i++) {
          allKizRecords.push(generateKIZ(i, 'blocked'));
        }
        for (let i = availableCount + usedCount + blockedCount; i < availableCount + usedCount + blockedCount + withdrawnCount; i++) {
          allKizRecords.push(generateKIZ(i, 'withdrawn'));
        }

        // Фильтрация
        const filteredKizRecords = allKizRecords.filter(kiz => {
          if (kizSearchQuery && !kiz.fullCode.includes(kizSearchQuery) && !kiz.code.includes(kizSearchQuery)) {
            return false;
          }
          if (kizStatusFilter !== 'all' && kiz.status !== kizStatusFilter) {
            return false;
          }
          if (kizDateFilter !== 'all' && kiz.usedDate) {
            const kizDate = new Date(kiz.usedDate.split('.').reverse().join('-'));
            const today = new Date();
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            if (kizDateFilter === 'today') {
              if (kizDate < todayStart) return false;
            } else if (kizDateFilter === 'week') {
              const weekAgo = new Date(todayStart);
              weekAgo.setDate(weekAgo.getDate() - 7);
              if (kizDate < weekAgo) return false;
            } else if (kizDateFilter === 'month') {
              const monthAgo = new Date(todayStart);
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              if (kizDate < monthAgo) return false;
            }
          }
          return true;
        });

        // Статистика
        const stats = {
          total: allKizRecords.length,
          available: allKizRecords.filter(k => k.status === 'available').length,
          used: allKizRecords.filter(k => k.status === 'used').length,
          blocked: allKizRecords.filter(k => k.status === 'blocked').length,
          withdrawn: allKizRecords.filter(k => k.status === 'withdrawn').length,
        };

        const getStatusLabel = (status: string) => {
          const labels: Record<string, string> = {
            available: 'Доступен',
            used: 'Использован',
            blocked: 'Заблокирован',
            withdrawn: 'Отозван'
          };
          return labels[status] || status;
        };

        const getStatusColor = (status: string) => {
          const colors: Record<string, { bg: string; text: string }> = {
            available: { bg: '#d1fae5', text: '#065f46' },
            used: { bg: '#dbeafe', text: '#1e40af' },
            blocked: { bg: '#fef3c7', text: '#92400e' },
            withdrawn: { bg: '#fee2e2', text: '#991b1b' }
          };
          return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
        };

        const handleRestore = (kizId: string) => {
          console.log('Restoring KIZ:', kizId);
        };

        return (
          <div 
            className="fw-kiz-modal"
            onClick={() => setSelectedSizeForKiz(null)}
          >
            <div 
              className="fw-kiz-modal__content"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: '0 0 8px 0' }}>
                  КИЗы: {product.name} • Размер {size.size}
                </h2>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Баркод:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 500, 
                        color: '#1f2937',
                        fontSize: '13px',
                        padding: '2px 6px',
                        background: '#f3f4f6',
                        borderRadius: '4px',
                        userSelect: 'all'
                      }}>
                        {size.barcode}
                      </span>
                      <button
                        onClick={() => copyToClipboard(size.barcode, `barcode-${product.id}-${size.size}`)}
                        style={{
                          padding: '4px',
                          border: 'none',
                          background: copiedField === `barcode-${product.id}-${size.size}` ? '#d1fae5' : '#f3f4f6',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'background 0.2s'
                        }}
                        title="Копировать баркод"
                      >
                        {copiedField === `barcode-${product.id}-${size.size}` ? (
                          <Check style={{ width: '14px', height: '14px', color: '#10a37f' }} />
                        ) : (
                          <Copy style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                        )}
                      </button>
                    </div>
                  </div>
                  {size.gtin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>GTIN:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ 
                          fontFamily: 'monospace', 
                          fontWeight: 500, 
                          color: '#1f2937',
                          fontSize: '13px',
                          padding: '2px 6px',
                          background: '#f3f4f6',
                          borderRadius: '4px',
                          userSelect: 'all'
                        }}>
                          {size.gtin}
                        </span>
                        <button
                          onClick={() => copyToClipboard(size.gtin!, `gtin-${product.id}-${size.size}`)}
                          style={{
                            padding: '4px',
                            border: 'none',
                            background: copiedField === `gtin-${product.id}-${size.size}` ? '#d1fae5' : '#f3f4f6',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'background 0.2s'
                          }}
                          title="Копировать GTIN"
                        >
                          {copiedField === `gtin-${product.id}-${size.size}` ? (
                            <Check style={{ width: '14px', height: '14px', color: '#10a37f' }} />
                          ) : (
                            <Copy style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    Всего КИЗов: {stats.total.toLocaleString()}
                  </p>
                  <button
                    onClick={() => setShowKizStats(!showKizStats)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      background: showKizStats ? '#f0fdf4' : '#fff',
                      color: showKizStats ? '#10a37f' : '#6b7280',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!showKizStats) e.currentTarget.style.background = '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      if (!showKizStats) e.currentTarget.style.background = '#fff';
                    }}
                  >
                    <Info style={{ width: '14px', height: '14px' }} />
                    {showKizStats ? 'Скрыть статистику' : 'Показать статистику'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedSizeForKiz(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: '#1f2937',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <X style={{ width: '16px', height: '16px' }} />
                Закрыть
              </button>
            </div>

            {/* Stats */}
            {showKizStats && (
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e5e7eb',
              background: '#fff'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px solid #d1fae5'
                }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
                    Доступно
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#10a37f', marginBottom: '4px' }}>
                    {stats.available.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
                    Готовы к печати и использованию
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px solid #dbeafe'
                }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
                    Использовано
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#3b82f6', marginBottom: '4px' }}>
                    {stats.used.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
                    Распечатаны и применены на товаре
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px solid #fef3c7'
                }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
                    Заблокировано
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#f59e0b', marginBottom: '4px' }}>
                    {stats.blocked.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
                    Нельзя использовать (ФНС, дубликат)
                  </div>
                </div>

                <div style={{
                  padding: '16px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px solid #fee2e2'
                }}>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
                    Отозвано
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#dc2626', marginBottom: '4px' }}>
                    {stats.withdrawn.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>
                    Выведены из оборота (брак, списание)
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Filters */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              background: '#fff'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  color: '#9ca3af'
                }} />
                <input
                  type="text"
                  placeholder="Поиск по коду КИЗ..."
                  value={kizSearchQuery}
                  onChange={(e) => setKizSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#10a37f'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                />
                {kizSearchQuery && (
                  <button
                    onClick={() => setKizSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#6b7280'
                    }}
                  >
                    <X style={{ width: '14px', height: '14px' }} />
                  </button>
                )}
              </div>

              <select
                value={kizStatusFilter}
                onChange={(e) => setKizStatusFilter(e.target.value as any)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '180px'
                }}
              >
                <option value="all">Все статусы</option>
                <option value="available">✓ Доступен</option>
                <option value="used">→ Использован</option>
                <option value="blocked">🔒 Заблокирован</option>
                <option value="withdrawn">✕ Отозван</option>
              </select>

              <select
                value={kizDateFilter}
                onChange={(e) => setKizDateFilter(e.target.value as any)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '160px'
                }}
              >
                <option value="all">Все даты</option>
                <option value="today">Сегодня</option>
                <option value="week">Последние 7 дней</option>
                <option value="month">Последний месяц</option>
              </select>
            </div>

            {/* Results Count */}
            {(kizSearchQuery || kizStatusFilter !== 'all' || kizDateFilter !== 'all') && (
              <div style={{
                padding: '12px 24px',
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
                fontSize: '13px',
                color: '#6b7280'
              }}>
                Найдено: <strong>{filteredKizRecords.length.toLocaleString()}</strong> из {stats.total.toLocaleString()} КИЗов
              </div>
            )}

            {/* Table */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 10 }}>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6b7280',
                      background: '#f9fafb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      КОД КИЗ
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6b7280',
                      background: '#f9fafb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      СТАТУС
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6b7280',
                      background: '#f9fafb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      ДАТА ОБНОВЛЕНИЯ
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6b7280',
                      background: '#f9fafb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      ПОЛЬЗОВАТЕЛЬ / ПРИЧИНА
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6b7280',
                      background: '#f9fafb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      ДАТА ЗАГРУЗКИ
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6b7280',
                      background: '#f9fafb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      КОММЕНТАРИЙ
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#6b7280',
                      background: '#f9fafb',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      width: '120px'
                    }}>
                      ДЕЙСТВИЯ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKizRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                        {kizSearchQuery ? `Ничего не найдено по запросу "${kizSearchQuery}"` : 'Нет данных для отображения'}
                      </td>
                    </tr>
                  ) : (
                    filteredKizRecords.map((kiz) => {
                      const statusColors = getStatusColor(kiz.status);
                      return (
                        <tr key={kiz.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{
                              fontFamily: 'monospace',
                              fontSize: '13px',
                              color: '#1f2937',
                              fontWeight: 500
                            }}>
                              {kiz.code}
                            </div>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <span style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: statusColors.bg,
                                color: statusColors.text,
                                whiteSpace: 'nowrap'
                              }}>
                                {getStatusLabel(kiz.status)}
                              </span>
                              {kiz.status === 'used' && (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '11px',
                                  color: kiz.wbAccepted ? '#10a37f' : '#f59e0b'
                                }}>
                                  {kiz.wbAccepted ? (
                                    <>
                                      <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                                      <span>WB принято</span>
                                    </>
                                  ) : (
                                    <>
                                      <Clock style={{ width: '12px', height: '12px' }} />
                                      <span>Ожидание WB</span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{
                              fontSize: '13px',
                              color: kiz.usedDate ? '#1f2937' : '#9ca3af'
                            }}>
                              {kiz.usedDate || '—'}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{
                              fontSize: '13px',
                              color: (kiz.usedBy || kiz.status === 'blocked') ? '#1f2937' : '#9ca3af',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              {kiz.status === 'blocked' ? (
                                <>
                                  <AlertCircle style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                                  {kiz.comment}
                                </>
                              ) : (
                                <>
                                  {kiz.usedBy && (
                                    <UserIcon style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                                  )}
                                  {kiz.usedBy || '—'}
                                </>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{
                              fontSize: '13px',
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <Calendar style={{ width: '14px', height: '14px' }} />
                              {kiz.uploadDate}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{
                              fontSize: '13px',
                              color: kiz.comment ? '#1f2937' : '#9ca3af'
                            }}>
                              {kiz.status === 'blocked' ? '—' : (kiz.comment || '—')}
                            </div>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            {kiz.status === 'used' && !kiz.wbAccepted && (
                              <button
                                onClick={() => handleRestore(kiz.id)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #10a37f',
                                  background: '#fff',
                                  color: '#10a37f',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#10a37f';
                                  e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#fff';
                                  e.currentTarget.style.color = '#10a37f';
                                }}
                              >
                                <RotateCcw style={{ width: '12px', height: '12px' }} />
                                Восстановить
                              </button>
                            )}
                            {(kiz.status === 'withdrawn' || kiz.status === 'blocked') && (
                              <button
                                onClick={() => handleRestore(kiz.id)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #10a37f',
                                  background: '#fff',
                                  color: '#10a37f',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#10a37f';
                                  e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#fff';
                                  e.currentTarget.style.color = '#10a37f';
                                }}
                              >
                                <RotateCcw style={{ width: '12px', height: '12px' }} />
                                Восстановить
                              </button>
                            )}
                            {(kiz.status === 'available' || kiz.status === 'reserved') && (
                              <span style={{ fontSize: '12px', color: '#9ca3af' }}>—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f9fafb'
            }}>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                Показано {filteredKizRecords.length} из {stats.total} КИЗов
              </div>
            </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default ProductsInventory;