import { withIronSessionApiRoute } from 'iron-session/next';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'phoros',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function withSessionRoute(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}
