import { getAuthToken } from './session'

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL?.trim() || 'https://api.talabahub.uz/api'

type QueryValue = string | number | boolean | null | undefined

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	query?: Record<string, QueryValue | QueryValue[]>
	body?: unknown
	headers?: HeadersInit
	auth?: boolean
	responseType?: 'json' | 'text' | 'blob'
}

function buildQuery(query?: RequestOptions['query']) {
	if (!query) return ''
	const params = new URLSearchParams()
	Object.entries(query).forEach(([key, value]) => {
		if (value === undefined || value === null) return
		if (Array.isArray(value)) {
			value.forEach(item => {
				if (item === undefined || item === null) return
				params.append(key, String(item))
			})
			return
		}
		params.set(key, String(value))
	})
	const rendered = params.toString()
	return rendered ? `?${rendered}` : ''
}

function buildUrl(path: string, query?: RequestOptions['query']) {
	if (path.startsWith('http')) {
		return `${path}${buildQuery(query)}`
	}

	const base = API_BASE_URL.replace(/\/+$/, '')
	const apiPrefix = '/api'
	const normalizedPath = base.endsWith(apiPrefix)
		? path.startsWith(apiPrefix)
			? path.slice(apiPrefix.length) || '/'
			: path
		: path
	return `${base}${normalizedPath}${buildQuery(query)}`
}

export async function apiRequest<T>(
	path: string,
	{
		method = 'GET',
		query,
		body,
		headers,
		auth,
		responseType = 'json',
	}: RequestOptions = {},
): Promise<T> {
	const url = buildUrl(path, query)

	const token = getAuthToken()
	if (auth && !token) {
		throw new Error('Authentication required')
	}

	const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

	const requestHeaders = new Headers(headers ?? undefined)

	if (token) {
		requestHeaders.set('Authorization', `Bearer ${token}`)
	}

	if (!isFormData && body !== undefined && body !== null) {
		requestHeaders.set('Content-Type', 'application/json')
	}

	const response = await fetch(url, {
		method,
		headers: requestHeaders,
		body:
			body === undefined || body === null
				? undefined
				: isFormData
					? (body as FormData)
					: JSON.stringify(body),
	})

	if (!response.ok) {
		let message = `Request failed with status ${response.status}`
		const contentType = response.headers.get('content-type') ?? ''
		if (contentType.includes('json')) {
			try {
				const data = await response.json()
				if (typeof data?.detail === 'string') {
					message = data.detail
				} else if (typeof data?.message === 'string') {
					message = data.message
				} else if (data?.errors && typeof data.errors === 'object') {
					const firstError = Object.values(data.errors)[0]
					if (Array.isArray(firstError)) {
						message = String(firstError[0])
					} else if (typeof firstError === 'string') {
						message = firstError
					}
				}
			} catch {
				// ignore JSON parse errors
			}
		} else {
			try {
				const text = await response.text()
				if (text) message = text
			} catch {
				// ignore text parse errors
			}
		}
		throw new Error(message)
	}

	if (response.status === 204) {
		return null as T
	}

	if (responseType === 'blob') {
		return (await response.blob()) as T
	}

	const contentType = response.headers.get('content-type') ?? ''
	if (responseType === 'text' || !contentType.includes('application/json')) {
		return (await response.text()) as T
	}

	return (await response.json()) as T
}
