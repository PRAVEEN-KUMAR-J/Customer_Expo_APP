import { createNavigationContainerRef } from '@react-navigation/native';

export const rootNavigationRef = createNavigationContainerRef();

export function navigateToCheckout() {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.navigate('Checkout' as never);
  }
}

export function navigateToWishlist() {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.navigate('Wishlist' as never);
  }
}
