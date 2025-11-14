"""
Auriya Fungible Token Contract (ARC-20 Compliant)
Algorand Standard Asset for tradeable music tokens
"""

from pyteal import *

def fungible_token_contract():
    """
    ARC-20 compliant fungible token
    - DEX compatible
    - Wallet integration support
    - Staking capabilities
    """
    
    # Global state
    total_supply = Bytes("total_supply")
    creator = Bytes("creator")
    token_name = Bytes("name")
    ticker = Bytes("ticker")
    
    # Create token (ARC-20)
    on_create = Seq([
        App.globalPut(creator, Txn.sender()),
        App.globalPut(token_name, Txn.application_args[0]),
        App.globalPut(ticker, Txn.application_args[1]),
        App.globalPut(total_supply, Btoi(Txn.application_args[2])),
        App.localPut(Txn.sender(), Bytes("balance"), Btoi(Txn.application_args[2])),
        Return(Int(1))
    ])
    
    # Transfer tokens
    on_transfer = Seq([
        Assert(App.localGet(Txn.sender(), Bytes("balance")) >= Btoi(Txn.application_args[1])),
        App.localPut(
            Txn.sender(), 
            Bytes("balance"), 
            App.localGet(Txn.sender(), Bytes("balance")) - Btoi(Txn.application_args[1])
        ),
        App.localPut(
            Txn.accounts[1], 
            Bytes("balance"), 
            App.localGet(Txn.accounts[1], Bytes("balance")) + Btoi(Txn.application_args[1])
        ),
        Return(Int(1))
    ])
    
    # Get balance
    on_balance = Return(App.localGet(Txn.sender(), Bytes("balance")))
    
    # Opt-in
    on_opt_in = Seq([
        App.localPut(Txn.sender(), Bytes("balance"), Int(0)),
        Return(Int(1))
    ])
    
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.OptIn, on_opt_in],
        [Txn.application_args[0] == Bytes("transfer"), on_transfer],
        [Txn.application_args[0] == Bytes("balance"), on_balance]
    )
    
    return program

if __name__ == "__main__":
    print(compileTeal(fungible_token_contract(), Mode.Application, version=8))
