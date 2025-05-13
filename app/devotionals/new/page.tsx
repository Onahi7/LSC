"use client"

import { getServerSession } from "next-auth"
import IntuitiveHeader from "@/app/components/IntuitiveHeader"
import Footer from "@/app/components/Footer"
import { DevotionalForm } from "@/components/DevotionalForm"

export default function NewDevotionalPage() {
  return (
    <>
      <IntuitiveHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Devotional</h1>
          <p className="text-muted-foreground">
            Share spiritual insights and encouragement with the congregation
          </p>
        </div>
        
        <DevotionalForm />
      </main>
      <Footer />
    </>
  )
}
