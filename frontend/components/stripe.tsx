"use client"

import { useState, useEffect } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// Simulação de chave pública do Stripe
const stripePromise = loadStripe("pk_test_simulated_key")

export function Stripe({ children, options, className }) {
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    // Simulação de obtenção do client secret
    // Em um ambiente real, isso viria de uma chamada de API ao backend
    setTimeout(() => {
      setClientSecret("sk_test_simulated_client_secret")
    }, 1000)
  }, [])

  return (
    <div className={className}>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, ...options }}>
          {children}
        </Elements>
      )}
      {!clientSecret && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}

