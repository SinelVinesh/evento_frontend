import React from "react";

// Amount Bounds
const AmountBoundsAddForm = React.lazy(() => import('./views/app/settings/amountBounds/AddForm'))
const AmountBoundsList = React.lazy(() => import('./views/app/settings/amountBounds/List'))

// Loan Duration
const LoanDurationAddForm = React.lazy(() => import('./views/app/settings/loanDuration/AddForm'))
const LoanDurationList = React.lazy(() => import('./views/app/settings/loanDuration/List'))

// Loan Interest
const InterestRateAddForm = React.lazy(() => import('./views/app/settings/interestRates/AddForm'))
const InterestRateList = React.lazy(() => import('./views/app/settings/interestRates/List'))

// Client
const ClientAddForm = React.lazy(() => import('./views/app/clients/AddForm'))
const ClientList = React.lazy(() => import('./views/app/clients/List'))

// Refill requests
const RefillRequestAddForm = React.lazy(() => import('./views/app/refillRequests/AddForm'))
const ReffilRequestList = React.lazy(() => import('./views/app/refillRequests/List'))

// Loan requests
const LoanRequestAddForm = React.lazy(() => import('./views/app/loanRequests/AddForm'))
const LoanRequestList = React.lazy(() => import('./views/app/loanRequests/List'))
const LoanRequestDetail = React.lazy(() => import('./views/app/loanRequests/Sheet'))

// monthly refund
const RefundSummaryList = React.lazy(() => import('./views/app/refundSummary/List'))

// monthly profit
const MonthlyProfitList = React.lazy(() => import('./views/app/monthlyProfit/List'))

const routes = [
  { path: '/settings/amount-bounds/create', element: AmountBoundsAddForm},
  { path: '/settings/amount-bounds/history', element: AmountBoundsList},
  { path: '/settings/loan-durations/create', element: LoanDurationAddForm},
  { path: '/settings/loan-durations/list', element: LoanDurationList},
  { path: '/settings/interest-rates/create', element: InterestRateAddForm},
  { path: '/settings/interest-rates/history', element: InterestRateList},
  { path: '/clients/create', element: ClientAddForm},
  { path: '/clients/list', element: ClientList},
  { path: '/refill-requests/create', element: RefillRequestAddForm},
  { path: '/refill-requests/list', element: ReffilRequestList},
  { path: '/loan-requests/create', element: LoanRequestAddForm},
  { path: '/loan-requests/list', element: LoanRequestList},
  { path: '/loan-requests/:id', element: LoanRequestDetail},
  { path: '/refund-summary/list', element: RefundSummaryList},
  { path: '/monthly-profit/list', element: MonthlyProfitList},
]

export default routes
