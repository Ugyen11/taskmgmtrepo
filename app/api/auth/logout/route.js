import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  
  // Clear the auth token
  cookieStore.delete('token');
  
  // Return response with cleared cookie
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('token');
  
  return response;
} 