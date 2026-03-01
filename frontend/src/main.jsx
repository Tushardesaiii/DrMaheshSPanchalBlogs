import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ContentProvider } from './context/ContentContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <App />
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F3A33',
                color: '#F3EBDD',
                padding: '16px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #B89B5E',
                boxShadow: '0 10px 40px rgba(15, 23, 42, 0.25)',
                maxWidth: '500px',
              },
              success: {
                duration: 4000,
                style: {
                  background: '#1F3A33',
                  color: '#F3EBDD',
                  border: '1px solid #10b981',
                },
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#F3EBDD',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#1F3A33',
                  color: '#F3EBDD',
                  border: '1px solid #ef4444',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#F3EBDD',
                },
              },
              loading: {
                style: {
                  background: '#1F3A33',
                  color: '#F3EBDD',
                  border: '1px solid #B89B5E',
                },
                iconTheme: {
                  primary: '#B89B5E',
                  secondary: '#F3EBDD',
                },
              },
            }}
          />
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
