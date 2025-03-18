"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NovoPersonalPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/admin/personais/novo/editar")
  }, [router])

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
}

