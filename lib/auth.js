import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

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
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
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
      username: payload.username
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}