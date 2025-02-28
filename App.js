import { ToastProvider } from "react-native-toast-notifications";
import AppNavigator from "./Screens/Navigation/AppNavigator"; // Đảm bảo đường dẫn chính xác
import { CartProvider } from "./Screens/CartContext"; // Đảm bảo đường dẫn chính xác

export default function App() {
  return (
    <ToastProvider
      placement="top"
      duration={3000}
      animationType="slide-in"
      successColor="green"
      dangerColor="red"
      warningColor="orange"
    >
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </ToastProvider>
  );
}
