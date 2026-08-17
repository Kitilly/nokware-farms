import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { CartRequiredRoute } from './CartRequiredRoute'
import { NotFoundPage } from './NotFoundPage'
import { useOnboardingStore } from '@/store/onboarding.store'

const WelcomeScreen = lazy(() => import('@/features/onboarding/WelcomeScreen').then((m) => ({ default: m.WelcomeScreen })))
const OtpScreen = lazy(() => import('@/features/onboarding/OtpScreen').then((m) => ({ default: m.OtpScreen })))
const ProfileScreen = lazy(() => import('@/features/onboarding/ProfileScreen').then((m) => ({ default: m.ProfileScreen })))
const LocationScreen = lazy(() => import('@/features/onboarding/LocationScreen').then((m) => ({ default: m.LocationScreen })))
const PersonalizedWelcomeScreen = lazy(() =>
  import('@/features/onboarding/PersonalizedWelcomeScreen').then((m) => ({ default: m.PersonalizedWelcomeScreen })),
)
const HomePage = lazy(() => import('@/features/home/HomePage').then((m) => ({ default: m.HomePage })))
const SearchResultsPage = lazy(() => import('@/features/search/SearchResultsPage').then((m) => ({ default: m.SearchResultsPage })))
const ShopPage = lazy(() => import('@/features/shop/ShopPage').then((m) => ({ default: m.ShopPage })))
const CategoryPage = lazy(() => import('@/features/shop/CategoryPage').then((m) => ({ default: m.CategoryPage })))
const LiveAnimalDetailPage = lazy(() => import('@/features/product/LiveAnimalDetailPage').then((m) => ({ default: m.LiveAnimalDetailPage })))
const MeatDetailPage = lazy(() => import('@/features/product/MeatDetailPage').then((m) => ({ default: m.MeatDetailPage })))
const CartPage = lazy(() => import('@/features/cart/CartPage').then((m) => ({ default: m.CartPage })))
const CheckoutLayout = lazy(() => import('@/features/checkout/CheckoutLayout').then((m) => ({ default: m.CheckoutLayout })))
const CheckoutAddressStep = lazy(() => import('@/features/checkout/CheckoutAddressStep').then((m) => ({ default: m.CheckoutAddressStep })))
const CheckoutFulfillmentStep = lazy(() => import('@/features/checkout/CheckoutFulfillmentStep').then((m) => ({ default: m.CheckoutFulfillmentStep })))
const CheckoutScheduleStep = lazy(() => import('@/features/checkout/CheckoutScheduleStep').then((m) => ({ default: m.CheckoutScheduleStep })))
const CheckoutContactStep = lazy(() => import('@/features/checkout/CheckoutContactStep').then((m) => ({ default: m.CheckoutContactStep })))
const CheckoutPaymentStep = lazy(() => import('@/features/checkout/CheckoutPaymentStep').then((m) => ({ default: m.CheckoutPaymentStep })))
const CheckoutSummaryStep = lazy(() => import('@/features/checkout/CheckoutSummaryStep').then((m) => ({ default: m.CheckoutSummaryStep })))
const OrderConfirmationPage = lazy(() =>
  import('@/features/order-confirmation/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })),
)
const OrdersListPage = lazy(() => import('@/features/orders/OrdersListPage').then((m) => ({ default: m.OrdersListPage })))
const OrderDetailPage = lazy(() => import('@/features/orders/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })))
const OrderTrackingPage = lazy(() => import('@/features/orders/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage })))
const FavoritesPage = lazy(() => import('@/features/favorites/FavoritesPage').then((m) => ({ default: m.FavoritesPage })))
const NotificationsPage = lazy(() => import('@/features/notifications/NotificationsPage').then((m) => ({ default: m.NotificationsPage })))

const AccountHomePage = lazy(() => import('@/features/account/AccountHomePage').then((m) => ({ default: m.AccountHomePage })))
const ProfilePage = lazy(() => import('@/features/account/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const AddressesPage = lazy(() => import('@/features/account/AddressesPage').then((m) => ({ default: m.AddressesPage })))
const AddressFormPage = lazy(() => import('@/features/account/AddressFormPage').then((m) => ({ default: m.AddressFormPage })))
const PaymentMethodsPage = lazy(() => import('@/features/account/PaymentMethodsPage').then((m) => ({ default: m.PaymentMethodsPage })))
const PaymentMethodFormPage = lazy(() => import('@/features/account/PaymentMethodFormPage').then((m) => ({ default: m.PaymentMethodFormPage })))
const SettingsPage = lazy(() => import('@/features/account/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const NotificationSettingsPage = lazy(() => import('@/features/account/NotificationSettingsPage').then((m) => ({ default: m.NotificationSettingsPage })))
const SecurityPage = lazy(() => import('@/features/account/SecurityPage').then((m) => ({ default: m.SecurityPage })))
const AccessibilityPage = lazy(() => import('@/features/account/AccessibilityPage').then((m) => ({ default: m.AccessibilityPage })))
const PrivacyPage = lazy(() => import('@/features/account/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const DataRequestPage = lazy(() => import('@/features/account/DataRequestPage').then((m) => ({ default: m.DataRequestPage })))
const SupportPage = lazy(() => import('@/features/account/SupportPage').then((m) => ({ default: m.SupportPage })))
const FaqPage = lazy(() => import('@/features/account/FaqPage').then((m) => ({ default: m.FaqPage })))
const ContactSupportPage = lazy(() => import('@/features/account/ContactSupportPage').then((m) => ({ default: m.ContactSupportPage })))
const OrderSupportPage = lazy(() => import('@/features/account/OrderSupportPage').then((m) => ({ default: m.OrderSupportPage })))
const TermsPage = lazy(() => import('@/features/account/TermsPage').then((m) => ({ default: m.TermsPage })))
const AboutFarmPage = lazy(() => import('@/features/account/AboutFarmPage').then((m) => ({ default: m.AboutFarmPage })))

function RouteFallback() {
  return <div className="min-h-screen bg-cream-100" />
}

function RootRedirect() {
  const completed = useOnboardingStore((s) => s.completed)
  return <Navigate to={completed ? '/home' : '/onboarding/welcome'} replace />
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}

function CheckoutGuardLayout() {
  return (
    <CartRequiredRoute>
      <CheckoutLayout />
    </CartRequiredRoute>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/onboarding/welcome" element={<WelcomeScreen />} />
        <Route path="/onboarding/otp" element={<OtpScreen />} />
        <Route path="/onboarding/profile" element={<ProfileScreen />} />
        <Route path="/onboarding/location" element={<LocationScreen />} />
        <Route path="/onboarding/complete" element={<PersonalizedWelcomeScreen />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<CategoryPage />} />
          <Route path="/shop/:category/:subCategory" element={<CategoryPage />} />

          <Route path="/product/live/:slug" element={<LiveAnimalDetailPage />} />
          <Route path="/product/meat/:slug" element={<MeatDetailPage />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/checkout" element={<CheckoutGuardLayout />}>
            <Route index element={<Navigate to="address" replace />} />
            <Route path="address" element={<CheckoutAddressStep />} />
            <Route path="fulfillment" element={<CheckoutFulfillmentStep />} />
            <Route path="schedule" element={<CheckoutScheduleStep />} />
            <Route path="contact" element={<CheckoutContactStep />} />
            <Route path="payment" element={<CheckoutPaymentStep />} />
            <Route path="summary" element={<CheckoutSummaryStep />} />
          </Route>
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/orders/:orderId/tracking" element={<OrderTrackingPage />} />

          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/account" element={<AccountHomePage />} />
          <Route path="/account/profile" element={<ProfilePage />} />
          <Route path="/account/addresses" element={<AddressesPage />} />
          <Route path="/account/addresses/new" element={<AddressFormPage />} />
          <Route path="/account/addresses/:addressId/edit" element={<AddressFormPage />} />
          <Route path="/account/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/account/payment-methods/new" element={<PaymentMethodFormPage />} />
          <Route path="/account/settings" element={<SettingsPage />} />
          <Route path="/account/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/account/settings/security" element={<SecurityPage />} />
          <Route path="/account/settings/accessibility" element={<AccessibilityPage />} />
          <Route path="/account/privacy" element={<PrivacyPage />} />
          <Route path="/account/privacy/data-request" element={<DataRequestPage />} />
          <Route path="/account/support" element={<SupportPage />} />
          <Route path="/account/support/faq" element={<FaqPage />} />
          <Route path="/account/support/contact" element={<ContactSupportPage />} />
          <Route path="/account/support/order/:orderId" element={<OrderSupportPage />} />
          <Route path="/account/terms" element={<TermsPage />} />
          <Route path="/account/about-farm" element={<AboutFarmPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
