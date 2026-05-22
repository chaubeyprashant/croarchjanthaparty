import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHead, UnheadProvider } from '@unhead/react/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import { routes } from './routes.jsx'

const hydrationData = window.__staticRouterHydrationData
const router = createBrowserRouter(routes, { hydrationData })
const head = createHead()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UnheadProvider head={head}>
      <RouterProvider router={router} />
      <Analytics />
    </UnheadProvider>
  </StrictMode>,
)
