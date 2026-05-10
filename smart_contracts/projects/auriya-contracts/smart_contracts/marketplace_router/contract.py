from algopy import ARC4Contract, arc4, Global, Txn, UInt64, BoxMap, itxn


class ListingRecord(arc4.Struct):
    seller: arc4.Address
    asset_id: arc4.UInt64
    amount: arc4.UInt64
    price_microalgo: arc4.UInt64
    is_active: arc4.Bool


class MarketplaceRouter(ARC4Contract):
    """
    Algorand marketplace router.
    Supports multiple listings using Box storage.
    """

    def __init__(self) -> None:
        self.owner = Global.creator_address
        self.listing_count = UInt64(0)
        self.listings = BoxMap(UInt64, ListingRecord)

    @arc4.abimethod
    def create_listing(
        self, asset_id: arc4.UInt64, amount: arc4.UInt64, price_microalgo: arc4.UInt64
    ) -> arc4.UInt64:
        assert amount.native > 0, "Amount must be > 0"
        assert price_microalgo.native > 0, "Price must be > 0"
        
        self.listing_count += UInt64(1)
        listing_id = self.listing_count
        
        new_listing = ListingRecord(
            Txn.sender,
            asset_id,
            amount,
            price_microalgo,
            arc4.Bool(True)
        )
        
        self.listings[listing_id] = new_listing
        return arc4.UInt64(listing_id)

    @arc4.abimethod
    def get_listing(self, listing_id: arc4.UInt64) -> ListingRecord:
        lid = listing_id.native
        assert lid <= self.listing_count, "Listing ID does not exist"
        return self.listings[lid].copy()

    @arc4.abimethod
    def cancel_listing(self, listing_id: arc4.UInt64) -> None:
        lid = listing_id.native
        assert lid <= self.listing_count, "Listing ID does not exist"
        
        listing = self.listings[lid].copy()
        assert Txn.sender == listing.seller, "Only seller can cancel listing"
        assert listing.is_active.native, "Listing is already inactive"
        
        new_listing = ListingRecord(
            listing.seller,
            listing.asset_id,
            listing.amount,
            listing.price_microalgo,
            arc4.Bool(False)
        )
        self.listings[lid] = new_listing

    @arc4.abimethod
    def buy_listing(self, listing_id: arc4.UInt64, payment: itxn.Payment) -> None:
        """Buy a listing. Expects a Payment transaction in the same group."""
        lid = listing_id.native
        assert lid <= self.listing_count, "Listing ID does not exist"
        
        listing = self.listings[lid].copy()
        assert listing.is_active.native, "Listing is not active"
        assert payment.receiver == Global.current_application_address, "Payment must be to the app"
        assert payment.amount == listing.price_microalgo.native, "Incorrect payment amount"
        assert payment.sender == Txn.sender, "Payment sender must match buyer"

        # Transfer asset to buyer
        itxn.AssetTransfer(
            xfer_asset=listing.asset_id.native,
            asset_receiver=Txn.sender,
            asset_amount=listing.amount.native,
            fee=0
        ).submit()

        # Pay seller
        itxn.Payment(
            receiver=listing.seller,
            amount=listing.price_microalgo.native,
            fee=0
        ).submit()

        # Mark listing as inactive
        new_listing = ListingRecord(
            listing.seller,
            listing.asset_id,
            listing.amount,
            listing.price_microalgo,
            arc4.Bool(False)
        )
        self.listings[lid] = new_listing

