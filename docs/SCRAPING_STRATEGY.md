# FoodNorway Scraping Strategy

## Target Supermarkets
- Rema 1000
- Kiwi
- Meny
- Coop

## Approach
- Use Python (Scrapy/BeautifulSoup) for scraping product listings and details
- Schedule regular scraping jobs to keep data up-to-date
- Implement anti-bot detection handling and respect robots.txt
- Store raw HTML and extracted data for traceability

## Data Fields Collected
- Product name and brand
- Price
- Ingredients
- Nutritional information
- Product category
- Images
- Barcode/product ID

## Anti-Bot & Rate Limiting
- Rotate user agents and IP addresses
- Implement delays and randomized intervals
- Monitor for CAPTCHAs and blocks

## Data Quality
- Validate and clean extracted data
- Deduplicate products across supermarkets
- Log scraping errors and anomalies

---
See [ARCHITECTURE.md](./ARCHITECTURE.md) and [REQUIREMENTS.md](./REQUIREMENTS.md) for more details.