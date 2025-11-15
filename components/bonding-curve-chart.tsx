"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BondingCurveService } from "@/lib/bonding-curve"

interface BondingCurveChartProps {
  virtualAlgoReserve: number
  virtualTokenReserve: number
  realAlgoRaised: number
  className?: string
}

export function BondingCurveChart({ 
  virtualAlgoReserve, 
  virtualTokenReserve, 
  realAlgoRaised,
  className 
}: BondingCurveChartProps) {
  const [chartData, setChartData] = useState<Array<{ algo: number; price: number }>>([])

  useEffect(() => {
    // Generate price curve data
    const data = []
    const maxAlgo = 15000 // Show curve up to 15k ALGO
    const steps = 100

    for (let i = 0; i <= steps; i++) {
      const algoAmount = (i / steps) * maxAlgo
      const remainingTokens = virtualTokenReserve - BondingCurveService.calculateTokensFromAlgo(
        algoAmount, 
        virtualAlgoReserve, 
        virtualTokenReserve
      )
      const price = BondingCurveService.getCurrentPrice(
        virtualAlgoReserve + algoAmount,
        remainingTokens
      )
      
      data.push({
        algo: algoAmount,
        price: price * 1000000 // Convert to microALGOs for better display
      })
    }

    setChartData(data)
  }, [virtualAlgoReserve, virtualTokenReserve])

  const currentPrice = BondingCurveService.getCurrentPrice(virtualAlgoReserve, virtualTokenReserve)
  const progress = BondingCurveService.calculateProgress(realAlgoRaised)
  const isGraduated = BondingCurveService.isGraduated(realAlgoRaised)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bonding Curve</span>
          <div className="text-sm font-normal">
            <span className="text-muted-foreground">Current Price: </span>
            <span className="text-[#15b9b7] font-mono">
              {(currentPrice * 1000000).toFixed(6)} μALGO
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to DEX</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#15b9b7] to-[#0ea39f] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{realAlgoRaised.toLocaleString()} ALGO raised</span>
              <span>10,000 ALGO target</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="algo" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `${value.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                  formatter={(value: number) => [
                    `${value.toFixed(6)} μALGO`,
                    'Price'
                  ]}
                  labelFormatter={(label: number) => `${label.toLocaleString()} ALGO Raised`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#15b9b7"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#15b9b7' }}
                />
                {/* Current position indicator */}
                <Line
                  type="monotone"
                  dataKey={() => null}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center p-3 rounded-lg bg-secondary/20">
            {isGraduated ? (
              <div className="text-center">
                <div className="text-green-500 font-semibold">🎉 Graduated to DEX!</div>
                <div className="text-sm text-muted-foreground">
                  Token is now trading on Tinyman
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-[#15b9b7] font-semibold">📈 Bonding Curve Active</div>
                <div className="text-sm text-muted-foreground">
                  {(10000 - realAlgoRaised).toLocaleString()} ALGO needed for DEX graduation
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}