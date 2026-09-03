import { collectAllProducts } from './collectors/index.js';
import { runDealCheck, getDealReport } from './deals/check.js';

async function main() {
  console.log('=== Dress Deal Tracker ===\n');
  
  console.log('1. Collecting products...');
  const products = await collectAllProducts();
  console.log(`   Found ${products.length} products\n`);
  
  console.log('2. Running deal check...');
  const result = await runDealCheck();
  console.log(`   Checked ${result.checked} products`);
  console.log(`   Found ${result.alerts.length} new alerts\n`);
  
  console.log('3. Deal Report:');
  const report = getDealReport();
  console.log(`   Total: ${report.total}`);
  console.log(`   Matching: ${report.matching}`);
  console.log(`   Great Deals: ${report.summary.greatDeals}`);
  console.log(`   Good Deals: ${report.summary.goodDeals}`);
  
  if (report.bestDeal) {
    console.log(`\n   Best Deal: ${report.bestDeal.name}`);
    console.log(`   Price: ₹${report.bestDeal.price} (${report.bestDeal.discount}% off)`);
  }
  
  console.log('\n=== Done ===');
}

main().catch(console.error);
