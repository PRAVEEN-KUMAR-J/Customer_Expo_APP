export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  unit: string;
}

export type OrderStatus = 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  shopId: string;
  shopName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'razorpay';
  orderDate: Date;
  deliveryAddress: {
    street: string;
    city: string;
    pincode: string;
  };
  deliveryTime?: string;
  tracking?: {
    latitude: number;
    longitude: number;
    eta: string;
  };
}

export const dummyOrders: Order[] = [
  {
    id: 'ORD001',
    userId: '1',
    shopId: '1',
    shopName: 'Fresh Mart Grocery',
    items: [
      {
        productId: '1',
        productName: 'Fresh Bananas',
        productImage: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400',
        quantity: 2,
        price: 40,
        unit: '1 dozen',
      },
      {
        productId: '3',
        productName: 'Fresh Milk',
        productImage: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400',
        quantity: 1,
        price: 60,
        unit: '1 liter',
      },
    ],
    subtotal: 140,
    deliveryFee: 20,
    tax: 14,
    total: 174,
    status: 'delivered',
    paymentMethod: 'razorpay',
    orderDate: new Date('2024-01-15T10:30:00'),
    deliveryAddress: {
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      pincode: '400001',
    },
    deliveryTime: '45 minutes',
  },
  {
    id: 'ORD002',
    userId: '1',
    shopId: '2',
    shopName: 'Organic Valley',
    items: [
      {
        productId: '5',
        productName: 'Organic Carrots',
        productImage: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
        quantity: 1,
        price: 80,
        unit: '500g',
      },
    ],
    subtotal: 80,
    deliveryFee: 25,
    tax: 8,
    total: 113,
    status: 'out_for_delivery',
    paymentMethod: 'cash',
    orderDate: new Date(),
    deliveryAddress: {
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      pincode: '400001',
    },
    deliveryTime: '15 minutes',
    tracking: {
      latitude: 19.0750,
      longitude: 72.8750,
      eta: '12 minutes',
    },
  },
];