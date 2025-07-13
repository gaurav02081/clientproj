const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anime-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fixProducts = async () => {
  try {
    console.log('🔍 Checking existing products...');

    // Get all categories
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories:`, categories.map(c => `${c.name} (${c.slug})`));

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    if (products.length === 0) {
      console.log('No products found to migrate.');
      mongoose.connection.close();
      return;
    }

    // Show current product categories
    products.forEach(product => {
      console.log(`Product: ${product.name} - Category: ${JSON.stringify(product.category)}`);
    });

    // Create category mapping
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('Category mapping:', categoryMap);

    let updatedCount = 0;
    for (const product of products) {
      console.log(`\nProcessing: ${product.name}`);
      
      // Check if product has old string category
      if (typeof product.category === 'string') {
        console.log(`  - Old format: string "${product.category}"`);
        const newCategoryId = categoryMap[product.category];
        
        if (newCategoryId) {
          await Product.findByIdAndUpdate(product._id, {
            category: [newCategoryId]
          });
          console.log(`  ✅ Updated to category ID: ${newCategoryId}`);
          updatedCount++;
        } else {
          console.log(`  ⚠️  No category found for slug: "${product.category}"`);
        }
      } else if (Array.isArray(product.category)) {
        if (product.category.length > 0 && typeof product.category[0] === 'string') {
          console.log(`  - Old format: array of strings ${product.category}`);
          const newCategoryIds = product.category
            .map(catSlug => categoryMap[catSlug])
            .filter(id => id); // Remove undefined values
          
          if (newCategoryIds.length > 0) {
            await Product.findByIdAndUpdate(product._id, {
              category: newCategoryIds
            });
            console.log(`  ✅ Updated to category IDs: ${newCategoryIds}`);
            updatedCount++;
          } else {
            console.log(`  ⚠️  No valid categories found`);
          }
        } else {
          console.log(`  ℹ️  Already in correct format`);
        }
      } else {
        console.log(`  ℹ️  No category field or already correct`);
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${updatedCount} products.`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Migration error:', error);
    mongoose.connection.close();
  }
};

fixProducts(); 