const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Naruto Uzumaki Action Figure',
    description: 'High-quality collectible figure of Naruto Uzumaki in his signature orange jumpsuit. Perfect for anime collectors and fans.',
    price: 2499,
    originalPrice: 3299,
    category: 'figures',
    anime: 'Naruto',
    images: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    stock: 50,
    sku: 'NAR-001',
    tags: ['naruto', 'action-figure', 'collectible'],
    specifications: {
      material: 'PVC',
      dimensions: '6 inches',
      weight: '200g',
      brand: 'AnimeCollectibles'
    },
    ratings: {
      average: 4.5,
      count: 12
    },
    isActive: true,
    isFeatured: true,
    discount: 25
  },
  {
    name: 'Dragon Ball Z Goku Poster',
    description: 'Vibrant poster featuring Goku in his Super Saiyan form. High-quality print perfect for room decoration.',
    price: 1099,
    originalPrice: 1349,
    category: 'posters',
    anime: 'Dragon Ball Z',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    ],
    stock: 100,
    sku: 'DBZ-001',
    tags: ['dragon-ball', 'goku', 'poster'],
    specifications: {
      material: 'Premium Paper',
      dimensions: '24x36 inches',
      weight: '50g',
      brand: 'AnimePosters'
    },
    ratings: {
      average: 4.8,
      count: 25
    },
    isActive: true,
    isFeatured: true,
    discount: 19
  },
  {
    name: 'One Piece Luffy T-Shirt',
    description: 'Comfortable cotton t-shirt featuring Monkey D. Luffy from One Piece. Available in multiple sizes.',
    price: 2099,
    originalPrice: 2499,
    category: 'clothing',
    anime: 'One Piece',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
    ],
    stock: 75,
    sku: 'OP-001',
    tags: ['one-piece', 'luffy', 't-shirt', 'clothing'],
    specifications: {
      material: '100% Cotton',
      dimensions: 'Various sizes',
      weight: '180g',
      brand: 'AnimeWear'
    },
    ratings: {
      average: 4.6,
      count: 18
    },
    isActive: true,
    isFeatured: false,
    discount: 17
  },
  {
    name: 'Attack on Titan Eren Keychain',
    description: 'Durable metal keychain featuring Eren Yeager from Attack on Titan. Perfect accessory for anime fans.',
    price: 749,
    originalPrice: 1099,
    category: 'accessories',
    anime: 'Attack on Titan',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'
    ],
    stock: 200,
    sku: 'AOT-001',
    tags: ['attack-on-titan', 'eren', 'keychain', 'accessory'],
    specifications: {
      material: 'Stainless Steel',
      dimensions: '2 inches',
      weight: '30g',
      brand: 'AnimeAccessories'
    },
    ratings: {
      average: 4.3,
      count: 8
    },
    isActive: true,
    isFeatured: false,
    discount: 31
  },
  {
    name: 'Demon Slayer Tanjiro Figure',
    description: 'Detailed collectible figure of Tanjiro Kamado from Demon Slayer. Includes his signature sword and kimono.',
    price: 2899,
    originalPrice: 3749,
    category: 'figures',
    anime: 'Demon Slayer',
    images: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    stock: 30,
    sku: 'DS-001',
    tags: ['demon-slayer', 'tanjiro', 'figure', 'collectible'],
    specifications: {
      material: 'PVC and ABS',
      dimensions: '7 inches',
      weight: '250g',
      brand: 'AnimeCollectibles'
    },
    ratings: {
      average: 4.9,
      count: 15
    },
    isActive: true,
    isFeatured: true,
    discount: 22
  },
  {
    name: 'My Hero Academia All Might Hoodie',
    description: 'Warm and comfortable hoodie featuring All Might from My Hero Academia. Perfect for cold weather.',
    price: 3299,
    originalPrice: 4149,
    category: 'clothing',
    anime: 'My Hero Academia',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
    ],
    stock: 40,
    sku: 'MHA-001',
    tags: ['my-hero-academia', 'all-might', 'hoodie', 'clothing'],
    specifications: {
      material: 'Cotton Blend',
      dimensions: 'Various sizes',
      weight: '400g',
      brand: 'AnimeWear'
    },
    ratings: {
      average: 4.7,
      count: 22
    },
    isActive: true,
    isFeatured: false,
    discount: 20
  },
  {
    name: 'Death Note Light Yagami Poster',
    description: 'Dark and mysterious poster featuring Light Yagami from Death Note. High-quality art print.',
    price: 1249,
    originalPrice: 1599,
    category: 'posters',
    anime: 'Death Note',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    ],
    stock: 60,
    sku: 'DN-001',
    tags: ['death-note', 'light-yagami', 'poster'],
    specifications: {
      material: 'Premium Paper',
      dimensions: '24x36 inches',
      weight: '50g',
      brand: 'AnimePosters'
    },
    ratings: {
      average: 4.4,
      count: 11
    },
    isActive: true,
    isFeatured: false,
    discount: 21
  },
  {
    name: 'Jujutsu Kaisen Gojo Satoru Mug',
    description: 'Ceramic coffee mug featuring Gojo Satoru from Jujutsu Kaisen. Microwave and dishwasher safe.',
    price: 1399,
    originalPrice: 1649,
    category: 'home-decor',
    anime: 'Jujutsu Kaisen',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'
    ],
    stock: 80,
    sku: 'JJK-001',
    tags: ['jujutsu-kaisen', 'gojo', 'mug', 'home-decor'],
    specifications: {
      material: 'Ceramic',
      dimensions: '4 inches height',
      weight: '300g',
      brand: 'AnimeHome'
    },
    ratings: {
      average: 4.6,
      count: 9
    },
    isActive: true,
    isFeatured: false,
    discount: 15
  },
  {
    name: 'Hunter x Hunter Gon Phone Case',
    description: 'Durable phone case featuring Gon Freecss from Hunter x Hunter. Compatible with iPhone and Samsung.',
    price: 1649,
    originalPrice: 2099,
    category: 'accessories',
    anime: 'Hunter x Hunter',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'
    ],
    stock: 120,
    sku: 'HXH-001',
    tags: ['hunter-x-hunter', 'gon', 'phone-case', 'accessory'],
    specifications: {
      material: 'Silicone and Polycarbonate',
      dimensions: 'Various sizes',
      weight: '50g',
      brand: 'AnimeAccessories'
    },
    ratings: {
      average: 4.5,
      count: 14
    },
    isActive: true,
    isFeatured: false,
    discount: 20
  },
  {
    name: 'Fullmetal Alchemist Edward Elric Book',
    description: 'Official manga volume featuring Edward Elric from Fullmetal Alchemist. High-quality printing.',
    price: 849,
    originalPrice: 1099,
    category: 'books',
    anime: 'Fullmetal Alchemist',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
    ],
    stock: 45,
    sku: 'FMA-001',
    tags: ['fullmetal-alchemist', 'edward-elric', 'manga', 'book'],
    specifications: {
      material: 'Paper',
      dimensions: '5x7 inches',
      weight: '200g',
      brand: 'AnimeBooks'
    },
    ratings: {
      average: 4.8,
      count: 7
    },
    isActive: true,
    isFeatured: false,
    discount: 23
  },
  {
    name: 'Bleach Ichigo Kurosaki Wallet',
    description: 'Leather wallet featuring Ichigo Kurosaki from Bleach. Multiple card slots and coin pocket.',
    price: 1899,
    originalPrice: 2349,
    category: 'accessories',
    anime: 'Bleach',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'
    ],
    stock: 65,
    sku: 'BLE-001',
    tags: ['bleach', 'ichigo', 'wallet', 'accessory'],
    specifications: {
      material: 'Genuine Leather',
      dimensions: '4x3 inches',
      weight: '100g',
      brand: 'AnimeAccessories'
    },
    ratings: {
      average: 4.4,
      count: 13
    },
    isActive: true,
    isFeatured: false,
    discount: 18
  },
  {
    name: 'Tokyo Ghoul Kaneki Ken Mask',
    description: 'Cosplay mask featuring Kaneki Ken from Tokyo Ghoul. Perfect for conventions and cosplay.',
    price: 1599,
    originalPrice: 1949,
    category: 'accessories',
    anime: 'Tokyo Ghoul',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400'
    ],
    stock: 35,
    sku: 'TG-001',
    tags: ['tokyo-ghoul', 'kaneki', 'mask', 'cosplay'],
    specifications: {
      material: 'Plastic and Fabric',
      dimensions: 'One size fits most',
      weight: '150g',
      brand: 'AnimeCosplay'
    },
    ratings: {
      average: 4.2,
      count: 6
    },
    isActive: true,
    isFeatured: false,
    discount: 17
  }
];

const sampleAdmin = {
  username: 'admin',
  email: 'admin@animestore.com',
  password: 'admin123',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  phone: '+1234567890',
  address: {
    street: '123 Admin Street',
    city: 'Admin City',
    state: 'AS',
    zipCode: '12345',
    country: 'US'
  }
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/anime-store', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${products.length} sample products`);

    // Check if admin user exists
    const existingAdmin = await User.findOne({ email: sampleAdmin.email });
    if (!existingAdmin) {
      const admin = await User.create(sampleAdmin);
      console.log('✅ Created admin user');
      console.log('👤 Admin credentials:');
      console.log('   Email: admin@animestore.com');
      console.log('   Password: admin123');
    } else {
      console.log('👤 Admin user already exists');
    }

    console.log('\n🎌 Sample data seeded successfully!');
    console.log('\n📊 Sample Products Added:');
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
    });

    console.log('\n🧪 Test the application:');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend API: http://localhost:5000/api/health');
    console.log('\n👤 Admin Login:');
    console.log('   Email: admin@animestore.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 