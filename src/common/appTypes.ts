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
  password?: string
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
  locationType?: LocationType
  image?: any
  imageLink?: string
  locationSeatCategories?: LocationSeatCategory[]
}

export interface SeatCategory extends HasName {
}

export interface LocationSeatCategory extends HasId {
  location?: Location
  seatCategory?: SeatCategory
  capacity?: number
}

export interface RatedExpenseType extends HasName {
  rateType?: RateType
}

export interface RateType extends HasName {
}

export interface RatedExpense extends HasName {
  ratedExpenseType?: RatedExpenseType
  rentPrice?: number
  image?: any
  imageLink?: string
}

export interface RatedExpenseFilter extends Paginated {
  ratedExpenseType?: number
}

export interface VariableExpense extends HasName {
}

export interface EventType extends HasName {
}

export interface EventStatus extends HasName {
}

export interface Event extends HasName {
  location?: Location
  eventType?: EventType
  eventStatus?: EventStatus
  locationPrice?: number
  startDate?: number
  endDate?: number
  deleted?: boolean
  ratedExpenses?: EventRatedExpense[]
  variableExpenses?: EventVariableExpense[]
  eventSeatCategories?: EventSeatCategory[]
}

export interface EventEstimation {
  event?: Event
  totalExpense?: number
  totalIncome?: number
}

export interface EventRatedExpense extends HasId {
  event?: Event
  ratedExpense?: RatedExpense
  duration?: number
  quantity: number
}

export interface EventVariableExpense extends HasId {
  event?: Event
  variableExpense?: VariableExpense
  amount?: number
  quantity: number
}

export interface EventSeatCategory extends HasId {
  price?: number
  locationSeatCategory?: LocationSeatCategory
}

