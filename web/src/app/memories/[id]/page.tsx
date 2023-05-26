'use client'

import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'

import pt from 'dayjs/locale/pt'
import dayjs from 'dayjs'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Cookies from 'js-cookie'
import { ChevronLeft, Delete, Edit } from 'lucide-react'
import Link from 'next/link'

dayjs.locale(pt)

interface Memory {
  id: string
  coverUrl: string
  content: string
  createdAt: string
}

export default function MemoryById() {
  const param = useParams()
  const id = param.id

  const isAuthenticated = Cookies.get('token')

  const token = Cookies.get('token')

  const [memory, setMemory] = useState<Memory | null>()

  async function getMemoryById(id: string) {
    const response = await api.get(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setMemory(response.data)
  }

  getMemoryById(id)

  if (isAuthenticated?.length === 0) {
    return <EmptyMemories />
  }

  if (!memory) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-200"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      <div className="space-y-4">
        <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
          {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
        </time>
        <img
          src={memory.coverUrl}
          width={592}
          height={280}
          className="aspect-video w-full rounded-lg object-cover"
          alt=""
        />
        <div
          className="text-lg leading-relaxed text-gray-100"
          dangerouslySetInnerHTML={{ __html: memory.content }}
        ></div>

        <div className="flex flex-1 flex-row justify-end gap-2">
          <a
            href={`/memories/edit/${memory.id}`}
            className="flex items-center gap-1 text-sm text-blue-100 hover:text-blue-200"
          >
            <Edit className="h-4 w-4" />
            Editar
          </a>
          <a
            href={`/memories/delete/${memory.id}`}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500"
          >
            <Delete className="h-4 w-4" />
            Apagar
          </a>
        </div>
      </div>
    </div>
  )
}
