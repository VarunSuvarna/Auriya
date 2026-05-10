from algopy import ARC4Contract, arc4, itxn, Txn, Global, UInt64, BoxMap


class SplitConfig(arc4.Struct):
    wallets: arc4.DynamicArray[arc4.Address]
    bps_splits: arc4.DynamicArray[arc4.UInt64]


class RoyaltyRouter(ARC4Contract):
    """
    Algorand royalty splitter.
    Supports dynamic split routing based on Recipe/Track configuraton.
    """

    def __init__(self) -> None:
        self.owner = Global.creator_address
        self.configs = BoxMap(UInt64, SplitConfig)
        self.platform_wallet = Global.creator_address

    @arc4.abimethod
    def configure_splits(
        self, 
        recipe_id: arc4.UInt64, 
        wallets: arc4.DynamicArray[arc4.Address], 
        bps_splits: arc4.DynamicArray[arc4.UInt64]
    ) -> None:
        assert Txn.sender == self.owner, "Only owner can configure splits"
        assert wallets.length > 0, "At least one wallet required"
        assert wallets.length == bps_splits.length, "Wallets and splits length mismatch"
        
        total_bps = UInt64(0)
        for i in range(bps_splits.length):
            total_bps += bps_splits[i].native
        assert total_bps <= 10_000, "Total splits cannot exceed 10000 BPS"
        
        new_config = SplitConfig(wallets, bps_splits)
        self.configs[recipe_id.native] = new_config

    @arc4.abimethod
    def pay_and_split(self, recipe_id: arc4.UInt64) -> None:
        """Payable call to distribute royalties for a recipe"""
        rid = recipe_id.native
        assert rid in self.configs, "No split config for this recipe"
        
        config = self.configs[rid].copy()
        total_amount = Txn.amount
        
        # Distribute based on BPS
        for i in range(config.wallets.length):
            wallet = config.wallets[i]
            bps = config.bps_splits[i].native
            amount = total_amount * bps // 10_000
            if amount > 0:
                itxn.Payment(
                    receiver=wallet,
                    amount=amount,
                    fee=0, # Use inner txn fee
                ).submit()

    @arc4.abimethod
    def update_platform_wallet(self, wallet: arc4.Address) -> None:
        assert Txn.sender == self.owner
        self.platform_wallet = wallet.native
