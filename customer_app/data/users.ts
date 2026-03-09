export interface Address {
  street: string;
  city: string;
  district?: string;
  pincode: string;
  type?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: Address;
}

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '9876543210',
    email: 'john.doe@example.com',
    address: {
      street: 'Flat 402, Skyline Apartments, Worli',
      city: 'Mumbai',
      pincode: '400018',
      type: 'Home',
      location: {
        latitude: 19.0760,
        longitude: 72.8777,
      },
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '9876543211',
    email: 'jane.smith@example.com',
    address: {
      street: '456 Park Avenue, Floor 2',
      city: 'Delhi',
      pincode: '110001',
      type: 'Work',
      location: {
        latitude: 28.7041,
        longitude: 77.1025,
      },
    },
  },
];
