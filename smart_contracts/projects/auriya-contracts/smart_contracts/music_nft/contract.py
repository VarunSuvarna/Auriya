from algopy import ARC4Contract, arc4, itxn, Global, Txn, UInt64, String

class MusicNFT(ARC4Contract):
    """
    ARC-3 NFT Smart Contract
    - Complies with ARC-3 metadata spec
    - Supports minting, ownership transfer, and IPFS metadata
    """

    name = arc4.String()
    symbol = arc4.String()
    base_metadata_url = arc4.String()
    total_supply = arc4.UInt64()

    def __init__(self):
        self.owner = Global.creator_address
        self.name = String("MusicNFT")
        self.symbol = String("MUSC")
        self.total_supply = UInt64(0)

    @arc4.abimethod
    def mint(self, metadata_url: arc4.String, receiver: arc4.Address) -> arc4.UInt64:
        """Mint a new ARC-3 NFT"""
        assert Txn.sender == self.owner
        asset_id = itxn.AssetConfig(
            total=1,
            decimals=0,
            default_frozen=False,
            unit_name="MUSC",
            asset_name=self.name,
            url=metadata_url,
            manager=self.owner,
            reserve=self.owner,
            freeze=self.owner,
            clawback=self.owner
        ).submit()
        self.total_supply += UInt64(1)
        return arc4.UInt64(asset_id)

    @arc4.abimethod
    def transfer_ownership(self, new_owner: arc4.Address):
        assert Txn.sender == self.owner
        self.owner = new_owner
