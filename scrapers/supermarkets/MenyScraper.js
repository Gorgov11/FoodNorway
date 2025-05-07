const BaseScraper = require('../base/BaseScraper');

class MenyScraper extends BaseScraper {
  constructor() {
    super();
    this.baseUrl = 'https://www.meny.no';
    this.productUrl = 'https://www.meny.no/api/products';
  }

  /**
   * Scrape all products from Meny
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
      console.error('Error scraping Meny products:', error);
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
    // TODO: Implement category-specific scraping logic
    // This should include pagination handling if needed
    return [];
  }
}

module.exports = MenyScraper;