type GenerateTokenParams = {
  _id: string;
  _secretKey?: string;
  _secretKeyValue?: string;
  _randomSecretKey?: boolean;
  _randomSecretKeyLevel?: 1 | 2 | 3;
  _expirationTime: string;
};

export { GenerateTokenParams };
