import firebase from 'firebase'

interface imagesInterface {
  urlImage: string;
  pathToStorage: string;
}
interface ticketDataUserIdInterface {
  id: string | undefined;
  surname: string | firebase.firestore.DocumentData | undefined;
  name: string | firebase.firestore.DocumentData | undefined;
}

interface ticketDataUserCreatedInterface {
  at: number | string | firebase.firestore.FieldValue;
  by: { id: string | undefined };
}

export { imagesInterface, ticketDataUserCreatedInterface, ticketDataUserIdInterface }
