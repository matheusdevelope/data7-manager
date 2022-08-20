import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({
  credential: cert({
    projectId: 'data7-api',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZZBkUHlYzHmXX\nfXoSd/tRW5aMBwBM453KcNqRC7IxvJ3H5RRsbGkCAz87H+Q6L8bUQtUTE9LO26ZG\nupsOQ3x6NqE0eqLv4Nm4GZ5WM2poor33Xi1WwFJXW0tuoK45I0jL2sESXYCAGcBJ\n8Z9gXUh4ROJVAzoZvULPMze42jYkY5zWgt9r4/LNb/yDRHMLQCIJVZYnPYIFjq6p\n8xtVR5yQeT8m/JdnX4LTcoqTJ3T9DaTHo7GhgB1qXouh0xBw8eVOI9lJ6MML15yl\ndE4tHxBTeSjEorN2MlP60nebPbm3GcHZs9q7i1bkHLlrj3ui2LNhS3mCfGoJt/VI\n3RtOPQeVAgMBAAECggEAEwcgQX2M8qPU1YbFxOYRmQPDlUrA66SkrrqFYbASDykW\nRQ/iY2xzHdpQ54juvhUTzzJxBLQgfeYF6NJJOMy5ZtfEm8ZRirOLUFeVtK/YFC6N\nIstwe9O7oVUmsMPfBrX1l4+fL09V1ws/TyRCB0+YRJwAP4wCbYxTqQqE9GjNLQ64\nUlIE2ffP61v3KE154Cclwa7qPK5N5/8tXrPcL+NgJXbuo/jO+xaxKBnTVScMQt3A\nZX06j3DAdS9PTLfB25q3RhznCkC7cV2zkL43RTrgNTjMt0ftwVrGO/tFIf3xZLJf\nt3cZiQFC2TiSDY6vHUV5HR3iJ4HLuYGLh4ZR8iLTxQKBgQD5lIR8Y9eWkS0Pj7DS\nnnx0PzztCKr30GLlA32hxvGXVxECroagTqU1nFL2+p2BdRK3Gt4TCnNH36o40hz4\nYr+fCzZ+NlopwFrHo74Mf0ZUSPb2WkM7uLCt+jDM26SvN933A8XHO4VZGWJIc2EK\nkpxixPwktk4DgMXb8gLfyR7dHwKBgQDe+52FnlrZy6fdkpoW+Q7s5pViUCjVw5bs\nNl+RR4vLneudpPq0j6VM/I69bY9oPJpubiVnR/xIIkzxoCpPEL6Li9skCxpP874v\nY07PBnS/qppjUvG9v6eZtgGU+SZBhjiEG5ZaTgyh8PSje4DHnRWimGXL84fDyylN\nUAvHMxZQywKBgQDLyzQrhjNiJQVQcZqHQRaKraCIRM2mMSivrBwH37UiSNwA/pW7\njLxmfFFajuXR8dDoZy3zClN72uzaHOe/ApNJwRQsFyGkegcmgVQMTFkXNcVDAA1q\nVLMgPO1gOfHNiabbrt7ugnGugYW5d01EHtdH52WkbKBjR+FIaeNi7I0hLQKBgH9n\nGkCPEu+f6gCyU7JOiVWYBcBPdpV0lFXQV1hFnb0wNMA01D24WUUchF39LFPtVHtG\nGb7iJWX9myLvVV0pfwVyWjpE0bre1Ep1HkExOiGM03tul8rHp3YuxMaeeFo12zK4\nJHbiY1tfthd2aEUlHohxNLCMK4UWHjobQy+Eo/pzAoGAU18aUdXASmAB2e55Itup\nE2xQqUP4PMP+IHUhkbuWBw6ucixoGUaWCkDM8HYLxVgEuPMdFkg2xZD5EQEGT2L5\nIG1PUIiG5vdaIlQz+woVQBnWlLOm8RUyQDk5nvcejWQHnK6groHzlNr+gjHMukGP\nb6eRGLvEv20nUhfsijQtskQ=\n-----END PRIVATE KEY-----\n',
    clientEmail: 'firebase-adminsdk-ir4v6@data7-api.iam.gserviceaccount.com',
  }),
});

export default function useFirestore(
  onError: ((error: Error) => void) | undefined,
) {
  const db = getFirestore();

  function Listen(
    collection: string,
    order_by_field: string,
    onChange: (Doc: FirebaseFirestore.DocumentData) => void,
    limit = 20,
  ) {
    const doc_collection = db
      .collection(collection)
      .orderBy(order_by_field, 'desc')
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
        .where(Field, '==', data[Field])
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
