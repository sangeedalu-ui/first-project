import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  matchesBudget, 
  matchesSizes, 
  matchesFabric, 
  matchesDiscount,
  getMatchScore 
} from '../src/filters/index.js';
import { 
  calculateDealScore, 
  getDealStatus 
} from '../src/deals/index.js';

const testPreferences = {
  budget: { max: 5000 },
  sizes: ['S', 'M'],
  fabrics: ['Cotton', 'Rayon'],
  discounts: { min: 30 }
};

const testProduct = {
  id: 'test-001',
  name: 'Test Dress',
  price: 1299,
  discount: 48,
  sizes: ['S', 'M', 'L'],
  fabric: 'Cotton',
  platform: 'Myntra',
  category: 'Dresses'
};

describe('Filters', () => {
  it('should match budget correctly', () => {
    assert.ok(matchesBudget(testProduct, testPreferences));
    assert.ok(!matchesBudget({ price: 6000 }, testPreferences));
  });

  it('should match sizes correctly', () => {
    assert.ok(matchesSizes(testProduct, testPreferences));
    assert.ok(!matchesSizes({ sizes: ['L', 'XL'] }, testPreferences));
  });

  it('should match fabric correctly', () => {
    assert.ok(matchesFabric(testProduct, testPreferences));
    assert.ok(!matchesFabric({ fabric: 'Polyester' }, testPreferences));
  });

  it('should match discount correctly', () => {
    assert.ok(matchesDiscount(testProduct, testPreferences));
    assert.ok(!matchesDiscount({ discount: 20 }, testPreferences));
  });
});

describe('Deal Scoring', () => {
  it('should calculate deal score', () => {
    const score = calculateDealScore(testProduct, testPreferences);
    assert.ok(score.total > 0);
    assert.ok(score.match > 0);
  });

  it('should determine deal status', () => {
    const score = calculateDealScore(testProduct, testPreferences);
    const status = getDealStatus(score);
    assert.ok(['great', 'good', 'watch', 'neutral'].includes(status));
  });
});

describe('Match Score', () => {
  it('should calculate match score with factors', () => {
    const result = getMatchScore(testProduct, testPreferences);
    assert.ok(result.score > 0);
    assert.ok(result.factors.length > 0);
  });
});
