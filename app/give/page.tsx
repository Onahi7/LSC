"use client"

import { useState } from "react"
import { CreditCard, Calendar, Lock, Heart, Church, Building, Gift, ChevronRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import IntuitiveHeader from "../components/IntuitiveHeader"
import Footer from "../components/Footer"

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

// Payment processors
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

export default function GivePage() {
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

  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && !givingType) return
    if (step === 2 && !amount) return
    if (step === 3) {
      if (paymentMethod === "stripe" && (!cardName || !cardNumber || !cardExpiry || !cardCvc || !email)) return
      if ((paymentMethod === "paystack" || paymentMethod === "paypal") && !email) return
    }

    if (step < 3) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Process payment
      setIsProcessing(true)
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false)
        setIsComplete(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }, 2000)
    }
  }

  // Handle back step
  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
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
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />

      <main className="flex-grow pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/give" className="text-primary font-medium">
              Give
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Give to Living Seed Church</h1>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Progress indicator */}
          <div className="mb-12 bg-background border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      step >= i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i}
                  </div>
                  <span className="text-sm font-medium">{i === 1 ? "Purpose" : i === 2 ? "Amount" : "Payment"}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-background border border-border rounded-xl p-8 shadow-md mb-8">
            {/* Step 1: Select giving type */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Select Giving Type</h2>
                <p className="text-muted-foreground mb-8">
                  Choose the purpose for your giving. Your generosity helps support our church's mission and ministries.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {givingTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        givingType === type.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setGivingType(type.id)}
                    >
                      <div className="flex items-start">
                        <div className={`p-3 rounded-full ${givingType === type.id ? "bg-primary/10" : "bg-muted"}`}>
                          <type.icon
                            className={`h-6 w-6 ${givingType === type.id ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-bold">{type.name}</h3>
                          <p className="text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ministry selection (only if ministry is selected) */}
                {givingType === "ministry" && (
                  <div className="mt-8 bg-muted/30 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Select Ministry</h3>
                    <RadioGroup value={ministry || ""} onValueChange={setMinistry}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ministryOptions.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="text-base">
                              {option.name}
                            </Label>
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
                <h2 className="text-2xl font-bold mb-4">Enter Amount</h2>
                <p className="text-muted-foreground mb-8">
                  Enter the amount you would like to give. You can also set up recurring giving.
                </p>

                {/* Currency selection */}
                <div className="mb-6">
                  <Label htmlFor="currency" className="text-base font-medium block mb-3">
                    Currency
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {currencies.map((curr) => (
                      <Button
                        key={curr.code}
                        type="button"
                        variant={currency === curr.code ? "default" : "outline"}
                        onClick={() => setCurrency(curr.code)}
                        className="flex items-center justify-center"
                      >
                        <span className="mr-2">{curr.symbol}</span> {curr.code}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <Label htmlFor="amount" className="text-lg font-medium block mb-3">
                    Amount
                  </Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-xl">
                      {currencies.find((c) => c.code === currency)?.symbol}
                    </div>
                    <Input
                      id="amount"
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="0.00"
                      className="pl-10 text-xl py-6"
                    />
                  </div>
                </div>

                {/* Quick amount buttons */}
                <div className="mb-8">
                  <Label className="text-base font-medium block mb-3">Quick Select</Label>
                  <div className="flex flex-wrap gap-3">
                    {currency === "NGN"
                      ? ["1000", "2000", "5000", "10000", "20000", "50000"].map((quickAmount) => (
                          <Button
                            key={quickAmount}
                            type="button"
                            variant={amount === quickAmount ? "default" : "outline"}
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
                                onClick={() => handleQuickAmount(quickAmount)}
                              >
                                €{quickAmount}
                              </Button>
                            ))}
                  </div>
                </div>

                {/* Recurring giving option */}
                <div className="bg-muted/30 p-6 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Checkbox
                      id="recurring"
                      checked={isRecurring}
                      onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
                    />
                    <Label htmlFor="recurring" className="text-base font-medium">
                      Make this a recurring gift
                    </Label>
                  </div>

                  {isRecurring && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-3">Recurring Schedule</h4>
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
              </div>
            )}

            {/* Step 3: Payment information */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
                <p className="text-muted-foreground mb-8">
                  Enter your payment details. All transactions are secure and encrypted.
                </p>

                {/* Payment method selection */}
                <div className="mb-8">
                  <Label className="text-base font-medium block mb-3">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="grid grid-cols-1 gap-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`border rounded-lg p-5 cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="flex items-center">
                            <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="mr-3" />
                            <div>
                              <Label htmlFor={`payment-${method.id}`} className="text-lg font-medium">
                                {method.name}
                              </Label>
                              <p className="text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Paystack form */}
                {paymentMethod === "paystack" && (
                  <div className="space-y-5 bg-muted/20 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Paystack Payment</h3>
                    <div>
                      <Label htmlFor="email" className="text-base">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName" className="text-base">
                        Full Name
                      </Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-base">
                        Phone Number
                      </Label>
                      <Input id="phone" type="tel" placeholder="+234 800 000 0000" className="mt-2" required />
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p>
                        You'll be redirected to Paystack's secure payment page to complete your donation of{" "}
                        {currencies.find((c) => c.code === currency)?.symbol}
                        {amount}.
                      </p>
                    </div>
                  </div>
                )}

                {/* Stripe form */}
                {paymentMethod === "stripe" && (
                  <div className="space-y-5 bg-muted/20 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Credit Card Payment</h3>
                    <div>
                      <Label htmlFor="email" className="text-base">
                        Email Receipt
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardName" className="text-base">
                        Name on Card
                      </Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber" className="text-base">
                        Card Number
                      </Label>
                      <div className="relative mt-2">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="cardExpiry" className="text-base">
                          Expiry Date
                        </Label>
                        <div className="relative mt-2">
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
                        <Label htmlFor="cardCvc" className="text-base">
                          CVC
                        </Label>
                        <div className="relative mt-2">
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
                  <div className="space-y-5 bg-muted/20 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">PayPal Payment</h3>
                    <div>
                      <Label htmlFor="email" className="text-base">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-2"
                        required
                      />
                    </div>
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <p>
                        You'll be redirected to PayPal's secure payment page to complete your donation of{" "}
                        {currencies.find((c) => c.code === currency)?.symbol}
                        {amount}.
                      </p>
                    </div>
                  </div>
                )}

                {/* Offline donation instructions */}
                {paymentMethod === "offline" && (
                  <div className="space-y-5 bg-muted/20 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Offline Donation</h3>
                    <div>
                      <Label htmlFor="offline-method" className="text-base">
                        Donation Method
                      </Label>
                      <Select defaultValue="bank" className="mt-2">
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

                    <div className="bg-background p-5 rounded-lg border border-border">
                      <h4 className="font-bold mb-4">Bank Account Details</h4>

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
                      <Label htmlFor="reference" className="text-base">
                        Payment Reference
                      </Label>
                      <Input id="reference" placeholder="Transaction ID or Reference Number" className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        If you've already made the payment, please provide the reference number
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="email-offline" className="text-base">
                        Email for Receipt
                      </Label>
                      <Input id="email-offline" type="email" placeholder="your@email.com" className="mt-2" required />
                    </div>
                  </div>
                )}

                {/* Secure payment notice */}
                <div className="mt-8 flex items-center text-sm text-muted-foreground">
                  <Lock className="h-5 w-5 mr-2" />
                  <p>All transactions are secure and encrypted</p>
                </div>
              </div>
            )}

            {/* Success message */}
            {isComplete && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Thank You for Your Gift!</h2>
                <p className="text-xl text-muted-foreground mb-3">
                  Your contribution of {currencies.find((c) => c.code === currency)?.symbol}
                  {amount} has been {paymentMethod === "offline" ? "recorded" : "received"}.
                </p>
                <p className="text-muted-foreground mb-8">
                  {paymentMethod === "offline"
                    ? "We'll confirm your donation once the payment is verified."
                    : "A receipt has been sent to your email."}
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/">
                    <Button size="lg">Return to Home</Button>
                  </Link>
                  <Button variant="outline" size="lg" onClick={() => window.print()}>
                    Print Receipt
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {!isComplete && (
            <div className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" size="lg" onClick={handleBackStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <div></div> // Empty div to maintain layout
              )}
              <Button
                size="lg"
                onClick={handleNextStep}
                disabled={
                  (step === 1 && (!givingType || (givingType === "ministry" && !ministry))) ||
                  (step === 2 && !amount) ||
                  isProcessing
                }
                className="min-w-[150px]"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    Next <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  "Complete Donation"
                )}
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

