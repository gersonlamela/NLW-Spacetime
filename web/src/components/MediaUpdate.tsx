'use client'

import { X } from 'lucide-react'
import { ChangeEvent, useEffect, useState } from 'react'

interface MediaUpdateProps {
  image: string
}

export function MediaUpdate(props: MediaUpdateProps) {
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    setPreview(props.image)
  }, [props.image])

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
  }

  function handleClearCoverUrl() {
    setPreview('')
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        name="coverUrl"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line
        <div className='relative w-full'>
          <img
            src={preview}
            alt=""
            className="aspect-video h-[280px] rounded-lg object-cover"
          />
          <div
            onClick={handleClearCoverUrl}
            className="absolute right-0 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600"
          >
            <X className="h-4 w-4" />
          </div>
        </div>
      )}
    </>
  )
}
