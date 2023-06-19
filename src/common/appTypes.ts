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

export interface Paginated {
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

export interface LocationType extends HasName {
}

export interface Location extends HasName {
  maxCapacity?: number
  locationType?: LocationType
}

export interface RatedExpenseType extends HasName {
  rateType?: RateType
}

export interface RateType extends HasName {
}

export interface RatedExpense extends HasName {
  ratedExpenseType?: RatedExpenseType
  rentPrice?: number
}

export interface VariableExpense extends HasName {
}
