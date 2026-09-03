export function matchesBudget(product, preferences) {
  if (!product.price || !preferences.budget) return false;
  return product.price <= preferences.budget.max;
}

export function matchesSizes(product, preferences) {
  if (!product.sizes || !preferences.sizes) return false;
  return preferences.sizes.some(size => product.sizes.includes(size));
}

export function matchesFabric(product, preferences) {
  if (!product.fabric || !preferences.fabrics) return false;
  return preferences.fabrics.some(fabric => 
    product.fabric.toLowerCase().includes(fabric.toLowerCase())
  );
}

export function matchesDiscount(product, preferences) {
  if (!product.discount || !preferences.discounts) return false;
  return product.discount >= preferences.discounts.min;
}

export function matchesCategory(product, preferences) {
  if (!product.category || !preferences.categories) return false;
  return preferences.categories.some(cat => 
    product.category.toLowerCase().includes(cat.toLowerCase())
  );
}

export function matchesPlatform(product, preferences) {
  if (!product.platform || !preferences.platforms) return false;
  return preferences.platforms.includes(product.platform);
}

export function getMatchScore(product, preferences) {
  let score = 0;
  let factors = [];

  if (matchesBudget(product, preferences)) {
    score += 20;
    factors.push('budget');
  }

  if (matchesSizes(product, preferences)) {
    score += 25;
    factors.push('sizes');
  }

  if (matchesFabric(product, preferences)) {
    score += 15;
    factors.push('fabric');
  }

  if (matchesDiscount(product, preferences)) {
    score += 25;
    factors.push('discount');
  }

  if (matchesCategory(product, preferences)) {
    score += 10;
    factors.push('category');
  }

  return { score, factors };
}

export function filterProducts(products, preferences) {
  return products.filter(product => {
    return matchesPlatform(product, preferences) &&
           matchesCategory(product, preferences);
  });
}

export function getMatchingProducts(products, preferences) {
  return products.filter(product => {
    const { score } = getMatchScore(product, preferences);
    return score >= 50;
  });
}
