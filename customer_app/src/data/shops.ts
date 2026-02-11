export interface Shop {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  categories: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  isOpen: boolean;
}

export const dummyShops: Shop[] = [
  {
    id: '1',
    name: 'Fresh Mart Grocery',
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5,
    deliveryTime: '15-30 min',
    categories: ['Fruits', 'Vegetables', 'Dairy', 'Snacks'],
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
    },
    isOpen: true,
  },
  {
    id: '2',
    name: 'Organic Valley',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    deliveryTime: '20-35 min',
    categories: ['Organic', 'Fruits', 'Vegetables', 'Dairy'],
    location: {
      latitude: 19.0850,
      longitude: 72.8950,
    },
    isOpen: true,
  },
  {
    id: '3',
    name: 'Quick Stop Market',
    image: 'https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.2,
    deliveryTime: '10-25 min',
    categories: ['Snacks', 'Beverages', 'Dairy', 'Bakery'],
    location: {
      latitude: 19.0650,
      longitude: 72.8650,
    },
    isOpen: false,
  },
];