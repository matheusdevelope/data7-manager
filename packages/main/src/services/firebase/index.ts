import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
const serviceAccount = require("./certificates/firebase.json");
initializeApp({
  credential: cert(serviceAccount),
});

export default function useFirestore(
  onError: ((error: Error) => void) | undefined,
) {
  const db = getFirestore();

  function Listen(
    collection: string,
    order_by_field: string,
    onChange: (Doc: FirebaseFirestore.DocumentData) => void,
    limit = 50,
  ) {
    const doc_collection = db
      .collection(collection)
      .orderBy(order_by_field, "desc")
      .limit(limit);

    const unsub = doc_collection.onSnapshot((data) => {
      data.docChanges().forEach((change) => {
        const data_doc = change.doc.data();

        onChange({
          doc_id: change.doc.id,
          doc_created_at: change.doc.createTime.toDate(),
          qtd_docs: data.docChanges().length,
          ...data_doc,
        });
      });
    }, onError);
    return unsub;
  }

  async function Update(
    collection: string,
    Field: string,
    data: {
      [key: string]: string;
    },
  ) {
    try {
      const DocById = db
        .collection(collection)
        .where(Field, "==", data[Field])
        .get();

      await db
        .collection(collection)
        .doc((await DocById).docs[0].id)
        .set(data, { merge: true });

      return Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  }
  async function Add(
    collection: string,
    data: {
      [key: string]: string | boolean;
    },
  ) {
    try {
      await db.collection(collection).add(data);
      return Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  }

  return { Listen, Update, Add };
}
