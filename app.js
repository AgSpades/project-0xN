function generateKeys() {
  const p = 61;
  const q = 53;
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const e = 17;

  let d = 0;
  for (let i = 0; i < phi; i++) {
    if ((e * i) % phi === 1) {
      d = i;
      break;
    }
  }

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
}

const keys = generateKeys();
document.getElementById(
  "publicKey"
).textContent = `Public Key (e,n): (${keys.publicKey.e}, ${keys.publicKey.n})`;
document.getElementById(
  "privateKey"
).textContent = `Private Key (d,n): (${keys.privateKey.d}, ${keys.privateKey.n})`;

function encrypt(message, publicKey) {
  const encrypted = [];
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const encryptedChar =
      BigInt(charCode) ** BigInt(publicKey.e) % BigInt(publicKey.n);
    encrypted.push(encryptedChar.toString());
  }
  return encrypted.join(",");
}

function decrypt(ciphertext, privateKey) {
  const encryptedChars = ciphertext.split(",");
  let decrypted = "";

  for (let i = 0; i < encryptedChars.length; i++) {
    const charCode = Number(
      BigInt(encryptedChars[i]) ** BigInt(privateKey.d) % BigInt(privateKey.n)
    );
    decrypted += String.fromCharCode(charCode);
  }
  return decrypted;
}

function createMessageElement(className, text) {
  const el = document.createElement("div");
  el.className = `message-box ${className}`;
  el.textContent = text;
  return el;
}

function startDemo() {
  const container = document.getElementById("animationContainer");
  const message = document.getElementById("messageInput").value.trim();
  const status = document.getElementById("status");
  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const messageInput = document.getElementById("messageInput");

  if (!message) {
    status.textContent = "Please enter a message first";
    return;
  }

  messageInput.disabled = true;
  startButton.disabled = true;

  container.querySelectorAll(".message-box").forEach((el) => el.remove());

  const originalEl = createMessageElement(
    "original",
    `Original Message: ${message}`
  );
  const encryptedMessage = encrypt(message, keys.publicKey);
  const encryptedEl = createMessageElement(
    "encrypted",
    `Encrypted Message: ${encryptedMessage}`
  );
  const decryptedMessage = decrypt(encryptedMessage, keys.privateKey);
  const decryptedEl = createMessageElement(
    "decrypted",
    `Decrypted Message: ${decryptedMessage}`
  );

  container.appendChild(originalEl);
  container.appendChild(encryptedEl);
  container.appendChild(decryptedEl);

  setTimeout(() => {
    status.textContent = "Starting with the original message...";
    originalEl.classList.add("show");
  }, 500);

  setTimeout(() => {
    status.textContent = "Encrypting using public key...";
    encryptedEl.classList.add("show");
  }, 2000);

  setTimeout(() => {
    status.textContent = "Decrypting using private key...";
    decryptedEl.classList.add("show");
  }, 3500);

  setTimeout(() => {
    status.textContent = "Encryption/Decryption cycle complete!";
    startButton.style.display = "none";
    resetButton.style.display = "inline-block";
    resetButton.disabled = false;
  }, 5000);

  document.getElementById("explanation").innerHTML = `
                <h3>Process Explanation:</h3>
                <p>1. Original message: "${message}"</p>
                <p>2. Each character is encrypted separately using public key (e=${keys.publicKey.e}, n=${keys.publicKey.n})</p>
                <p>3. Encrypted form (comma-separated values for each character): ${encryptedMessage}</p>
                <p>4. Each value is decrypted using private key (d=${keys.privateKey.d}, n=${keys.privateKey.n})</p>
                <p>5. Recovered original message: "${decryptedMessage}"</p>
        `;
}

function resetDemo() {
  const container = document.getElementById("animationContainer");
  const status = document.getElementById("status");
  const startButton = document.getElementById("startButton");
  const resetButton = document.getElementById("resetButton");
  const messageInput = document.getElementById("messageInput");

  container.querySelectorAll(".message-box").forEach((el) => el.remove());

  status.textContent = "Enter a message and click Start Demo";
  startButton.style.display = "inline-block";
  startButton.disabled = false;
  resetButton.style.display = "none";
  messageInput.value = "";
  messageInput.disabled = false;
  document.getElementById("explanation").innerHTML = "";
}
function startDemoProcess() {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add("show");
    }, index * 1000);
  });
}
