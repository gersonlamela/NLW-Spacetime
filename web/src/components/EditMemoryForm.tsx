'use client'

import { Camera } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // Import the Quill styles

import { useParams, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { EmptyMemories } from './EmptyMemories'
import { MediaUpdate } from './MediaUpdate'

interface Memory {
  id: string
  coverUrl: string
  content: string
  createdAt: string
  isPublic: boolean
}

export function EditMemoryForm() {
  const router = useRouter()
  const param = useParams()
  const id = param.id

  const isAuthenticated = Cookies.get('token')

  const token = Cookies.get('token')

  const [memory, setMemory] = useState<Memory | null>()

  const [content, setContent] = useState('')

  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    async function getMemoryById() {
      const response = await api.get(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setMemory(response.data)
      setContent(response.data.content)
      setIsPublic(response.data.isPublic)
    }

    getMemoryById()
  }, [id, token])

  if (isAuthenticated?.length === 0) {
    return <EmptyMemories />
  }

  if (!memory) {
    return <EmptyMemories />
  }

  async function handleUpdateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')
    let coverUrl = memory?.coverUrl

    if (fileToUpload instanceof File) {
      const fileName = fileToUpload.name

      if (fileName.length !== 0) {
        const uploadFormData = new FormData()

        uploadFormData.set('file', fileToUpload)

        const uploadResponse = await api.post('/upload', uploadFormData)

        console.log(uploadResponse)

        coverUrl = uploadResponse.data.fileUrl
      }
    } else {
      coverUrl = memory?.coverUrl
    }
    await api.put(
      `/memories/${id}`,

      {
        coverUrl,
        content,
        isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    console.log(content.toString)

    router.push('/')
  }

  return (
    <form
      onSubmit={handleUpdateMemory}
      className="flex flex-1  flex-col gap-2 p-16"
    >
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Adicionar foto
        </label>

        <label
          htmlFor="isPublic"
          className="flex  items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 focus:ring-0"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaUpdate image={memory.coverUrl} />

      <div>
        <ReactQuill
          value={content}
          onChange={(value) => setContent(value)}
          className="bg-white p-4 text-black shadow-sm"
          theme="snow"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />
      </div>

      <button
        type="submit"
        className='className="inline-block hover:bg-green-600"  self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black'
      >
        Salvar
      </button>
    </form>
  )
}
