'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DataItem {
  id: number
  description: string
  content: string
  tag: string
}

interface DataTableProps {
  initialItems: DataItem[]
}

export default function DataTable({ initialItems }: DataTableProps) {
  const [items, setItems] = useState(initialItems)
  const router = useRouter()

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const handleEdit = (item: DataItem) => {
    router.push(`/?edit=${item.id}`)
  }

  const handleDelete = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (res.ok) {
      setItems(items.filter(item => item.id !== id))
      router.refresh()
    }
  }

  const handleAddNew = () => {
    router.push('/?edit=new')
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.content}</TableCell>
              <TableCell>{item.tag}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end p-4">
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>
    </div>
  )
}

