let products = [];
let filteredProducts = [];

async function loadData() {
  try {
    const response = await fetch('/data/products.json');
    if (response.ok) {
      products = await response.json();
    } else {
      products = getSampleProducts();
    }
  } catch {
    products = getSampleProducts();
  }
  
  filteredProducts = [...products];
  updateSummary();
  renderProducts();
  renderAlerts();
}

function getSampleProducts() {
  return [
    {
      id: "myntra-001",
      name: "Cotton Floral Print A-Line Dress",
      url: "https://www.myntra.com/dresses/brand/cotton-floral-dress",
      platform: "Myntra",
      category: "Dresses",
      price: 1299,
      previousPrice: 2499,
      discount: 48,
      sizes: ["S", "M", "L", "XL"],
      fabric: "Cotton",
      offers: ["Extra 10% off on prepaid orders"],
      dealStatus: "great"
    },
    {
      id: "meesho-001",
      name: "Rayon Anarkali Kurti Set",
      url: "https://www.meesho.com/rayon-anarkali-kurti",
      platform: "Meesho",
      category: "Kurtas",
      price: 899,
      previousPrice: 1599,
      discount: 44,
      sizes: ["S", "M", "L"],
      fabric: "Rayon",
      offers: ["Free shipping"],
      dealStatus: "good"
    },
    {
      id: "amazon-001",
      name: "Cotton Blend Palazzo Set",
      url: "https://www.amazon.in/cotton-palazzo-set",
      platform: "Amazon",
      category: "Ethnic Wear",
      price: 1599,
      previousPrice: 2999,
      discount: 47,
      sizes: ["M", "L", "XL"],
      fabric: "Cotton Blend",
      offers: ["5% cashback on Amazon Pay"],
      dealStatus: "good"
    },
    {
      id: "myntra-002",
      name: "Georgette Printed Saree",
      url: "https://www.myntra.com/sarees/brand/georgette-saree",
      platform: "Myntra",
      category: "Sarees",
      price: 999,
      previousPrice: 1999,
      discount: 50,
      sizes: ["Free Size"],
      fabric: "Georgette",
      offers: ["Buy 2 Get 1 Free"],
      dealStatus: "great"
    },
    {
      id: "meesho-002",
      name: "Linen Straight Kurta",
      url: "https://www.meesho.com/linen-kurta",
      platform: "Meesho",
      category: "Kurtas",
      price: 649,
      previousPrice: 1299,
      discount: 50,
      sizes: ["S", "M"],
      fabric: "Linen",
      offers: ["Extra ₹100 off on first order"],
      dealStatus: "great"
    }
  ];
}

function updateSummary() {
  document.getElementById('totalProducts').textContent = products.length;
  
  const matching = products.filter(p => 
    p.price <= 5000 && 
    p.discount >= 30
  ).length;
  document.getElementById('matchingProducts').textContent = matching;
  
  const smAvailable = products.filter(p => 
    p.sizes && 
    (p.sizes.includes('S') || p.sizes.includes('M'))
  ).length;
  document.getElementById('smAvailable').textContent = smAvailable;
  
  const bestDeal = products.reduce((best, p) => 
    p.discount > (best?.discount || 0) ? p : best, null
  );
  document.getElementById('bestDeal').textContent = bestDeal ? `${bestDeal.discount}% off` : '--';
  
  document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString();
  document.getElementById('newAlerts').textContent = '0';
}

function renderProducts() {
  const container = document.getElementById('productList');
  container.innerHTML = filteredProducts.map(product => `
    <div class="product-card" data-platform="${product.platform}" data-price="${product.price}" 
         data-discount="${product.discount}" data-fabric="${product.fabric}" 
         data-sizes="${product.sizes?.join(',')}" data-status="${product.dealStatus}">
      <div class="product-header">
        <span class="product-name">${product.name}</span>
        <span class="deal-badge ${product.dealStatus}">${getDealLabel(product.dealStatus)}</span>
      </div>
      <div class="product-platform">${product.platform} • ${product.category || ''}</div>
      <div class="price-section">
        <span class="current-price">₹${product.price.toLocaleString()}</span>
        ${product.previousPrice ? `<span class="original-price">₹${product.previousPrice.toLocaleString()}</span>` : ''}
        ${product.discount ? `<span class="discount">${product.discount}% off</span>` : ''}
      </div>
      <div class="product-details">
        ${product.fabric ? `<span>📐 ${product.fabric}</span>` : ''}
        ${product.sizes ? `<span>📏 Sizes: ${product.sizes.join(', ')}</span>` : ''}
        ${product.offers?.length ? `<span>🎁 ${product.offers[0]}</span>` : ''}
      </div>
      <a href="${product.url}" target="_blank" class="product-link">View Deal →</a>
    </div>
  `).join('');
}

function getDealLabel(status) {
  const labels = {
    great: '🔥 Great Deal',
    good: '🟢 Good',
    watch: '🟡 Watch',
    new: '🔵 New',
    unavailable: '⚪ N/A'
  };
  return labels[status] || status;
}

function renderAlerts() {
  const container = document.getElementById('alertsList');
  container.innerHTML = `
    <div class="alert-item price">
      <strong>💰 Price Drop Alert</strong>
      <p>Cotton Floral Print A-Line Dress dropped from ₹2,499 to ₹1,299 on Myntra</p>
    </div>
    <div class="alert-item discount">
      <strong>🔥 High Discount Alert</strong>
      <p>Georgette Printed Saree now 50% off on Myntra - ₹999</p>
    </div>
    <div class="alert-item size">
      <strong>✅ Size Available</strong>
      <p>Size S now available for Linen Straight Kurta on Meesho</p>
    </div>
  `;
}

function applyFilters() {
  const platform = document.getElementById('filterPlatform').value;
  const maxPrice = parseInt(document.getElementById('filterPrice').value) || 5000;
  const minDiscount = parseInt(document.getElementById('filterDiscount').value) || 0;
  const fabric = document.getElementById('filterFabric').value;
  const size = document.getElementById('filterSize').value;
  const status = document.getElementById('filterStatus').value;

  filteredProducts = products.filter(p => {
    if (platform && p.platform !== platform) return false;
    if (p.price > maxPrice) return false;
    if (p.discount < minDiscount) return false;
    if (fabric && !p.fabric?.toLowerCase().includes(fabric.toLowerCase())) return false;
    if (size && !p.sizes?.includes(size)) return false;
    if (status && p.dealStatus !== status) return false;
    return true;
  });

  renderProducts();
}

function resetFilters() {
  document.getElementById('filterPlatform').value = '';
  document.getElementById('filterPrice').value = '5000';
  document.getElementById('filterDiscount').value = '0';
  document.getElementById('filterFabric').value = '';
  document.getElementById('filterSize').value = '';
  document.getElementById('filterStatus').value = '';
  
  filteredProducts = [...products];
  renderProducts();
}

document.addEventListener('DOMContentLoaded', loadData);
