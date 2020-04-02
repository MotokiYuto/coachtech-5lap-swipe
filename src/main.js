import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

Vue.config.productionTip = false
const config = {
 apiKey: 'AIzaSyCp8wfuHOe2_JKMOje1XPudE7acP-wGaA0',
 projectId: 'lap-137f9',
 authDomain: 'lap-137f9.firebaseapp.com',
 databaseURL: 'https://lap-137f9.firebaseio.com',
 storageBucket: 'lap-137f9.appspot.com',
}


firebase.initializeApp(config);


export default firebase;
new Vue({
 router,
 store,
 render: h => h(App)
}).$mount('#app')
