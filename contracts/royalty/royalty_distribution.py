"""
Auriya Royalty Distribution Contract
Automated payment splits for music streams
"""

from pyteal import *

def royalty_contract():
    """
    Automated royalty distribution
    - Multi-party splits
    - Instant payments per stream
    - Transparent tracking
    """
    
    # Global state
    artist_address = Bytes("artist")
    producer_address = Bytes("producer")
    artist_share = Bytes("artist_share")
    producer_share = Bytes("producer_share")
    total_streams = Bytes("streams")
    
    # Initialize contract
    on_create = Seq([
        App.globalPut(artist_address, Txn.application_args[0]),
        App.globalPut(producer_address, Txn.application_args[1]),
        App.globalPut(artist_share, Btoi(Txn.application_args[2])),
        App.globalPut(producer_share, Btoi(Txn.application_args[3])),
        App.globalPut(total_streams, Int(0)),
        Return(Int(1))
    ])
    
    # Distribute royalty on stream
    on_stream = Seq([
        Assert(Gtxn[0].type_enum() == TxnType.Payment),
        Assert(Gtxn[0].receiver() == Global.current_application_address()),
        
        # Calculate splits
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(artist_address),
            TxnField.amount: Mul(Gtxn[0].amount(), App.globalGet(artist_share)) / Int(100)
        }),
        InnerTxnBuilder.Submit(),
        
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(producer_address),
            TxnField.amount: Mul(Gtxn[0].amount(), App.globalGet(producer_share)) / Int(100)
        }),
        InnerTxnBuilder.Submit(),
        
        App.globalPut(total_streams, App.globalGet(total_streams) + Int(1)),
        Return(Int(1))
    ])
    
    # Get stream count
    on_get_streams = Return(App.globalGet(total_streams))
    
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("stream"), on_stream],
        [Txn.application_args[0] == Bytes("get_streams"), on_get_streams]
    )
    
    return program

if __name__ == "__main__":
    print(compileTeal(royalty_contract(), Mode.Application, version=8))
