import productsDemo from './products-demo.json';

// Convert demo data to ProductsInventory format
export const convertToInventoryFormat = () => {
  return productsDemo.products.map(product => {
    const totalCodes = product.sizes.reduce((sum, size) => sum + size.kiz.available + size.kiz.assigned + size.kiz.used, 0);
    const unusedCodes = product.sizes.reduce((sum, size) => sum + size.kiz.available, 0);
    const usedCodes = product.sizes.reduce((sum, size) => sum + size.kiz.used, 0);

    return {
      id: product.id,
      name: product.name,
      article: product.wbArticle,
      vendorArticle: product.vendorArticle,
      color: product.color,
      colorHex: '#000000', // Default color, можно расширить в будущем
      image: product.image,
      brand: product.brand,
      category: product.category,
      composition: product.composition,
      needsMarking: product.needsMarking,
      tags: product.tags,
      totalCodes,
      usedCodes,
      unusedCodes,
      sizes: product.sizes.map(size => ({
        size: size.size,
        rusSize: size.rusSize,
        barcode: size.barcode,
        total: size.kiz.available + size.kiz.assigned + size.kiz.used,
        used: size.kiz.used,
        unused: size.kiz.available,
        assigned: size.kiz.assigned,
        stock: size.kiz.available + size.kiz.assigned // Approximate stock
      })),
      kizStats: product.kizStats,
      recentActivity: product.recentActivity
    };
  });
};

export const inventoryProducts = convertToInventoryFormat();
