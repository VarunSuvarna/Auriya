"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockHolders = [
  { address: "Liquidity pool", percentage: 2.95, amount: "2.95K", icon: "💧" },
  { address: "EzUp...6eSf", percentage: 2.22, amount: "13.62k", icon: "🌊" },
  { address: "7wtH...Qmxi", percentage: 1.89, amount: "11.60k", icon: "🔥" },
  { address: "7hEUeA", percentage: 1.69, amount: "10.37k", icon: "⚡" },
  { address: "6v79B5", percentage: 1.59, amount: "9.76k", icon: "🎯" },
  { address: "949APR", percentage: 1.55, amount: "9.51k", icon: "🚀" },
  { address: "coIdaf", percentage: 1.5, amount: "9.21k", icon: "💎" },
  { address: "HuTshm", percentage: 1.48, amount: "9.08k", icon: "🌟" },
]

export function TopHolders() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Top holders</h3>
          <Button variant="ghost" size="sm" className="h-6 text-xs text-accent">
            Generate bubble map
          </Button>
        </div>

        <div className="space-y-2">
          {mockHolders.map((holder, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-secondary/30 p-2 text-sm hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-lg">{holder.icon}</span>
                <span className="font-mono text-xs truncate">{holder.address}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{holder.amount}</span>
                <span className="text-xs font-semibold text-accent w-12 text-right">
                  {holder.percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
