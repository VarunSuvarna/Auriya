"""
Auriya DAO Governance Contract
Token-weighted voting for community decisions
"""

from pyteal import *

def governance_contract():
    """
    DAO governance with token-weighted voting
    - Proposal creation
    - Token-weighted votes
    - Execution threshold
    """
    
    # Global state
    proposal_count = Bytes("proposal_count")
    voting_token = Bytes("voting_token")
    
    # Create governance
    on_create = Seq([
        App.globalPut(voting_token, Txn.application_args[0]),
        App.globalPut(proposal_count, Int(0)),
        Return(Int(1))
    ])
    
    # Create proposal
    on_create_proposal = Seq([
        App.globalPut(proposal_count, App.globalGet(proposal_count) + Int(1)),
        App.globalPut(
            Concat(Bytes("proposal_"), Itob(App.globalGet(proposal_count))),
            Txn.application_args[1]
        ),
        App.globalPut(
            Concat(Bytes("votes_"), Itob(App.globalGet(proposal_count))),
            Int(0)
        ),
        Return(Int(1))
    ])
    
    # Vote on proposal
    on_vote = Seq([
        Assert(App.localGet(Txn.sender(), Bytes("token_balance")) > Int(0)),
        App.globalPut(
            Concat(Bytes("votes_"), Txn.application_args[1]),
            App.globalGet(Concat(Bytes("votes_"), Txn.application_args[1])) + 
            App.localGet(Txn.sender(), Bytes("token_balance"))
        ),
        App.localPut(
            Txn.sender(),
            Concat(Bytes("voted_"), Txn.application_args[1]),
            Int(1)
        ),
        Return(Int(1))
    ])
    
    # Get proposal votes
    on_get_votes = Return(
        App.globalGet(Concat(Bytes("votes_"), Txn.application_args[1]))
    )
    
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_args[0] == Bytes("create_proposal"), on_create_proposal],
        [Txn.application_args[0] == Bytes("vote"), on_vote],
        [Txn.application_args[0] == Bytes("get_votes"), on_get_votes]
    )
    
    return program

if __name__ == "__main__":
    print(compileTeal(governance_contract(), Mode.Application, version=8))
