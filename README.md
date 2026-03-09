# 🛒 NimBasket – Customer Grocery Delivery App

> A modern, feature-rich **React Native / Expo** grocery delivery mobile application for customers. Built with TypeScript, Expo Router, and a rich UI component library — styled with a red/orange gradient brand identity.

---

## 📋 Table of Contents

- [Overview](#overview)
- [App Flow](#app-flow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Screens & Navigation](#screens--navigation)
- [State Management (Contexts)](#state-management-contexts)
- [Data Layer](#data-layer)
- [Key Components](#key-components)
- [Build & Run](#build--run)
- [EAS Build Configuration](#eas-build-configuration)
- [App Configuration](#app-configuration)

---

## 🌟 Overview

**NimBasket** is a customer-facing grocery delivery app that allows users to:

- Browse multiple local supermarkets/shops
- Explore products by category (Fruits, Vegetables, Dairy, Snacks, Beverages, Organic, Bakery)
- Add products to the cart and manage quantities
- Wishlist favourite products
- Checkout with address selection
- Pay via **Cash on Delivery** or **Razorpay**
- Track live order status (Confirmed → Packed → Out for Delivery → Delivered)
- Manage their profile, saved addresses, and order history

The app is currently scoped to the **Tiruvannamalai** area with **15 local supermarkets** pre-loaded.

---

## 🔁 App Flow

### 1. App Launch & Authentication
When users first open the app, they go through a seamless authentication flow:
- **Splash Screen**: Users see a branded animated splash screen for 2 seconds
- **Mobile Authentication**: Users must enter their mobile number and verify with OTP sent via Firebase Authentication
- **Profile Access**: Authenticated users can access their profile, manage addresses, and view order history

### 2. Main Navigation (Bottom Tabs)
After authentication, users land on the main app interface with 5 primary navigation tabs:

#### 🏠 Home Tab
The entry point to the shopping experience:
- Promotional banners highlighting special offers
- Quick category access (Fruits, Vegetables, Dairy, etc.)
- Featured shops in the local area
- Search functionality to find specific products or shops

#### 🏪 Shops Tab
Browse all partner shops in Tiruvannamalai:
- View all 15 local supermarkets in a grid layout
- See shop ratings, delivery times, and categories
- Tap on any shop to view its complete product catalog

#### 🛒 Cart Tab
Manage selected items before checkout:
- View all added items grouped by shop
- Adjust quantities or remove items
- See real-time pricing calculations (subtotal, delivery fees, taxes)
- Proceed to checkout when ready

#### 📦 Orders Tab
Track and manage order history:
- View past orders with status indicators
- Track current order progress in real-time
- Access detailed order information including items, pricing, and delivery address

#### ⚙️ Profile Tab
Personal account management:
- View and edit personal information
- Manage multiple delivery addresses
- Access wishlist of favorite products
- View help and support resources

### 3. Shopping Journey

#### Browsing Products
Users can discover products through multiple pathways:
1. **Home Screen**: Browse featured products and categories
2. **Shop Selection**: Choose a specific shop to view its complete catalog
3. **Category Filtering**: View products by specific categories (Fruits, Vegetables, etc.)
4. **Search**: Find specific products using the search functionality

#### Adding Items to Cart
For each product:
- View detailed information including price, description, and ratings
- Select quantity using the quantity selector
- Add to cart with a single tap
- See the floating CartBar appear at the bottom for 5 seconds with quick checkout access

### 4. Checkout Process

#### Cart Review
Before checkout, users review their selections:
- Verify all items and quantities
- Check pricing breakdown (subtotal, delivery fees, taxes)
- Remove items if needed

#### Delivery Address Selection
Choose from saved addresses or:
- Add a new address manually
- Select location on map using AddressMapScreen

#### Payment Method
Select preferred payment option:
- **Cash on Delivery**: Pay when items are delivered
- **Razorpay**: Digital payment processing

#### Order Confirmation
After placing an order:
- View order confirmation with estimated delivery time
- Receive order ID for tracking purposes
- See real-time order status updates

### 5. Order Tracking

#### Real-Time Status Updates
Orders progress through several stages:
1. **Order Confirmed**: Order received and processed
2. **Order Packed**: Items are being prepared for delivery
3. **Out for Delivery**: Order is with the delivery person
4. **Delivered**: Order successfully delivered to customer

#### Tracking Features
- Visual stepper showing current status
- Estimated delivery time
- Auto-progress in demo mode (every 10 seconds)

### 6. Profile Management

#### Personal Information
- Update name, email, and phone number
- Manage communication preferences

#### Address Book
- Save multiple delivery addresses
- Set default delivery address
- Edit or remove existing addresses
- Add new addresses with map integration

#### Wishlist
- Save favorite products for later
- Quickly access wishlisted items
- Remove items from wishlist

#### Help & Support
- Access FAQ and support resources
- Contact customer service
- View app information and version

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | [Expo](https://expo.dev/) v54 (React Native 0.81.5) |
| Language | TypeScript 5.9 |
| Navigation | Expo Router v6 (file-based routing) |
| UI Icons | `@expo/vector-icons`, `lucide-react-native` |
| Animations | `react-native-reanimated` v4, `expo-haptics` |
| Maps | `react-native-maps` |
| QR Code | `react-native-qrcode-svg` |
| Gradient | `expo-linear-gradient` |
| Camera | `expo-camera` |
| Location | `expo-location` |
| Auth/DB | Supabase JS + Firebase |
| Blur | `expo-blur` |
| Build | EAS (Expo Application Services) |

---

## 📁 Project Structure

```
Customer_Expo_APP/
└── customer_app/                  # Main Expo app root
    ├── app/                       # Expo Router file-based pages
    │   ├── _layout.tsx            # Root layout (wraps all Providers)
    │   ├── index.tsx              # Entry redirect
    │   ├── +not-found.tsx         # 404 screen
    │   ├── login.tsx              # Login screen
    │   ├── (tabs)/                # Bottom tab navigator
    │   │   ├── _layout.tsx        # Tab bar config
    │   │   ├── home.tsx           # Home tab
    │   │   ├── shops.tsx          # Shops tab
    │   │   ├── cart.tsx           # Cart tab
    │   │   ├── orders.tsx         # Orders tab
    │   │   └── settings.tsx       # Settings/Profile tab
    │   ├── checkout/              # Checkout + Payment pages
    │   ├── order/                 # Order tracking pages
    │   └── profile/               # Profile management pages
    │       ├── shop/              # Shop detail pages
    │       ├── checkout/          # Checkout + Payment pages
    │       ├── order/             # Order tracking pages
    │       └── profile/           # Profile management pages
    │
    ├── src/                       # Source code (non-page)
    │   ├── components/            # Reusable UI components
    │   ├── screens/               # Screen-level View components
    │   │   ├── SplashScreen.tsx
    │   │   ├── auth/
    │   │   ├── home/
    │   │   ├── shop/
    │   │   ├── cart/
    │   │   ├── checkout/
    │   │   ├── order/
    │   │   └── profile/
    │   ├── context/               # React Context (global state)
    │   │   ├── AuthContext.tsx
    │   │   ├── CartContext.tsx
    │   │   └── OrderContext.tsx
    │   ├── data/                  # Static/dummy data
    │   │   ├── banners.ts
    │   │   ├── orders.ts
    │   │   ├── products.ts        # Large product catalog (~64KB)
    │   │   ├── shops.ts           # 15 local shops
    │   │   └── users.ts
    │   ├── navigation/            # Navigator components
    │   │   ├── AppNavigator.tsx
    │   │   ├── BottomTabs.tsx
    │   │   └── rootNavigationRef.ts
    │   ├── layouts/               # Shared layout wrappers
    │   ├── ui/                    # Design system / primitives
    │   └── utils/                 # Utility helpers
    │
    ├── assets/                    # App icons, splash, images
    ├── hooks/                     # Custom hooks
    ├── android/                   # Native Android folder (EAS)
    ├── app.json                   # Expo config
    ├── eas.json                   # EAS build config
    ├── babel.config.js
    ├── tsconfig.json
    └── package.json
```

---

## ✨ Features

### 🏠 Home Screen
- **Animated Splash Screen** with brand identity on first load (5s delay auto-login)
- **Promotional Banner Carousel** (swipeable, 3 banners: Fruits, Organic, Quick Delivery)
- **Category Grid** (Fruits, Vegetables, Dairy, Snacks, Beverages, Organic, Bakery)
- **Featured Shops** horizontal scroll
- **Search** functionality

### 🏪 Shops
- Browse **15 local supermarkets** in Tiruvannamalai
- Shop cards with rating, delivery time, category tags, open/closed state
- **Store Map** with `react-native-maps` showing all shop locations
- Navigate into individual shop product listings

### 🛍 Product Browsing
- **Category-based filtering** (CategoryProductsScreen)
- **Product cards** with image, name, price, unit, add-to-cart buttons
- **Floating Wishlist Button** on product screens
- Product detail with quantity selector
- Products data file: `~64KB` of real product catalog entries

### ❤️ Wishlist
- Toggle products in/out of wishlist
- WishlistScreen showing all saved items
- Wishlist state persisted in `AuthContext`

### 🛒 Cart
- Add / Remove / Update quantity of items
- **CartBar** – floating bottom bar that auto-appears for 5 seconds when an item is added
- Full cart screen with item list and totals
- Clear cart option

### 📦 Checkout Flow
1. **CheckoutScreen** – Review cart, selected delivery address, delivery estimate
2. **PaymentScreen** – Choose Cash on Delivery or Razorpay
3. Order placed → navigate to order tracking

### 📍 Address Management
- View, Add, Edit, Delete saved addresses
- Select active delivery address
- **AddressMapScreen** – pick location on map
- Address synced with user profile

### 📊 Order Management
- **Order History** – list of all past orders with status badges
- **Order Tracking** – live status stepper (Confirmed → Packed → Out for Delivery → Delivered)
  - Auto-progresses every 10 seconds (demo mode)
- Order details: items, totals, delivery address, payment method

### 👤 Profile
- View & Edit profile details (name, email, phone)
- Manage saved addresses
- View wishlist
- Help & Support screen
- Logout

### 🗺 Store Map
- Native map view showing all shop pin locations
- Tap a pin to visit the shop

---

## 🧭 Screens & Navigation

### Tab Navigator (Bottom Tabs)
| Tab | Screen | Description |
|---|---|---|
| 🏠 Home | `HomeScreen` | Banner, categories, shops |
| 🏪 Shops | `ShopListScreen` | All local shops |
| 🛒 Cart | `CartScreen` | Cart items & checkout CTA |
| 📦 Orders | `OrderHistoryScreen` | Past & current orders |
| ⚙️ Settings | `ProfileScreen` | User profile & settings |

### Stack Screens (within `(app)`)
| Route | Screen |
|---|---|
| `/shop/[id]` | `ProductListScreen` / `CategoryProductsScreen` |
| `/checkout` | `CheckoutScreen` |
| `/checkout/payment` | `PaymentScreen` |
| `/order/[id]` | `OrderTrackingScreen` |
| `/order/history` | `OrderHistoryScreen` |
| `/profile/details` | `ProfileDetailsScreen` |
| `/profile/addresses` | `SavedAddressesScreen` |
| `/profile/addresses/add` | `AddressDetailsScreen` |
| `/profile/addresses/map` | `AddressMapScreen` |
| `/profile/wishlist` | `WishlistScreen` |
| `/profile/help` | `HelpSupportScreen` |
| `/store-map` | Store Map (all shops) |

### Auth Group
| Route | Screen |
|---|---|
| `/(auth)/login` | `LoginScreen` |

---

## 🌐 State Management (Contexts)

### `AuthContext`
Manages the authenticated user, addresses, and wishlist.

| State | Type | Description |
|---|---|---|
| `user` | `User \| null` | Logged-in user object |
| `isLoading` | `boolean` | Loading state (splash) |
| `addresses` | `Address[]` | Saved delivery addresses |
| `selectedAddressIndex` | `number` | Active delivery address |
| `wishlistProductIds` | `string[]` | Wishlisted product IDs |

**Key Methods:** `login(phone)`, `logout()`, `updateUser()`, `addAddress()`, `updateAddress()`, `deleteAddress()`, `selectAddress()`, `toggleWishlist()`

> **Demo Mode:** Auto-logs in with `dummyUsers[0]` (John Doe) after a 5-second splash delay.

---

### `CartContext`
Manages shopping cart state.

| State | Type | Description |
|---|---|---|
| `items` | `CartItem[]` | Cart items (product + quantity) |
| `shouldShowCheckoutBar` | `boolean` | Controls floating checkout bar |

**Key Methods:** `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `getTotalItems()`, `getTotalPrice()`

> **CartBar logic:** Shows for 5 seconds after every item addition, auto-hides with timer reset on each new add.

---

### `OrderContext`
Manages order placement and tracking.

| State | Type | Description |
|---|---|---|
| `orders` | `Order[]` | All orders (incl. dummy history) |
| `currentOrder` | `Order \| null` | Currently tracked order |

**Key Methods:** `placeOrder()`, `updateOrderStatus()`, `startOrderTracking()`, `getOrderById()`

**Order pricing logic:**
- Subtotal: sum of `price × quantity`
- Delivery fee: **₹0** if subtotal > ₹500, else **₹25**
- Tax: **10%** of subtotal

---

## 📊 Data Layer

All data is **static dummy data** (no live backend calls yet).

### Users (`users.ts`)
- 2 dummy users: John Doe (Mumbai), Jane Smith (Delhi)

### Shops (`shops.ts`)
- **15 shops** in Tiruvannamalai:
  Al Mart, ABK Hyper Mart, Sri Ramana Super Market, Dhanapal Store, GSM Super Market, Sri Kumars Supermarket, Zam Zam, More Super Market, Nilgiris Supermarket, ABN Super Market, Epic Super Market, GRS Super Market, Pragadhe Super Market, 55 Mart, ARS Super Market
- Each shop has: `id`, `name`, `image`, `rating`, `deliveryTime`, `address`, `categories[]`, `location { lat, lng }`, `isOpen`

### Products (`products.ts`)
- Large catalog (~64KB) covering categories: Fruits, Vegetables, Dairy, Snacks, Beverages, Organic, Bakery
- Each product: `id`, `name`, `price`, `unit`, `image`, `category`, `shopId`, `description`, `rating`, `inStock`

### Banners (`banners.ts`)
- 3 promotional banners: Fresh Fruits (30% off), Organic Collection, Quick Delivery
- Each banner: `id`, `title`, `subtitle`, `image`, `backgroundColor`, `actionType`, `actionValue`

### Orders (`orders.ts`)
- 2 dummy historic orders (ORD001 – delivered, ORD002 – out for delivery with GPS tracking)
- Order statuses: `confirmed` | `packed` | `out_for_delivery` | `delivered` | `cancelled`
- Payment methods: `cash` | `razorpay`

---

## 🧩 Key Components

| Component | Description |
|---|---|
| `BannerCarousel.tsx` | Auto-swipeable promotional banner slider |
| `CartBar.tsx` | Floating bottom bar showing cart count + checkout CTA, auto-hides after 5s |
| `CartItem.tsx` | Single cart item row with +/- quantity controls |
| `FloatingWishlistButton.tsx` | Animated floating button to toggle wishlist |
| `OrderStatusStepper.tsx` | Visual step-by-step order progress tracker |
| `ProductCard.tsx` | Rich product display card with add-to-cart and wishlist toggle |
| `ShopCard.tsx` | Shop listing card with rating, eta, and categories |
| `SplashScreen.tsx` | Animated branded splash screen (~10KB) |

---

## 🚀 Build & Run

### Prerequisites
- Node.js ≥ 18
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android Studio (for Android emulator) or physical device with Expo Go

### Install Dependencies
```bash
cd customer_app
npm install
```

### Run in Development (Tunnel mode — current)
```bash
npx expo start --tunnel
```

### Run on Android Emulator
```bash
npm run android
# or
npx expo run:android
```

### Run on iOS Simulator
```bash
npm run ios
```

### Web Preview
```bash
npm run build:web
```

---

## ☁️ EAS Build Configuration

**`eas.json`** defines three build profiles:

| Profile | Distribution | Description |
|---|---|---|
| `development` | Internal | Dev client for debugging |
| `preview` | Internal | Internal APK for testing |
| `production` | Store | Auto-increments version, for Play Store |

### Build APK (Preview)
```bash
eas build --platform android --profile preview
```

### Build Production
```bash
eas build --platform android --profile production
```

---

## ⚙️ App Configuration (`app.json`)

| Field | Value |
|---|---|
| App Name | **Nim Basket** |
| Slug | `nim-basket` |
| Version | `1.0.0` |
| Bundle ID (iOS) | `com.nimbasket.customer` |
| Package (Android) | `com.nimbasket.customer` |
| Orientation | Portrait |
| EAS Project ID | `5eba4923-23de-4b74-8b37-8c3d9dba54ed` |
| Owner | `nimbasket_100224` |
| New Architecture | Enabled (`newArchEnabled: true`) |

**Expo Plugins used:**
- `expo-router`
- `expo-font`
- `expo-web-browser`
- `expo-location` (with location permission description)

---

## 🎨 Brand Identity

- **App Name:** Nim Basket
- **Color Scheme:** Red / Orange gradient
- **Theme:** Automatic (light/dark)
- **Typography:** Modern, clean

---

## 🔐 Authentication (Firebase Mobile OTP)

The app now uses **Firebase Authentication with Mobile OTP**:
- Users enter their mobile number to receive an OTP via SMS
- Firebase Authentication handles the OTP verification process
- Upon successful verification, users are logged into the app
- Users can logout anytime from the profile section

---

## 📦 Dependencies Summary

### Core
`expo` · `expo-router` · `react` · `react-native` · `typescript`

### Navigation
`@react-navigation/native` · `@react-navigation/bottom-tabs` · `@react-navigation/stack`

### UI & Animations
`expo-linear-gradient` · `expo-blur` · `react-native-reanimated` · `expo-haptics` · `@expo/vector-icons` · `lucide-react-native`

### Maps & Location
`react-native-maps` · `expo-location`

### Camera & QR
`expo-camera` · `react-native-qrcode-svg`

### Backend/Auth
`@supabase/supabase-js` · `firebase`

### Utils
`react-native-url-polyfill` · `react-native-gesture-handler` · `react-native-safe-area-context` · `react-native-screens`

---

*Built with ❤️ using Expo & React Native — NimBasket Customer App v1.0.0*
