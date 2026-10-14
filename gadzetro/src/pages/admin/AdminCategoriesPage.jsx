import CrudManager from '../../components/admin/CrudManager.jsx'
import { createCategory, deleteCategory, getAdminCategories, updateCategory } from '../../services/adminService.js'
import { categorySchema } from '../../utils/validation.js'

export default function AdminCategoriesPage() {
  return (
    <CrudManager
      title="Categories" singular="Category"
      load={getAdminCategories} onCreate={createCategory} onUpdate={updateCategory} onDelete={deleteCategory}
      getId={(row) => row.id} searchKeys={['name', 'description']} schema={categorySchema}
      defaults={{ name: '', description: '', image: '', banner: '' }}
      toForm={(row) => ({ name: row.name, description: row.description, image: row.image || '', banner: row.banner || '' })}
      columns={[
        { key: 'name', label: 'Name', render: (r) => <strong>{r.name}</strong> },
        { key: 'slug', label: 'Slug' },
        { key: 'description', label: 'Description' },
      ]}
      fields={[
        { name: 'name', label: 'Name' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'image', label: 'Image path (optional)', hint: 'Example: /images/categories/tablets.png' },
        { name: 'banner', label: 'Banner path (optional)', hint: 'Example: /images/banners/deals-banner.jpg' },
      ]}
    />
  )
}