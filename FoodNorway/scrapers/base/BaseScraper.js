// Base scraper module with common functionality
class BaseScraper {
  constructor() {
    this.config = {
      rateLimit: 2000, // Increased delay between requests to avoid rate limiting
      maxRetries: 5,  // Increased retry attempts for failed requests
      timeout: 30000,  // Request timeout in ms
      userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Mozilla/5.0 (X11; Linux x86_64)'
      ],
      proxyList: [],
      rotateUserAgent: true,
      randomDelay: true
    };
    this.products = [];
  }

  /**
   * Common request method with retry logic
   * @param {string} url - URL to scrape
   * @returns {Promise<Object>} - Response data
   */
  async request(url) {
    let retries = 0;
    
    while (retries < this.config.maxRetries) {
      try {
        // Add random delay if enabled
        if (this.config.randomDelay) {
          const delay = this.config.rateLimit + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // Rotate user agent if enabled
        const headers = {};
        if (this.config.rotateUserAgent && this.config.userAgents.length > 0) {
          const randomAgent = this.config.userAgents[
            Math.floor(Math.random() * this.config.userAgents.length)
          ];
          headers['User-Agent'] = randomAgent;
        }
        
        // Add proxy support if configured
        const options = {
          headers,
          timeout: this.config.timeout
        };
        
        const response = await fetch(url, options);
        
        // Check for anti-bot responses
        if (response.status === 429 || response.status === 403) {
          throw new Error(`Anti-bot protection triggered (HTTP ${response.status})`);
        }
        
        return await response.json();
        
      } catch (error) {
        retries++;
        if (retries >= this.config.maxRetries) {
          throw new Error(`Request failed after ${retries} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        const delay = this.config.rateLimit * Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Parse product data from response
   * @param {Object} data - Raw response data
   * @returns {Array} - Array of parsed products
   */
  parseProducts(data) {
    // Implement common parsing logic here
    // Should handle:
    // - Product name
    // - Price
    // - Basic attributes
    
    // Mock implementation
    return data.products.map(product => ({
      name: product.name,
      price: product.price,
      id: product.id
    }));
  }

  /**
   * Save products to storage
   * @param {Array} products - Products to save
   */
  saveProducts(products) {
    // Implement common storage logic
    this.products = [...this.products, ...products];
    
    // Save to file system as JSON
    const fs = require('fs');
    const path = require('path');
    
    try {
      const dataDir = path.join(__dirname, '../../data/raw');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `products_${timestamp}.json`;
      const filePath = path.join(dataDir, filename);
      
      fs.writeFileSync(
        filePath,
        JSON.stringify(this.products, null, 2),
        'utf8'
      );
    } catch (error) {
      console.error('Failed to save products:', error);
    }
  }
}

module.exports = BaseScraper;