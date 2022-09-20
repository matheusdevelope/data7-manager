import { EnumKeysTerminalData } from "../../../../types/enums/configTabsAndKeys";
import { Global_State } from "../global_state";
import { ObjectToLowerCase } from "../utils";
import useFirestore from "./firebase";
import { GetConfigTabs, GetValuesFirebase } from "./local_storage";
import { CallQrCode } from "./protocoll_events";

const Firestore = useFirestore(console.error);

const ID_and_STATUS_original = {
  status: "",
  id: "",
};
let lista: IDataQrCode[] = [];
const InitialPix: IDataQrCode = {
  action: "",
  id: "",
  portion: "",
  price: 0,
  img: "",
  link: "",
  phone: "",
  awaiting_payment: true,
  confirmed_payment: false,
  canceled: false,
  message: "Aguardando Ação",
  created_at: new Date(),
  doc_id: "",
};

export function StartPixService() {
  const Config = GetConfigTabs();
  const FieldsFirebase = GetValuesFirebase();
  const ObjCNPJ = Config
    ? Config.find((obj) => obj.key === EnumKeysTerminalData.cnpj_cpf)
    : undefined;
  const CNPJs = ObjCNPJ && Array.isArray(ObjCNPJ.value) ? ObjCNPJ.value : [];
  const AvailableStatus = [
    FieldsFirebase.status_awaiting_payment,
    FieldsFirebase.status_finish_payment,
    FieldsFirebase.status_canceled_system,
    FieldsFirebase.status_canceled_client,
  ];
  const CanceledStatus = [
    FieldsFirebase.status_canceled_system,
    FieldsFirebase.status_canceled_client,
  ];

  const unsubscriber = Firestore.Listen(
    FieldsFirebase.collection,
    FieldsFirebase.created_at,
    CNPJs,
    (doc) => {
      const data: {
        [key: string]: string | boolean | number | IComumObject2;
      } = ObjectToLowerCase<IComumObject2>(doc);
      // console.log({ ID: doc.doc_id, status: doc.STATUS });

      //Save the original key of STATUS and ID to use in future
      for (const key in doc) {
        if (Object.prototype.hasOwnProperty.call(doc, key)) {
          if (FieldsFirebase.id == key.toLowerCase()) {
            ID_and_STATUS_original.id = key;
          }
          if (FieldsFirebase.status_field == key.toLowerCase()) {
            ID_and_STATUS_original.status = key;
          }
        }
      }

      //Validate if the doc contain the sub doc with the required data
      if (!data[FieldsFirebase.liberation_key]) return;
      const LiberationKey = data[FieldsFirebase.liberation_key] as IComumObject;

      //Validate if the states os doc is one of the AvailableStatus to listen
      if (
        !AvailableStatus.includes(
          data[FieldsFirebase.status_field].toString().toLowerCase(),
        )
      )
        return;
      //Validate if the hostname is equal the value in the document
      if (
        LiberationKey[FieldsFirebase.machine_name].toString().toLowerCase() ===
        Global_State.hostname.toLowerCase()
      ) {
        const StatusInDoc = String(
          data[FieldsFirebase.status_field],
        ).toLowerCase();

        const QrCode: IDataQrCode = {
          action: "open",
          id: String(data[FieldsFirebase.id] || ""),
          price: Number(data[FieldsFirebase.price] || ""),
          portion: String(data[FieldsFirebase.portion] || ""),
          img: String(data[FieldsFirebase.img] || ""),
          link: String(data[FieldsFirebase.link] || ""),
          phone: String(data[FieldsFirebase.phone] || ""),
          awaiting_payment:
            StatusInDoc ===
            FieldsFirebase.status_awaiting_payment.toLowerCase(),
          confirmed_payment:
            StatusInDoc === FieldsFirebase.status_finish_payment.toLowerCase(),
          canceled: CanceledStatus.includes(StatusInDoc),
          message: String(data[FieldsFirebase.message] || ""),
          created_at: new Date(),
          doc_id: String(data.doc_id),
          error: String(data[FieldsFirebase.error] || ""),
        };

        if (
          !QrCode.awaiting_payment &&
          !QrCode.confirmed_payment &&
          !QrCode.canceled
        ) {
          const message =
            "Nenhum status valido informado. Tente novamente. \nStatus Recebido:" +
            StatusInDoc;
          QrCode.error = message;
          QrCode.message = message;
        }
        //Filter the initial SnapShot to only insert in the list DOC with active state
        if (data.qtd_docs > 1 && !QrCode.awaiting_payment) return;

        //Index of the current DOC
        const index = lista.findIndex((obj) => obj.id == QrCode.id);

        if (index >= 0) {
          //UPDATE the DOC in the list
          lista.splice(index, 1, QrCode);
        } else {
          //INSERT the DOC in the list
          if (!QrCode.awaiting_payment) return;
          lista.push(QrCode);
        }
        //Validate if the LIST is empty and the DOC have a active state
        if (index < 0 && !QrCode.awaiting_payment) return;
        lista.sort((a, b) =>
          a.created_at < b.created_at ? 1 : b.created_at < a.created_at ? -1 : 0,
        );

        CallQrCode(lista[0]);
        if (!QrCode.awaiting_payment) {
          lista = lista.filter((obj) => obj.id !== QrCode.id);
          setTimeout(() => {
            CallQrCode(
              lista.length > 0 ? lista[0] : { ...InitialPix, action: "close" },
            );
          }, 1200);
        }
      }
    },
  );
  return () => {
    unsubscriber();
    CallQrCode({
      ...InitialPix,
      action: "close",
      message: "Serviço Firestore Desabilitado.",
    });
  };
}

export async function CancelPix(doc_id: string): Promise<ICancelQr> {
  const FieldsFirebase = GetValuesFirebase();
  const data: { [key: string]: string } = {};
  data[ID_and_STATUS_original.status] =
    FieldsFirebase.status_canceled_client.toUpperCase();

  try {
    await Firestore.Update(FieldsFirebase.collection, doc_id, data);
    return Promise.resolve({
      canceled: true,
      message: "Cancelamento solicitado com sucesso, aguarde!",
    });
  } catch (error) {
    return Promise.reject({
      canceled: false,
      message: "Falha ao solicitar o cancelamento do PIX. Tente novamente.",
      error: JSON.stringify(error),
    });
  }
}
export async function RefreshPix(id: string): Promise<IRefreshQr> {
  const FieldsFirebase = GetValuesFirebase();
  const data: IComumObject = {};
  data[FieldsFirebase.id] = id;

  try {
    await Firestore.Add(FieldsFirebase.collection_refresh, data);
    return Promise.resolve({
      canceled: false,
      awaiting_payment: true,
      confirmed_payment: false,
      message: "Atualização solicitada...",
    });
  } catch (error) {
    return Promise.reject({
      canceled: false,
      message: "Falha ao solicitar o cancelamento do PIX. Tente novamente.",
      error: JSON.stringify(error),
    });
  }
}
