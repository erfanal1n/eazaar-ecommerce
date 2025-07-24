const ProductType = require('../model/ProductType');

const productTypesData = [
  {
    name: "Electronics",
    description: "Electronic devices and gadgets including smartphones, laptops, tablets, and accessories",
    icon: "", // Will be updated later via admin panel
    slug: "electronics",
    status: "active"
  },
  {
    name: "Fashion",
    description: "Clothing, shoes, accessories, and fashion items for men, women, and children",
    icon: "", // Will be updated later via admin panel
    slug: "fashion",
    status: "active"
  },
  {
    name: "Beauty",
    description: "Cosmetics, skincare, haircare, and personal care products",
    icon: "", // Will be updated later via admin panel
    slug: "beauty",
    status: "active"
  },
  {
    name: "Jewelry",
    description: "Rings, necklaces, bracelets, earrings, and precious accessories",
    icon: "", // Will be updated later via admin panel
    slug: "jewelry",
    status: "active"
  },
  {
    name: "Home & Garden",
    description: "Furniture, home decor, kitchen items, and garden supplies",
    icon: "", // Will be updated later via admin panel
    slug: "home-garden",
    status: "active"
  },
  {
    name: "Sports & Outdoors",
    description: "Sports equipment, outdoor gear, fitness accessories, and athletic wear",
    icon: "", // Will be updated later via admin panel
    slug: "sports-outdoors",
    status: "active"
  }
];

// Seed Product Types
const seedProductTypes = async () => {
  try {
    // Check if product types already exist
    const existingProductTypes = await ProductType.find();
    
    if (existingProductTypes.length === 0) {
      await ProductType.insertMany(productTypesData);
      console.log('✅ Product Types seeded successfully');
    } else {
      console.log('⚠️  Product Types already exist, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error seeding product types:', error);
  }
};

// Reset and seed Product Types
const resetAndSeedProductTypes = async () => {
  try {
    await ProductType.deleteMany();
    await ProductType.insertMany(productTypesData);
    console.log('✅ Product Types reset and seeded successfully');
  } catch (error) {
    console.error('❌ Error resetting and seeding product types:', error);
  }
};

module.exports = {
  seedProductTypes,
  resetAndSeedProductTypes,
  productTypesData
};