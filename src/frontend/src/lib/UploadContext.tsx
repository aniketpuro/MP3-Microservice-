'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

interface UploadTask {
  id: string
  fileName: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  errorMessage?: string
}

interface UploadContextType {
  uploads: UploadTask[]
  uploadFile: (file: File, gatewayIP: string) => Promise<void>
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploads, setUploads] = useState<UploadTask[]>([])

  const uploadFile = useCallback(async (file: File, gatewayIP: string) => {
    const id = Math.random().toString(36).substring(7)
    const newTask: UploadTask = { id, fileName: file.name, progress: 0, status: 'uploading' }
    
    setUploads((prev) => [...prev, newTask])

    try {
      await axios.post(
        '/api/upload',
        { file, gatewayIP },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || file.size))
            setUploads((prev) =>
              prev.map((t) => (t.id === id ? { ...t, progress } : t))
            )
          },
        }
      )

      setUploads((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'completed', progress: 100 } : t))
      )
      
      // Remove completed uploads after 5 seconds
      setTimeout(() => {
        setUploads((prev) => prev.filter((t) => t.id !== id))
      }, 5000)

    } catch (error: any) {
      setUploads((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'error', errorMessage: error.response?.data || 'Upload failed' } : t))
      )
    }
  }, [])

  return (
    <UploadContext.Provider value={{ uploads, uploadFile }}>
      {children}
    </UploadContext.Provider>
  )
}

export const useUpload = () => {
  const context = useContext(UploadContext)
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider')
  }
  return context
}
