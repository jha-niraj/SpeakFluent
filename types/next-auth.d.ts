import { Role } from '@prisma/client'
import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			email: string
			name: string
			image: string
			role: Role
		}
	}

	interface User {
		id: string
		email: string
		name: string
		image: string
		role: Role
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string
		role: Role
		roleExplicitlyChosen?: boolean
	}
} 