const encryptionKey = "dont-try-to-guess";

function encryptData(data: string): string {
  let result = "";
  for (let i = 0; i < data.length; i += 1) {
    result += String.fromCharCode(data.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length));
  }
  return btoa(result);
}

function decryptData(encryptedData: string): string {
  try {
    const data = atob(encryptedData);
    let result = "";
    for (let i = 0; i < data.length; i += 1) {
      result += String.fromCharCode(data.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length));
    }
    return result;
  } catch {
    return "";
  }
}

export function getSecureItem(key: string): string {
  const item = localStorage.getItem(key);
  if (!item) return "";
  return decryptData(item);
}

export function setSecureItem(key: string, value: string): void {
  const encryptedValue = encryptData(value);
  localStorage.setItem(key, encryptedValue);
}
