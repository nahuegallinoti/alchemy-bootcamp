import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { hexToBytes, toHex } from "ethereum-cryptography/utils";

// Map of accounts and keys
const ACCOUNT_KEYS = new Map();

// List of accounts as addresses starting with '0x'
const ACCOUNTS = [];

const generateWallet = (userName) => {
  const prk = secp.utils.randomPrivateKey();
  const puk = secp.getPublicKey(prk);
  const hashedPuk = keccak256(puk.slice(1));
  const address = `0x${toHex(hashedPuk.slice(-20)).toString().toUpperCase()}`;

  ACCOUNT_KEYS.set(address, { private: toHex(prk), public: toHex(puk) });
  ACCOUNTS.push({ address, userName });
};

const hashMessage = (message) => keccak256(Uint8Array.from(message));

const getPublicKey = (user) => {
  if (!user) return null;

  try {
    const userSelect = ACCOUNTS.find((account) => {
      return account.userName === user;
    });

    if (!userSelect) return null;

    const userSelected = ACCOUNT_KEYS.get(userSelect.address);

    if (!userSelected) return null;

    return hexToBytes(userSelected.public);
  } catch (error) {
    throw new Error("Invalid user");
  }
};

const getPrivateKey = (user) => {
  if (!user) return null;

  try {
    const userSelected = ACCOUNT_KEYS.get(user);
    if (!userSelected) return null;

    return hexToBytes(userSelected.private);
  } catch (error) {
    throw new Error("Invalid user");
  }
};

const getAddress = (user) => {
  if (!user) return null;

  const pubKey = getPublicKey(user);

  if (!pubKey) return null;

  const hash = keccak256(pubKey.slice(1));

  return toHex(hash.slice(-20)).toUpperCase();
};

const sign = async (username, message) => {
  const privateKey = getPrivateKey(username);
  const hash = hashMessage(message);

  const [signature, recoveryBit] = await secp.sign(hash, privateKey, {
    recovered: true,
  });
  const fullSignature = new Uint8Array([recoveryBit, ...signature]);
  return toHex(fullSignature);
};

const wallet = {
  ACCOUNTS,
  generateWallet,
  sign,
  getAddress,
};
export default wallet;
