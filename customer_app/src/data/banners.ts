export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
  actionType: 'shop' | 'category' | 'offer';
  actionValue: string;
}

export const dummyBanners: Banner[] = [
  {
    id: '1',
    title: 'Fresh Fruits',
    subtitle: 'Up to 30% off on all fruits',
    image: 'https://images.pexels.com/photos/1128678/pexels-photo-1128678.jpeg?auto=compress&cs=tinysrgb&w=800',
    backgroundColor: '#FFE4E1',
    actionType: 'category',
    actionValue: 'Fruits',
  },
  {
    id: '2',
    title: 'Organic Collection',
    subtitle: 'Farm fresh organic vegetables',
    image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800',
    backgroundColor: '#F0FFF0',
    actionType: 'shop',
    actionValue: '2',
  },
  {
    id: '3',
    title: 'Quick Delivery',
    subtitle: 'Get groceries in 15 minutes',
    image: 'https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=800',
    backgroundColor: '#E6F3FF',
    actionType: 'offer',
    actionValue: 'quick-delivery',
  },
];