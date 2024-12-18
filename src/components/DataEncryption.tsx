import CryptoJS from 'crypto-js';

const encryptString = "KsAqMRSbLzcrIhm0CdtOdyzx3VC2rwCXpeZ18JjFr2KQY9mcF0";

export const encrypt = (data: string): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, encryptString).toString();
};

export const decrypt = (ciphertext: string): any => {
  try {
    let data;
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptString);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptedData) {
      data = JSON.parse(decryptedData);
    }
    return data;
  } catch (error) {
    throw new Error('Decryption failed. Please check your key and ciphertext. error:' + error);
  }
};
