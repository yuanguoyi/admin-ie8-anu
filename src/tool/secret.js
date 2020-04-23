import CryptoJS from "crypto-js";   //引用AES源码js

const key = CryptoJS.enc.Utf8.parse("1234567890123456");  //十六位十六进制数作为密钥(16字节对应128位)
const iv = CryptoJS.enc.Utf8.parse('ht_interface_1.0');   //十六位十六进制数作为密钥偏移量
const md5_key = "test_md5_key2018";

//AES加密方法
function Encrypt(wordString, bool) {
  let srcs = CryptoJS.enc.Utf8.parse(wordString);
  let encrypted;
  if (bool) {
    let token = JSON.parse(sessionStorage.getItem("loginData")).token;
    let private_key = CryptoJS.enc.Utf8.parse(token);
    encrypted = CryptoJS.AES.encrypt(srcs, private_key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  } else {
    encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  }
  return encrypted.toString();
}

//AES解密方法
function Decrypt(wordString, bool) {
  let encryptedHexStr = CryptoJS.enc.Base64.parse(wordString);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt;
  if (bool) {
    let token = JSON.parse(sessionStorage.getItem("loginData")).token;
    let private_key = CryptoJS.enc.Utf8.parse(token);
    decrypt = CryptoJS.AES.decrypt(srcs, private_key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  } else {
    decrypt = CryptoJS.AES.decrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  }
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

//Md5加密
function MD5(string) {
  return CryptoJS.MD5(string + md5_key).toString();
}

export default {
  Encrypt,
  Decrypt,
  MD5
}
