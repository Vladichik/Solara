export interface OrviboDeviceQueryProps {
  access_token: string;
  user_id: string;
}

export interface DeviceCommandProps {
  access_token: string;
  user_id: string;
  action: string;
  deviceId: string;
}
