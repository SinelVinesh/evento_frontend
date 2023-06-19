export interface AuthRequest {
  username?: string
  password?: string
}

interface HasId {
  id?: number
}

interface HasName extends HasId {
  name?: string
}

interface Paginated {
  page?: number
}

export interface Role extends HasName {
}

export interface User extends HasId {
  username?: string
  email?: string
  role?: Role
}

export interface UserFilter extends Paginated {
  username?: string
  email?: string
  role?: number
}

export interface Material extends HasName {
  rentPrice?: number
}

export interface MaterialFilter extends Paginated {
}
