function isPrime(number) {
  if (number <= 1) return false;
  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) return false;
  }
  return true;
}

function findRelativelyPrime(PI) {
  for (let e = 2; e < PI; e++) {
    if (gcd(e, PI) === 1) {
      return e;
    }
  }
  return null;
}

function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function modularInverse(a, m) {
  let m0 = m;
  let x0 = 0;
  let x1 = 1;

  if (m === 1) return 0;

  while (a > 1) {
    const q = Math.floor(a / m);
    let t = m;

    m = a % m;
    a = t;
    t = x0;

    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < 0) {
    x1 += m0;
  }

  return x1;
}

function generateRSAKeys() {
  let p, q, n, PI, e, d;

  do {
    p = generateRandomPrime();
    q = generateRandomPrime();
  } while (p === q);

  n = p * q;
  PI = (p - 1) * (q - 1);

  e = findRelativelyPrime(PI);

  d = modularInverse(e, PI);

  console.log('p:', p);
  console.log('q:', q);
  console.log('Public Key:', { e, n });
  console.log('Private Key:', { d, n });

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
}

function encryptRSA(message, publicKey) {
  const { e, n } = publicKey;
  return message
  .split('')
  .map(char => BigInt(char.charCodeAt(0)) ** BigInt(e) % BigInt(n))
  .join(' ');
}

function decryptRSA(encryptedMessage, privateKey) {
  const { d, n } = privateKey;
  return encryptedMessage
  .split(' ')
  .filter(Boolean)
  .map(char => String.fromCharCode(
      Number(BigInt(char) ** BigInt(d) % BigInt(n))))
  .join('');
}

function generateRandomPrime() {
  let num;
  do {
    num = Math.floor(Math.random() * 100) + 50;
  } while (!isPrime(num));
  return num;
}

const rsaKeys = generateRSAKeys();


const messageToEncrypt = 'Encryption';
console.log('Original Message:', messageToEncrypt);

console.time('RSA Encryption Time');
const encryptedRSA = encryptRSA(messageToEncrypt, rsaKeys.publicKey);
console.timeEnd('RSA Encryption Time');

console.time('RSA Decryption Time');
const decryptedRSA = decryptRSA(encryptedRSA, rsaKeys.privateKey);
console.timeEnd('RSA Decryption Time');

console.log('Encrypted Message:', encryptedRSA);
console.log('Decrypted Message:', decryptedRSA);
