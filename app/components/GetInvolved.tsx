"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, Users, Briefcase, Home, BookOpen, X } from "lucide-react"
import TribesOfIsrael from "./TribesOfIsrael"

// Define the options for getting involved
const involvementOptions = [
  {
    id: "member",
    title: "Become a Member",
    description: "Join our church family and grow with us in faith and fellowship",
    icon: Users,
    color: "bg-blue-500/10",
    formFields: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      { id: "address", label: "Home Address", type: "text", required: true },
      { id: "previousChurch", label: "Previous Church (if any)", type: "text", required: false },
    ],
  },
  {
    id: "workforce",
    title: "Join the Workforce",
    description: "Serve in one of our ministry departments using your gifts and talents",
    icon: Briefcase,
    color: "bg-green-500/10",
    formFields: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      {
        id: "department",
        label: "Preferred Department",
        type: "select",
        required: true,
        options: [
          "Worship Ministry",
          "Children's Ministry",
          "Youth Ministry",
          "Media & Technical",
          "Ushering",
          "Protocol",
          "Hospitality",
          "Prayer",
          "Outreach",
        ],
      },
      { id: "experience", label: "Relevant Experience", type: "textarea", required: false },
    ],
  },
  {
    id: "family",
    title: "Join a Family",
    description: "Connect with a home fellowship group based on the 12 tribes of Israel",
    icon: Home,
    color: "bg-purple-500/10",
    specialDisplay: true,
  },
  {
    id: "believers",
    title: "Start Believers Class",
    description: "Begin your journey of faith with foundational Christian teachings",
    icon: BookOpen,
    color: "bg-amber-500/10",
    formFields: [
      { id: "name", label: "Full Name", type: "text", required: true },
      { id: "email", label: "Email Address", type: "email", required: true },
      { id: "phone", label: "Phone Number", type: "tel", required: true },
      { id: "conversionDate", label: "Date of Salvation (if known)", type: "date", required: false },
      { id: "baptized", label: "Have you been baptized?", type: "checkbox", required: false },
    ],
  },
]

export default function GetInvolved() {
  // State to track which form is expanded
  const [expandedForm, setExpandedForm] = useState<string | null>(null)
  // State to track form submissions
  const [submittedForms, setSubmittedForms] = useState<Record<string, boolean>>({})
  // State for form data
  const [formData, setFormData] = useState<Record<string, Record<string, any>>>({
    member: {},
    workforce: {},
    family: {},
    believers: {},
  })
  // State for selected tribe (for family option)
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null)

  // Toggle form expansion
  const toggleForm = (id: string) => {
    if (expandedForm === id) {
      setExpandedForm(null)
      setSelectedTribe(null)
    } else {
      setExpandedForm(id)
    }
  }

  // Handle form input changes
  const handleInputChange = (optionId: string, fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        [fieldId]: value,
      },
    }))
  }

  // Handle form submission
  const handleSubmit = (optionId: string, e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would send the form data to your backend here
    console.log(`Submitting ${optionId} form:`, formData[optionId])

    // Mark this form as submitted
    setSubmittedForms((prev) => ({
      ...prev,
      [optionId]: true,
    }))

    // Close the form after submission
    setTimeout(() => {
      setExpandedForm(null)
      setSelectedTribe(null)

      // Reset form data for this option
      setFormData((prev) => ({
        ...prev,
        [optionId]: {},
      }))

      // Reset submission status after a delay
      setTimeout(() => {
        setSubmittedForms((prev) => ({
          ...prev,
          [optionId]: false,
        }))
      }, 5000)
    }, 2000)
  }

  // Handle tribe selection
  const handleTribeSelect = (tribe: string) => {
    setSelectedTribe(tribe)
  }

  // Handle tribe form submission
  const handleTribeSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would send the tribe form data to your backend here
    console.log(`Submitting family form for tribe ${selectedTribe}:`, formData.family)

    // Mark this form as submitted
    setSubmittedForms((prev) => ({
      ...prev,
      family: true,
    }))

    // Close the form after submission
    setTimeout(() => {
      setSelectedTribe(null)

      // Reset form data for family
      setFormData((prev) => ({
        ...prev,
        family: {},
      }))

      // Reset submission status after a delay
      setTimeout(() => {
        setSubmittedForms((prev) => ({
          ...prev,
          family: false,
        }))
      }, 5000)
    }, 2000)
  }

  // Render form fields based on type
  const renderFormField = (option: (typeof involvementOptions)[0], field: any) => {
    const optionId = option.id
    const fieldId = field.id
    const value = formData[optionId][fieldId] || ""

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <div className="mb-4">
            <Label htmlFor={`${optionId}-${fieldId}`} className="block mb-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`${optionId}-${fieldId}`}
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(optionId, fieldId, e.target.value)}
              required={field.required}
              className="w-full"
            />
          </div>
        )

      case "textarea":
        return (
          <div className="mb-4">
            <Label htmlFor={`${optionId}-${fieldId}`} className="block mb-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={`${optionId}-${fieldId}`}
              value={value}
              onChange={(e) => handleInputChange(optionId, fieldId, e.target.value)}
              required={field.required}
              className="w-full min-h-[100px]"
            />
          </div>
        )

      case "select":
        return (
          <div className="mb-4">
            <Label htmlFor={`${optionId}-${fieldId}`} className="block mb-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleInputChange(optionId, fieldId, val)}>
              <SelectTrigger id={`${optionId}-${fieldId}`}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "date":
        return (
          <div className="mb-4">
            <Label htmlFor={`${optionId}-${fieldId}`} className="block mb-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={`${optionId}-${fieldId}`}
              type="date"
              value={value}
              onChange={(e) => handleInputChange(optionId, fieldId, e.target.value)}
              required={field.required}
              className="w-full"
            />
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id={`${optionId}-${fieldId}`}
              checked={value || false}
              onCheckedChange={(checked) => handleInputChange(optionId, fieldId, checked)}
            />
            <Label htmlFor={`${optionId}-${fieldId}`}>{field.label}</Label>
          </div>
        )

      default:
        return null
    }
  }

  // Render tribe form
  const renderTribeForm = () => {
    if (!selectedTribe) return null

    return (
      <div className="bg-background border border-border rounded-xl p-6 shadow-md mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Join the Tribe of {selectedTribe}</h3>
          <button
            onClick={() => setSelectedTribe(null)}
            className="p-1 rounded-full hover:bg-muted"
            aria-label="Close form"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submittedForms.family ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Your request to join the Tribe of {selectedTribe} has been submitted. We'll be in touch with you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleTribeSubmit}>
            <div className="mb-4">
              <Label htmlFor="family-name" className="block mb-2">
                Full Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="family-name"
                type="text"
                value={formData.family.name || ""}
                onChange={(e) => handleInputChange("family", "name", e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="family-email" className="block mb-2">
                Email Address<span className="text-red-500">*</span>
              </Label>
              <Input
                id="family-email"
                type="email"
                value={formData.family.email || ""}
                onChange={(e) => handleInputChange("family", "email", e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="family-phone" className="block mb-2">
                Phone Number<span className="text-red-500">*</span>
              </Label>
              <Input
                id="family-phone"
                type="tel"
                value={formData.family.phone || ""}
                onChange={(e) => handleInputChange("family", "phone", e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="family-address" className="block mb-2">
                Home Address<span className="text-red-500">*</span>
              </Label>
              <Input
                id="family-address"
                type="text"
                value={formData.family.address || ""}
                onChange={(e) => handleInputChange("family", "address", e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="family-reason" className="block mb-2">
                Why would you like to join this tribe?
              </Label>
              <Textarea
                id="family-reason"
                value={formData.family.reason || ""}
                onChange={(e) => handleInputChange("family", "reason", e.target.value)}
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="mt-6">
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="py-24 bg-background relative overflow-hidden" id="get-involved">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary-light rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            className="text-base text-primary font-semibold tracking-wide uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Join Us
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Be a Part of God's Move
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Take the next step in your spiritual journey and become an active part of what God is doing at Living Seed
            Church
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {involvementOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border border-border rounded-xl overflow-hidden shadow-md"
            >
              <div
                className={`cursor-pointer ${expandedForm === option.id ? "bg-primary/5" : ""}`}
                onClick={() => toggleForm(option.id)}
              >
                <div className="p-6 flex items-start">
                  <div className={`p-3 rounded-full ${option.color} mr-4`}>
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">{option.title}</h3>
                      {expandedForm === option.id ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedForm === option.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-border pt-6">
                      {option.specialDisplay ? (
                        // Special display for family/tribes option
                        <div>
                          <p className="text-muted-foreground mb-4">
                            Select a tribe to join based on your birth month. Each tribe represents a unique community
                            within our church family.
                          </p>
                          <TribesOfIsrael onSelectTribe={handleTribeSelect} />
                          {renderTribeForm()}
                        </div>
                      ) : submittedForms[option.id] ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-8 h-8 text-green-600 dark:text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                          <p className="text-muted-foreground">
                            Your information has been submitted. We'll be in touch with you soon.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleSubmit(option.id, e)}>
                          {option.formFields?.map((field) => (
                            <div key={field.id}>{renderFormField(option, field)}</div>
                          ))}

                          <div className="mt-6">
                            <Button type="submit" className="w-full">
                              Submit
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

