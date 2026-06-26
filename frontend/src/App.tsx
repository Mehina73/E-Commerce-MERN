import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/NavBar"
import RegisterPage from "./pages/RegisterPage"
import AuthProvider from "./context/Auth/AuthProvider"
import CartPage from "./pages/CartPage"
import ProtectedRoute from "./components/ProtectedRoute"
import CartProvider from "./context/Cart/CartProvider"
import CheckoutPage from "./pages/CheckoutPage"
import SuccessPage from "./pages/SuccessPage"


function App() {

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/mycart" element={<CartPage />} />
              <Route path="/cart/checkout" element={<CheckoutPage />} />
              <Route path="/cart/success" element={<SuccessPage />} />
            </Route>
          </Routes >
        </ BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
