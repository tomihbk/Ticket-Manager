import firebase from 'firebase'

var firebaseConfig = {
  apiKey: 'AIzaSyBJpNmk8_scixqjZ0hd1x3QSOCU4z_nmU4',
  authDomain: 'ticket-manager-gxc-b38f7.firebaseapp.com',
  projectId: 'ticket-manager-gxc-b38f7',
  storageBucket: 'ticket-manager-gxc-b38f7.appspot.com',
  messagingSenderId: '572999335419',
  appId: '1:572999335419:web:2e3d19a98d255e7ee9df5e'
}
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
firebaseApp.firestore().settings({ timestampsInSnapshots: true })
export default firebaseApp.firestore()
