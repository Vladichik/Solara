export interface OrviboDeviceQueryProps {
  access_token: string;
  user_id: string;
}

export interface OrviboRefreshTokenProps {
  refresh_token: string;
}

export interface DeviceCommandProps {
  access_token: string;
  user_id: string;
  action: string;
  deviceId: string;
}
