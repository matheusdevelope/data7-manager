import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
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
    date_field: string,
    cnpj_cpf: string[],
    onChange: (Doc: FirebaseFirestore.DocumentData) => void,
    limit = 50,
  ) {
    const YesterdayDate = new Date();
    YesterdayDate.setDate(YesterdayDate.getDate() - 1);
    const doc_collection = db
      .collection(collection)
      .where("liberacaoKey.cnpj", "in", cnpj_cpf)
      .where(date_field, ">", Timestamp.fromDate(YesterdayDate))
      .orderBy(date_field, "desc")
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
    doc_id: string,
    data: IComumObject,
  ) {
    try {
      await db.collection(collection).doc(doc_id).set(data, { merge: true });
      return Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  }
  async function Add(collection: string, data: IComumObject) {
    try {
      await db.collection(collection).add(data);
      return Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  }

  return { Listen, Update, Add };
}
