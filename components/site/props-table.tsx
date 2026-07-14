export interface PropRow {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

export function PropsTable({ title, rows }: { title?: string; rows: PropRow[] }) {
  return (
    <div className='props-table-wrap'>
      {title && <p className='props-table-title'>{title}</p>}
      <table className='props-table'>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
                {row.required && <span className='props-required'>required</span>}
              </td>
              <td>
                <code className='props-type'>{row.type}</code>
              </td>
              <td>{row.default ? <code>{row.default}</code> : '—'}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
