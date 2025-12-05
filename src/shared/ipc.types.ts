// Shared IPC types between main and renderer

export interface IPCRequest<T = unknown> {
  id: string
  channel: string
  payload: T
}

export interface IPCResponse<T = unknown> {
  id: string
  channel: string
  success: boolean
  payload?: T
  error?: string
}

// Database operation types
export type DatabaseOperation = 'create' | 'read' | 'update' | 'delete' | 'list'

export interface DatabaseRequest {
  operation: DatabaseOperation
  table: string
  data?: Record<string, unknown>
  id?: string
  filters?: Record<string, unknown>
}

export interface DatabaseResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
