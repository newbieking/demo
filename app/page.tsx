import { Suspense } from 'react'
import SearchForm from '@/components/SearchForm'
import DataTable from '@/components/DataTable'
import ItemDialog from '@/components/ItemDialog'

async function getItems(searchTerm?: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch items')
  }
  const items = await res.json()
  if (searchTerm) {
    return items.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }
  return items
}

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const searchTerm = searchParams.search
  const initialItems = await getItems(searchTerm)

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Table Data</h1>
      <div className="flex justify-between items-center mb-4">
        <SearchForm />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <DataTable initialItems={initialItems} />
      </Suspense>
      <ItemDialog />
    </main>
  )
}

