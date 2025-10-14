"use client"

import { motion } from "framer-motion"
import KYCStatus from "@/components/kyc-status"

export default function StatusPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">KYC Status</h1>
          <p className="text-muted-foreground mt-1">View your current KYC verification status</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <KYCStatus />
      </motion.div>
    </div>
  )
}
