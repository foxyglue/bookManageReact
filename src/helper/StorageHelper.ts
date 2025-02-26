"use client";

import CryptoJS from "crypto-js";
export default class StorageHelper {
  storage: Storage | null;
  constructor(
    storage: Storage | null = typeof window !== "undefined"
      ? window.localStorage
      : null
  ) {
    this.storage = storage;
  }
  private get aesKey(): string {
    const key = import.meta.env.VITE_AES_SECRET_KEY;
    if (!key) throw new Error("AES key is not provided");
    return key;
  }
  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.aesKey).toString();
  }
  private decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.aesKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  getItem<T = object | string>(name: string): T | null {
    if (!this.storage) return null;

    const encryptedData = this.storage.getItem(name);
    if (!encryptedData) return null;

    try {
      const decrypted = this.decrypt(encryptedData);
      try {
        const tryParse = JSON.parse(decrypted);
        if (tryParse.state == undefined && tryParse.version == undefined)
          return tryParse as T;
        return decrypted as T;
      } catch {
        return decrypted as T;
      }
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }
  setItem(name: string, value: object | string): void {
    if (!this.storage) return;
    let dataToStore: string;
    if (value === null) {
      dataToStore = "null";
    } else if (typeof value === "object") {
      dataToStore = JSON.stringify(value);
    } else {
      dataToStore = value;
    }
    this.storage.setItem(name, this.encrypt(dataToStore));
  }

  removeItem(name: string): void {
    this.storage?.removeItem(name);
  }

  clear(): void {
    this.storage?.clear();
  }
}
