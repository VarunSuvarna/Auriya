"use client"

import { motion } from "framer-motion"
import VerificationHistory from "@/components/verification-history"

export default function HistoryPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Verification History</h1>
          <p className="text-muted-foreground mt-1">View your third-party verification history</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <VerificationHistory />
      </motion.div>
    </div>
  )
}
