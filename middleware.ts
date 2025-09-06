import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple token verification without any external dependencies
function verifyToken(token: string) {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (middle part) using base64
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = JSON.parse(atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < currentTime) {
      return null;
    }

    return decodedPayload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    console.log('🔐 Admin route accessed:', pathname);
    
    // Get token from cookies
    const token = request.cookies.get('token')?.value;
    console.log('🍪 Token found:', !!token);

    if (!token) {
      console.log('❌ No token found, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify the token using Edge Runtime compatible method
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log('💥 Token verification failed - invalid or expired token');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    console.log('✅ Token decoded:', { 
      userId: decoded.userId, 
      email: decoded.email,
      role: decoded.role 
    });
    
    // Check if user is admin
    if (decoded.role !== 'admin') {
      console.log('🚫 User is not admin, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(loginUrl);
    }

    console.log('🎉 Admin access granted');
    
    // Add user info to headers for server components
    const response = NextResponse.next();
    response.headers.set('x-user-id', decoded.userId);
    response.headers.set('x-user-email', decoded.email);
    response.headers.set('x-user-role', decoded.role);
    
    return response;
  }

  // For non-admin routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
