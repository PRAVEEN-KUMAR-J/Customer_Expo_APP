export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    pincode: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
}

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+91-9876543210',
    email: 'john.doe@example.com',
    address: {
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      pincode: '400001',
      location: {
        latitude: 19.0760,
        longitude: 72.8777,
      },
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+91-9876543211',
    email: 'jane.smith@example.com',
    address: {
      street: '456 Park Avenue, Floor 2',
      city: 'Delhi',
      pincode: '110001',
      location: {
        latitude: 28.7041,
        longitude: 77.1025,
      },
    },
  },
];