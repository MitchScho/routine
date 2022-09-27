export interface AuthDb {
  apiKey: String;
  appName: String;
  createdAt: String;
  displayName: String | undefined;
  email: String;
  emailVerified: Boolean;
  isAnonymous: Boolean;
  lastLoginAt: String;
  phoneNumber: String | undefined;
  photoURL: String | undefined;
  providerData: any;
  stsTokenManager: {
    refreshToken: String;
    expirationTime: Number;
  };
  tenantId: String | undefined;
  uid: String;
}

export const initialAuthDb: AuthDb = {
  apiKey: null,
  appName: null,
  createdAt: null,
  displayName:null,
  email: null,
  emailVerified: false,
  isAnonymous: false,
  lastLoginAt: null,
  phoneNumber: null,
  photoURL: null,
  providerData: {},
  stsTokenManager: {
    refreshToken: null,
    expirationTime: 0
  },
  tenantId: null,
  uid: null,
}
