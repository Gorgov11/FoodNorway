# FoodNorway Technical Specification

## System Architecture

### Overview
FoodNorway follows a modern three-tier architecture with clear separation between data collection, processing, and presentation layers:

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  Data Layer    |---->|  Service Layer |---->|  Presentation  |
|  (Scrapers &   |     |  (API &        |     |  Layer         |
|   Database)    |     |   Algorithms)  |     |  (Frontend)    |
|                |     |                |     |                |
+----------------+     +----------------+     +----------------+
```

### Components

#### Backend (Node.js/Express)
- RESTful API for product data access
- Authentication and authorization services
- Data processing and health rating calculation
- Caching layer for performance optimization

#### Frontend (React.js)
- Responsive single-page application
- Component-based UI architecture
- State management with Redux or Context API
- Material-UI for consistent design language

#### Database (MongoDB)
- Document-based NoSQL database
- Flexible schema for product data
- Indexing for efficient querying
- Aggregation pipeline for analytics

#### Scrapers (Puppeteer/Cheerio)
- Modular design with base scraper class
- Supermarket-specific implementations
- Scheduled execution via cron jobs
- Rate limiting and retry mechanisms

## Data Models

### Product
```json
{
  "_id": "ObjectId",
  "name": "String",
  "brand": "String",
  "description": "String",
  "barcode": "String",
  "supermarket": "String",
  "category": "String",
  "subcategory": "String",
  "price": {
    "amount": "Number",
    "currency": "String",
    "unit": "String",
    "unitPrice": "Number"
  },
  "ingredients": ["String"],
  "nutritionalInfo": {
    "calories": "Number",
    "fat": "Number",
    "saturatedFat": "Number",
    "carbohydrates": "Number",
    "sugar": "Number",
    "protein": "Number",
    "salt": "Number",
    "fiber": "Number"
  },
  "allergens": ["String"],
  "healthRating": {
    "score": "Number",
    "category": "String",
    "breakdown": {
      "nutritionalBalance": "Number",
      "additiveContent": "Number",
      "processingLevel": "Number",
      "sugarContent": "Number",
      "fatQuality": "Number"
    }
  },
  "images": ["String"],
  "url": "String",
  "lastUpdated": "Date",
  "metadata": "Object"
}
```

### Supermarket
```json
{
  "_id": "ObjectId",
  "name": "String",
  "website": "String",
  "scraper": "String",
  "active": "Boolean",
  "lastScraped": "Date",
  "productCount": "Number"
}
```

## Health Rating Algorithm

The health rating algorithm will evaluate products on a scale of 0-100 based on the following factors:

1. **Nutritional Balance (30%)**
   - Macronutrient distribution
   - Micronutrient content
   - Caloric density

2. **Additive Content (20%)**
   - Number of additives
   - Types of additives (weighted by health impact)

3. **Processing Level (20%)**
   - Degree of food processing
   - Presence of whole food ingredients

4. **Sugar Content (15%)**
   - Added sugars
   - Natural sugars
   - Sugar alternatives

5. **Fat Quality (15%)**
   - Saturated vs. unsaturated fats
   - Trans fats
   - Omega-3 content

The final score will be categorized as follows:
- 80-100: Excellent
- 60-79: Good
- 40-59: Average
- 20-39: Below Average
- 0-19: Poor

## API Endpoints

### Products
- `GET /api/products` - List products with pagination and filtering
- `GET /api/products/:id` - Get product details
- `GET /api/products/search` - Search products by name, brand, or ingredients
- `GET /api/products/category/:category` - Get products by category

### Categories
- `GET /api/categories` - List all product categories
- `GET /api/categories/:id` - Get category details

### Health Ratings
- `GET /api/health-ratings/metrics` - Get health rating metrics
- `GET /api/health-ratings/compare` - Compare health ratings of multiple products

## Security Considerations

- HTTPS for all communications
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration
- Content Security Policy
- Regular dependency updates

## Performance Optimization

- Database indexing for common queries
- Response caching
- Image optimization
- Lazy loading of content
- Code splitting for frontend
- CDN for static assets

## Testing Strategy

### Unit Testing
- Backend: Jest
- Frontend: React Testing Library

### Integration Testing
- API: Supertest
- Frontend-Backend: Cypress

### Performance Testing
- Load testing: Artillery
- Lighthouse for frontend performance

## Deployment Architecture

```
+----------------+     +----------------+     +----------------+
|                |     |                |     |                |
|  Load Balancer |---->|  Web Servers   |---->|  Database      |
|                |     |                |     |  Cluster       |
+----------------+     +----------------+     +----------------+
                              |
                              v
                       +----------------+
                       |                |
                       |  Scraper       |
                       |  Workers       |
                       |                |
                       +----------------+
```

## Monitoring and Logging

- Application logs with structured logging
- Error tracking and alerting
- Performance monitoring
- User analytics
- Uptime monitoring