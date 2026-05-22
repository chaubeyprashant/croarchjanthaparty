import RootLayout from './RootLayout.jsx'
import { Home } from './pages/Home.jsx'
// import { Donate } from './pages/Donate.jsx' // Temporarily disabled
import { Community } from './pages/Community.jsx'
import { Admin } from './pages/Admin.jsx'
import { Complaints } from './pages/Complaints.jsx'
import { ComplaintCreate } from './pages/ComplaintCreate.jsx'
import { ComplaintDetail } from './pages/ComplaintDetail.jsx'
import { AdminComplaints } from './pages/AdminComplaints.jsx'
import { ComplaintsHeatmap } from './pages/ComplaintsHeatmap.jsx'

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      // { path: 'donate', element: <Donate /> }, // Temporarily disabled
      { path: 'community', element: <Community /> },
      { path: 'complaints', element: <Complaints /> },
      { path: 'complaints/new', element: <ComplaintCreate /> },
      { path: 'complaints/heatmap', element: <ComplaintsHeatmap /> },
      { path: 'complaints/:id', element: <ComplaintDetail /> },
      { path: 'admin', element: <Admin /> },
      { path: 'admin/complaints', element: <AdminComplaints /> },
      { path: '*', element: <Home /> },
    ],
  },
]
