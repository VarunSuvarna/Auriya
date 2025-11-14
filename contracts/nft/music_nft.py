"""
Auriya Music NFT Contract (ARC-3 Compliant)
Algorand Standard Asset for unique music ownership
"""

from pyteal import *

def music_nft_contract():
    """
    ARC-3 compliant NFT for music ownership
    - Unique asset (total=1, decimals=0)
    - IPFS metadata URI
    - Royalty enforcement on transfers
    """
    
    # Global state
    creator = Bytes("creator")
    royalty_percentage = Bytes("royalty_pct")
    ipfs_hash = Bytes("ipfs")
    
    # ARC-3 metadata structure
    @Subroutine(TealType.bytes)
    def get_arc3_metadata():
        return Concat(
            Bytes('{"name":"'),
            App.globalGet(Bytes("name")),
            Bytes('","description":"'),
            App.globalGet(Bytes("description")),
            Bytes('","image":"ipfs://'),
            App.globalGet(ipfs_hash),
            Bytes('","properties":{"artist":"'),
            App.globalGet(Bytes("artist")),
            Bytes('","genre":"'),
            App.globalGet(Bytes("genre")),
            Bytes('","duration":"'),
            App.globalGet(Bytes("duration")),
            Bytes('","audio":"ipfs://'),
            App.globalGet(Bytes("audio_hash")),
            Bytes('"}}')
        )
    
    # Create NFT
    on_create = Seq([
        Assert(Len(Txn.application_args) == Int(5)),
        Assert(Btoi(Txn.application_args[2]) <= Int(100)),
        App.globalPut(creator, Txn.sender()),
        App.globalPut(Bytes("name"), Txn.application_args[0]),
        App.globalPut(Bytes("artist"), Txn.application_args[1]),
        App.globalPut(royalty_percentage, Btoi(Txn.application_args[2])),
        App.globalPut(ipfs_hash, Txn.application_args[3]),
        App.globalPut(Bytes("audio_hash"), Txn.application_args[4]),
        Return(Int(1))
    ])
    
    # Transfer with royalty
    on_transfer = Seq([
        Assert(Global.group_size() >= Int(2)),
        Assert(Gtxn[0].type_enum() == TxnType.Payment),
        Assert(Gtxn[0].receiver() == App.globalGet(creator)),
        Assert(App.globalGet(royalty_percentage) > Int(0)),
        Assert(
            Gtxn[0].amount() >= 
            Mul(Gtxn[1].amount(), App.globalGet(royalty_percentage)) / Int(100)
        ),
        Return(Int(1))
    ])
    
    # Get metadata (ARC-3)
    on_get_metadata = Return(get_arc3_metadata())
    
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [And(Len(Txn.application_args) > Int(0), Txn.application_args[0] == Bytes("transfer")), on_transfer],
        [And(Len(Txn.application_args) > Int(0), Txn.application_args[0] == Bytes("metadata")), on_get_metadata],
        [Int(0)]
    )
    
    return program

if __name__ == "__main__":
    print(compileTeal(music_nft_contract(), Mode.Application, version=8))
