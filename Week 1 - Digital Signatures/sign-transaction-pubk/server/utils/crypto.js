const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");

const hashMessage = (message) => {
  return keccak256(Uint8Array.from(message));
};

const getAddressFromPublicKey = (publicKey) => {
  try {
    if (!publicKey) return null;

    return toHex(keccak256(publicKey.slice(1)).slice(-20))
      .toUpperCase()
      .toString();
  } catch (error) {
    throw new Error("Invalid public key");
  }
};

const signatureToPubKey = (message, signature) => {
  try {
    const hash = hashMessage(message);
    const fullSignatureBytes = hexToBytes(signature);
    const recoveryBit = fullSignatureBytes[0];
    const signatureBytes = fullSignatureBytes.slice(1);

    return secp.recoverPublicKey(hash, signatureBytes, recoveryBit);
  } catch (error) {
    throw new Error("Invalid signature");
  }
};

module.exports = {
  getAddressFromPublicKey,
  signatureToPubKey,
};
