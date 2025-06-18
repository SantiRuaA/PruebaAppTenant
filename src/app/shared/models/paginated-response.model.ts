export interface PaginatedResponse<T> {
  //T = añadir cualquier tipo de dato
  items: T[]
  total: number
  page: number
  limit: number
}
