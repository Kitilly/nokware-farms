// Centralized user-facing copy. Component-local strings are limited to short,
// structurally-bound UI labels (e.g. "Add", "Remove") — narrative, marketing,
// legal, and state copy all live here so a future locale can be swapped in
// without touching components.

export const copy = {
  onboarding: {
    welcome: {
      title: 'Nokware Farms',
      subtitle: 'Fresh from our farm to your table.',
      body: 'Live livestock, poultry, and freshly processed meat — raised with care and delivered with trust.',
      phoneLabel: 'Phone number',
      continueCta: 'Continue',
      termsAcknowledgement: 'By continuing, you agree to our Terms of Service and Privacy Policy.',
    },
    otp: {
      title: 'Verify your number',
      subtitleTemplate: (maskedPhone: string) => `Enter the 6-digit code we sent to ${maskedPhone}`,
      changeNumber: 'Change number',
      resendPrompt: 'Didn’t get a code?',
      resendCta: 'Resend code',
      resendCountdownTemplate: (seconds: number) => `Resend in ${seconds}s`,
      invalidCode: 'That code isn’t right. Please try again.',
      expiredCode: 'This code has expired. Request a new one.',
      success: 'Number verified',
      devHint: 'Demo mode: use code 123456',
    },
    profile: {
      title: 'Tell us about you',
      subtitle: 'This helps us personalize your orders and deliveries.',
      firstNameLabel: 'First name',
      lastNameLabel: 'Last name',
      emailLabel: 'Email (optional)',
      continueCta: 'Continue',
    },
    location: {
      title: 'Set your delivery location',
      subtitle: 'We use this to show accurate delivery times and availability near you.',
      useCurrentLocation: 'Use my current location',
      searchPlaceholder: 'Search for your address or landmark',
      manualEntry: 'Enter address manually',
      permissionDenied: 'We couldn’t access your location. You can still search for your address manually.',
      unavailableArea: 'We don’t deliver to this area yet. You can still browse and select pickup where available.',
      confirmTitle: 'Confirm your address',
      labelPrompt: 'Save this address as',
    },
    complete: {
      greetingTemplate: (firstName: string) => `Welcome, ${firstName}`,
      story:
        'Nokware Farms has raised livestock and poultry with care for over a decade, delivering fresh, honestly-sourced food straight from our farm to your table.',
      trustStatement: 'Every order is farm-verified, hygienically handled, and transparently priced.',
      startShoppingCta: 'Start Shopping',
    },
  },

  home: {
    searchPlaceholder: 'Search livestock, meat, poultry…',
    sections: {
      categories: 'Shop by category',
      popularLivestock: 'Popular livestock',
      freshMeat: 'Fresh meat',
      poultry: 'Poultry & birds',
      farmFavorites: 'Farm favorites',
      freshThisWeek: 'Fresh this week',
      trust: 'Why customers trust us',
      farmStory: 'Our farm story',
    },
    farmStoryBody:
      'From pasture to processing, every animal on Nokware Farms is raised on open land, handled with care, and inspected before it reaches you. We believe fresh food starts with a farm you can trust.',
  },

  trust: {
    items: [
      {
        title: 'Farm-verified sourcing',
        body: 'Every animal and cut is traceable back to our farm.',
      },
      {
        title: 'Hygienic processing',
        body: 'Meat is processed and packaged under strict hygiene standards.',
      },
      {
        title: 'Transparent pricing',
        body: 'No hidden fees — prices and units are always shown clearly.',
      },
      {
        title: 'Reliable delivery',
        body: 'Scheduled delivery windows with live order tracking.',
      },
    ],
  },

  states: {
    loading: {
      title: 'Loading',
      body: 'Just a moment while we fetch the freshest details.',
    },
    noResults: {
      title: 'No results found',
      body: 'Try a different search term or browse our categories instead.',
      action: 'Browse categories',
    },
    noInternet: {
      title: 'You’re offline',
      body: 'Check your internet connection and try again.',
      action: 'Retry',
    },
    locationDenied: {
      title: 'Location access denied',
      body: 'Enter your address manually to see accurate delivery options.',
      action: 'Enter address',
    },
    deliveryUnavailable: {
      title: 'Delivery unavailable here',
      body: 'We don’t deliver to this address yet, but pickup may still be available.',
      action: 'Choose another address',
    },
    emptyCart: {
      title: 'Your cart is empty',
      body: 'Browse live livestock, poultry, and fresh meat to get started.',
      action: 'Start shopping',
    },
    emptyOrders: {
      title: 'No orders yet',
      body: 'Your past and active orders will show up here.',
      action: 'Start shopping',
    },
    emptyFavorites: {
      title: 'No favorites yet',
      body: 'Tap the heart on any product to save it here for later.',
      action: 'Browse products',
    },
    productUnavailable: {
      title: 'Currently unavailable',
      body: 'This product isn’t available right now. Check back soon or explore similar items.',
    },
    insufficientStock: {
      title: 'Limited stock',
      body: 'We don’t have enough in stock to fulfill this quantity right now.',
    },
    invalidPromo: {
      title: 'Invalid promo code',
      body: 'This code doesn’t exist or is no longer valid.',
    },
    sessionExpired: {
      title: 'Session expired',
      body: 'For your security, please verify your number again to continue.',
      action: 'Sign in again',
    },
    failedAddressSearch: {
      title: 'Couldn’t search addresses',
      body: 'Something went wrong while searching. Please try again.',
      action: 'Retry',
    },
    failedOrderSubmission: {
      title: 'Order couldn’t be placed',
      body: 'Something went wrong while placing your order. No charge was made.',
      action: 'Try again',
    },
    paymentFailed: {
      title: 'Payment failed',
      body: 'Your payment could not be processed. No charge was made.',
      action: 'Try again',
    },
  },

  legal: {
    placeholderNotice:
      'This is placeholder legal copy for demonstration purposes. Replace with reviewed legal text before launch.',
  },
} as const
