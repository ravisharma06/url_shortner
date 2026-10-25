import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="*"
        element={
          <main className="flex min-h-screen items-center justify-center px-5 text-gray-900">
            <section className="text-center">
              <p className="text-sm font-medium text-gray-500">404 error</p>
              <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
              <p className="mt-2 text-sm text-gray-500">
                The page you are looking for doesn&apos;t exist.
              </p>
              <a
                href="/"
                className="mt-6 inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Back to home
              </a>
            </section>
          </main>
        }
      />
    </Routes>
  </BrowserRouter>

)
