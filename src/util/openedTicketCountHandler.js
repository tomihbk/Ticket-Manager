import db from '@/firebase/api'
import firebase from 'firebase'

const openedTicketCountHandler = async (ticketFirebaseId, currentState, oldState, isIncremented) => {
  if (oldState === 'Fermé' && currentState !== 'Fermé') {
    const statsRef = db.collection('stats').doc('stats')
    await statsRef.update({
      'total-opened-tickets': firebase.firestore.FieldValue.increment(isIncremented ? 1 : -1)
    })
  }

  try {
    await db.collection('tickets').doc(ticketFirebaseId).update({
      state: currentState,
      oldstate: currentState
    })
  } catch (err) {
    console.log(err)
  }
}

export default openedTicketCountHandler
