from algopy import ARC4Contract, arc4, itxn, Txn, Global, UInt64

class RoyaltySplitter(ARC4Contract):
    """
    Splits incoming payments between predefined parties
    Supports integration with ARC-3 NFTs and ARC-20 tokens
    """

    artist = arc4.Address()
    producer = arc4.Address()
    platform = arc4.Address()
    artist_share = arc4.UInt64()
    producer_share = arc4.UInt64()
    platform_share = arc4.UInt64()

    def __init__(self):
        self.artist_share = UInt64(70)
        self.producer_share = UInt64(20)
        self.platform_share = UInt64(10)

    @arc4.abimethod
    def configure(self, artist: arc4.Address, producer: arc4.Address, platform: arc4.Address):
        assert Txn.sender == Global.creator_address
        self.artist = artist
        self.producer = producer
        self.platform = platform

    @arc4.abimethod
    def distribute(self):
        """Distribute royalty in microalgos"""
        total = Txn.amount
        itxn.Payment(receiver=self.artist, amount=total * self.artist_share // 100).submit()
        itxn.Payment(receiver=self.producer, amount=total * self.producer_share // 100).submit()
        itxn.Payment(receiver=self.platform, amount=total * self.platform_share // 100).submit()
