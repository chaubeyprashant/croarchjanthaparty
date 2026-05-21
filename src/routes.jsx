import RootLayout from './RootLayout.jsx'
import { Home } from './pages/Home.jsx'
import { Donate } from './pages/Donate.jsx'
import { Community } from './pages/Community.jsx'
import { Admin } from './pages/Admin.jsx'

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'donate', element: <Donate /> },
      { path: 'community', element: <Community /> },
      { path: 'admin', element: <Admin /> },
      { path: '*', element: <Home /> },
    ],
  },
]
