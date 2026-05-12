import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User, Employee, Role, RoleMenu } from '@/models';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await User.findOne({
          where: { username: credentials.username, isActive: true },
          include: [
            { model: Employee },
            { model: Role, include: [{ model: RoleMenu, as: 'menus' }] },
          ],
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        await user.update({ lastLogin: new Date() });
        const role = (user as any).Role;
        const allowedPages: string[] = role?.menus?.map((m: any) => m.pageUrl) ?? [];
        return {
          id: String(user.id),
          name: `${(user as any).Employee?.firstName} ${(user as any).Employee?.lastName}`,
          email: (user as any).Employee?.email,
          roleId: user.roleId,
          employeeId: user.employeeId,
          allowedPages,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roleId = (user as any).roleId;
        token.employeeId = (user as any).employeeId;
        token.allowedPages = (user as any).allowedPages;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        roleId: token.roleId as number,
        employeeId: token.employeeId as number,
        allowedPages: token.allowedPages as string[],
      };
      return session;
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
