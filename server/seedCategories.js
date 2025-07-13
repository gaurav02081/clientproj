const mongoose = require('mongoose');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anime-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleCategories = [
  {
    name: 'Figures',
    slug: 'figures',
    description: 'High-quality anime figurines and action figures from popular series'
  },
  {
    name: 'Posters',
    slug: 'posters',
    description: 'Beautiful anime posters and wall art for your room decoration'
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Anime-themed t-shirts, hoodies, and cosplay costumes'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Anime-themed accessories including jewelry, bags, and phone cases'
  },
  {
    name: 'Collectibles',
    slug: 'collectibles',
    description: 'Rare and limited edition anime collectibles and memorabilia'
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Manga, light novels, and art books from your favorite anime series'
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Anime-themed electronics including headphones, phone cases, and gadgets'
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Anime-themed home decoration items like pillows, blankets, and wall art'
  }
];

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log(`✅ Successfully seeded ${createdCategories.length} categories:`);
    
    createdCategories.forEach(category => {
      console.log(`  - ${category.name} (${category.slug})`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding categories:', error);
    mongoose.connection.close();
  }
};

seedCategories(); 