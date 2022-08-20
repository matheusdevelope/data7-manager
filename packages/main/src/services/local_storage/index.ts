import { safeStorage } from 'electron';
import type { Schema } from 'electron-store';
import Store from 'electron-store';

const DefaultConfig = [
  {
    key: 'cnpj',
    value: JSON.stringify([]),
    label: 'CNPJ Empresa',
    type: 'array',
    order: 0,
  },
  {
    key: 'firebase_validate_ip',
    value: false,
    label:
      'Define se o IP local vai ser comparado com o do recebido no evento de cobrança.',
    type: 'checkbox',
    order: 1,
  },
  {
    key: 'firebase_collection',
    value: 'cobrancas-pix',
    label: 'Nome da coleção dos registros do  Pix',
    type: 'text',
    order: 2,
  },
  {
    key: 'firebase_liberation_key',
    value: 'LiberacaoKey',
    label: 'Nome da coleção dos registros do  Pix',
    type: 'text',
    order: 3,
  },
  {
    key: 'firebase_cnpj',
    value: 'cnpj',
    label: 'Campo CNPJ do  Pix',
    type: 'text',
    order: 4,
  },
  {
    key: 'firebase_ip',
    value: 'ip',
    label: 'Campo IP do  Pix',
    type: 'text',
    order: 5,
  },
  {
    key: 'firebase_username',
    value: 'nomeUsuario',
    label: 'Campo Usuário Conectado Windows do  Pix',
    type: 'text',
    order: 6,
  },
  {
    key: 'firebase_machine_name',
    value: 'estacaoTrabalho',
    label: 'Campo Estacao Conectada Windows do  Pix',
    type: 'text',
    order: 7,
  },
  {
    key: 'firebase_id',
    value: 'txid',
    label: 'Campo ID do Pix',
    type: 'text',
    order: 8,
  },
  {
    key: 'firebase_price',
    value: 'valor',
    label: 'Campo Valor do Pix',
    type: 'text',
    order: 9,
  },
  {
    key: 'firebase_portion',
    value: 'parcela',
    label: 'Campo Parcela do Pix',
    type: 'text',
    order: 10,
  },
  {
    key: 'firebase_img',
    value: 'imagemqrcode',
    label: 'Campo Imagem Base64 do Pix',
    type: 'text',
    order: 11,
  },
  {
    key: 'firebase_link',
    value: 'linkqrcode',
    label: 'Campo Link Copia e Cola do Pix',
    type: 'text',
    order: 12,
  },
  {
    key: 'firebase_phone',
    value: 'telefone',
    label: 'Campo Tefone do Pix',
    type: 'text',
    order: 13,
  },
  {
    key: 'firebase_status',
    value: 'status',
    label: 'Campo Status do Pix',
    type: 'text',
    order: 14,
  },
  {
    key: 'firebase_message',
    value: 'mensagem',
    label: 'Campo Mensagem do Pix',
    type: 'text',
    order: 15,
  },
  {
    key: 'firebase_created_at',
    value: 'DataCriacao',
    label: 'Campo Data de Criação do Pix',
    type: 'text',
    order: 16,
  },
  {
    key: 'firebase_error',
    value: 'error',
    label: 'Campo de dados de Erro do Pix',
    type: 'text',
    order: 17,
  },
  {
    key: 'firebase_status_awaiting_payment',
    value: 'ATIVO',
    label: 'Status do Pix ABERTO',
    type: 'text',
    order: 18,
  },
  {
    key: 'firebase_status_confirmed_payment',
    value: 'CONCLUIDO',
    label: 'Status do Pix FINALIZADO',
    type: 'text',
    order: 19,
  },
  {
    key: 'firebase_status_canceled',
    value: 'CANCELADO',
    label: 'Status do Pix CANCELADO',
    type: 'text',
    order: 20,
  },
  {
    key: 'firebase_status_canceled_system',
    value: 'CANCELADO-SISTEMA',
    label: 'Status do Pix CANCELADO pelo sistema',
    type: 'text',
    order: 21,
  },
  {
    key: 'firebase_status_canceled_client',
    value: 'CANCELADO-CLIENTE',
    label: 'Status do Pix CANCELADO pelo cliente',
    type: 'text',
    order: 22,
  },
];

const Schema_Storage: Schema<Record<string, string>> = {
  application_pass: {
    type: 'string',
  },
  application_ids: {
    type: 'array',
    contains: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        id: { type: 'string' },
        identification: { type: 'string' },
      },
      default: {},
    },
  },
  config: {
    type: 'array',
    contains: {
      type: 'object',
      properties: {
        key: { type: 'string' },
        value: { type: 'string' },
        label: { type: 'string' },
        type: { type: 'string' },
        order: { type: 'number' },
      },
    },
  },
  dimensions: {
    type: 'object',
    properties: {
      width: { type: 'number' },
      height: { type: 'number' },
    },
  },
};

const Storage = new Store({
  name: 'the_config',
  watch: true,
  encryptionKey: 'process.env.encryptionKey',
  schema: Schema_Storage,
});

if (!Storage.has('config')) {
  Storage.set('config', DefaultConfig);
}

if (Storage.has('config')) {
  const Config = Storage.get('config') as unknown as IObjectConfig[];
  const KeysConfig = Config.map((obj) => obj.key);
  const NewConfig: IObjectConfig[] = [];
  DefaultConfig.forEach((obj) => {
    if (!KeysConfig.includes(obj.key)) {
      NewConfig.push(obj);
    }
    if (obj.key.includes('firebase')) {
      // NewConfig.push(obj);
      const index = Config.findIndex((config) => config.key == obj.key);
      Config.splice(index, 1, obj);
    }
  });
  Storage.set('config', Config.concat(NewConfig));
}

const SafeStorage = {
  setPassword(key: string, password: string) {
    try {
      const buffer = safeStorage.encryptString(password);
      Storage.set(key, buffer.toString('latin1'));
      return true;
    } catch (error) {
      return new Error(String(error));
    }
  },
  getPassword(key: string) {
    if (Storage.has(key)) {
      try {
        return safeStorage.decryptString(
          Buffer.from(Storage.get(key), 'latin1'),
        );
      } catch (error) {
        return new Error(String(error));
      }
    }
    return false;
  },
};

interface IObjectConfig {
  key: string;
  value: string | number | boolean;
  label: string;
  type: string;
  order: number;
}

function GetConfig(): IObjectConfig[] | false {
  if (!Storage.has('config')) return [];
  try {
    const Config = Storage.get('config') as unknown as IObjectConfig[];
    return Config;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export { SafeStorage, Storage, GetConfig };
