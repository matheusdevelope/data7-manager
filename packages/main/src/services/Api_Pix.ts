import type { Timestamp } from "firebase-admin/firestore";
import { EnumKeys } from "../../../../types/enums/configTabsAndKeys";
import { Global_State } from "../global_state";
import { apenasNumeros } from "../utils";
import useFirestore from "./firebase";
import { GetConfigTabs, GetValuesFirebase } from "./local_storage";
import { CallQrCode } from "./protocoll_events";

const Firestore = useFirestore(console.error);
const CollectionUpdate = "refresh-pix";

const ID_and_STATUS_original = {
  status: "",
  id: "",
};

export function StartPixSrvice() {
  const Config = GetConfigTabs();
  const FieldsFirebase = GetValuesFirebase();
  const ObjCNPJ = Config
    ? Config.find((obj) => obj.key === EnumKeys.cnpj_cpf)
    : undefined;
  const CNPJs = ObjCNPJ && Array.isArray(ObjCNPJ.value) ? ObjCNPJ.value : [];
  const FieldsToLowerCase = [
    FieldsFirebase.ip,
    FieldsFirebase.machine_name,
    FieldsFirebase.status_awaiting_payment,
    FieldsFirebase.status_confirmed_payment,
    FieldsFirebase.status_canceled,
    FieldsFirebase.status_field,
  ];

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

  const unsubscriber = Firestore.Listen(
    FieldsFirebase.collection,
    FieldsFirebase.created_at,
    (doc) => {
      const data: {
        [key: string]:
          | string
          | boolean
          | number
          | { [key: string]: string | boolean | number };
      } = {};

      for (const key in doc) {
        if (Object.prototype.hasOwnProperty.call(doc, key)) {
          if (typeof doc[key] == "string") {
            if (FieldsFirebase.id == key.toLowerCase()) {
              ID_and_STATUS_original.id = key;
            }
            if (FieldsFirebase.status_field == key.toLowerCase()) {
              ID_and_STATUS_original.status = key;
            }
            if (FieldsToLowerCase.includes(key.toLowerCase())) {
              data[key.toLowerCase()] = doc[key].toLowerCase();
            } else {
              data[key.toLowerCase()] = doc[key];
            }
          } else {
            data[key.toLowerCase()] = doc[key];
          }
        }
      }
      if (!data[FieldsFirebase.liberation_key]) return;

      const LiberacaoKey: {
        [key: string]: string | boolean | number;
      } = {};

      const tempLiberacaoKey: {
        [key: string]: string | boolean | number;
      } = data[FieldsFirebase.liberation_key] as {
        [key: string]: string | boolean | number;
      };

      for (const key in tempLiberacaoKey) {
        if (Object.prototype.hasOwnProperty.call(tempLiberacaoKey, key)) {
          if (typeof tempLiberacaoKey[key] == "string") {
            if (FieldsToLowerCase.includes(key.toLowerCase())) {
              LiberacaoKey[key.toLowerCase()] = tempLiberacaoKey[key]
                .toString()
                .toLowerCase();
            } else {
              LiberacaoKey[key.toLowerCase()] = tempLiberacaoKey[key];
            }
          } else {
            LiberacaoKey[key.toLowerCase()] = tempLiberacaoKey[key];
          }
        }
      }

      if (
        ![
          FieldsFirebase.status_awaiting_payment,
          FieldsFirebase.status_confirmed_payment,
          FieldsFirebase.status_canceled,
          FieldsFirebase.status_canceled_system,
          FieldsFirebase.status_canceled_client,
        ].includes(String(data[FieldsFirebase.status_field]))
      )
        return;

      if (
        apenasNumeros(CNPJs.join(",")).includes(
          apenasNumeros(String(LiberacaoKey[FieldsFirebase.cnpj] || "")),
        ) &&
        (FieldsFirebase.validate_ip === true
          ? String(LiberacaoKey[FieldsFirebase.ip]) == Global_State.local_ip
          : true) &&
        String(LiberacaoKey[FieldsFirebase.machine_name]).toLowerCase() ==
          Global_State.hostname.toLowerCase() &&
        String(LiberacaoKey[FieldsFirebase.username]).toLowerCase() ==
          Global_State.username_machine.toLowerCase()
      ) {
        const TheTimestamp =
          (data[FieldsFirebase.created_at] as unknown as Timestamp) ||
          (data.doc_created_at as unknown as Timestamp);

        const QrCode: IDataQrCode = {
          action: "open",
          id: String(data[FieldsFirebase.id] || ""),
          price: Number(data[FieldsFirebase.price]),
          portion: String(data[FieldsFirebase.portion] || ""),
          img: String(data[FieldsFirebase.img] || ""),
          link: String(data[FieldsFirebase.link] || ""),
          phone: String(data[FieldsFirebase.phone] || ""),
          awaiting_payment:
            String(data[FieldsFirebase.status_field]).toLowerCase() ==
            FieldsFirebase.status_awaiting_payment.toLowerCase(),
          confirmed_payment:
            String(data[FieldsFirebase.status_field] || "").toLowerCase() ==
            FieldsFirebase.status_confirmed_payment.toLowerCase(),
          canceled: [
            FieldsFirebase.status_canceled,
            FieldsFirebase.status_canceled_system,
            FieldsFirebase.status_canceled_client,
          ].includes(
            String(data[FieldsFirebase.status_field] || "").toLowerCase(),
          ),
          message: String(data[FieldsFirebase.message] || ""),
          created_at: TheTimestamp.toDate(),
          doc_id: String(data.doc_id),
        };
        if (data[FieldsFirebase.error]) {
          QrCode["error"] = String(data[FieldsFirebase.error] || "");
        }
        if (
          !QrCode.awaiting_payment &&
          !QrCode.confirmed_payment &&
          !QrCode.canceled
        ) {
          QrCode.error = "Nenhum status informado. Tente novamente.";
          QrCode.message = "Nenhum status informado. Tente novamente.";
        }

        if (data.qtd_docs > 1 && !QrCode.awaiting_payment) return;

        const index = lista.findIndex((obj) => obj.id == QrCode.id);
        if (index >= 0) {
          lista.splice(index, 1, QrCode);
        } else {
          lista.push(QrCode);
        }

        if (index < 0 && !QrCode.awaiting_payment) return;

        lista.sort((a, b) =>
          a.created_at > b.created_at ? 1 : b.created_at > a.created_at ? -1 : 0,
        );

        CallQrCode({
          qrcode: lista[0],
          callback: () => console.log,
        });
        if (!QrCode.awaiting_payment) {
          lista = lista.filter((obj) => obj.id !== QrCode.id);
          setTimeout(() => {
            CallQrCode({
              qrcode:
                lista.length > 0 ? lista[0] : { ...QrCode, action: "close" },
              callback: () => console.log,
            });
          }, 1200);
        }
      }
    },
  );
  return () => {
    unsubscriber();
    CallQrCode({
      qrcode: {
        ...InitialPix,
        action: "close",
        message: "Serviço Firestore Desabilitado.",
      },
      callback: () => console.log,
    });
  };
}

export async function CancelPix(id: string): Promise<ICancelQr> {
  // const Config = GetConfigTabs();
  const FieldsFirebase = GetValuesFirebase();
  const data: { [key: string]: string } = {};
  data[ID_and_STATUS_original.status] =
    FieldsFirebase.status_canceled_client.toUpperCase();
  data[ID_and_STATUS_original.id] = id;

  try {
    await Firestore.Update(
      FieldsFirebase.collection,
      ID_and_STATUS_original.id, // FieldsFirebase.id,
      data,
    );
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
  const data: { [key: string]: boolean | string } = {};
  data[FieldsFirebase.id] = id;

  try {
    await Firestore.Add(CollectionUpdate, data);
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
