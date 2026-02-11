export interface Product {
  id: string;
  shopId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  unit: string;
  description: string;
  inStock: boolean;
  rating: number;
}

export const dummyProducts: Product[] = [
  {
    id: '1',
    shopId: '1',
    name: 'Fresh Bananas',
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 40,
    originalPrice: 50,
    category: 'Fruits',
    unit: '1 dozen',
    description: 'Fresh ripe bananas, perfect for smoothies and snacking',
    inStock: true,
    rating: 4.5,
  },
  {
    id: '2',
    shopId: '1',
    name: 'Red Apples',
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 120,
    category: 'Fruits',
    unit: '1 kg',
    description: 'Crisp red apples, rich in vitamins and fiber',
    inStock: true,
    rating: 4.8,
  },
  {
    id: '3',
    shopId: '1',
    name: 'Fresh Milk',
    image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 60,
    category: 'Dairy',
    unit: '1 liter',
    description: 'Fresh full cream milk, farm to table quality',
    inStock: true,
    rating: 4.7,
  },
  {
    id: '4',
    shopId: '1',
    name: 'Potato Chips',
    image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 25,
    category: 'Snacks',
    unit: '50g pack',
    description: 'Crispy potato chips with sea salt',
    inStock: false,
    rating: 4.2,
  },
  {
    id: '5',
    shopId: '2',
    name: 'Organic Carrots',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 80,
    category: 'Vegetables',
    unit: '500g',
    description: 'Fresh organic carrots, pesticide-free',
    inStock: true,
    rating: 4.9,
  },
  {
    id: '6',
    shopId: '2',
    name: 'Organic Spinach',
    image: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: 50,
    category: 'Vegetables',
    unit: '250g bunch',
    description: 'Fresh organic spinach leaves',
    inStock: true,
    rating: 4.6,
  },
];