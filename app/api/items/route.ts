import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Helper function to generate a unique key for each item
const getItemKey = (id: number) => `item:${id}`

export async function GET() {
  // Get all item IDs
  const itemIds = await redis.smembers('items')
  
  // Fetch all items in parallel
  const items = await Promise.all(
    itemIds.map(async (id) => {
      const item = await redis.hgetall(getItemKey(parseInt(id)))
      return { ...item, id: parseInt(id) }
    })
  )

  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const item = await request.json()
  const id = Date.now()
  const itemKey = getItemKey(id)

  // Add the item to Redis
  await redis.hset(itemKey, item)
  // Add the item ID to the set of all items
  await redis.sadd('items', id.toString())

  return NextResponse.json({ ...item, id })
}

export async function PUT(request: Request) {
  const updatedItem = await request.json()
  const itemKey = getItemKey(updatedItem.id)

  // Update the item in Redis
  await redis.hset(itemKey, updatedItem)

  return NextResponse.json(updatedItem)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const itemKey = getItemKey(id)

  // Remove the item from Redis
  await redis.del(itemKey)
  // Remove the item ID from the set of all items
  await redis.srem('items', id.toString())

  return NextResponse.json({ id })
}

