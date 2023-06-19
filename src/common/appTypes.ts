export interface AuthRequest {
  username?: string
  password?: string
}

interface HasId {
  id?: number
}

interface HasName extends HasId{
  name?: string
}

interface Paginated {
  page?: number
}

export interface Role extends HasName {}

export interface AmountBounds extends HasId {
  date?: number
  minAmount?: number
  maxAmount?: number
}

export interface AmountBoundsFilter extends Paginated {}

export interface LoanDuration extends HasId {
  duration?: number
}

export interface LoanDurationFilter extends Paginated {}

export interface InterestRate extends HasId {
  date?: number
  rate?: number
}

export interface InterestRateFilter extends Paginated {}

export interface Client extends HasId {
  username?: string
  password?: string
  role?: Role
  balance?: number
}

export interface ClientFilter extends Paginated {
  role?: number
}

interface RefillState extends HasName {}

export interface RefillRequest extends HasId {
  user?: Client
  refillState?: RefillState
  requestDate?: number
  amount?: number
}

export interface RefillRequestFilter extends Paginated {
  user?: number
}

interface LoanState extends HasName {}

export interface LoanRequest extends HasId {
  user?: Client
  requestDate?: number
  amount?: number
  loanDuration?: LoanDuration
  interestRate?: InterestRate
  loanState?: LoanState
  refundStartDate?: number
  refundTable?: LoanRefundPlan[]
}

export interface LoanRequestFilter extends Paginated {
  user?: number
}

export interface RefundState extends HasName {}

export interface LoanRefundPlan extends HasId {
  monthyear?: number
  amountToRefund?: number
  remainingAmount?: number
  interestAmount?: number
  refundState?: RefundState
  loanRequest?: LoanRequest
}










export interface User extends HasId {
  username?: string
  email?: string
  role?: Role
}

export interface UserFilter extends Paginated{
  username?: string
  email?: string
  role?: number
}

export interface Stats {
  id?: number
  month?: number
  year?: number
  sales?: number
  totalProfit?: number
  profit?: number
  losses?: number
  commission?:number
}

export interface StatsFilter extends Paginated{
  month?: number
  year?: number
}

export interface MonthlyRefund extends HasId {
  month?: number
  year?: number
  totalRefund?: number
}

export interface MonthlyRefundFilter extends Paginated{
  minYear?: number
  maxYear?: number
  minMonth?: number
  maxMonth?: number
}

export interface MonthlyProfit extends HasId {
  month?: number
  year?: number
  totalProfit?: number
}

export interface MonthlyProfitFilter extends Paginated{
  minYear?: number
  maxYear?: number
  minMonth?: number
  maxMonth?: number
}
