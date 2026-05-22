import { defineReactSsgConfig } from 'vite-plugin-react-ssg'
import { routes } from './src/routes.jsx'

export default defineReactSsgConfig({
  history: 'browser',
  origin: 'https://cockroachjantaparty.org',
  routes,
  paths: ['/donate', '/community', '/complaints', '/complaints/new', '/complaints/heatmap'],
  logLevel: 'normal',
})
