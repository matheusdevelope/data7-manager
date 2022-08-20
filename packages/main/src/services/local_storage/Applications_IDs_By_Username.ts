import { Storage } from '.';
import { GenerateJWT, ValidateJWT } from '../../handlers/jwt';
const Expiration_JWT = 180;
interface IApplicationID {
  username: string;
  id: string;
  identification: string;
}

function GetAplicationsIDs(): IApplicationID[] | false {
  if (!Storage.has('application_ids')) return false;
  const IDs = Storage.get('application_ids') as unknown as IApplicationID[];
  return IDs;
}
function GetAplicationData(
  username: string,
): IApplicationID | undefined | false {
  const IDs = GetAplicationsIDs();
  if (!IDs) return false;
  return IDs.find((obj) => (obj.username = username));
}
function ValidateApplicationID(id: string) {
  const Payload = ValidateJWT(id);
  if (typeof Payload == 'boolean') {
    return false;
  }
  return Payload;
}

function GenerateApplicationID(username: string) {
  const AplicationID = GetAplicationData(username);
  if (AplicationID === false) {
    try {
      const newApplicationID = {
        username,
        id: GenerateJWT(Expiration_JWT),
        identification: username,
      };
      Storage.set('application_ids', [newApplicationID]);
      return newApplicationID;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
  const IDs = GetAplicationsIDs();
  if (IDs) {
    //Existe uma lista de ID, mas não pra esse user
    if (typeof AplicationID === undefined) {
      try {
        const newApplicationID: IApplicationID = {
          username,
          id: GenerateJWT(Expiration_JWT),
          identification: username,
        };
        Storage.set('application_ids', [...IDs, newApplicationID]);
        return newApplicationID;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    //Já Existe esse user na lista
    if (AplicationID) {
      //Verifica se o ID ainda é valido (renova caso não seja)
      if (ValidateJWT(AplicationID.id) === false) {
        const index = IDs.findIndex((obj) => obj.username === username);
        const newApplicationID: IApplicationID = {
          ...IDs[index],
          id: GenerateJWT(Expiration_JWT),
        };
        IDs.splice(index, 1, newApplicationID);
        return newApplicationID;
      }
      return AplicationID;
    }
  }
  try {
    const newApplicationID = {
      username,
      id: GenerateJWT(Expiration_JWT),
      identification: username,
    };
    Storage.set('application_ids', [newApplicationID]);
    return newApplicationID;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export {
  GetAplicationsIDs,
  GetAplicationData,
  ValidateApplicationID,
  GenerateApplicationID,
};
