from algopy import ARC4Contract, arc4, Global, Txn, UInt64, String, BoxMap


class StemRecord(arc4.Struct):
    metadata_uri: arc4.String
    contributor: arc4.Address
    royalty_bps: arc4.UInt64
    is_active: arc4.Bool


class StemRegistry(ARC4Contract):
    """
    Algorand-first stem registry.
    Supports multiple stems using Box storage.
    """

    def __init__(self) -> None:
        self.owner = Global.creator_address
        self.stem_count = UInt64(0)
        self.stems = BoxMap(UInt64, StemRecord)

    @arc4.abimethod
    def register_stem(
        self, metadata_uri: arc4.String, contributor: arc4.Address, royalty_bps: arc4.UInt64
    ) -> arc4.UInt64:
        assert Txn.sender == self.owner, "Only owner can register stems"
        assert royalty_bps.native <= 10_000, "Royalty BPS must be <= 10000"
        
        self.stem_count += UInt64(1)
        stem_id = self.stem_count
        
        new_record = StemRecord(
            metadata_uri,
            contributor,
            royalty_bps,
            arc4.Bool(True)
        )
        
        self.stems[stem_id] = new_record
        return arc4.UInt64(stem_id)

    @arc4.abimethod
    def get_stem(self, stem_id: arc4.UInt64) -> StemRecord:
        sid = stem_id.native
        assert sid <= self.stem_count, "Stem ID does not exist"
        return self.stems[sid].copy()

    @arc4.abimethod
    def update_stem_metadata(self, stem_id: arc4.UInt64, metadata_uri: arc4.String) -> None:
        assert Txn.sender == self.owner, "Only owner can update stems"
        sid = stem_id.native
        assert sid <= self.stem_count, "Stem ID does not exist"
        
        record = self.stems[sid].copy()
        new_record = StemRecord(
            metadata_uri,
            record.contributor,
            record.royalty_bps,
            record.is_active
        )
        self.stems[sid] = new_record

    @arc4.abimethod
    def set_stem_active(self, stem_id: arc4.UInt64, is_active: arc4.Bool) -> None:
        assert Txn.sender == self.owner, "Only owner can update stems"
        sid = stem_id.native
        assert sid <= self.stem_count, "Stem ID does not exist"
        
        record = self.stems[sid].copy()
        new_record = StemRecord(
            record.metadata_uri,
            record.contributor,
            record.royalty_bps,
            is_active
        )
        self.stems[sid] = new_record

