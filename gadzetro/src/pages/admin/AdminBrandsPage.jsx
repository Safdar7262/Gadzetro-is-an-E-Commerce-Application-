import CrudManager from '../../components/admin/CrudManager.jsx'
import { createBrand, deleteBrand, getAdminBrands, updateBrand } from '../../services/adminService.js'
import { brandSchema } from '../../utils/validation.js'

export default function AdminBrandsPage() {
  return (
    <CrudManager
      title="Brands" singular="Brand"
      load={getAdminBrands} onCreate={createBrand} onUpdate={updateBrand} onDelete={deleteBrand}
      getId={(row) => row.id} searchKeys={['name', 'description']} schema={brandSchema}
      defaults={{ name: '', description: '', color: '#1e6bff' }}
      toForm={(row) => ({ name: row.name, description: row.description, color: row.color })}
      columns={[
        { key: 'name', label: 'Name', render: (r) => <strong style={{ color: r.color }}>{r.name}</strong> },
        { key: 'slug', label: 'Slug' },
        { key: 'description', label: 'Description' },
      ]}
      fields={[
        { name: 'name', label: 'Name' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'color', label: 'Brand colour', type: 'color' },
      ]}
    />
  )
}