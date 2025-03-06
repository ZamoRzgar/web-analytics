import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './db'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' as const },
    callbacks: {
        session: ({ session, token }) => {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        jwt: ({ token, user }) => {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Add your credential validation logic here
                // This is a placeholder - you should implement proper authentication
                if (!credentials?.email || !credentials?.password) {
                    return null
                }
                
                // Example: Check user in database
                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                })
                
                // Add your password validation logic here
                // For now, this is just a placeholder
                if (user) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                }
                
                return null
            }
        })
    ]
}

export const { auth, signIn, signOut } = NextAuth(authOptions)