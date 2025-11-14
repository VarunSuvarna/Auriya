"""
Auriya Bonding Curve Contract
Core mechanism for music token price discovery and trading

This contract implements the primary use case:
- Artists launch songs as tradable tokens
- Fans buy tokens at bonding curve prices
- Automatic price discovery based on supply/demand
- Graduation to DEX when threshold reached
"""

from pyteal import *

def bonding_curve_contract():
    """
    Bonding curve mechanism for music token launches
    
    Key Features:
    - Virtual AMM pool (30 ALGO + 1B tokens initially)
    - Price = Virtual_ALGO_Reserve / Virtual_Token_Reserve
    - 1% royalty to artist on each trade
    - Auto-graduation to Tinyman at 10,000 ALGO raised
    """
    
    # Global state keys
    artist_address = Bytes("artist")
    virtual_algo_reserve = Bytes("v_algo")
    virtual_token_reserve = Bytes("v_token")
    real_algo_reserve = Bytes("r_algo")
    total_supply = Bytes("supply")
    graduation_threshold = Bytes("grad_threshold")
    is_graduated = Bytes("graduated")
    song_ipfs = Bytes("ipfs")
    royalty_rate = Bytes("royalty")
    
    # Constants
    INITIAL_VIRTUAL_ALGO = Int(30_000_000)  # 30 ALGO in microALGOs
    INITIAL_VIRTUAL_TOKENS = Int(1_073_000_000)  # 1.073B tokens
    GRADUATION_ALGO = Int(10_000_000_000)  # 10,000 ALGO in microALGOs
    ROYALTY_PERCENTAGE = Int(1)  # 1% royalty
    
    @Subroutine(TealType.uint64)
    def calculate_buy_price(algo_amount: TealType.uint64):
        """Calculate tokens received for ALGO amount"""
        current_v_algo = App.globalGet(virtual_algo_reserve)
        current_v_tokens = App.globalGet(virtual_token_reserve)
        
        new_v_algo = current_v_algo + algo_amount
        new_v_tokens = Div(
            Mul(current_v_algo, current_v_tokens),
            new_v_algo
        )
        
        return current_v_tokens - new_v_tokens
    
    @Subroutine(TealType.uint64)
    def calculate_sell_price(token_amount: TealType.uint64):
        """Calculate ALGO received for token amount"""
        current_v_algo = App.globalGet(virtual_algo_reserve)
        current_v_tokens = App.globalGet(virtual_token_reserve)
        
        new_v_tokens = current_v_tokens + token_amount
        new_v_algo = Div(
            Mul(current_v_algo, current_v_tokens),
            new_v_tokens
        )
        
        return current_v_algo - new_v_algo
    
    @Subroutine(TealType.uint64)
    def calculate_royalty(amount: TealType.uint64):
        """Calculate 1% royalty for artist"""
        return Div(Mul(amount, ROYALTY_PERCENTAGE), Int(100))
    
    # Initialize bonding curve for new song
    on_create = Seq([
        # Validate inputs
        Assert(Len(Txn.application_args) == Int(4)),
        
        # Set initial state
        App.globalPut(artist_address, Txn.sender()),
        App.globalPut(song_ipfs, Txn.application_args[0]),  # IPFS hash
        App.globalPut(total_supply, Btoi(Txn.application_args[1])),  # Token supply
        App.globalPut(graduation_threshold, GRADUATION_ALGO),
        App.globalPut(is_graduated, Int(0)),
        App.globalPut(royalty_rate, ROYALTY_PERCENTAGE),
        
        # Initialize virtual reserves
        App.globalPut(virtual_algo_reserve, INITIAL_VIRTUAL_ALGO),
        App.globalPut(virtual_token_reserve, INITIAL_VIRTUAL_TOKENS),
        App.globalPut(real_algo_reserve, Int(0)),
        
        Return(Int(1))
    ])
    
    # Buy tokens with ALGO
    on_buy = Seq([
        Assert(App.globalGet(is_graduated) == Int(0)),  # Not graduated yet
        Assert(Gtxn[0].type_enum() == TxnType.Payment),  # Payment transaction
        Assert(Gtxn[0].receiver() == Global.current_application_address()),
        
        # Calculate tokens to mint
        algo_amount = Gtxn[0].amount(),
        royalty_amount = calculate_royalty(algo_amount),
        net_algo = algo_amount - royalty_amount,
        tokens_to_mint = calculate_buy_price(net_algo),
        
        # Update reserves
        App.globalPut(
            virtual_algo_reserve,
            App.globalGet(virtual_algo_reserve) + net_algo
        ),
        App.globalPut(
            virtual_token_reserve,
            App.globalGet(virtual_token_reserve) - tokens_to_mint
        ),
        App.globalPut(
            real_algo_reserve,
            App.globalGet(real_algo_reserve) + net_algo
        ),
        
        # Mint tokens to buyer
        App.localPut(
            Txn.sender(),
            Bytes("balance"),
            App.localGet(Txn.sender(), Bytes("balance")) + tokens_to_mint
        ),
        
        # Send royalty to artist
        If(royalty_amount > Int(0)).Then(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: App.globalGet(artist_address),
                TxnField.amount: royalty_amount,
            }),
            InnerTxnBuilder.Submit()
        ),
        
        # Check graduation
        If(App.globalGet(real_algo_reserve) >= GRADUATION_ALGO).Then(
            App.globalPut(is_graduated, Int(1))
        ),
        
        Return(Int(1))
    ])
    
    # Sell tokens for ALGO
    on_sell = Seq([
        Assert(App.globalGet(is_graduated) == Int(0)),  # Not graduated yet
        
        token_amount = Btoi(Txn.application_args[1]),
        algo_to_receive = calculate_sell_price(token_amount),
        royalty_amount = calculate_royalty(algo_to_receive),
        net_algo = algo_to_receive - royalty_amount,
        
        # Validate seller has enough tokens
        Assert(App.localGet(Txn.sender(), Bytes("balance")) >= token_amount),
        
        # Update reserves
        App.globalPut(
            virtual_algo_reserve,
            App.globalGet(virtual_algo_reserve) - algo_to_receive
        ),
        App.globalPut(
            virtual_token_reserve,
            App.globalGet(virtual_token_reserve) + token_amount
        ),
        App.globalPut(
            real_algo_reserve,
            App.globalGet(real_algo_reserve) - algo_to_receive
        ),
        
        # Burn tokens from seller
        App.localPut(
            Txn.sender(),
            Bytes("balance"),
            App.localGet(Txn.sender(), Bytes("balance")) - token_amount
        ),
        
        # Send ALGO to seller
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: Txn.sender(),
            TxnField.amount: net_algo,
        }),
        InnerTxnBuilder.Submit(),
        
        # Send royalty to artist
        If(royalty_amount > Int(0)).Then(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: App.globalGet(artist_address),
                TxnField.amount: royalty_amount,
            }),
            InnerTxnBuilder.Submit()
        ),
        
        Return(Int(1))
    ])
    
    # Graduate to DEX (Tinyman)
    on_graduate = Seq([
        Assert(App.globalGet(is_graduated) == Int(1)),
        Assert(Txn.sender() == App.globalGet(artist_address)),
        
        # Create liquidity pool on Tinyman
        # This would integrate with Tinyman's pool creation
        # For now, we mark as graduated
        
        Return(Int(1))
    ])
    
    # Get current price
    on_get_price = Seq([
        current_v_algo = App.globalGet(virtual_algo_reserve),
        current_v_tokens = App.globalGet(virtual_token_reserve),
        
        # Price = ALGO_Reserve / Token_Reserve
        price = Div(current_v_algo, current_v_tokens),
        
        Return(price)
    ])
    
    # Opt-in for token balance
    on_opt_in = Seq([
        App.localPut(Txn.sender(), Bytes("balance"), Int(0)),
        Return(Int(1))
    ])
    
    # Main program logic
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.OptIn, on_opt_in],
        [Txn.application_args[0] == Bytes("buy"), on_buy],
        [Txn.application_args[0] == Bytes("sell"), on_sell],
        [Txn.application_args[0] == Bytes("graduate"), on_graduate],
        [Txn.application_args[0] == Bytes("price"), on_get_price],
        [Return(Int(0))]  # Reject all other calls
    )
    
    return program

if __name__ == "__main__":
    print(compileTeal(bonding_curve_contract(), Mode.Application, version=8))