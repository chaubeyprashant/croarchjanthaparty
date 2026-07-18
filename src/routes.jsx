import RootLayout from './RootLayout.jsx'
import Home from './pages/Home.jsx'
import Donate from './pages/Donate.jsx'
import { Community } from './pages/Community.jsx'
import { Admin } from './pages/Admin.jsx'
import { Complaints } from './pages/Complaints.jsx'
import { ComplaintCreate } from './pages/ComplaintCreate.jsx'
import { ComplaintDetail } from './pages/ComplaintDetail.jsx'
import { Join } from './pages/Join.jsx'
import { Login } from './pages/Login.jsx'
import { AdminComplaints } from './pages/AdminComplaints.jsx'
import { ComplaintsHeatmap } from './pages/ComplaintsHeatmap.jsx'
import { Articles } from './pages/Articles.jsx'
import { ArticleDetail } from './pages/ArticleDetail.jsx'
import { Chat } from './pages/Chat.jsx'

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'join', element: <Join /> },
      { path: 'login', element: <Login /> },
      { path: 'donate', element: <Donate /> },
      { path: 'community', element: <Community /> },
      { path: 'complaints', element: <Complaints /> },
      { path: 'complaints/new', element: <ComplaintCreate /> },
      { path: 'complaints/heatmap', element: <ComplaintsHeatmap /> },
      { path: 'complaints/:id', element: <ComplaintDetail /> },
      { path: 'admin', element: <Admin /> },
      { path: 'admin/complaints', element: <AdminComplaints /> },
      { path: 'articles', element: <Articles /> },
      { path: 'articles/:id', element: <ArticleDetail /> },
      { path: 'chat', element: <Chat /> },
      { path: '*', element: <Home /> },
    ],
  },
]
