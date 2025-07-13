const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anime-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const addCategoriesToProducts = async () => {
  try {
    console.log('🔍 Adding categories to existing products...');

    // Get all categories
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('Category mapping:', categoryMap);

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    // Define product to category mapping
    const productCategoryMapping = {
      'Naruto Uzumaki Action Figure': 'figures',
      'Demon Slayer Tanjiro Figure': 'figures',
      'Dragon Ball Z Goku Poster': 'posters',
      'Death Note Light Yagami Poster': 'posters',
      'One Piece Luffy T-Shirt': 'clothing',
      'My Hero Academia All Might Hoodie': 'clothing',
      'Attack on Titan Eren Keychain': 'accessories',
      'Jujutsu Kaisen Gojo Satoru Mug': 'home-decor',
      'Hunter x Hunter Gon Phone Case': 'electronics',
      'Fullmetal Alchemist Edward Elric Book': 'books',
      'Bleach Ichigo Kurosaki Wallet': 'accessories',
      'Tokyo Ghoul Kaneki Ken Mask': 'collectibles'
    };

    let updatedCount = 0;
    for (const product of products) {
      console.log(`\nProcessing: ${product.name}`);
      
      const categorySlug = productCategoryMapping[product.name];
      if (categorySlug && categoryMap[categorySlug]) {
        const categoryId = categoryMap[categorySlug];
        await Product.findByIdAndUpdate(product._id, {
          category: [categoryId]
        });
        console.log(`  ✅ Added category: ${categorySlug} (${categoryId})`);
        updatedCount++;
      } else {
        console.log(`  ⚠️  No category mapping found for: ${product.name}`);
      }
    }

    console.log(`\n🎉 Categories added to ${updatedCount} products.`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding categories:', error);
    mongoose.connection.close();
  }
};

addCategoriesToProducts(); 