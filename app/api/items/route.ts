import { NextResponse } from 'next/server'

// This would typically be a database, but we'll use an in-memory store for this example
let items = [
  { id: 1, description: 'Project Overview', content: 'A brief summary of the project goals and objectives', tag: 'Planning' },
  { id: 2, description: 'User Requirements', content: 'List of user stories and acceptance criteria', tag: 'Analysis' },
  { id: 3, description: 'System Architecture', content: 'High-level design of the system components', tag: 'Design' },
  { id: 4, description: 'Test Cases', content: 'Detailed test scenarios for quality assurance', tag: 'Testing' },
  { id: 5, description: 'Deployment Plan', content: 'Step-by-step guide for system deployment', tag: 'Implementation' },
]

export async function GET() {
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const item = await request.json()
  item.id = Date.now()
  items.push(item)
  return NextResponse.json(item)
}

export async function PUT(request: Request) {
  const updatedItem = await request.json()
  items = items.map(item => item.id === updatedItem.id ? updatedItem : item)
  return NextResponse.json(updatedItem)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  items = items.filter(item => item.id !== id)
  return NextResponse.json({ id })
}

