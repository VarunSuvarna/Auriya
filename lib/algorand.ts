import algosdk from 'algosdk'

export class AlgorandService {
  private static algodClient: algosdk.Algodv2
  private static indexerClient: algosdk.Indexer

  static initialize() {
    // TestNet configuration
    const algodToken = ''
    const algodServer = 'https://testnet-api.algonode.cloud'
    const algodPort = 443

    const indexerToken = ''
    const indexerServer = 'https://testnet-idx.algonode.cloud'
    const indexerPort = 443

    this.algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort)
    this.indexerClient = new algosdk.Indexer(indexerToken, indexerServer, indexerPort)
  }

  static async createNFT(params: {
    creator: string
    assetName: string
    unitName: string
    assetURL: string
    metadataHash?: Uint8Array
    total?: number
  }) {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do()
      
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: params.creator,
        total: params.total || 1,
        decimals: 0,
        assetName: params.assetName,
        unitName: params.unitName,
        assetURL: params.assetURL,
        assetMetadataHash: params.metadataHash,
        defaultFrozen: false,
        freeze: undefined,
        manager: params.creator,
        clawback: undefined,
        reserve: undefined,
        suggestedParams,
      })

      return txn
    } catch (error) {
      console.error('Error creating NFT transaction:', error)
      throw error
    }
  }

  static async createFungibleToken(params: {
    creator: string
    assetName: string
    unitName: string
    total: number
    decimals: number
    assetURL?: string
  }) {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do()
      
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: params.creator,
        total: params.total,
        decimals: params.decimals,
        assetName: params.assetName,
        unitName: params.unitName,
        assetURL: params.assetURL,
        defaultFrozen: false,
        freeze: undefined,
        manager: params.creator,
        clawback: undefined,
        reserve: undefined,
        suggestedParams,
      })

      return txn
    } catch (error) {
      console.error('Error creating token transaction:', error)
      throw error
    }
  }

  static async submitTransaction(signedTxn: Uint8Array) {
    try {
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do()
      await algosdk.waitForConfirmation(this.algodClient, txId, 4)
      return txId
    } catch (error) {
      console.error('Error submitting transaction:', error)
      throw error
    }
  }

  static async getAssetInfo(assetId: number) {
    try {
      return await this.algodClient.getAssetByID(assetId).do()
    } catch (error) {
      console.error('Error getting asset info:', error)
      throw error
    }
  }
}

// Initialize on import
AlgorandService.initialize()