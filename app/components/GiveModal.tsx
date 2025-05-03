"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Calendar, Lock, Heart, Church, Building, Gift, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define giving types
const givingTypes = [
  { id: "tithe", name: "Tithe", icon: Church, description: "10% of your income given to support the church" },
  { id: "offering", name: "Offering", icon: Heart, description: "General offering to support church operations" },
  {
    id: "project",
    name: "Building Project",
    icon: Building,
    description: "Support our church building and renovation projects",
  },
  {
    id: "ministry",
    name: "Ministry Support",
    icon: Gift,
    description: "Support specific ministries within the church",
  },
]

// Define ministry options
const ministryOptions = [
  { id: "youth", name: "Youth Ministry" },
  { id: "children", name: "Children's Ministry" },
  { id: "women", name: "Women's Ministry" },
  { id: "men", name: "Men's Ministry" },
  { id: "outreach", name: "Outreach & Missions" },
  { id: "worship", name: "Worship Ministry" },
]

// Replace the paymentMethods array with this updated version that includes payment processors
const paymentMethods = [
  { id: "paystack", name: "Paystack", description: "Pay with card, bank transfer, or USSD" },
  { id: "stripe", name: "Stripe", description: "International payments with credit/debit cards" },
  { id: "paypal", name: "PayPal", description: "Pay using your PayPal account" },
  { id: "offline", name: "Offline Donation", description: "Bank transfer, mobile money, or cash" },
]

// Define currencies
const currencies = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "EUR", symbol: "€", name: "Euro" },
]

export default function GiveModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [givingType, setGivingType] = useState<string | null>(null)
  const [ministry, setMinistry] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("NGN")
  const [paymentMethod, setPaymentMethod] = useState<string>("paystack")
  const [isRecurring, setIsRecurring] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Form fields for payment
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [email, setEmail] = useState("")

  // Listen for open modal event
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true)
      // Reset form when opening
      setStep(1)
      setGivingType(null)
      setMinistry(null)
      setAmount("")
      setCurrency("NGN")
      setIsRecurring(false)
      setIsComplete(false)
    }

    window.addEventListener("open-give-modal", handleOpenModal)
    return () => window.removeEventListener("open-give-modal", handleOpenModal)
  }, [])

  // Handle close
  const handleClose = () => {
    setIsOpen(false)
    // Reset after animation completes
    setTimeout(() => {
      setStep(1)
      setGivingType(null)
      setMinistry(null)
      setAmount("")
      setCurrency("NGN")
      setIsRecurring(false)
      setIsComplete(false)
    }, 300)
  }

  // Update the handleNextStep function to handle different payment processors
  const handleNextStep = () => {
    if (step === 1 && !givingType) return
    if (step === 2 && !amount) return
    if (step === 3) {
      if (paymentMethod === "stripe" && (!cardName || !cardNumber || !cardExpiry || !cardCvc || !email)) return
      if ((paymentMethod === "paystack" || paymentMethod === "paypal") && !email) return
    }

    if (step < 3) {
      setStep(step + 1)
    } else {
      // Process payment
      setIsProcessing(true)
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false)
        setIsComplete(true)
      }, 2000)
    }
  }

  // Handle back step
  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format card expiry
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Handle quick amount selection
  const handleQuickAmount = (quickAmount: string) => {
    setAmount(quickAmount)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-2xl bg-background rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-2xl font-bold">Give to Living Seed Church</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Close giving form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                          step >= i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {i === 1 ? "Purpose" : i === 2 ? "Amount" : "Payment"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step 1: Select giving type */}
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Select Giving Type</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose the purpose for your giving. Your generosity helps support our church's mission and
                    ministries.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {givingTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          givingType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setGivingType(type.id)}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full ${givingType === type.id ? "bg-primary/10" : "bg-muted"}`}>
                            <type.icon
                              className={`h-5 w-5 ${givingType === type.id ? "text-primary" : "text-muted-foreground"}`}
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium">{type.name}</h4>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ministry selection (only if ministry is selected) */}
                  {givingType === "ministry" && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Select Ministry</h4>
                      <RadioGroup value={ministry || ""} onValueChange={setMinistry}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {ministryOptions.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Label htmlFor={option.id}>{option.name}</Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Enter amount */}
              {step === 2 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Enter Amount</h3>
                  <p className="text-muted-foreground mb-6">
                    Enter the amount you would like to give. You can also set up recurring giving.
                  </p>

                  {/* Currency selection */}
                  <div className="mb-4">
                    <Label htmlFor="currency" className="text-sm font-medium block mb-2">
                      Currency
                    </Label>
                    <div className="grid grid-cols-4 gap-2">
                      {currencies.map((curr) => (
                        <Button
                          key={curr.code}
                          type="button"
                          variant={currency === curr.code ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrency(curr.code)}
                          className="flex items-center justify-center"
                        >
                          <span className="mr-1">{curr.symbol}</span> {curr.code}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="amount" className="text-lg font-medium">
                      Amount
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        {currencies.find((c) => c.code === currency)?.symbol}
                      </div>
                      <Input
                        id="amount"
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        placeholder="0.00"
                        className="pl-10 text-lg"
                      />
                    </div>
                  </div>

                  {/* Quick amount buttons */}
                  <div className="mb-6">
                    <Label className="text-sm mb-2 block">Quick Select</Label>
                    <div className="flex flex-wrap gap-2">
                      {currency === "NGN"
                        ? ["1000", "2000", "5000", "10000", "20000", "50000"].map((quickAmount) => (
                            <Button
                              key={quickAmount}
                              type="button"
                              variant={amount === quickAmount ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleQuickAmount(quickAmount)}
                            >
                              ₦{quickAmount}
                            </Button>
                          ))
                        : currency === "USD"
                          ? ["10", "20", "50", "100", "200", "500"].map((quickAmount) => (
                              <Button
                                key={quickAmount}
                                type="button"
                                variant={amount === quickAmount ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleQuickAmount(quickAmount)}
                              >
                                ${quickAmount}
                              </Button>
                            ))
                          : currency === "GBP"
                            ? ["10", "20", "50", "100", "200", "500"].map((quickAmount) => (
                                <Button
                                  key={quickAmount}
                                  type="button"
                                  variant={amount === quickAmount ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleQuickAmount(quickAmount)}
                                >
                                  £{quickAmount}
                                </Button>
                              ))
                            : ["10", "20", "50", "100", "200", "500"].map((quickAmount) => (
                                <Button
                                  key={quickAmount}
                                  type="button"
                                  variant={amount === quickAmount ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleQuickAmount(quickAmount)}
                                >
                                  €{quickAmount}
                                </Button>
                              ))}
                    </div>
                  </div>

                  {/* Recurring giving option */}
                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                    />
                    <Label htmlFor="recurring">Make this a recurring gift</Label>
                  </div>

                  {isRecurring && (
                    <div className="bg-muted/30 p-4 rounded-lg mb-6">
                      <h4 className="font-medium mb-2">Recurring Schedule</h4>
                      <Tabs defaultValue="weekly">
                        <TabsList className="mb-4">
                          <TabsTrigger value="weekly">Weekly</TabsTrigger>
                          <TabsTrigger value="monthly">Monthly</TabsTrigger>
                          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                        </TabsList>
                        <p className="text-sm text-muted-foreground">
                          Your gift will be automatically processed according to your selected schedule until you
                          cancel.
                        </p>
                      </Tabs>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment information */}
              {step === 3 && (
                <div>
                  <h3 className="text-xl font-bold mb-4">Payment Information</h3>
                  <p className="text-muted-foreground mb-6">
                    Enter your payment details. All transactions are secure and encrypted.
                  </p>

                  {/* Payment method selection */}
                  <div className="mb-6">
                    <Label className="text-sm mb-2 block">Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="grid grid-cols-1 gap-3">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              paymentMethod === method.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setPaymentMethod(method.id)}
                          >
                            <div className="flex items-center">
                              <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="mr-3" />
                              <div>
                                <Label htmlFor={`payment-${method.id}`} className="font-medium">
                                  {method.name}
                                </Label>
                                <p className="text-sm text-muted-foreground">{method.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Paystack form */}
                  {paymentMethod === "paystack" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Full Name</Label>
                        <Input
                          id="cardName"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+234 800 000 0000" className="mt-1" required />
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-sm">
                          You'll be redirected to Paystack's secure payment page to complete your donation of{" "}
                          {currencies.find((c) => c.code === currency)?.symbol}
                          {amount}.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Stripe form */}
                  {paymentMethod === "stripe" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Receipt</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative mt-1">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          <Input
                            id="cardNumber"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            className="pl-10"
                            maxLength={19}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <div className="relative mt-1">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              id="cardExpiry"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                              placeholder="MM/YY"
                              className="pl-10"
                              maxLength={5}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                              id="cardCvc"
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                              placeholder="123"
                              className="pl-10"
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PayPal form */}
                  {paymentMethod === "paypal" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <p className="text-sm">
                          You'll be redirected to PayPal's secure payment page to complete your donation of{" "}
                          {currencies.find((c) => c.code === currency)?.symbol}
                          {amount}.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Offline donation instructions */}
                  {paymentMethod === "offline" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="offline-method" className="text-sm font-medium block mb-2">
                          Donation Method
                        </Label>
                        <Select defaultValue="bank">
                          <SelectTrigger id="offline-method">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="mobile">Mobile Money</SelectItem>
                            <SelectItem value="cash">Cash/Check</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-4">Bank Account Details</h4>

                        {/* NGN Account */}
                        <div className="mb-4 pb-4 border-b border-border">
                          <div className="flex items-center mb-2">
                            <div className="bg-primary/10 p-1 rounded mr-2">
                              <span className="font-bold">₦</span>
                            </div>
                            <h5 className="font-medium">Nigerian Naira (NGN)</h5>
                          </div>
                          <div className="space-y-1 text-sm pl-7">
                            <p>
                              <span className="font-medium">Bank:</span> First Bank of Nigeria
                            </p>
                            <p>
                              <span className="font-medium">Account Name:</span> RCCG Living Seed Church
                            </p>
                            <p>
                              <span className="font-medium">Account Number:</span> 1234567890
                            </p>
                            <p>
                              <span className="font-medium">Branch:</span> Abuja Main Branch
                            </p>
                          </div>
                        </div>

                        {/* USD Account */}
                        <div className="mb-4 pb-4 border-b border-border">
                          <div className="flex items-center mb-2">
                            <div className="bg-primary/10 p-1 rounded mr-2">
                              <span className="font-bold">$</span>
                            </div>
                            <h5 className="font-medium">US Dollar (USD)</h5>
                          </div>
                          <div className="space-y-1 text-sm pl-7">
                            <p>
                              <span className="font-medium">Bank:</span> Zenith Bank
                            </p>
                            <p>
                              <span className="font-medium">Account Name:</span> RCCG Living Seed Church
                            </p>
                            <p>
                              <span className="font-medium">Account Number:</span> 1234567890
                            </p>
                            <p>
                              <span className="font-medium">Swift Code:</span> ZEIBNGLA
                            </p>
                          </div>
                        </div>

                        {/* GBP Account */}
                        <div className="mb-4 pb-4 border-b border-border">
                          <div className="flex items-center mb-2">
                            <div className="bg-primary/10 p-1 rounded mr-2">
                              <span className="font-bold">£</span>
                            </div>
                            <h5 className="font-medium">British Pound (GBP)</h5>
                          </div>
                          <div className="space-y-1 text-sm pl-7">
                            <p>
                              <span className="font-medium">Bank:</span> Guaranty Trust Bank
                            </p>
                            <p>
                              <span className="font-medium">Account Name:</span> RCCG Living Seed Church
                            </p>
                            <p>
                              <span className="font-medium">Account Number:</span> 1234567890
                            </p>
                            <p>
                              <span className="font-medium">IBAN:</span> GB29NWBK60161331926819
                            </p>
                          </div>
                        </div>

                        {/* EUR Account */}
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="bg-primary/10 p-1 rounded mr-2">
                              <span className="font-bold">€</span>
                            </div>
                            <h5 className="font-medium">Euro (EUR)</h5>
                          </div>
                          <div className="space-y-1 text-sm pl-7">
                            <p>
                              <span className="font-medium">Bank:</span> Access Bank
                            </p>
                            <p>
                              <span className="font-medium">Account Name:</span> RCCG Living Seed Church
                            </p>
                            <p>
                              <span className="font-medium">Account Number:</span> 1234567890
                            </p>
                            <p>
                              <span className="font-medium">IBAN:</span> DE89370400440532013000
                            </p>
                            <p>
                              <span className="font-medium">BIC/SWIFT:</span> COBADEFFXXX
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="reference">Payment Reference</Label>
                        <Input id="reference" placeholder="Transaction ID or Reference Number" className="mt-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          If you've already made the payment, please provide the reference number
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="email-offline">Email for Receipt</Label>
                        <Input id="email-offline" type="email" placeholder="your@email.com" className="mt-1" required />
                      </div>
                    </div>
                  )}

                  {/* Secure payment notice */}
                  <div className="mt-6 flex items-center text-sm text-muted-foreground">
                    <Lock className="h-4 w-4 mr-2" />
                    <p>All transactions are secure and encrypted</p>
                  </div>
                </div>
              )}

              {/* Success message */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
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
                  <h3 className="text-2xl font-bold mb-2">Thank You for Your Gift!</h3>
                  <p className="text-muted-foreground mb-2">
                    Your contribution of {currencies.find((c) => c.code === currency)?.symbol}
                    {amount} has been {paymentMethod === "offline" ? "recorded" : "received"}.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {paymentMethod === "offline"
                      ? "We'll confirm your donation once the payment is verified."
                      : "A receipt has been sent to your email."}
                  </p>
                  <Button onClick={handleClose}>Close</Button>
                </motion.div>
              )}
            </div>

            {/* Footer with action buttons */}
            {!isComplete && (
              <div className="p-6 border-t border-border bg-muted/30 flex justify-between">
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBackStep}>
                    Back
                  </Button>
                ) : (
                  <div></div> // Empty div to maintain layout
                )}
                <Button
                  onClick={handleNextStep}
                  disabled={
                    (step === 1 && (!givingType || (givingType === "ministry" && !ministry))) ||
                    (step === 2 && !amount) ||
                    isProcessing
                  }
                  className="min-w-[100px]"
                >
                  {isProcessing ? (
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
                      Processing...
                    </>
                  ) : step < 3 ? (
                    <>
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    "Complete Donation"
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

