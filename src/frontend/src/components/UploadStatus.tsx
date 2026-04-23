'use client'
import React from 'react'
import { useUpload } from '@/lib/UploadContext'
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa'

const UploadStatus: React.FC = () => {
  const { uploads } = useUpload()

  if (uploads.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 w-72 space-y-2 z-50">
      {uploads.map((upload) => (
        <div key={upload.id} className="bg-white p-3 rounded-lg shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-gray-700 truncate w-40">
              {upload.fileName}
            </span>
            <span className="text-xs text-gray-500">{upload.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                upload.status === 'completed' ? 'bg-green-500' : 
                upload.status === 'error' ? 'bg-red-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${upload.progress}%` }}
            ></div>
          </div>
          <div className="flex items-center text-[10px]">
            {upload.status === 'uploading' && (
              <>
                <FaSpinner className="animate-spin mr-1 text-cyan-500" />
                <span className="text-cyan-600 font-medium">Uploading...</span>
              </>
            )}
            {upload.status === 'completed' && (
              <>
                <FaCheckCircle className="mr-1 text-green-500" />
                <span className="text-green-600 font-medium">Done</span>
              </>
            )}
            {upload.status === 'error' && (
              <>
                <FaExclamationCircle className="mr-1 text-red-500" />
                <span className="text-red-600 font-medium">{upload.errorMessage}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default UploadStatus
