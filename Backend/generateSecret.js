const crypto = require('crypto');

// Function to generate a random secret key
function generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
}

// Generate and print the secret key
const secretKey = generateSecretKey();
console.log("Generated Secret Key:", secretKey);
