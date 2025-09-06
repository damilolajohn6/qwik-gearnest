import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function verifyAdminAuth(): Promise<TokenPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    
    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export async function requireAdminAuth() {
  const user = await verifyAdminAuth();
  
  if (!user) {
    redirect('/login?error=admin_required&redirect=/admin/dashboard');
  }
  
  return user;
}
