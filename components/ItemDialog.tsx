'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Item {
  id: number
  description: string
  content: string
  tag: string
}

export default function ItemDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [item, setItem] = useState<Item | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  useEffect(() => {
    if (editId) {
      setIsOpen(true)
      if (editId !== 'new') {
        fetchItem(parseInt(editId))
      } else {
        setItem({ id: 0, description: '', content: '', tag: '' })
      }
    } else {
      setIsOpen(false)
      setItem(null)
    }
  }, [editId])

  const fetchItem = async (id: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`)
    if (res.ok) {
      const data = await res.json()
      const item = data.find((item: Item) => item.id === id)
      if (item) {
        setItem(item)
      }
    }
  }

  const handleSave = async () => {
    if (item) {
      const method = item.id === 0 ? 'POST' : 'PUT'
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })

      if (res.ok) {
        handleClose()
        router.refresh()
      }
    }
  }

  const handleClose = () => {
    setItem(null)
    setIsOpen(false)
    console.log("close")
    router.push("/?")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item && item.id === 0 ? 'Add New Item' : 'Edit Item'}</DialogTitle>
        </DialogHeader>
        {item && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={item.description}
                onChange={(e) => setItem({ ...item, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Input
                id="content"
                value={item.content}
                onChange={(e) => setItem({ ...item, content: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">
                Tag
              </Label>
              <Input
                id="tag"
                value={item.tag}
                onChange={(e) => setItem({ ...item, tag: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            {item && item.id === 0 ? 'Add Item' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

