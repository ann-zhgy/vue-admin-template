import CryptoJS from 'crypto-js'

export function encryptMd5(key: string): string {
  return CryptoJS.MD5(key).toString()
}
