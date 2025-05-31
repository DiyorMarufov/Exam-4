import { hash, compare } from 'bcrypt';

export const encrypt = async (data: string) => {
  return hash(data, 10);
};

export const decrypt = async (data: string, encryptData: string) => {
  return compare(data, encryptData);
};
