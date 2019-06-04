import OffenderBreadcrumb from './Components/OffenderBreadcrumb'

// This needs to be put into a centralised route config that is also used in App.js
// See: https://reacttraining.com/react-router/web/example/route-config
export default [
  { path: '/', breadcrumb: null },
  { path: '/content', breadcrumb: null },
  { path: '/establishment-roll/out-today', breadcrumb: 'Out today' },
  { path: '/establishment-roll/in-reception', breadcrumb: 'In reception' },
  { path: '/establishment-roll/en-route', breadcrumb: 'En route' },
  { path: '/establishment-roll/total-currently-out', breadcrumb: 'Total currently out' },
  { path: '/establishment-roll/:livingUnitId', breadcrumb: null },

  { path: '/offenders', breadcrumb: null },
  { path: '/offenders/:offenderNo', breadcrumb: OffenderBreadcrumb, renderDirectly: true },
  { path: '/offenders/:offenderNo/iep-details', breadcrumb: 'IEP details' },
  { path: '/offenders/:offenderNo/iep-details/change-iep', breadcrumb: 'Change IEP' },
  // Below are temporary as latest version of react-router-breadcrumbs-hoc leaves hyphens in the breadcrumb text
  { path: '/establishment-roll', breadcrumb: 'Establishment roll' },
  { path: '/search-prisoner-whereabouts', breadcrumb: 'Search prisoner whereabouts' },
  { path: '/search-prisoner-whereabouts/housing-block-results', breadcrumb: 'Housing block results' },
  { path: '/search-prisoner-whereabouts/activity-results', breadcrumb: 'Activity results' },
  { path: '/add-bulk-appointments', breadcrumb: 'Add bulk appointments' },
]
