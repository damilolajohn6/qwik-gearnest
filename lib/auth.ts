/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(12);
  return bcryptjs.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(password, hash);
};

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const getTokenFromRequest = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const token = request.cookies.get('token')?.value;
  return token || null;
};

export const verifyAuth = async (
  request: NextRequest
): Promise<
  | { success: true; user: TokenPayload }
  | { success: false; error: string; status: number }
> => {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return {
        success: false,
        error: 'Unauthorized',
        status: 401,
      };
    }

    const user = verifyToken(token);

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      success: false,
      error: 'Invalid or expired token',
      status: 401,
    };
  }
};

export const getUserFromRequest = async (request: NextRequest): Promise<TokenPayload | null> => {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return null;

    return verifyToken(token);
  } catch (error) {
    return null;
  }
};

type HandlerFunction = (
  req: NextRequest,
  context: { params: Record<string, string>; user: TokenPayload }
) => Promise<NextResponse>;

export const adminAuth = (handler: HandlerFunction) => {
  return async (req: NextRequest, { params }: { params: Record<string, string> }) => {
    const token = getTokenFromRequest(req); 

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(token);
      if (decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Access forbidden: Admin rights required' }, { status: 403 });
      }
      return handler(req, { params, user: decoded });
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  };
};

export const customerAuth = (handler: HandlerFunction) => {
  return async (req: NextRequest, { params }: { params: Record<string, string> }) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    try {
      const decoded = verifyToken(token);
      return handler(req, { params, user: decoded });
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  };
};

