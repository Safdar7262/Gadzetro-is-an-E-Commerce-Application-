import { formatCurrency } from '../../utils/currency.js'

const short = (v) => (v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(1)}k` : `₹${v}`)

// Small SVG bar chart (no chart library needed). data: [{ label, value }]
export default function BarChart({ data, title }) {
  const w = 520, h = 220, top = 22, bottom = 34
  const max = Math.max(1, ...data.map((d) => d.value))
  const slot = w / data.length
  const summary = data.map((d) => `${d.label}: ${formatCurrency(d.value)}`).join(', ')
  return (
    <figure className="bar-chart">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${title}. ${summary}`}>
        <line x1="0" y1={h - bottom} x2={w} y2={h - bottom} stroke="var(--border)" />
        {data.map((d, i) => {
          const barH = (d.value / max) * (h - top - bottom)
          const x = i * slot + slot * 0.18
          const y = h - bottom - barH
          return (
            <g key={d.label + i}>
              <rect x={x} y={y} width={slot * 0.64} height={d.value > 0 ? Math.max(barH, 2) : 0} rx="4" fill="var(--blue)"><title>{`${d.label}: ${formatCurrency(d.value)}`}</title></rect>
              {d.value > 0 && <text x={x + slot * 0.32} y={y - 6} textAnchor="middle" fontSize="11" fill="currentColor">{short(d.value)}</text>}
              <text x={x + slot * 0.32} y={h - 12} textAnchor="middle" fontSize="12" fill="currentColor">{d.label}</text>
            </g>
          )
        })}
      </svg>
      <figcaption className="muted small">{title}</figcaption>
    </figure>
  )
}