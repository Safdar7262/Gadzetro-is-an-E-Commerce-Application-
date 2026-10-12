const toDate = (value) => (value instanceof Date ? value : new Date(value))

export const formatDate = (value) =>
  toDate(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export const formatDateTime = (value) =>
  toDate(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
