import { defineReactSsgConfig } from 'vite-plugin-react-ssg'
import { routes } from './src/routes.jsx'

const siteUrl = (process.env.VITE_SITE_URL || 'https://cockroachjanthaparty.com').replace(/\/$/, '')

export default defineReactSsgConfig({
  history: 'browser',
  origin: siteUrl,
  routes,
  paths: ['/', '/community', '/complaints', '/complaints/new', '/complaints/heatmap'],
  logLevel: 'normal',
})
