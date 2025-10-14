"use client"

import { Badge } from "@/components/ui/badge"

const mockTrades = [
  { account: "GwkSwC", type: "Sell", amountSOL: "0.348", amountToken: "11.04k", time: "1s ago", txn: "2wGFzs" },
  { account: "FRg7L5", type: "Buy", amountSOL: "0.436", amountToken: "13.62k", time: "1s ago", txn: "5yko2N" },
  { account: "7JXbfn", type: "Buy", amountSOL: "0.500", amountToken: "15.65k", time: "1s ago", txn: "5TxVRU" },
  { account: "7hEUeA", type: "Buy", amountSOL: "0.200", amountToken: "6264.74", time: "1s ago", txn: "2baUxP" },
  { account: "3FvPwv", type: "Buy", amountSOL: "0.477", amountToken: "14.94k", time: "1s ago", txn: "5myHBX" },
  { account: "6v79B5", type: "Buy", amountSOL: "0.109", amountToken: "3445.72", time: "1s ago", txn: "38gFiC" },
  { account: "2aiC1q", type: "Buy", amountSOL: "0.176", amountToken: "5556.68", time: "2s ago", txn: "Guw7g" },
  { account: "949APR", type: "Buy", amountSOL: "3.494", amountToken: "110.60k", time: "2s ago", txn: "3bs6Fe" },
]

export function TradesTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="pb-2 text-left font-medium text-muted-foreground">Account</th>
            <th className="pb-2 text-left font-medium text-muted-foreground">Type</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Amount (SOL)</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Amount (LION)</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Time</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Txn</th>
          </tr>
        </thead>
        <tbody>
          {mockTrades.map((trade, i) => (
            <tr key={i} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent/50 to-primary/50" />
                  <span className="font-mono text-xs">{trade.account}</span>
                </div>
              </td>
              <td className="py-2">
                <Badge
                  variant={trade.type === "Buy" ? "default" : "destructive"}
                  className={
                    trade.type === "Buy"
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  }
                >
                  {trade.type}
                </Badge>
              </td>
              <td className="py-2 text-right font-mono">{trade.amountSOL}</td>
              <td className="py-2 text-right font-mono text-accent">{trade.amountToken}</td>
              <td className="py-2 text-right text-muted-foreground">{trade.time}</td>
              <td className="py-2 text-right">
                <span className="font-mono text-xs text-accent hover:underline cursor-pointer">{trade.txn}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
