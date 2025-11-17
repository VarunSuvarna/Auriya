from algopy import ARC4Contract, arc4, itxn, Global, Txn, UInt64, String

class FungibleToken(ARC4Contract):
    """
    ARC-20 Token Implementation
    - Supports DEX and wallet compatibility
    """

    def __init__(self):
        self.name = String("RoyaltyToken")
        self.symbol = String("RLTY")
        self.decimals = UInt64(6)
        self.total_supply = UInt64(1_000_000_000)
        self.creator = Global.creator_address
        self.asset_id = UInt64(0)

    @arc4.abimethod
    def deploy_token(self):
        assert self.asset_id == 0
        self.asset_id = itxn.AssetConfig(
            total=self.total_supply,
            decimals=self.decimals,
            unit_name=self.symbol,
            asset_name=self.name,
            manager=self.creator
        ).submit()

    @arc4.abimethod
    def mint(self, amount: arc4.UInt64):
        assert Txn.sender == self.creator
        itxn.AssetTransfer(
            xfer_asset=self.asset_id,
            asset_receiver=Txn.sender,
            asset_amount=amount
        ).submit()
