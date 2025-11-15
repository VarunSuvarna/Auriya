import algosdk from 'algosdk'
import { AlgorandService } from './algorand'

export class BondingCurveService {
  static calculateTokensFromAlgo(
    algoAmount: number,
    virtualAlgoReserve: number,
    virtualTokenReserve: number
  ): number {
    // Formula: tokens = virtualTokenReserve - (virtualAlgoReserve * virtualTokenReserve) / (virtualAlgoReserve + algoAmount)
    const newVirtualAlgo = virtualAlgoReserve + algoAmount
    const newVirtualToken = (virtualAlgoReserve * virtualTokenReserve) / newVirtualAlgo
    return virtualTokenReserve - newVirtualToken
  }

  static calculateAlgoFromTokens(
    tokenAmount: number,
    virtualAlgoReserve: number,
    virtualTokenReserve: number
  ): number {
    // Formula: algo = virtualAlgoReserve / virtualTokenReserve - virtualAlgoReserve / (virtualTokenReserve + tokenAmount)
    const currentPrice = virtualAlgoReserve / virtualTokenReserve
    const newPrice = virtualAlgoReserve / (virtualTokenReserve + tokenAmount)
    return currentPrice - newPrice
  }

  static getCurrentPrice(
    virtualAlgoReserve: number,
    virtualTokenReserve: number
  ): number {
    return virtualAlgoReserve / virtualTokenReserve
  }

  static async createBuyTransaction(params: {
    buyer: string
    contractId: number
    algoAmount: number
  }) {
    try {
      const suggestedParams = await AlgorandService['algodClient'].getTransactionParams().do()
      
      // Payment transaction to contract
      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: params.buyer,
        to: algosdk.getApplicationAddress(params.contractId),
        amount: params.algoAmount * 1000000, // Convert to microALGOs
        suggestedParams,
      })

      // Application call transaction
      const appCallTxn = algosdk.makeApplicationCallTxnWithSuggestedParamsFromObject({
        from: params.buyer,
        appIndex: params.contractId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [new Uint8Array(Buffer.from("buy"))],
        suggestedParams,
      })

      // Group transactions
      const txnGroup = [paymentTxn, appCallTxn]
      algosdk.assignGroupID(txnGroup)

      return txnGroup
    } catch (error) {
      console.error('Error creating buy transaction:', error)
      throw error
    }
  }

  static async createSellTransaction(params: {
    seller: string
    contractId: number
    tokenId: number
    tokenAmount: number
  }) {
    try {
      const suggestedParams = await AlgorandService['algodClient'].getTransactionParams().do()
      
      // Asset transfer transaction to contract
      const assetTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: params.seller,
        to: algosdk.getApplicationAddress(params.contractId),
        assetIndex: params.tokenId,
        amount: params.tokenAmount,
        suggestedParams,
      })

      // Application call transaction
      const appCallTxn = algosdk.makeApplicationCallTxnWithSuggestedParamsFromObject({
        from: params.seller,
        appIndex: params.contractId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [new Uint8Array(Buffer.from("sell"))],
        suggestedParams,
      })

      // Group transactions
      const txnGroup = [assetTxn, appCallTxn]
      algosdk.assignGroupID(txnGroup)

      return txnGroup
    } catch (error) {
      console.error('Error creating sell transaction:', error)
      throw error
    }
  }

  static calculateMarketCap(
    currentPrice: number,
    totalSupply: number,
    circulatingSupply: number
  ): number {
    return currentPrice * circulatingSupply
  }

  static isGraduated(realAlgoRaised: number): boolean {
    return realAlgoRaised >= 10000 // 10,000 ALGO graduation threshold
  }

  static calculateProgress(realAlgoRaised: number): number {
    const threshold = 10000
    return Math.min((realAlgoRaised / threshold) * 100, 100)
  }
}