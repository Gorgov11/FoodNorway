class BaseScraper {
  constructor() {
    this.requestOptions = {
      headers: {
        'User-Agent': 'FoodNorwayScraper/1.0',
        'Accept': 'application/json'
      }
    };
    this.retryCount = 3;
    this.retryDelay = 1000;
    this.requestInterval = 2000;
    this.lastRequestTime = 0;
    this.maxPages = 100; // Safety limit for pagination
    this.rateLimitRemaining = 30; // Default API rate limit
    this.rateLimitReset = 60; // Default reset time in seconds
  }

  async fetch(url) {
    // Check rate limits before making request
    if (this.rateLimitRemaining <= 0) {
      const waitTime = this.rateLimitReset * 1000;
      console.warn(`Rate limit reached. Waiting ${waitTime}ms before retrying...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.requestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.requestInterval - timeSinceLastRequest)
      );
    }
    
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        this.lastRequestTime = Date.now();
        const response = await fetch(url, this.requestOptions);
        
        // Update rate limit headers if available
        if (response.headers) {
          this.rateLimitRemaining = parseInt(response.headers.get('x-ratelimit-remaining')) || this.rateLimitRemaining;
          this.rateLimitReset = parseInt(response.headers.get('x-ratelimit-reset')) || this.rateLimitReset;
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed for ${url}:`, error);
        
        if (attempt < this.retryCount) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          this.retryDelay *= 2; // Exponential backoff
        }
      }
    }
    
    throw lastError || new Error(`Failed to fetch ${url} after ${this.retryCount} attempts`);
  }

  async scrape(url) {
    throw new Error('scrape() method must be implemented by subclass');
  }

  parseProductData(html) {
    throw new Error('parseProductData() method must be implemented by subclass');
  }

  validateProduct(product) {
    if (!product.name || !product.price) {
      throw new Error('Product must have name and price');
    }
    return product;
  }

  /**
   * Parse nutritional information from various formats
   * @param {Object|String} nutritionData - Raw nutritional data
   */
  parseNutritionalInfo(nutritionData) {
    if (!nutritionData) return {};
    
    if (typeof nutritionData === 'string') {
      try {
        return JSON.parse(nutritionData);
      } catch {
        return this.parseNutritionalString(nutritionData);
      }
    }
    
    if (typeof nutritionData === 'object') {
      return nutritionData;
    }
    
    return {};
  }

  /**
   * Parse nutritional information from string format
   * @param {String} nutritionString - Nutritional info string
   */
  parseNutritionalString(nutritionString) {
    const result = {};
    const lines = nutritionString.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const [key, value] = line.split(':').map(part => part.trim());
      if (key && value) {
        result[key] = value;
      }
    }
    
    return result;
  }

  /**
   * Standardize ingredient list format
   * @param {String|Array} ingredients - Raw ingredients data
   */
  standardizeIngredients(ingredients) {
    if (!ingredients) return '';
    
    if (Array.isArray(ingredients)) {
      return ingredients.join(', ');
    }
    
    return ingredients.toString();
  }

  /**
   * Common method to save products to storage
   * @param {Array} products - Products to save
   */
  saveProducts(products) {
    if (!this.products) this.products = [];
    this.products.push(...products);
    console.log(`Saved ${products.length} products`);
  }

  /**
   * Common method to scrape a product category
   * @param {string} categoryUrl - URL of the category to scrape
   */
  async scrapeCategory(categoryUrl) {
    try {
      const response = await this.fetch(categoryUrl);
      return response.products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category
      }));
    } catch (error) {
      console.error(`Failed to scrape category ${categoryUrl}:`, error);
      return [];
    }
  }
}

module.exports = BaseScraper;