import { Global_State } from '../global_state';
import { apenasNumeros } from '../utils';
import useFirestore from './firebase';
import { CallQrCode } from './protocoll_events';

const Firestore = useFirestore(console.error);
const LocalConfig = Global_State.localConfig();
const CollectionUpdate = 'refresh-pix';
const FieldsToLowerCase = [
  LocalConfig.firebase_ip,
  LocalConfig.firebase_machine_name,
  LocalConfig.firebase_status_awaiting_payment,
  LocalConfig.firebase_status_confirmed_payment,
  LocalConfig.firebase_status_canceled,
  LocalConfig.firebase_status,
];

const ID_and_STATUS_original = {
  status: '',
  id: '',
};

export function StartPixSrvice() {
  let lista: IDataQrCode[] = [];
  const InitialPix: IDataQrCode = {
    action: '',
    id: '',
    portion: '',
    price: 0,
    img: '',
    link: '',
    phone: '',
    awaiting_payment: true,
    confirmed_payment: false,
    canceled: false,
    message: 'Aguardando Ação',
    created_at: new Date(),
  };

  const unsubscriber = Firestore.Listen(
    LocalConfig.firebase_collection,
    LocalConfig.firebase_created_at,
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
          if (typeof doc[key] == 'string') {
            if (LocalConfig.firebase_id == key.toLowerCase()) {
              ID_and_STATUS_original.id = key;
            }
            if (LocalConfig.firebase_status == key.toLowerCase()) {
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

      if (!data[LocalConfig.firebase_liberation_key]) return;

      const LiberacaoKey: {
        [key: string]: string | boolean | number;
      } = {};

      const tempLiberacaoKey: {
        [key: string]: string | boolean | number;
      } = data[LocalConfig.firebase_liberation_key] as {
        [key: string]: string | boolean | number;
      };

      for (const key in tempLiberacaoKey) {
        if (Object.prototype.hasOwnProperty.call(tempLiberacaoKey, key)) {
          if (typeof tempLiberacaoKey[key] == 'string') {
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
          LocalConfig.firebase_status_awaiting_payment,
          LocalConfig.firebase_status_confirmed_payment,
          LocalConfig.firebase_status_canceled,
          LocalConfig.firebase_status_canceled_system,
          LocalConfig.firebase_status_canceled_client,
        ].includes(String(data[LocalConfig.firebase_status]))
      )
        return;
      // appendFileSync("docs.json", JSON.stringify(doc) + ",\n");
      // writeFileSync("config-formated.json", JSON.stringify(LocalConfig));
      if (
        apenasNumeros(LocalConfig.cnpj.join(',')).includes(
          apenasNumeros(String(LiberacaoKey[LocalConfig.firebase_cnpj] || '')),
        ) &&
        (LocalConfig.firebase_validate_ip === true
          ? LiberacaoKey[LocalConfig.firebase_ip] == Global_State.local_ip
          : true) &&
        LiberacaoKey[LocalConfig.firebase_machine_name] ==
          Global_State.hostname.toLowerCase()
        //    &&
        // LiberacaoKey[LocalConfig.firebase_username] ==
        //   Global_State.username_machine
      ) {
        const QrCode: IDataQrCode = {
          action: 'open',
          id: String(data[LocalConfig.firebase_id] || ''),
          price: Number(data[LocalConfig.firebase_price]),
          portion: String(data[LocalConfig.firebase_portion] || ''),
          img: String(data[LocalConfig.firebase_img] || ''),
          link: String(data[LocalConfig.firebase_link] || ''),
          phone: String(data[LocalConfig.firebase_phone] || ''),
          awaiting_payment:
            String(data[LocalConfig.firebase_status]).toLowerCase() ==
            LocalConfig.firebase_status_awaiting_payment.toLowerCase(),
          confirmed_payment:
            String(data[LocalConfig.firebase_status] || '').toLowerCase() ==
            LocalConfig.firebase_status_confirmed_payment.toLowerCase(),
          canceled: [
            LocalConfig.firebase_status_canceled,
            LocalConfig.firebase_status_canceled_system,
            LocalConfig.firebase_status_canceled_client,
          ].includes(
            String(data[LocalConfig.firebase_status] || '').toLowerCase(),
          ),
          // String(data[LocalConfig.firebase_status] || "").toLowerCase() ==
          // LocalConfig.firebase_status_canceled.toLowerCase(),
          message: String(data[LocalConfig.firebase_message] || ''),
          created_at: new Date(
            String(data[LocalConfig.firebase_created_at]) ||
              String(data.doc_created_at),
          ),
        };
        // console.log(QrCode);

        if (data[LocalConfig.firebase_error]) {
          QrCode['error'] = String(data[LocalConfig.firebase_error] || '');
        }
        if (
          !QrCode.awaiting_payment &&
          !QrCode.confirmed_payment &&
          !QrCode.canceled
        ) {
          QrCode.error = 'Nenhum status informado. Tente novamente.';
          QrCode.message = 'Nenhum status informado. Tente novamente.';
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
          devices: [],
          callback: () => console.log,
        });
        if (!QrCode.awaiting_payment) {
          lista = lista.filter((obj) => obj.id !== QrCode.id);
          setTimeout(() => {
            CallQrCode({
              qrcode:
                lista.length > 0 ? lista[0] : { ...QrCode, action: 'close' },
              devices: [],
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
        action: 'close',
        message: 'Serviço Firestore Desabilitado.',
      },
      devices: [],
      callback: () => console.log,
    });
  };
}

export async function CancelPix(id: string): Promise<ICancelQr> {
  const data: { [key: string]: string } = {};
  data[ID_and_STATUS_original.status] =
    LocalConfig.firebase_status_canceled_client.toUpperCase();
  data[ID_and_STATUS_original.id] = id;

  try {
    await Firestore.Update(
      LocalConfig.firebase_collection,
      ID_and_STATUS_original.id, // LocalConfig.firebase_id,
      data,
    );
    return Promise.resolve({
      canceled: true,
      message: 'Cancelamento solicitado com sucesso, aguarde!',
    });
  } catch (error) {
    return Promise.reject({
      canceled: false,
      message: 'Falha ao solicitar o cancelamento do PIX. Tente novamente.',
      error: JSON.stringify(error),
    });
  }
}
export async function RefreshPix(id: string): Promise<IRefreshQr> {
  const data: { [key: string]: boolean | string } = {};
  data[LocalConfig.firebase_id] = id;

  try {
    await Firestore.Add(CollectionUpdate, data);
    return Promise.resolve({
      canceled: false,
      awaiting_payment: true,
      confirmed_payment: false,
      message: 'Atualização solicitada...',
    });
  } catch (error) {
    return Promise.reject({
      canceled: false,
      message: 'Falha ao solicitar o cancelamento do PIX. Tente novamente.',
      error: JSON.stringify(error),
    });
  }
}
