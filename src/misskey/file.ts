import { User } from "./user"

export interface MisskeyFile {
	id: string
	createdAt: string
	name: string
	type: string
	md5: string
	size: number
	isSensitive: boolean
	blurhash: string | null
	properties: {
		width?: number
		height?: number
	}
	url: string
	thumbnailUrl: string | null
	comment?: unknown | null // FIXME
	folderId: string | null
	folder?: unknown | null // FIXME
	userId: string | null
	user: User | null
}
