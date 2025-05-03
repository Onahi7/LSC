"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import IntuitiveHeader from "../components/IntuitiveHeader"
import Footer from "../components/Footer"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormState((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="relative bg-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-xl text-muted-foreground">
                We'd love to hear from you! Reach out with any questions, prayer requests, or to learn more about our
                church.
              </p>
            </motion.div>
          </div>

          {/* Decorative wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path
                fill="currentColor"
                fillOpacity="1"
                className="text-background"
                d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/contact" className="text-primary font-medium">
              Contact
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-background border border-border rounded-xl p-6 shadow-md"
              >
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Our Location</h3>
                      <p className="text-muted-foreground">123 Faith Avenue, Abuja, Nigeria</p>
                      <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline mt-1 inline-block"
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Email Us</h3>
                      <a
                        href="mailto:info@livingseedchurch.org"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        info@livingseedchurch.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Call Us</h3>
                      <a
                        href="tel:+2341234567890"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +234 123 456 7890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Office Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p className="text-muted-foreground">Saturday: 10:00 AM - 2:00 PM</p>
                      <p className="text-muted-foreground">Sunday: Closed (Join us for service!)</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Service Times */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-primary/10 rounded-xl p-6 mt-6"
              >
                <h2 className="text-2xl font-bold mb-4">Service Times</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold">Sunday Services</h3>
                    <p className="text-muted-foreground">9:00 AM - 11:30 AM</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Wednesday Bible Study</h3>
                    <p className="text-muted-foreground">6:00 PM - 7:30 PM</p>
                  </div>
                  <div>
                    <h3 className="font-bold">Friday Prayer Meeting</h3>
                    <p className="text-muted-foreground">7:00 PM - 9:00 PM</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-background border border-border rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-lg flex items-center"
                  >
                    <CheckCircle className="h-6 w-6 mr-3 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-bold text-lg">Message Sent Successfully!</h3>
                      <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="+234 123 456 7890"
                        className="mt-1"
                      />
                    </div>

                    <div className="mb-6">
                      <Label>Subject</Label>
                      <RadioGroup
                        value={formState.subject}
                        onValueChange={handleRadioChange}
                        className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general">General Inquiry</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="prayer" id="prayer" />
                          <Label htmlFor="prayer">Prayer Request</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="visit" id="visit" />
                          <Label htmlFor="visit">Planning a Visit</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="mb-6">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                        className="mt-1 min-h-[150px]"
                      />
                    </div>

                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3 mt-8"
            >
              <div className="bg-background border border-border rounded-xl overflow-hidden shadow-md">
                <h2 className="text-2xl font-bold p-6 border-b border-border">Our Location</h2>
                <div className="aspect-[16/9] w-full bg-muted">
                  {/* Replace with actual map embed */}
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <img
                      src="/placeholder.svg?height=500&width=1000&text=Church+Location+Map"
                      alt="Church Location Map"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background border border-border rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-2">What time are your Sunday services?</h3>
                <p className="text-muted-foreground">
                  Our main Sunday service runs from 9:00 AM to 11:30 AM. We also have children's church and youth
                  services running concurrently.
                </p>
              </div>

              <div className="bg-background border border-border rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-2">How do I become a member?</h3>
                <p className="text-muted-foreground">
                  We offer membership classes monthly. You can register for the next class by filling out the contact
                  form above or speaking with one of our ushers on Sunday.
                </p>
              </div>

              <div className="bg-background border border-border rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-2">Do you have programs for children?</h3>
                <p className="text-muted-foreground">
                  Yes! We have age-appropriate programs for children from toddlers through pre-teens. Our children's
                  ministry meets during the main Sunday service.
                </p>
              </div>

              <div className="bg-background border border-border rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold mb-2">How can I get involved in serving?</h3>
                <p className="text-muted-foreground">
                  We have many opportunities to serve in various ministries. Fill out the contact form, and our ministry
                  coordinator will reach out to discuss your interests and gifts.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

