import { ipcInvoke } from '../utils/ipc'
import { DatabaseRequest } from '../../../shared/ipc.types'

/**
 * Create a new record
 */
export const createRecord = async <T extends { id: string }>(
  table: string,
  data: T
): Promise<{ id: string }> => {
  const response = await ipcInvoke<{ success: boolean; data?: { id: string }; error?: string }>(
    'db:request',
    {
      operation: 'create',
      table,
      data
    } as DatabaseRequest
  )
  if (!response.success) {
    throw new Error(response.error || 'Failed to create record')
  }
  return response.data || { id: '' }
}

/**
 * Read a single record by ID
 */
export const readRecord = async <T = unknown>(table: string, id: string): Promise<T> => {
  const response = await ipcInvoke<{ success: boolean; data?: T; error?: string }>(
    'db:request',
    {
      operation: 'read',
      table,
      id
    } as DatabaseRequest
  )
  if (!response.success) {
    throw new Error(response.error || 'Failed to read record')
  }
  return response.data as T
}

/**
 * Update a record
 */
export const updateRecord = async <T extends { id: string }>(
  table: string,
  data: T
): Promise<{ id: string }> => {
  const response = await ipcInvoke<{ success: boolean; data?: { id: string }; error?: string }>(
    'db:request',
    {
      operation: 'update',
      table,
      id: data.id,
      data
    } as DatabaseRequest
  )
  if (!response.success) {
    throw new Error(response.error || 'Failed to update record')
  }
  return response.data || { id: '' }
}

/**
 * Delete a record
 */
export const deleteRecord = async (table: string, id: string): Promise<void> => {
  const response = await ipcInvoke<{ success: boolean; error?: string }>('db:request', {
    operation: 'delete',
    table,
    id
  } as DatabaseRequest)
  if (!response.success) {
    throw new Error(response.error || 'Failed to delete record')
  }
}

/**
 * List records with optional filters
 */
export const listRecords = async <T = unknown>(
  table: string,
  filters?: Record<string, unknown>
): Promise<T[]> => {
  const response = await ipcInvoke<{ success: boolean; data?: T[]; error?: string }>(
    'db:request',
    {
      operation: 'list',
      table,
      filters
    } as DatabaseRequest
  )
  if (!response.success) {
    throw new Error(response.error || 'Failed to list records')
  }
  return response.data || []
}
