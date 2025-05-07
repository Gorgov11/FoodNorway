# FoodNorway Health Rating Methodology

## Overview
The health rating engine evaluates supermarket products based on their ingredients and nutritional information to provide transparent, actionable health scores for consumers.

## Key Principles
- Transparency: All scoring criteria are documented and open for review.
- Evidence-based: Ratings are grounded in nutritional science and public health guidelines.
- Adaptability: The methodology can be updated as new research or regulations emerge.

## Scoring Components
1. **Nutritional Analysis**
   - Calories, sugar, salt, saturated fat, fiber, protein, etc.
   - Benchmarked against Norwegian and international dietary guidelines.
2. **Ingredient Quality**
   - Whole foods vs. processed ingredients
   - Presence of additives, preservatives, and artificial sweeteners
   - Allergen and dietary restriction detection
3. **Additives & Allergens**
   - Penalize products with high-risk additives or common allergens
   - Highlight products suitable for special diets (vegan, gluten-free, etc.)

## Calculation Process
- Parse and standardize nutritional fields
- Assign sub-scores for each component
- Aggregate into a final health score (0-100 scale)
- Provide breakdown and rationale for each score

## Example
- Product A: High fiber, low sugar, no additives → High score
- Product B: High sugar, artificial colors, contains allergens → Low score

## Future Extensions
- User-customizable scoring (e.g., for specific health conditions)
- Integration with external health databases

---
See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details and [TASKS.md](./TASKS.md) for implementation steps.