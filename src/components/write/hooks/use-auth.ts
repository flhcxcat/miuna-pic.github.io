import { create } from 'zustand'
import { clearAllAuthCache, getAuthToken as getToken, hasAuth as checkAuth, getPemFromCache, savePemToCache } from '@/lib/auth'

interface AuthStore {
	// State
	isAuth: boolean
	privateKey: string | null

	// Actions
	setPrivateKey: (key: string) => Promise<void>
	clearAuth: () => void
	refreshAuthState: () => void
	getAuthToken: (manualPrivateKey?: string) => Promise<string>
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	isAuth: false,
	privateKey: null,

	setPrivateKey: async (key: string) => {
		set({ isAuth: true, privateKey: key })
		await savePemToCache(key)
	},

	clearAuth: () => {
		clearAllAuthCache()
		set({ isAuth: false })
	},

	refreshAuthState: async () => {
		set({ isAuth: await checkAuth() })
	},

	getAuthToken: async (manualPrivateKey?: string) => {
		const token = await getToken(manualPrivateKey)
		get().refreshAuthState()
		return token
	}
}))

if (typeof window !== 'undefined') {
	const initAuth = async () => {
		const key = await getPemFromCache()
		const isAuth = await checkAuth()
		useAuthStore.setState({ privateKey: key, isAuth })
	}

	initAuth()

	// 监听同页面不同孤岛之间的同步
	window.addEventListener('auth-state-changed', () => {
		initAuth()
	})

	// 监听不同标签页之间的同步
	window.addEventListener('storage', (e) => {
		if (e.key === 'p_info') {
			initAuth()
		}
	})
}
