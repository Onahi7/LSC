"use client"

import { motion } from "framer-motion"

// Define the 12 tribes of Israel with corresponding months and colors
const tribes = [
  {
    name: "Reuben",
    month: "January",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
    textColor: "text-white",
    description: "Firstborn, unstable as water",
    symbol: "Water waves",
  },
  {
    name: "Simeon",
    month: "February",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    textColor: "text-white",
    description: "Scattered and dispersed",
    symbol: "City gates",
  },
  {
    name: "Levi",
    month: "March",
    color: "bg-amber-500",
    hoverColor: "hover:bg-amber-600",
    textColor: "text-white",
    description: "Priestly tribe",
    symbol: "Breastplate",
  },
  {
    name: "Judah",
    month: "April",
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    textColor: "text-black",
    description: "Royal tribe, lion's whelp",
    symbol: "Lion",
  },
  {
    name: "Dan",
    month: "May",
    color: "bg-lime-500",
    hoverColor: "hover:bg-lime-600",
    textColor: "text-black",
    description: "Judge of the people",
    symbol: "Scales",
  },
  {
    name: "Naphtali",
    month: "June",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    textColor: "text-white",
    description: "Hind let loose",
    symbol: "Deer",
  },
  {
    name: "Gad",
    month: "July",
    color: "bg-emerald-500",
    hoverColor: "hover:bg-emerald-600",
    textColor: "text-white",
    description: "Troop, overcomer",
    symbol: "Camp",
  },
  {
    name: "Asher",
    month: "August",
    color: "bg-teal-500",
    hoverColor: "hover:bg-teal-600",
    textColor: "text-white",
    description: "Royal dainties, prosperity",
    symbol: "Olive tree",
  },
  {
    name: "Issachar",
    month: "September",
    color: "bg-cyan-500",
    hoverColor: "hover:bg-cyan-600",
    textColor: "text-white",
    description: "Strong donkey, knowledge of times",
    symbol: "Sun and stars",
  },
  {
    name: "Zebulun",
    month: "October",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    textColor: "text-white",
    description: "Haven of ships, commerce",
    symbol: "Ship",
  },
  {
    name: "Joseph",
    month: "November",
    color: "bg-indigo-500",
    hoverColor: "hover:bg-indigo-600",
    textColor: "text-white",
    description: "Fruitful bough",
    symbol: "Sheaf of wheat",
  },
  {
    name: "Benjamin",
    month: "December",
    color: "bg-violet-500",
    hoverColor: "hover:bg-violet-600",
    textColor: "text-white",
    description: "Ravenous wolf",
    symbol: "Wolf",
  },
]

interface TribesOfIsraelProps {
  onSelectTribe: (tribe: string) => void
}

export default function TribesOfIsrael({ onSelectTribe }: TribesOfIsraelProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tribes.map((tribe, index) => (
          <motion.div
            key={tribe.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            className={`${tribe.color} ${tribe.hoverColor} ${tribe.textColor} rounded-lg p-4 shadow-md cursor-pointer transition-all duration-200 flex flex-col items-center text-center`}
            onClick={() => onSelectTribe(tribe.name)}
          >
            <div className="font-bold text-lg mb-1">{tribe.name}</div>
            <div className="text-sm opacity-90 mb-2">{tribe.month}</div>
            <div className="text-xs opacity-75">{tribe.description}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

