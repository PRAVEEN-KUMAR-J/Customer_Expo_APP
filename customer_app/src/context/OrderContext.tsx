import React, { createContext, useContext, useState } from 'react';
import { Order, OrderStatus, dummyOrders } from '../data/orders';
import { CartItem } from './CartContext';
import { Shop } from '../data/shops';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (items: CartItem[], shop: Shop, paymentMethod: 'cash' | 'razorpay') => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  startOrderTracking: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const generateOrderId = () => {
    return `ORD${(orders.length + 1).toString().padStart(3, '0')}`;
  };

  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 25;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + deliveryFee + tax;
    
    return { subtotal, deliveryFee, tax, total };
  };

  const placeOrder = async (items: CartItem[], shop: Shop, paymentMethod: 'cash' | 'razorpay'): Promise<string> => {
    // Simulate order processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = generateOrderId();
    const { subtotal, deliveryFee, tax, total } = calculateTotals(items);

    const newOrder: Order = {
      id: orderId,
      userId: '1', // Using dummy user
      shopId: shop.id,
      shopName: shop.name,
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
        unit: item.product.unit,
      })),
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'confirmed',
      paymentMethod,
      orderDate: new Date(),
      deliveryAddress: {
        street: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        pincode: '400001',
      },
      deliveryTime: '30-45 minutes',
    };

    setOrders(prev => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status }
          : order
      )
    );
    
    if (currentOrder?.id === orderId) {
      setCurrentOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  const startOrderTracking = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setCurrentOrder(order);
      
      // Simulate order status progression
      const statuses: OrderStatus[] = ['confirmed', 'packed', 'out_for_delivery', 'delivered'];
      let currentStatusIndex = statuses.indexOf(order.status);
      
      const interval = setInterval(() => {
        currentStatusIndex++;
        if (currentStatusIndex < statuses.length) {
          updateOrderStatus(orderId, statuses[currentStatusIndex]);
        } else {
          clearInterval(interval);
        }
      }, 10000); // Update every 10 seconds for demo
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      currentOrder,
      placeOrder,
      updateOrderStatus,
      startOrderTracking,
      getOrderById,
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};