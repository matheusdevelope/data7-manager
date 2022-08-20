import { Storage } from '.';

function GetDevicesMobile(): IDeviceMobile[] | false {
  if (!Storage.has('devices_mobile')) return [];
  try {
    return Storage.get('devices_mobile') as unknown as IDeviceMobile[];
  } catch (err) {
    console.error(err);
    return false;
  }
}
function GetDeviceMobile(id: string): IDeviceMobile | undefined {
  const Devices = GetDevicesMobile();
  if (!Devices) return;
  return Devices.find((obj) => (obj.id = id));
}

function RegisterDeviceMobile(device: IDeviceMobile): IDeviceMobile | false {
  let devices = GetDevicesMobile();
  if (devices) {
    devices = [...devices, device];
  } else {
    devices = [device];
  }
  try {
    Storage.set('devices_mobile', devices);
    return device;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function DeleteDeviceMobile(id: string): boolean {
  const devices = GetDevicesMobile();
  if (!devices) return true;
  try {
    Storage.set(
      'devices_mobile',
      devices.filter((obj) => obj.id !== id),
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
function UpdateDeviceMobile(device: IDeviceMobile) {
  if (DeleteDeviceMobile(device.id)) return RegisterDeviceMobile(device);
  return false;
}

export { GetDevicesMobile, GetDeviceMobile, RegisterDeviceMobile, DeleteDeviceMobile, UpdateDeviceMobile };
