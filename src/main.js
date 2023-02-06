import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCryptojs from 'vue-cryptojs'



createApp(App).use(VueCryptojs).use(VueAxios, axios).mount('#app')
