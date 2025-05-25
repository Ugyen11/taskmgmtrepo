import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

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