'use client'

import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchForm() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchTerm = formData.get('searchTerm') as string
    router.push(`/?search=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2">
        <Input
          type="text"
          name="searchTerm"
          placeholder="Search..."
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
}

