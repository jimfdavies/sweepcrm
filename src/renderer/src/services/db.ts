import { ipcInvoke } from '../utils/ipc'
import { DatabaseRequest } from '../../../shared/ipc.types'

/**
 * Create a new record
 */
export const createRecord = async <T extends { id: string }>(
  table: string,
  data: T
): Promise<{ id: string }> => {
  const response = await ipcInvoke<{ id: string }>('db:request', {
    operation: 'create',
    table,
    data
  } as DatabaseRequest)
  return response
}

/**
 * Read a single record by ID
 */
export const readRecord = async <T = unknown>(table: string, id: string): Promise<T> => {
  const response = await ipcInvoke<T>('db:request', {
    operation: 'read',
    table,
    id
  } as DatabaseRequest)
  return response
}

/**
 * Update a record
 */
export const updateRecord = async <T extends { id: string }>(
  table: string,
  data: T
): Promise<{ id: string }> => {
  const response = await ipcInvoke<{ id: string }>('db:request', {
    operation: 'update',
    table,
    id: data.id,
    data
  } as DatabaseRequest)
  return response
}

/**
 * Delete a record
 */
export const deleteRecord = async (table: string, id: string): Promise<void> => {
  await ipcInvoke('db:request', {
    operation: 'delete',
    table,
    id
  } as DatabaseRequest)
}

/**
 * List records with optional filters
 */
export const listRecords = async <T = unknown>(
  table: string,
  filters?: Record<string, unknown>
): Promise<T[]> => {
  const response = await ipcInvoke<T[]>('db:request', {
    operation: 'list',
    table,
    filters
  } as DatabaseRequest)
  return response || []
}
