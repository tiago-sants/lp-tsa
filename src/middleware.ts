import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/painel'];
const authRoutes = ['/login', '/recuperar-senha', '/redefinir-senha'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas protegidas: redirecionar para login se não autenticado
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rotas de auth: redirecionar para painel se já autenticado
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/painel', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/painel/:path*', '/login', '/recuperar-senha', '/redefinir-senha'],
};
