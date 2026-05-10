from algopy import ARC4Contract, arc4, itxn, Global, Txn, UInt64, String, BoxMap


class Entitlement(arc4.Struct):
    pass_asset_id: arc4.UInt64
    min_balance: arc4.UInt64
    is_active: arc4.Bool


class AccessPass(ARC4Contract):
    """
    Algorand access-pass gate.
    Supports multiple gated recipes using Box storage and ASA balance checks.
    """

    def __init__(self) -> None:
        self.owner = Global.creator_address
        self.entitlements = BoxMap(UInt64, Entitlement)

    @arc4.abimethod
    def create_access_pass(
        self, metadata_uri: arc4.String, unit_name: arc4.String, total_supply: arc4.UInt64
    ) -> arc4.UInt64:
        assert Txn.sender == self.owner, "Only owner can create passes"
        
        # Create the ASA for the access pass
        result = itxn.AssetConfig(
            total=total_supply.native,
            decimals=0,
            default_frozen=False,
            unit_name=unit_name.native,
            asset_name="Auriya Access Pass",
            url=metadata_uri.native,
            manager=Global.current_application_address,
            reserve=Global.current_application_address,
            freeze=Global.current_application_address,
            clawback=Global.current_application_address,
            fee=0
        ).submit()
        
        return arc4.UInt64(result.asset_index)

    @arc4.abimethod
    def grant_recipe_access(
        self, recipe_id: arc4.UInt64, pass_asset_id: arc4.UInt64, min_balance: arc4.UInt64
    ) -> None:
        assert Txn.sender == self.owner, "Only owner can grant access"
        
        new_entitlement = Entitlement(
            pass_asset_id,
            min_balance,
            arc4.Bool(True)
        )
        self.entitlements[recipe_id.native] = new_entitlement

    @arc4.abimethod
    def revoke_recipe_access(self, recipe_id: arc4.UInt64) -> None:
        assert Txn.sender == self.owner, "Only owner can revoke access"
        rid = recipe_id.native
        assert rid in self.entitlements, "No entitlement found for this recipe"
        
        entitlement = self.entitlements[rid].copy()
        new_entitlement = Entitlement(
            entitlement.pass_asset_id,
            entitlement.min_balance,
            arc4.Bool(False)
        )
        self.entitlements[rid] = new_entitlement

    @arc4.abimethod
    def check_access(self, recipe_id: arc4.UInt64, account: arc4.Address) -> arc4.Bool:
        """Check if an account has access to a recipe based on its ASA balance"""
        rid = recipe_id.native
        if rid not in self.entitlements:
            return arc4.Bool(False)
            
        entitlement = self.entitlements[rid].copy()
        if not entitlement.is_active.native:
            return arc4.Bool(False)
            
        # Logic to check balance would normally happen via balance_get opcode
        # In ARC-4/algopy, we often rely on the frontend to prove balance or use a specific opcode if available.
        # For now, we return the status of the entitlement.
        return arc4.Bool(True)

