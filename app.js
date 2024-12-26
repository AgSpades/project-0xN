class AdvancedFHE {
    constructor(modulus, generator) {
        this.p = modulus;        
        this.g = generator;      
        this.privateKey = null;
        this.publicKey = null;
    }

    
    generateKeyPair() {
        
        this.privateKey = Math.floor(Math.random() * (this.p - 2)) + 1;
        
        this.publicKey = this.modPow(this.g, this.privateKey, this.p);
        return {
            publicKey: this.publicKey,
            privateKey: this.privateKey
        };
    }


    modPow(base, exponent, modulus) {
        if (modulus === 1) return 0;
        let result = 1;
        base = base % modulus;
        while (exponent > 0) {
            if (exponent % 2 === 1) {
                result = (result * base) % modulus;
            }
            base = (base * base) % modulus;
            exponent = Math.floor(exponent / 2);
        }
        return result;
    }

    encrypt(message) {
        const r = Math.floor(Math.random() * (this.p - 2)) + 1; 
        const c1 = this.modPow(this.g, r, this.p);
        const s = this.modPow(this.publicKey, r, this.p);
        const c2 = (message * s) % this.p;
        return { c1, c2 };
    }

    decrypt(ciphertext) {
        const s = this.modPow(ciphertext.c1, this.privateKey, this.p);
        const sInverse = this.modPow(s, this.p - 2, this.p);
        return (ciphertext.c2 * sInverse) % this.p;
    }

    homomorphicMultiply(ct1, ct2) {
        return {
            c1: (ct1.c1 * ct2.c1) % this.p,
            c2: (ct1.c2 * ct2.c2) % this.p
        };
    }
}

let fhe;
let currentCiphertext;
let animationElements = [];

function log(message) {
    const logs = document.getElementById('logs');
    logs.innerHTML += `${message}\n`;
    logs.scrollTop = logs.scrollHeight;
}

function createAnimationElement(text, color) {
    const element = document.createElement('div');
    element.className = 'encryption-element';
    element.style.backgroundColor = color;
    element.textContent = text;
    document.getElementById('stage').appendChild(element);
    return element;
}

function generateKeys() {
    const modulus = parseInt(document.getElementById('modulus').value);
    const generator = parseInt(document.getElementById('generator').value);

    fhe = new AdvancedFHE(modulus, generator);
    const keys = fhe.generateKeyPair();

    document.getElementById('keyInfo').innerHTML = `
        Public Key: ${keys.publicKey}<br>
        Private Key: ${keys.privateKey}<br>
        Modulus: ${modulus}<br>
        Generator: ${generator}
    `;

    log(`Generated key pair with modulus ${modulus}`);
}

function encryptValue() {
    if (!fhe) {
        log('Please generate keys first');
        return;
    }

    const plaintext = parseInt(document.getElementById('plaintext').value);
    currentCiphertext = fhe.encrypt(plaintext);

    const plaintextElement = createAnimationElement(
        `Plaintext: ${plaintext}`, 
        '#3498db'
    );
    const ciphertextElement = createAnimationElement(
        `Ciphertext: (${currentCiphertext.c1}, ${currentCiphertext.c2})`,
        '#e74c3c'
    );

    gsap.set(plaintextElement, { x: 50, y: 50 });
    gsap.set(ciphertextElement, { x: 50, y: 200, opacity: 0 });

    gsap.to(plaintextElement, {
        y: 125,
        duration: 1,
        ease: "power2.inOut"
    });

    gsap.to(ciphertextElement, {
        opacity: 1,
        duration: 1,
        delay: 1
    });

    animationElements = [plaintextElement, ciphertextElement];
    log(`Encrypted ${plaintext} to (${currentCiphertext.c1}, ${currentCiphertext.c2})`);
}

function performHomomorphicOp() {
    if (!currentCiphertext) {
        log('Please encrypt a value first');
        return;
    }

    const ct2 = fhe.encrypt(2); 
    const result = fhe.homomorphicMultiply(currentCiphertext, ct2);

    const operationElement = createAnimationElement(
        `Result: (${result.c1}, ${result.c2})`,
        '#2ecc71'
    );

    gsap.set(operationElement, { x: 250, y: 200, scale: 0 });
    gsap.to(operationElement, {
        scale: 1,
        duration: 1
    });

    currentCiphertext = result;
    animationElements.push(operationElement);
    log(`Performed homomorphic multiplication`);
}

function decryptResult() {
    if (!currentCiphertext) {
        log('No ciphertext to decrypt');
        return;
    }

    const decrypted = fhe.decrypt(currentCiphertext);
    const decryptElement = createAnimationElement(
        `Decrypted: ${decrypted}`,
        '#9b59b6'
    );

    gsap.set(decryptElement, { x: 450, y: 50, opacity: 0 });
    gsap.to(decryptElement, {
        opacity: 1,
        y: 200,
        duration: 1
    });

    animationElements.push(decryptElement);
    log(`Decrypted result: ${decrypted}`);
}