import db from '../firebase/api'
import firebase from 'firebase'

const openedTicketCountHandler = async (ticketFirebaseId:string, currentState:string, oldState:string, isIncremented:boolean) => {
  if (oldState === 'Fermé' && currentState !== 'Fermé') {
    updateTicketCount(ticketFirebaseId, currentState, isIncremented)
    return
  }

  if (oldState !== 'Fermé' && currentState === 'Fermé') {
    updateTicketCount(ticketFirebaseId, currentState, isIncremented)
    return
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

const updateTicketCount = async (ticketFirebaseId:string, currentState:string, isIncremented:boolean) => {
  const statsRef = db.collection('stats').doc('stats')
  await statsRef.update({
    'total-opened-tickets': firebase.firestore.FieldValue.increment(isIncremented ? 1 : -1)
  })

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
