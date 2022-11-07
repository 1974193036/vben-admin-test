import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
// import './style.css'
// import 'animate.css' // 引入动画

import { createApp } from 'vue'
import { setupRouter } from '@/router'
import App from './App.vue'

function bootstrap() {
  const app = createApp(App)

  // 注册路由
  setupRouter(app)

  app.mount('#app')
}

bootstrap()
