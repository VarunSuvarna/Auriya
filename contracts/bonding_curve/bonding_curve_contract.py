"""
Bonding Curve Contract for Music Token Trading
Implements automated market maker with price discovery
"""

from pyteal import *

def bonding_curve_contract():
    """
    Bonding curve implementation for music token trading
    - Virtual reserves for price calculation
    - Automatic DEX graduation at threshold
    - Creator royalties on trades
    """
    
    # Global state keys
    creator_key = Bytes("creator")
    token_id_key = Bytes("token_id")
    virtual_algo_key = Bytes("virtual_algo")
    virtual_token_key = Bytes("virtual_token")
    real_algo_key = Bytes("real_algo")
    graduated_key = Bytes("graduated")
    royalty_key = Bytes("royalty_pct")
    
    # Constants
    graduation_threshold = Int(10000000000)  # 10,000 ALGO in microALGOs
    
    # Initialize bonding curve
    on_create = Seq([
        App.globalPut(creator_key, Txn.sender()),
        App.globalPut(token_id_key, Btoi(Txn.application_args[0])),
        App.globalPut(virtual_algo_key, Int(30000000)),  # 30 ALGO
        App.globalPut(virtual_token_key, Btoi(Txn.application_args[1])),  # Total supply
        App.globalPut(real_algo_key, Int(0)),
        App.globalPut(graduated_key, Int(0)),
        App.globalPut(royalty_key, Btoi(Txn.application_args[2])),  # Royalty %
        Return(Int(1))
    ])
    
    # Calculate price for token amount
    @Subroutine(TealType.uint64)
    def calculate_buy_price(token_amount):
        return Seq([
            # Price = virtual_algo / (virtual_token - token_amount) - virtual_algo / virtual_token
            App.localPut(Int(0), Bytes("temp_price"), 
                Minus(
                    Div(App.globalGet(virtual_algo_key), 
                        Minus(App.globalGet(virtual_token_key), token_amount)),
                    Div(App.globalGet(virtual_algo_key), App.globalGet(virtual_token_key))
                )
            ),
            Return(App.localGet(Int(0), Bytes("temp_price")))
        ])
    
    # Buy tokens
    on_buy = Seq([
        Assert(App.globalGet(graduated_key) == Int(0)),
        Assert(Txn.type_enum() == TxnType.Payment),
        
        # Calculate tokens to mint based on ALGO sent
        App.localPut(Int(0), Bytes("algo_amount"), Txn.amount()),
        App.localPut(Int(0), Bytes("token_amount"), 
            Minus(App.globalGet(virtual_token_key),
                Div(
                    Mul(App.globalGet(virtual_algo_key), App.globalGet(virtual_token_key)),
                    Plus(App.globalGet(virtual_algo_key), App.localGet(Int(0), Bytes("algo_amount")))
                )
            )
        ),
        
        # Update reserves
        App.globalPut(virtual_algo_key, 
            Plus(App.globalGet(virtual_algo_key), App.localGet(Int(0), Bytes("algo_amount")))),
        App.globalPut(virtual_token_key,
            Minus(App.globalGet(virtual_token_key), App.localGet(Int(0), Bytes("token_amount")))),
        App.globalPut(real_algo_key,
            Plus(App.globalGet(real_algo_key), App.localGet(Int(0), Bytes("algo_amount")))),
        
        # Send tokens to buyer
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: App.globalGet(token_id_key),
            TxnField.asset_receiver: Txn.sender(),
            TxnField.asset_amount: App.localGet(Int(0), Bytes("token_amount")),
        }),
        InnerTxnBuilder.Submit(),
        
        # Check graduation
        If(App.globalGet(real_algo_key) >= graduation_threshold,
            App.globalPut(graduated_key, Int(1))
        ),
        
        Return(Int(1))
    ])
    
    # Sell tokens
    on_sell = Seq([
        Assert(App.globalGet(graduated_key) == Int(0)),
        Assert(Txn.type_enum() == TxnType.AssetTransfer),
        Assert(Txn.xfer_asset() == App.globalGet(token_id_key)),
        
        # Calculate ALGO to return
        App.localPut(Int(0), Bytes("token_amount"), Txn.asset_amount()),
        App.localPut(Int(0), Bytes("algo_return"),
            Minus(
                Div(App.globalGet(virtual_algo_key), App.globalGet(virtual_token_key)),
                Div(App.globalGet(virtual_algo_key), 
                    Plus(App.globalGet(virtual_token_key), App.localGet(Int(0), Bytes("token_amount"))))
            )
        ),
        
        # Creator royalty
        App.localPut(Int(0), Bytes("royalty_amount"),
            Div(Mul(App.localGet(Int(0), Bytes("algo_return")), App.globalGet(royalty_key)), Int(100))
        ),
        App.localPut(Int(0), Bytes("seller_amount"),
            Minus(App.localGet(Int(0), Bytes("algo_return")), App.localGet(Int(0), Bytes("royalty_amount")))
        ),
        
        # Update reserves
        App.globalPut(virtual_token_key,
            Plus(App.globalGet(virtual_token_key), App.localGet(Int(0), Bytes("token_amount")))),
        App.globalPut(virtual_algo_key,
            Minus(App.globalGet(virtual_algo_key), App.localGet(Int(0), Bytes("algo_return")))),
        App.globalPut(real_algo_key,
            Minus(App.globalGet(real_algo_key), App.localGet(Int(0), Bytes("algo_return")))),
        
        # Send ALGO to seller
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: Txn.sender(),
            TxnField.amount: App.localGet(Int(0), Bytes("seller_amount")),
        }),
        InnerTxnBuilder.Submit(),
        
        # Send royalty to creator
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: App.globalGet(creator_key),
            TxnField.amount: App.localGet(Int(0), Bytes("royalty_amount")),
        }),
        InnerTxnBuilder.Submit(),
        
        Return(Int(1))
    ])
    
    # Get current price
    on_get_price = Return(
        Div(App.globalGet(virtual_algo_key), App.globalGet(virtual_token_key))
    )
    
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("buy"), on_buy],
        [Txn.application_args[0] == Bytes("sell"), on_sell],
        [Txn.application_args[0] == Bytes("price"), on_get_price]
    )
    
    return program

if __name__ == "__main__":
    print(compileTeal(bonding_curve_contract(), Mode.Application, version=8))