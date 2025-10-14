"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"

export default function VerificationHistory() {
  // Mock data - in a real app, this would come from your API
  const verificationHistory = [
    {
      serviceName: "DeFi Solutions",
      date: "2024-09-25",
      status: "Verified",
      verifiedBy: "3VSx...Xf4y",
    },
    {
      serviceName: "CryptoPay",
      date: "2024-08-19",
      status: "Pending",
      verifiedBy: "2GTx...Hf7z",
    },
    {
      serviceName: "BlockFinance",
      date: "2024-07-10",
      status: "Verified",
      verifiedBy: "5HTv...Rf8w",
    },
    {
      serviceName: "MetaBank",
      date: "2024-06-18",
      status: "Rejected",
      verifiedBy: "9AVz...Tp3m",
    },
  ]

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>3rd Party Verification History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Verification Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verificationHistory.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b last:border-0"
                >
                  <TableCell className="font-medium">{item.serviceName}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.verifiedBy}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
