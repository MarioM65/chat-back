import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const algorithm = 'aes-256-ctr';
const password=process.env.encryptionKey??'something';

const getKey = async () => {
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  return key;
};

export const encrypt = async (text: string) => {
  const iv = randomBytes(16);
  const key = await getKey();

  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

  return {
    iv: iv.toString('base64'),
    content: encrypted.toString('base64'),
  };
};
export const decrypt = async (hash: { iv: string; content: string }) => {
  const key = await getKey();
  const decipher = createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'base64')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
};