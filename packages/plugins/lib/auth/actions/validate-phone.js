import { ApiTable } from '$utils';
import { Request } from '@peace/utils';

const SHA1 = require('crypto-js/sha1');
const Hex = require('crypto-js/enc-hex');

export function sendPhoneCode(phone) {
  const random = Math.floor(Math.random() * 10 ** 4);
  const sig = Hex.stringify(SHA1(phone + random));

  const url = ApiTable.phoneVCode;

  return Request.get(url, {
    phone,
    r: random,
    sig,
  });
}

export function checkPhoneCode(phone, code) {
  const url = ApiTable.phoneVCode;

  return Request.post(url, {
    phone,
    code,
  });
}

export function checkPhone(phone, pcode) {
  const url = ApiTable.checkPhone;

  return Request.get(url, { phone, p: pcode });
}

export default {
  sendPhoneCode,
  checkPhoneCode,
  checkPhone,
};
