import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { T } from '../../lib';

const STORES = [
  {
    id: 1, name: 'Talabat Mart', type: 'Dark Store (Platform-Owned)',
    rating: 4.4, reviews: 18400, delivery_min: 12, delivery_max: 20,
    min_order: 50, delivery_fee: '0–15 EGP', tier: 'Platform',
    branches: 35, coverage: '8 governorates',
    skus: 8000, tagline: 'Ultra-fast dark store — platform flagship',
    color: '#22D3EE',
    badges: ['T-Pro Free Delivery', 'Flash Deals Daily', 'Under 20 Min'],
    categories: [
      { name: 'Fresh Produce', items: ['Tomatoes', 'Cucumbers', 'Lemons', 'Bananas', 'Apples', 'Mangoes'], hasPromo: true, promoDepth: '30%' },
      { name: 'Dairy & Eggs', items: ['Milk (Juhayna)', 'Yogurt', 'Eggs (30-pack)', 'White Cheese', 'Butter'], hasPromo: true, promoDepth: '20%' },
      { name: 'Bakery', items: ['Aish Baladi', 'Toast Bread', 'Croissants', 'Pita Bread'], hasPromo: false },
      { name: 'Beverages', items: ['Pepsi 1.5L', 'Sprite', 'Water (Baraka)', 'Juice (Minute Maid)', 'Energy (Monster)'], hasPromo: true, promoDepth: '25%' },
      { name: 'Snacks', items: ['Chips (Lays)', 'Biscuits', 'Chocolate', 'Nuts'], hasPromo: true, promoDepth: '40%' },
      { name: 'Household', items: ['Ariel Detergent', 'Vim', 'Dettol', 'Downy', 'Fairy'], hasPromo: true, promoDepth: '50%' },
      { name: 'Personal Care', items: ['Head & Shoulders', 'Dove Soap', 'Sensodyne', 'Pampers'], hasPromo: false },
      { name: 'Baby Products', items: ['Pampers', 'Baby Wipes', 'Baby Formula', 'Baby Shampoo'], hasPromo: false },
    ],
    promotions: [
      { type: 'Flash Deal', detail: 'Daily rotating 30–50% off on 20–30 SKUs', funding: 'Platform', frequency: 'Daily' },
      { type: 'T-Pro Free Delivery', detail: 'Free delivery for T-Pro subscribers (all order sizes)', funding: 'Platform', frequency: 'Always' },
      { type: 'Household Bundle', detail: '50% off cleaning products every Tuesday', funding: 'Platform + Vendor', frequency: 'Weekly' },
      { type: 'Back-to-School', detail: '40% off stationery in September', funding: 'Platform', frequency: 'Seasonal' },
    ],
    insights: 'Platform-funded promotions dominate. Vendor co-funding is rare. Best attack surface: flash deal predictability.',
    vulnerability: 'HIGH — Over-reliant on platform subsidy. Low organic vendor loyalty.',
  },
  {
    id: 2, name: 'Spinneys Egypt', type: 'Premium Supermarket',
    rating: 4.6, reviews: 3200, delivery_min: 30, delivery_max: 60,
    min_order: 150, delivery_fee: '15–25 EGP', tier: 'Premium',
    branches: 12, coverage: 'Greater Cairo + North Coast',
    skus: 12000, tagline: 'Premium international & local produce',
    color: '#22C55E',
    badges: ['International Brands', 'T-Pro Free Delivery', 'Premium Cuts'],
    categories: [
      { name: 'Imported Goods', items: ['San Pellegrino', 'Nutella', 'Pringles', 'Ferrero Rocher', 'Kinder'], hasPromo: true, promoDepth: '15%' },
      { name: 'Fresh Meat', items: ['Beef Tenderloin', 'Lamb Chops', 'Chicken Breast', 'Turkey'], hasPromo: false },
      { name: 'Dairy & Cheese', items: ['Brie', 'Cheddar', 'Emmental', 'Greek Yogurt', 'Cream Cheese'], hasPromo: true, promoDepth: '10%' },
      { name: 'Organic Produce', items: ['Organic Tomatoes', 'Organic Spinach', 'Avocado', 'Blueberries'], hasPromo: false },
      { name: 'Bakery', items: ['Sourdough', 'Ciabatta', 'Bagels', 'Pain au Chocolat'], hasPromo: false },
      { name: 'Beverages', items: ['Perrier', 'Evian', 'Lipton Ice Tea', 'Monster', 'Starbucks Bottled'], hasPromo: true, promoDepth: '20%' },
    ],
    promotions: [
      { type: 'T-Pro Free Delivery', detail: 'Free delivery for T-Pro members, standard 150 EGP min', funding: 'Platform', frequency: 'Always' },
      { type: 'Weekend Specials', detail: '10–15% off imported goods on Fri–Sat', funding: 'Vendor', frequency: 'Weekly' },
      { type: 'Seasonal Flash', detail: 'Occasional 20% off dairy/cheese on Talabat Offers tab', funding: 'Co-funded', frequency: 'Monthly' },
    ],
    insights: 'Mainly vendor-funded promotions. Platform support limited to T-Pro delivery. Premium customers are price-inelastic — promotions drive trial, not retention.',
    vulnerability: 'LOW — Strong brand loyalty. Difficult to displace without equal premium positioning.',
  },
  {
    id: 3, name: 'The Mart', type: 'Mid-Range Supermarket',
    rating: 4.2, reviews: 5800, delivery_min: 25, delivery_max: 45,
    min_order: 100, delivery_fee: '10–20 EGP', tier: 'Mid-Range',
    branches: 18, coverage: 'Cairo + Giza',
    skus: 5000, tagline: 'Everyday grocery at competitive prices',
    color: '#F9A825',
    badges: ['Competitive Pricing', 'Weekly Deals', 'Flash Sales'],
    categories: [
      { name: 'Staples', items: ['Rice (El-Doha)', 'Pasta', 'Oil (Afia)', 'Sugar', 'Salt', 'Flour'], hasPromo: true, promoDepth: '25%' },
      { name: 'Canned Goods', items: ['Tuna (Al-Alali)', 'Tomato Paste', 'Beans', 'Chickpeas', 'Sardines'], hasPromo: true, promoDepth: '30%' },
      { name: 'Frozen Food', items: ['Frozen Chicken', 'Frozen Vegetables', 'Ice Cream (Domty)', 'Frozen Pizza'], hasPromo: true, promoDepth: '20%' },
      { name: 'Beverages', items: ['Pepsi', 'Mirinda', '7UP', 'Nestle Water', 'Juice'], hasPromo: false },
      { name: 'Household', items: ['Ariel', 'Persil', 'Clorox', 'Mr. Clean', 'Mortein'], hasPromo: true, promoDepth: '35%' },
    ],
    promotions: [
      { type: 'Flash Deal', detail: '20–35% off staples in Talabat Offers section', funding: 'Co-funded', frequency: 'Weekly' },
      { type: 'Weekend Bundle', detail: 'Buy 2 get 1 free on selected FMCG', funding: 'Vendor', frequency: 'Weekly' },
      { type: 'Ramadan Campaign', detail: 'Up to 40% off on Suhoor/Iftar essentials', funding: 'Platform + Vendor', frequency: 'Seasonal' },
    ],
    insights: 'Co-funded model with strong vendor participation. Mid-range customers are the most promotion-responsive segment.',
    vulnerability: 'MEDIUM — Promotional competitiveness is their main advantage. Easy to outbid.',
  },
  {
    id: 4, name: 'BIM Egypt', type: 'Budget Supermarket',
    rating: 3.9, reviews: 2100, delivery_min: 30, delivery_max: 50,
    min_order: 80, delivery_fee: '12–18 EGP', tier: 'Budget',
    branches: 300, coverage: '15+ governorates',
    skus: 600, tagline: 'Turkish-owned ALDI-style value supermarket',
    color: '#EF4444',
    badges: ['Lowest Prices', 'Own-Brand Products', 'No-Frills'],
    categories: [
      { name: 'Own-Brand Staples', items: ['BIM Rice', 'BIM Pasta', 'BIM Oil', 'BIM Sugar'], hasPromo: false },
      { name: 'Dairy', items: ['BIM Milk', 'BIM Yogurt', 'BIM Cheese'], hasPromo: false },
      { name: 'Frozen', items: ['Frozen Patties', 'Frozen Burgers', 'Frozen Vegetables'], hasPromo: true, promoDepth: '15%' },
      { name: 'Snacks', items: ['BIM Chips', 'BIM Biscuits', 'BIM Chocolate'], hasPromo: false },
      { name: 'Household', items: ['BIM Detergent', 'BIM Dish Soap'], hasPromo: false },
    ],
    promotions: [
      { type: 'Everyday Low Price', detail: 'No platform promotions — price-led strategy only', funding: 'Vendor (Price)', frequency: 'Always' },
      { type: 'Seasonal EDLP', detail: 'Marginal seasonal discounts (5–10%)', funding: 'Vendor', frequency: 'Seasonal' },
    ],
    insights: 'Almost no platform-funded promotions. Price is the product. Very difficult to out-promote — must compete on price or speed.',
    vulnerability: 'LOW on price, HIGH on delivery experience (app UX rated poorly).',
  },
  {
    id: 5, name: 'Beit El Gomla', type: 'Wholesale / Bulk Grocery',
    rating: 4.1, reviews: 890, delivery_min: 45, delivery_max: 90,
    min_order: 300, delivery_fee: '0 EGP (free above min)', tier: 'Wholesale',
    branches: 8, coverage: 'Greater Cairo',
    skus: 2000, tagline: 'Bulk wholesale delivered to your door',
    color: '#A855F7',
    badges: ['Bulk Pricing', 'Free Delivery 300+ EGP', 'B2B & Consumer'],
    categories: [
      { name: 'Bulk Dry Goods', items: ['Rice 10kg', 'Pasta 5kg', 'Lentils 5kg', 'Flour 10kg'], hasPromo: true, promoDepth: '20%' },
      { name: 'FMCG Bulk Packs', items: ['Pepsi 24-pack', 'Water 12-pack', 'Juice 12-pack'], hasPromo: true, promoDepth: '25%' },
      { name: 'Cleaning Bulk', items: ['Ariel 5kg', 'Clorox 4L', 'Dettol 1L × 6'], hasPromo: true, promoDepth: '30%' },
      { name: 'Cooking Essentials', items: ['Oil 5L', 'Sugar 10kg', 'Salt 5kg'], hasPromo: false },
    ],
    promotions: [
      { type: 'Volume Discount', detail: '20–30% off when buying 3+ units of same SKU', funding: 'Vendor', frequency: 'Always' },
      { type: 'Free Delivery', detail: 'Free delivery on all orders above 300 EGP min', funding: 'Vendor', frequency: 'Always' },
    ],
    insights: 'Bulk + wholesale model — unique positioning not covered by Talabat Mart. Appeals to families and small business owners.',
    vulnerability: 'MEDIUM — Niche but growing. Minimum order barrier excludes casual buyers.',
  },
  {
    id: 6, name: 'Gourmet Egypt', type: 'Premium Imported Goods',
    rating: 4.4, reviews: 1650, delivery_min: 30, delivery_max: 55,
    min_order: 200, delivery_fee: '20 EGP', tier: 'Premium',
    branches: 6, coverage: 'Zamalek, Maadi, New Cairo, Fifth Settlement',
    skus: 3000, tagline: 'Curated international grocery for discerning shoppers',
    color: '#F9A825',
    badges: ['International Brands', 'Premium Cuts', 'Specialty Items'],
    categories: [
      { name: 'International Brands', items: ['San Pellegrino', 'Evian', 'Perrier', 'Fiji Water', 'Pellicle'], hasPromo: true, promoDepth: '15%' },
      { name: 'Specialty Cheese', items: ['Brie de Meaux', 'Gruyère', 'Parmesan', 'Gouda', 'Camembert'], hasPromo: false },
      { name: 'Deli & Charcuterie', items: ['Prosciutto', 'Salami', 'Smoked Salmon', 'Paté'], hasPromo: false },
      { name: 'Organic & Health', items: ['Quinoa', 'Chia Seeds', 'Coconut Oil', 'Almond Milk', 'Gluten-Free Pasta'], hasPromo: true, promoDepth: '20%' },
      { name: 'Confectionery', items: ['Godiva', 'Lindt', 'Ferrero Rocher', 'Macarons', 'Belgian Waffles'], hasPromo: true, promoDepth: '10%' },
    ],
    promotions: [
      { type: 'Seasonal Discount', detail: '10–20% off imported goods during holidays (Xmas, EID)', funding: 'Vendor', frequency: 'Seasonal' },
      { type: 'Platform Flash', detail: 'Occasional 15% off on Talabat Offers tab', funding: 'Platform', frequency: 'Monthly' },
    ],
    insights: 'Niche premium segment. Very low promotion depth — brand prestige strategy. Talabat has only 6 active premium grocery partners — massive gap.',
    vulnerability: 'LOW — Premium segment under-served but high barrier to entry.',
  },
  {
    id: 7, name: 'Metro Market', type: 'Mid-Premium Supermarket',
    rating: 4.3, reviews: 4100, delivery_min: 25, delivery_max: 50,
    min_order: 120, delivery_fee: '15 EGP', tier: 'Mid-Range',
    branches: 22, coverage: 'Cairo + Giza + Alexandria',
    skus: 7000, tagline: 'Wide range — known for fresh bakery & international brands',
    color: '#3B82F6',
    badges: ['Fresh Bakery', 'International Aisle', 'Loyalty Card'],
    categories: [
      { name: 'Fresh Bakery', items: ['Sourdough', 'Baguette', 'Croissant', 'Danish', 'Muffins'], hasPromo: false },
      { name: 'International Aisle', items: ['Heinz Ketchup', 'Hellman\'s Mayo', 'Marmite', 'Kraft Mac & Cheese'], hasPromo: true, promoDepth: '20%' },
      { name: 'Fresh Produce', items: ['Strawberries', 'Raspberries', 'Avocado', 'Baby Spinach', 'Cherry Tomatoes'], hasPromo: false },
      { name: 'Meat & Poultry', items: ['Chicken Breast (El-Watanya)', 'Beef Mince', 'Lamb Rack', 'Turkey Breast'], hasPromo: true, promoDepth: '25%' },
      { name: 'Dairy', items: ['Full-fat Milk', 'Semi-skimmed Milk', 'Labneh', 'Yogurt', 'Feta'], hasPromo: false },
      { name: 'Frozen', items: ['McCain Fries', 'Birds Eye Vegetables', 'Domino\'s Frozen Pizza'], hasPromo: true, promoDepth: '30%' },
    ],
    promotions: [
      { type: 'Metro Card Discount', detail: '5% off all purchases for Metro loyalty card holders (not Talabat-integrated)', funding: 'Vendor', frequency: 'Always' },
      { type: 'Weekend Flash', detail: '25% off meat & poultry every Thursday–Friday', funding: 'Co-funded', frequency: 'Weekly' },
      { type: 'Buy 2 Get 1', detail: 'On selected international brands', funding: 'Vendor', frequency: 'Monthly' },
      { type: 'Ramadan Special', detail: 'Up to 35% off on Suhoor packs', funding: 'Vendor + Platform', frequency: 'Seasonal' },
    ],
    insights: 'Strong loyalty program (Metro Card) not integrated with Talabat — a missed cross-platform loyalty opportunity. Meat deals drive highest order frequency.',
    vulnerability: 'MEDIUM — Loyalty not digital-native. Competitor can offer digital loyalty integration advantage.',
  },
  {
    id: 8, name: 'Seoudi Supermarket', type: 'Local Egyptian Chain',
    rating: 4.0, reviews: 2900, delivery_min: 20, delivery_max: 40,
    min_order: 80, delivery_fee: '10 EGP', tier: 'Local',
    branches: 45, coverage: 'Nasr City, Heliopolis, Sheraton, Masr El Gedida',
    skus: 4000, tagline: 'Trusted local chain — Egyptian products focus',
    color: '#22C55E',
    badges: ['Local Products', 'Halal Certified', 'Competitive Pricing'],
    categories: [
      { name: 'Egyptian Staples', items: ['Baladi Bread', 'Ful (Fava Beans)', 'Tamarind', 'Molasses', 'Tahini'], hasPromo: false },
      { name: 'Halal Meat', items: ['Beef', 'Lamb', 'Chicken (Koki)', 'Veal', 'Rabbit'], hasPromo: true, promoDepth: '20%' },
      { name: 'Fresh Produce', items: ['Cauliflower', 'Eggplant', 'Okra', 'Zucchini', 'Tomatoes'], hasPromo: false },
      { name: 'Dairy (Local)', items: ['Kariesh Cheese', 'Gibna Beda', 'Ayran', 'Labneh', 'Ghee'], hasPromo: true, promoDepth: '15%' },
      { name: 'Egyptian Beverages', items: ['Karkade (Hibiscus)', 'Tamarind Drink', 'Asir Oranges', 'Ayran'], hasPromo: false },
    ],
    promotions: [
      { type: 'Ramadan Bundle', detail: '20% off Suhoor/Iftar staples + free delivery during Ramadan', funding: 'Vendor', frequency: 'Seasonal' },
      { type: 'Meat Weekend Deal', detail: '20% off on fresh halal meat every Friday', funding: 'Vendor', frequency: 'Weekly' },
      { type: 'Flash Deal', detail: 'Occasional 15–25% off on Talabat Offers', funding: 'Platform', frequency: 'Monthly' },
    ],
    insights: 'Strong cultural fit for Egyptian consumers. Authentic local product range that Talabat Mart cannot replicate at the same quality level.',
    vulnerability: 'MEDIUM — App UX is their weak point. Digital experience significantly below Talabat Mart standard.',
  },
  {
    id: 9, name: 'Abu Auf', type: 'Specialty Health & Organic',
    rating: 4.5, reviews: 6700, delivery_min: 20, delivery_max: 35,
    min_order: 100, delivery_fee: '12 EGP', tier: 'Specialty',
    branches: 55, coverage: 'Cairo + Alexandria + Mansoura',
    skus: 1500, tagline: 'Egypt\'s leading nuts, seeds, and health food retailer',
    color: '#EF5F17',
    badges: ['Premium Nuts', 'Organic', 'Health Foods', 'Ramadan Star'],
    categories: [
      { name: 'Nuts & Seeds', items: ['Almonds', 'Cashews', 'Pistachios', 'Walnuts', 'Sunflower Seeds', 'Pumpkin Seeds'], hasPromo: true, promoDepth: '20%' },
      { name: 'Dried Fruits', items: ['Dates (Medjool)', 'Apricots', 'Raisins', 'Figs', 'Cranberries'], hasPromo: true, promoDepth: '25%' },
      { name: 'Organic Health', items: ['Chia Seeds', 'Flaxseed', 'Quinoa', 'Spirulina', 'Protein Powder'], hasPromo: false },
      { name: 'Specialty Teas', items: ['Green Tea', 'Chamomile', 'Peppermint', 'Hibiscus', 'Turmeric Tea'], hasPromo: false },
      { name: 'Egyptian Honey', items: ['Sidr Honey', 'Clover Honey', 'Thyme Honey', 'Natural Bee Honey'], hasPromo: true, promoDepth: '15%' },
      { name: 'Gift Packs', items: ['Ramadan Nut Box', 'Date Gift Box', 'Mixed Nuts Premium', 'EID Gift Box'], hasPromo: true, promoDepth: '20%' },
    ],
    promotions: [
      { type: 'Ramadan Flash', detail: '20–30% off dates and gift packs during Ramadan — biggest revenue month', funding: 'Vendor', frequency: 'Seasonal' },
      { type: 'EID Gift Promo', detail: '15% off gift boxes + free wrapping', funding: 'Vendor', frequency: 'Seasonal' },
      { type: 'Buy More Save More', detail: '10% off 200+ EGP, 15% off 300+ EGP, 20% off 500+ EGP', funding: 'Vendor', frequency: 'Always' },
      { type: 'Flash Deal', detail: '25% off nuts on Talabat Offers tab (monthly)', funding: 'Platform', frequency: 'Monthly' },
    ],
    insights: 'Category leader with no real competitor on Talabat. Ramadan is their super-peak (3× normal revenue). Gift pack segment is uniquely high-margin.',
    vulnerability: 'LOW — Category monopoly. Attack vector: same-category exclusive partnership offer.',
  },
  {
    id: 10, name: 'Carrefour Egypt', type: 'Hypermarket',
    rating: 4.1, reviews: 8900, delivery_min: 40, delivery_max: 75,
    min_order: 200, delivery_fee: '25 EGP', tier: 'Hypermarket',
    branches: 47, coverage: '12 governorates (mall-based)',
    skus: 50000, tagline: 'Everything under one roof — food, electronics, clothing',
    color: '#1E88E5',
    badges: ['Widest SKU Range', 'Carrefour App', 'Mall Pickup Available'],
    categories: [
      { name: 'Grocery Staples', items: ['Rice', 'Pasta', 'Oil', 'Sugar', 'Flour', 'Salt'], hasPromo: true, promoDepth: '30%' },
      { name: 'Fresh & Chilled', items: ['Chicken', 'Beef', 'Fish', 'Deli Meats', 'Cheese'], hasPromo: true, promoDepth: '20%' },
      { name: 'Household', items: ['Detergent', 'Cleaning Products', 'Kitchen Tools', 'Storage'], hasPromo: true, promoDepth: '40%' },
      { name: 'Personal Care', items: ['Shampoo', 'Conditioner', 'Deodorant', 'Toothpaste', 'Skincare'], hasPromo: true, promoDepth: '25%' },
      { name: 'Baby & Kids', items: ['Pampers', 'Baby Formula', 'Baby Food', 'Toys', 'School Supplies'], hasPromo: true, promoDepth: '35%' },
      { name: 'Electronics', items: ['USB Cables', 'Chargers', 'Earphones', 'Power Banks'], hasPromo: true, promoDepth: '20%' },
    ],
    promotions: [
      { type: 'Carrefour Weekly Offer', detail: '30–40% off rotating product categories every Monday', funding: 'Vendor', frequency: 'Weekly' },
      { type: 'Platform Campaign', detail: 'Co-branded promotions during Back-to-School (Sep)', funding: 'Co-funded', frequency: 'Seasonal' },
      { type: 'Household Flash', detail: '40% off cleaning products 2× per month', funding: 'Co-funded', frequency: 'Bi-monthly' },
      { type: 'Baby Mega Deal', detail: '35% off Pampers + Baby Formula during EID', funding: 'Vendor', frequency: 'Seasonal' },
    ],
    insights: 'Largest SKU count but delivery time is the weakness (40–75 min). Carrefour also has its own app competing with Talabat for grocery orders.',
    vulnerability: 'MEDIUM — Split loyalty between Carrefour app and Talabat. Delivery speed is the attack vector.',
  },
  {
    id: 11, name: 'El Jocker Store', type: 'Neighborhood Convenience',
    rating: 4.0, reviews: 1200, delivery_min: 15, delivery_max: 25,
    min_order: 40, delivery_fee: '8 EGP', tier: 'Convenience',
    branches: 12, coverage: 'Maadi, Zamalek, Garden City',
    skus: 800, tagline: 'Fast neighborhood convenience — expats & premium residential',
    color: '#14B8A6',
    badges: ['Lowest Min Order', 'Fast Delivery', 'Convenience Staples'],
    categories: [
      { name: 'Beverages', items: ['Soft Drinks', 'Water', 'Juices', 'Energy Drinks', 'Beer (Non-Alcoholic)'], hasPromo: false },
      { name: 'Snacks', items: ['Chips', 'Chocolate', 'Biscuits', 'Gum', 'Candy'], hasPromo: false },
      { name: 'Household Basics', items: ['Tissue', 'Toilet Paper', 'Garbage Bags', 'Cling Film'], hasPromo: false },
      { name: 'Dairy', items: ['Milk', 'Juice', 'Yogurt', 'Cheese Singles'], hasPromo: false },
    ],
    promotions: [
      { type: 'No Promotions', detail: 'Convenience premium model — no discounts needed', funding: 'N/A', frequency: 'Never' },
    ],
    insights: 'Pure convenience play. Low volume but high margin per order. Serves expat community and premium residential areas.',
    vulnerability: 'LOW — Niche audience. Attack via broader neighborhood coverage in similar demographics.',
  },
  {
    id: 12, name: 'Fathalla Market', type: 'Regional Supermarket',
    rating: 4.2, reviews: 1450, delivery_min: 25, delivery_max: 45,
    min_order: 100, delivery_fee: '12 EGP', tier: 'Regional',
    branches: 20, coverage: 'Alexandria + Delta governorates',
    skus: 6000, tagline: 'Alexandria\'s most trusted supermarket chain',
    color: '#6366F1',
    badges: ['Alexandria Leader', 'Local Brands', 'Fresh Seafood'],
    categories: [
      { name: 'Fresh Seafood', items: ['Sea Bass', 'Shrimp', 'Calamari', 'Crab', 'Mullet'], hasPromo: true, promoDepth: '20%' },
      { name: 'Egyptian Local Brands', items: ['Juhayna', 'Vita', 'Domty', 'El Maleka', 'Halawa'], hasPromo: true, promoDepth: '25%' },
      { name: 'Fresh Produce', items: ['Local Vegetables', 'Fruits', 'Herbs', 'Fresh Figs'], hasPromo: false },
      { name: 'Bakery', items: ['Alexandrian Bread', 'Semit', 'Kak', 'Ka\'ak'], hasPromo: false },
      { name: 'Dairy', items: ['Local Cheese', 'Gibna Rumi', 'Labneh', 'Milk'], hasPromo: false },
    ],
    promotions: [
      { type: 'Seafood Friday Deal', detail: '20% off fresh seafood every Friday', funding: 'Vendor', frequency: 'Weekly' },
      { type: 'Alexandria Summer', detail: 'Seasonal seafood + drinks promotions during summer peak', funding: 'Vendor', frequency: 'Seasonal' },
      { type: 'Local Brand Flash', detail: '25% off Egyptian local brands on Talabat Offers', funding: 'Platform', frequency: 'Monthly' },
    ],
    insights: 'Dominant in Alexandria — underrepresented in national intelligence. Fresh seafood is their #1 differentiator. Critical for any competitor entering Alexandria market.',
    vulnerability: 'MEDIUM — Geographic dependency. Weak in Cairo market. Opportunity: expand seafood delivery to Cairo.',
  },
];

const TIER_COLORS = {
  'Platform': '#22D3EE',
  'Premium': '#F9A825',
  'Mid-Range': '#1E88E5',
  'Budget': '#EF4444',
  'Wholesale': '#A855F7',
  'Specialty': '#EF5F17',
  'Hypermarket': '#1E88E5',
  'Convenience': '#14B8A6',
  'Local': '#22C55E',
  'Regional': '#6366F1',
};

const VULN_COLORS = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#22C55E' };

const Card = ({ children, style }) => (
  <div style={{
    background: '#111111',
    border: '1px solid #1E1E1E',
    borderRadius: 14,
    padding: '1.25rem',
    ...style,
  }}>{children}</div>
);

function StoreCard({ store, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(store)}
      style={{
        background: isSelected ? '#141414' : '#111111',
        border: `1px solid ${isSelected ? store.color : '#1E1E1E'}`,
        borderRadius: 14,
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: store.color,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#F5F5F5' }}>{store.name}</div>
          <div style={{ color: '#9CA3AF', fontSize: '0.7rem', marginTop: 2 }}>{store.type}</div>
        </div>
        <div style={{
          background: TIER_COLORS[store.tier] + '22',
          border: `1px solid ${TIER_COLORS[store.tier]}`,
          color: TIER_COLORS[store.tier],
          fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
        }}>{store.tier}</div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: '0.75rem' }}>
        <span style={{ color: '#F9A825', fontWeight: 700 }}>★ {store.rating}</span>
        <span style={{ color: '#9CA3AF' }}>{store.reviews.toLocaleString()} reviews</span>
        <span style={{ color: '#22C55E' }}>{store.delivery_min}–{store.delivery_max} min</span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {store.badges.map(b => (
          <span key={b} style={{
            background: '#1E1E1E', color: '#9CA3AF', fontSize: '0.6rem',
            padding: '2px 7px', borderRadius: 10, fontWeight: 600,
          }}>{b}</span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
        <span style={{ color: '#9CA3AF' }}>Min: <strong style={{ color: '#F5F5F5' }}>{store.min_order} EGP</strong></span>
        <span style={{ color: '#9CA3AF' }}>Del: <strong style={{ color: '#F5F5F5' }}>{store.delivery_fee}</strong></span>
        <span style={{ color: '#9CA3AF' }}>SKUs: <strong style={{ color: store.color }}>{store.skus.toLocaleString()}</strong></span>
      </div>

      <div style={{
        marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ color: '#9CA3AF', fontSize: '0.65rem' }}>Vulnerability:</span>
        <span style={{
          color: VULN_COLORS[store.vulnerability?.split(' ')[0]] || '#9CA3AF',
          fontWeight: 700, fontSize: '0.65rem',
        }}>{store.vulnerability?.split(' ')[0]}</span>
      </div>
    </div>
  );
}

function StoreDetail({ store }) {
  if (!store) return (
    <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <div style={{ color: '#9CA3AF', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>🛒</div>
        <div style={{ fontSize: '0.85rem' }}>Select a store to see full intelligence</div>
      </div>
    </Card>
  );

  return (
    <Card>
      <div style={{ borderBottom: '1px solid #1E1E1E', paddingBottom: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, color: store.color, fontSize: '1.1rem', fontWeight: 800 }}>{store.name}</h3>
            <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: 2 }}>{store.tagline}</div>
          </div>
          <div style={{
            background: VULN_COLORS[store.vulnerability?.split(' ')[0]] + '22',
            border: `1px solid ${VULN_COLORS[store.vulnerability?.split(' ')[0]]}`,
            color: VULN_COLORS[store.vulnerability?.split(' ')[0]],
            padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
          }}>
            ⚠ {store.vulnerability?.split(' ')[0]} Vuln
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
          {[
            { label: 'Branches', value: store.branches },
            { label: 'Coverage', value: store.coverage },
            { label: 'SKUs', value: store.skus.toLocaleString() },
            { label: 'Min Order', value: `${store.min_order} EGP` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', background: '#0A0A0A', borderRadius: 8, padding: '8px 4px' }}>
              <div style={{ color: '#9CA3AF', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.85rem', marginTop: 2 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotions Table */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.8rem', marginBottom: 10 }}>Active Promotions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {store.promotions.map((p, i) => (
            <div key={i} style={{
              background: '#0A0A0A', borderRadius: 8, padding: '8px 12px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              border: '1px solid #1E1E1E',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: store.color, fontWeight: 700, fontSize: '0.75rem' }}>{p.type}</div>
                <div style={{ color: '#9CA3AF', fontSize: '0.7rem', marginTop: 2 }}>{p.detail}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                <div style={{
                  color: p.funding === 'Platform' ? '#22C55E' : p.funding === 'Vendor' ? '#F9A825' : '#A855F7',
                  fontSize: '0.62rem', fontWeight: 700,
                }}>{p.funding}</div>
                <div style={{ color: '#9CA3AF', fontSize: '0.6rem' }}>{p.frequency}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Categories */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.8rem', marginBottom: 10 }}>Product Categories & Sample Menu</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          {store.categories.map((cat, i) => (
            <div key={i} style={{
              background: '#0A0A0A', border: `1px solid ${cat.hasPromo ? store.color + '44' : '#1E1E1E'}`,
              borderRadius: 8, padding: '8px 10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.72rem' }}>{cat.name}</span>
                {cat.hasPromo && (
                  <span style={{
                    background: '#22C55E22', color: '#22C55E',
                    fontSize: '0.58rem', fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                  }}>🏷 {cat.promoDepth} off</span>
                )}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.65rem', lineHeight: 1.4 }}>
                {cat.items.slice(0, 4).join(' · ')}
                {cat.items.length > 4 && ` +${cat.items.length - 4} more`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Insight */}
      <div style={{
        background: '#0A0A0A', borderLeft: `3px solid ${store.color}`,
        borderRadius: '0 8px 8px 0', padding: '10px 14px',
      }}>
        <div style={{ color: '#9CA3AF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Strategic Insight</div>
        <div style={{ color: '#F5F5F5', fontSize: '0.75rem', lineHeight: 1.5 }}>{store.insights}</div>
      </div>
    </Card>
  );
}

function PromoBarChart({ stores }) {
  const data = stores.map(s => ({
    name: s.name.replace(' Egypt', '').replace(' Market', '').replace(' Supermarket', ''),
    promoCount: s.promotions.filter(p => p.type !== 'No Promotions').length,
    platformFunded: s.promotions.filter(p => p.funding === 'Platform' || p.funding === 'Co-funded' || p.funding === 'Platform + Vendor' || p.funding === 'Vendor + Platform').length,
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#111111', borderColor: '#1E1E1E', textStyle: { color: '#F5F5F5', fontSize: 11 } },
    legend: { data: ['Total Promos', 'Platform-Funded'], textStyle: { color: '#9CA3AF', fontSize: 10 }, top: 0 },
    grid: { top: 36, right: 16, bottom: 60, left: 16, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLabel: { color: '#9CA3AF', fontSize: 9, rotate: 20 },
      axisLine: { lineStyle: { color: '#1E1E1E' } },
      axisTick: { show: false },
    },
    yAxis: { type: 'value', axisLabel: { color: '#9CA3AF', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E1E1E', type: 'dashed' } }, axisLine: { show: false } },
    series: [
      {
        name: 'Total Promos', type: 'bar', data: data.map(d => d.promoCount),
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#1E88E5' }, barMaxWidth: 28,
      },
      {
        name: 'Platform-Funded', type: 'bar', data: data.map(d => d.platformFunded),
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#22C55E' }, barMaxWidth: 28,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 260, width: '100%' }} />;
}

export default function GroceryTab() {
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const TIERS = ['all', ...new Set(STORES.map(s => s.tier))];

  const filtered = useMemo(() => STORES.filter(s => {
    if (filter !== 'all' && s.tier !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filter, search]);

  const totalStores = STORES.length;
  const withPromos = STORES.filter(s => s.promotions.some(p => p.type !== 'No Promotions')).length;
  const platformFunded = STORES.filter(s => s.promotions.some(p => p.funding?.includes('Platform'))).length;
  const avgRating = (STORES.reduce((a, s) => a + s.rating, 0) / STORES.length).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Grocery Stores Mapped', value: totalStores, color: '#22D3EE', icon: '🛒' },
          { label: 'Stores With Active Promos', value: `${withPromos}/${totalStores}`, color: '#22C55E', icon: '🏷' },
          { label: 'Platform-Funded Promos', value: platformFunded, color: '#1E88E5', icon: '💳' },
          { label: 'Avg Grocery Rating', value: avgRating + '★', color: '#F9A825', icon: '⭐' },
        ].map(k => (
          <div key={k.label} style={{ background: '#111111', border: `1px solid #1E1E1E`, borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{k.icon}</div>
            <div style={{ color: '#9CA3AF', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{k.label}</div>
            <div style={{ color: k.color, fontWeight: 900, fontSize: '1.4rem' }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Promo count chart */}
      <Card>
        <div style={{ color: '#F5F5F5', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>Promotion Count per Store</div>
        <div style={{ color: '#9CA3AF', fontSize: '0.72rem', marginBottom: 12 }}>Total active promotions vs platform-funded promotions per grocery partner</div>
        <PromoBarChart stores={STORES} />
      </Card>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          placeholder="Search stores..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: '#111111', border: '1px solid #1E1E1E', color: '#F5F5F5',
            padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem', outline: 'none', width: 200,
          }}
        />
        {TIERS.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? '#1E88E5' : 'transparent',
            border: `1px solid ${filter === t ? '#1E88E5' : '#1E1E1E'}`,
            color: filter === t ? '#fff' : '#9CA3AF',
            padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
          }}>
            {t === 'all' ? 'All Tiers' : t}
          </button>
        ))}
        <span style={{ color: '#9CA3AF', fontSize: '0.72rem', marginLeft: 'auto' }}>
          Showing {filtered.length} of {totalStores} stores
        </span>
      </div>

      {/* Main Grid: Store Cards + Detail Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: store cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '80vh', overflowY: 'auto', paddingRight: 4 }}>
          {filtered.map(s => (
            <StoreCard key={s.id} store={s} onSelect={setSelectedStore} isSelected={selectedStore?.id === s.id} />
          ))}
        </div>

        {/* Right: selected store detail */}
        <div style={{ position: 'sticky', top: 0 }}>
          <StoreDetail store={selectedStore} />
        </div>
      </div>
    </div>
  );
}
