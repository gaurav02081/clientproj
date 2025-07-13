const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anime-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const migrateProducts = async () => {
  try {
    console.log('Starting product migration...');

    // Get all categories
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('Category mapping:', categoryMap);

    // Get all products with old string categories
    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);

    let updatedCount = 0;
    for (const product of products) {
      // Check if product has old string category
      if (typeof product.category === 'string' || (Array.isArray(product.category) && product.category.length > 0 && typeof product.category[0] === 'string')) {
        const oldCategory = Array.isArray(product.category) ? product.category[0] : product.category;
        const newCategoryId = categoryMap[oldCategory];

        if (newCategoryId) {
          // Update product with new category ObjectId
          await Product.findByIdAndUpdate(product._id, {
            category: [newCategoryId]
          });
          console.log(`✅ Updated product "${product.name}" from "${oldCategory}" to category ID: ${newCategoryId}`);
          updatedCount++;
        } else {
          console.log(`⚠️  No category found for slug: "${oldCategory}" in product "${product.name}"`);
        }
      } else {
        console.log(`ℹ️  Product "${product.name}" already has proper category format`);
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${updatedCount} products.`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Migration error:', error);
    mongoose.connection.close();
  }
};

migrateProducts(); 