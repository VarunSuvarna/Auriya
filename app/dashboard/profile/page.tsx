"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@txnlab/use-wallet-react"

export default function ProfilePage() {
  const { activeAccount } = useWallet()

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your profile information</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-muted-foreground">Connected Wallet:</span>
                <span className="font-mono text-sm break-all">{activeAccount?.address || "Not connected"}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-muted-foreground">Wallet Type:</span>
                <span>{activeAccount?.providerId || "N/A"}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
                <span className="text-muted-foreground">Network:</span>
                <span>{activeAccount?.network || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
