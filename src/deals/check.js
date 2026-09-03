import { getProducts, getPreferences, saveAlerts, getAlerts } from '../storage/index.js';
import { filterProducts, getMatchingProducts } from '../filters/index.js';
import { calculateDealScore, getDealStatus, detectBetterDeal, rankProducts } from '../deals/index.js';
import { sendBatchNotifications, shouldNotify } from '../notifications/index.js';

export async function runDealCheck() {
  const products = getProducts();
  const preferences = getPreferences();
  
  if (!products.length) {
    console.log('No products to check');
    return { checked: 0, alerts: [] };
  }

  const filtered = filterProducts(products, preferences);
  const ranked = rankProducts(filtered, preferences);
  
  const newAlerts = [];
  
  for (const product of ranked) {
    const existingAlerts = getAlerts().filter(a => a.productId === product.id);
    const lastAlert = existingAlerts[existingAlerts.length - 1];
    
    if (lastAlert) {
      const tempProduct = { ...product, previousPrice: lastAlert.currentPrice };
      const alerts = detectBetterDeal(product, tempProduct);
      
      if (alerts) {
        for (const alert of alerts) {
          newAlerts.push({
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            productUrl: product.url,
            platform: product.platform,
            type: alert.type,
            message: alert.message,
            previous: alert.previous,
            current: alert.current,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    if (product.discount >= 30) {
      const hasDiscountAlert = existingAlerts.some(a => a.type === 'discount_alert');
      if (!hasDiscountAlert) {
        newAlerts.push({
          id: `${product.id}-discount-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          productUrl: product.url,
          platform: product.platform,
          type: 'discount_alert',
          message: `${product.discount}% discount available`,
          previous: null,
          current: product.discount,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  if (newAlerts.length > 0 && shouldNotify(preferences)) {
    await sendBatchNotifications(newAlerts);
    saveAlerts([...getAlerts(), ...newAlerts]);
  }

  return {
    checked: ranked.length,
    matching: getMatchingProducts(ranked, preferences).length,
    alerts: newAlerts
  };
}

export function getDealReport() {
  const products = getProducts();
  const preferences = getPreferences();
  const filtered = filterProducts(products, preferences);
  const ranked = rankProducts(filtered, preferences);
  
  return {
    total: products.length,
    filtered: filtered.length,
    matching: getMatchingProducts(ranked, preferences).length,
    products: ranked,
    bestDeal: ranked[0] || null,
    summary: {
      greatDeals: ranked.filter(p => p.dealStatus === 'great').length,
      goodDeals: ranked.filter(p => p.dealStatus === 'good').length,
      watchList: ranked.filter(p => p.dealStatus === 'watch').length
    }
  };
}
