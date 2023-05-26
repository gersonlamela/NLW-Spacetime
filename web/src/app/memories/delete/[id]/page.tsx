'use client'
import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { api } from '@/lib/api'
import { EmptyMemories } from '@/components/EmptyMemories'

const DeleteMemoryById = () => {
  const param = useParams()
  const router = useRouter()
  const id = param.id
  const token = Cookies.get('token')

  useEffect(() => {
    async function deleteById() {
      await api.delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }

    router.push('/')

    deleteById()
  }, [id, token, router])

  if (token?.length === 0) {
    return <EmptyMemories />
  }
}

export default DeleteMemoryById
