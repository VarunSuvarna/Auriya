"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@txnlab/use-wallet-react"
import Link from "next/link"

export default function KYCStatus() {
  const { activeAccount } = useWallet()

  // Mock data - in a real app, this would come from your API
  const kycData = {
    walletAddress: activeAccount?.address || "",
    submission: "Submitted",
    level: "Level 2",
    status: "Pending",
    submittedOn: "2024-10-06",
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6">
          <h3 className="text-xl font-semibold mb-4">KYC Status</h3>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-muted-foreground">Connected Wallet:</span>
              <span className="font-mono text-sm break-all">{kycData.walletAddress}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-muted-foreground">KYC Submission:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{kycData.submission}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-muted-foreground">KYC Level:</span>
              <span className="font-medium">{kycData.level}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800">
              <span className="text-muted-foreground">Verification Status:</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                {kycData.status}
              </span>
            </div>

            <div className="py-2">
              <p className="text-muted-foreground">Your KYC is under review. We will notify you once it is verified.</p>
              <p className="text-sm text-muted-foreground mt-2">Submitted on: {kycData.submittedOn}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard/view-details">View Details</Link>
              </Button>
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Link href="/dashboard/fill-kyc">Update KYC</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
