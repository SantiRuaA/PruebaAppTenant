export interface Document {
  id: number
  name: string
  description: string
  fileUrl: string
  createdAt: Date
  updatedAt: Date
  userId: number
  tenantId: number
  tags: string[]
}