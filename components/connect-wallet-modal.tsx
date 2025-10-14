"use client"

import { type Wallet, useWallet } from "@txnlab/use-wallet-react"
import { toast } from "react-toastify"

const ConnectWalletModal = ({
  wallets,
  isOpen,
  onClose,
}: {
  wallets: Wallet[]
  isOpen: boolean
  onClose: () => void
}) => {
  const { activeAccount } = useWallet()

  const handleWalletClick = async (wallet: Wallet) => {
    try {
      if (wallet.isConnected) {
        await wallet.setActive()
        toast.success("Wallet set as active")
      } else {
        await wallet.connect()
        toast.success("Wallet connected successfully")
      }
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Failed to connect wallet")
    }
  }

  const disconnectWallets = async () => {
    try {
      for (const wallet of wallets) {
        if (wallet.isConnected) {
          await wallet.disconnect()
        }
      }
      toast.success("Disconnected from all wallets")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Failed to disconnect wallets")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50" onClick={onClose}>
      <div
        className="bg-[#001324] border border-[#15b9b7]/20 rounded-lg shadow-xl w-full max-w-md p-6 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center w-full mb-4">
          <h3 className="text-lg font-medium text-white">Connect Wallet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2 w-full">
          {wallets.map((wallet) => (
            <div
              onClick={() => handleWalletClick(wallet)}
              key={wallet.id}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors w-full
                ${
                  wallet.isConnected
                    ? "bg-[#15b9b7]/20 border border-[#15b9b7]/50 hover:bg-[#15b9b7]/30"
                    : "bg-[#002a4a] border border-[#15b9b7]/10 hover:bg-[#003a5a]"
                }`}
            >
              <span className="font-medium text-white">
                {wallet.metadata.name}{" "}
                {wallet.activeAccount &&
                  `[${wallet.activeAccount.address.slice(0, 3)}...${wallet.activeAccount.address.slice(-3)}]`}
                {wallet.isActive && ` (active)`}
              </span>
              <img
                src={wallet.metadata.icon || "/placeholder.svg?height=24&width=24"}
                alt={`${wallet.metadata.name} Icon`}
                className="h-6 w-6"
              />
            </div>
          ))}

          {activeAccount && (
            <div
              onClick={disconnectWallets}
              className="flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 mt-4 w-full"
            >
              <span className="font-medium text-red-400">
                Disconnect{" "}
                {activeAccount && `[${activeAccount.address.slice(0, 3)}...${activeAccount.address.slice(-3)}]`}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#15b9b7]/20 text-sm text-center text-gray-400 w-full">
          <span>New to Algorand? </span>
          <a
            href="https://algorand.com/wallets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#15b9b7] hover:text-[#15b9b7]/80"
          >
            Learn more about wallets
          </a>
        </div>
      </div>
    </div>
  )
}

export default ConnectWalletModal
