import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {

    
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/login' || path === '/signup';
    const isProtectedPath = path === '/buyproduct';
    const token = request.cookies.get("token")?.value || '';

    


    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // Redirect to login if trying to access protected paths without a token 
    if ((isProtectedPath || !isPublicPath) && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
       '/buyproduct/:path*', // Add buyproduct to the matcher
    ]
}
