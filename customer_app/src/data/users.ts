export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  pincode: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  // Primary/default address (used on Home, Checkout, etc.)
  address: Address;
  // Optional list of saved addresses (includes the primary one)
  addresses?: Address[];
}

export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+91-9876543210',
    email: 'john.doe@example.com',
    address: {
      id: 'home-1',
      label: 'Home',
      street: '123 Main Street, Apartment 4B',
      city: 'Mumbai',
      pincode: '400001',
      location: {
        latitude: 19.0760,
        longitude: 72.8777,
      },
      isDefault: true,
    },
    addresses: [
      {
        id: 'home-1',
        label: 'Home',
        street: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        pincode: '400001',
        location: {
          latitude: 19.0760,
          longitude: 72.8777,
        },
        isDefault: true,
      },
      {
        id: 'work-1',
        label: 'Work',
        street: '456 Corporate Blvd, Suite 200',
        city: 'Mumbai',
        pincode: '400002',
        location: {
          latitude: 19.0760,
          longitude: 72.8777,
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+91-9876543211',
    email: 'jane.smith@example.com',
    address: {
      id: 'home-2',
      label: 'Home',
      street: '456 Park Avenue, Floor 2',
      city: 'Delhi',
      pincode: '110001',
      location: {
        latitude: 28.7041,
        longitude: 77.1025,
      },
      isDefault: true,
    },
    addresses: [
      {
        id: 'home-2',
        label: 'Home',
        street: '456 Park Avenue, Floor 2',
        city: 'Delhi',
        pincode: '110001',
        location: {
          latitude: 28.7041,
          longitude: 77.1025,
        },
        isDefault: true,
      },
      {
        id: 'work-2',
        label: 'Work',
        street: '123 Business Park, Tower A',
        city: 'Delhi',
        pincode: '110002',
        location: {
          latitude: 28.7041,
          longitude: 77.1025,
        },
      },
    ],
  },
];