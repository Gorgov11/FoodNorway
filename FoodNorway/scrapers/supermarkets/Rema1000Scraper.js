const BaseScraper = require('../base/BaseScraper');

class Rema1000Scraper extends BaseScraper {
  constructor() {
    super();
    this.baseUrl = 'https://www.rema1000.no';
    this.productUrl = 'https://www.rema1000.no/api/products';
  }

  /**
   * Scrape all products from Rema 1000
   */
  async scrapeAllProducts() {
    try {
      // Get product categories first
      const categories = await this.getCategories();
      
      // Scrape products from each category
      for (const category of categories) {
        const products = await this.scrapeCategory(category.url);
        this.saveProducts(products);
      }
      
      return this.products;
    } catch (error) {
      console.error('Error scraping Rema 1000 products:', error);
      throw error;
    }
  }

  /**
   * Get all product categories
   */
  async getCategories() {
    try {
      const response = await this.fetch(`${this.baseUrl}/api/categories`);
      return response.map(category => ({
        name: category.name,
        url: `${this.baseUrl}${category.url}`
      }));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw new Error('Failed to fetch product categories');
    }
  }

  /**
   * Scrape products from a specific category
   * @param {string} categoryUrl - URL of the category to scrape
   */
  async scrapeCategory(categoryUrl) {
    try {
      let allProducts = [];
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore) {
        const paginatedUrl = `${categoryUrl}?page=${currentPage}`;
        const response = await this.fetch(paginatedUrl);
        
        if (!response.products || response.products.length === 0) {
          hasMore = false;
        } else {
          allProducts = [...allProducts, ...this.parseRema1000Products(response.products)];
          currentPage++;
          
          // Rate limiting protection
          await new Promise(resolve => setTimeout(resolve, this.requestInterval));
        }
      }
      
      return allProducts;
    } catch (error) {
      console.error(`Failed to scrape category ${categoryUrl}:`, error);
      throw new Error(`Failed to scrape products from category ${categoryUrl}`);
    }
  }

  /**
   * Parse Rema 1000 product data
   * @param {Array} products - Raw product data from API
   */
  parseRema1000Products(products) {
    if (!products || !Array.isArray(products)) {
      throw new Error('Invalid products data: expected array');
    }
    
    return products.map(product => {
      if (!product || !product.id || !product.name) {
        console.warn('Skipping invalid product:', product);
        return null;
      }
      
      try {
        return {
          id: product.id,
          name: product.name,
          brand: product.brand || 'Unknown',
          price: this.validatePrice(product.price),
          unitPrice: this.validatePrice(product.unitPrice),
          category: product.category || 'Uncategorized',
          imageUrl: product.imageUrl || '',
          ingredients: this.standardizeIngredients(product.ingredients),
          nutritionalInfo: this.parseNutritionalInfo(product.nutritionalInfo),
          store: 'Rema 1000',
          timestamp: new Date().toISOString(),
          productUrl: product.url ? `${this.baseUrl}${product.url}` : ''
        };
      } catch (error) {
        console.warn('Failed to parse product:', product, error);
        return null;
      }
    }).filter(product => product !== null);
  }
}

module.exports = Rema1000Scraper;