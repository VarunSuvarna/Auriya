import { PinataSDK } from "pinata-web3"

export class IPFSService {
  private static pinata: PinataSDK

  static initialize() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
      pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY!
    })
  }

  static async uploadFile(file: File): Promise<string> {
    try {
      const upload = await this.pinata.upload.file(file)
      return upload.IpfsHash
    } catch (error) {
      console.error('IPFS upload error:', error)
      throw new Error('Failed to upload to IPFS')
    }
  }

  static async uploadJSON(metadata: any): Promise<string> {
    try {
      const upload = await this.pinata.upload.json(metadata)
      return upload.IpfsHash
    } catch (error) {
      console.error('IPFS JSON upload error:', error)
      throw new Error('Failed to upload metadata to IPFS')
    }
  }

  static async createARC3Metadata(params: {
    name: string
    description: string
    artist: string
    genre: string
    duration: string
    imageHash: string
    audioHash: string
  }): Promise<string> {
    const metadata = {
      name: params.name,
      description: params.description,
      image: `ipfs://${params.imageHash}`,
      properties: {
        artist: params.artist,
        genre: params.genre,
        duration: params.duration,
        audio: `ipfs://${params.audioHash}`,
        standard: "ARC-3"
      }
    }

    return await this.uploadJSON(metadata)
  }

  static getGatewayUrl(hash: string): string {
    return `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${hash}`
  }
}

// Initialize on import
if (typeof window !== 'undefined') {
  IPFSService.initialize()
}