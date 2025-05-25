import { jwtVerify, SignJWT } from 'jose';

// Function to convert string to base64
function stringToBase64(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

// Function to convert base64 to string
function base64ToString(base64) {
  return new TextDecoder().decode(Uint8Array.from(atob(base64), c => c.charCodeAt(0)));
}

export async function generateToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Hash the password with the salt
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array([...salt, ...data])
  );
  
  // Convert the hash to base64
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));
  
  // Combine salt and hash
  const saltBase64 = btoa(String.fromCharCode(...salt));
  return `${saltBase64}:${hashBase64}`;
}

export async function comparePassword(plainPassword, hashedPassword) {
  try {
    const [saltBase64, hashBase64] = hashedPassword.split(':');
    
    // Decode the salt
    const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
    
    // Hash the plain password with the same salt
    const encoder = new TextEncoder();
    const data = encoder.encode(plainPassword);
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new Uint8Array([...salt, ...data])
    );
    
    // Convert to base64 for comparison
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const newHashBase64 = btoa(String.fromCharCode(...hashArray));
    
    // Compare the hashes
    return hashBase64 === newHashBase64;
  } catch (error) {
    return false;
  }
}

export async function getTokenData(request) {
  try {
    const token = request.cookies.get('token');
    
    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return {
      userId: payload.userId,
      email: payload.email
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}