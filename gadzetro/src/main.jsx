import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.jsx'
import { CartStoreProvider } from './context/CartStore.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartStoreProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
        </WishlistProvider>
      </CartStoreProvider>
    </AuthProvider>
  </React.StrictMode>
)
