'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function SignOutPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/vms/portal'

  useEffect(() => {
    void signOut({ callbackUrl })
  }, [callbackUrl])

  return <></>
}
