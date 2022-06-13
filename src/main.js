import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import './assets/styles/base.scss'
import * as THREE from 'three'
window.THREE = THREE
createApp(App).use(store).use(router).mount('#app')
