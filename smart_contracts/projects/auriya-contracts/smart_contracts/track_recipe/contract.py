from algopy import ARC4Contract, arc4, Global, Txn, UInt64, String, BoxMap


class RecipeRecord(arc4.Struct):
    metadata_uri: arc4.String
    track_asset_id: arc4.UInt64
    stem_ids: arc4.DynamicArray[arc4.UInt64]
    stem_weights: arc4.DynamicArray[arc4.UInt64]
    is_frozen: arc4.Bool


class TrackRecipe(ARC4Contract):
    """
    Algorand recipe composition module.
    Supports multiple recipes using Box storage.
    """

    def __init__(self) -> None:
        self.owner = Global.creator_address
        self.recipe_count = UInt64(0)
        self.recipes = BoxMap(UInt64, RecipeRecord)

    @arc4.abimethod
    def create_recipe(
        self,
        metadata_uri: arc4.String,
        track_asset_id: arc4.UInt64,
        stem_ids: arc4.DynamicArray[arc4.UInt64],
        stem_weights: arc4.DynamicArray[arc4.UInt64],
    ) -> arc4.UInt64:
        assert Txn.sender == self.owner, "Only owner can create recipes"
        assert stem_ids.length > 0, "At least one stem is required"
        assert stem_ids.length == stem_weights.length, "Stem IDs and weights must match in length"
        
        # Verify total weight is 100% (10000 BPS)
        total_weight = UInt64(0)
        for i in range(stem_weights.length):
            total_weight += stem_weights[i].native
        assert total_weight == 10_000, "Total weight must be 10000 BPS"

        self.recipe_count += UInt64(1)
        recipe_id = self.recipe_count
        
        new_record = RecipeRecord(
            metadata_uri,
            track_asset_id,
            stem_ids,
            stem_weights,
            arc4.Bool(False)
        )
        
        self.recipes[recipe_id] = new_record
        return arc4.UInt64(recipe_id)

    @arc4.abimethod
    def get_recipe(self, recipe_id: arc4.UInt64) -> RecipeRecord:
        rid = recipe_id.native
        assert rid <= self.recipe_count, "Recipe ID does not exist"
        return self.recipes[rid].copy()

    @arc4.abimethod
    def update_recipe_metadata(self, recipe_id: arc4.UInt64, metadata_uri: arc4.String) -> None:
        assert Txn.sender == self.owner, "Only owner can update recipes"
        rid = recipe_id.native
        assert rid <= self.recipe_count, "Recipe ID does not exist"
        
        record = self.recipes[rid].copy()
        assert not record.is_frozen.native, "Cannot update a frozen recipe"
        
        new_record = RecipeRecord(
            metadata_uri,
            record.track_asset_id,
            record.stem_ids,
            record.stem_weights,
            record.is_frozen
        )
        self.recipes[rid] = new_record

    @arc4.abimethod
    def freeze_recipe(self, recipe_id: arc4.UInt64) -> None:
        assert Txn.sender == self.owner, "Only owner can freeze recipes"
        rid = recipe_id.native
        assert rid <= self.recipe_count, "Recipe ID does not exist"
        
        record = self.recipes[rid].copy()
        new_record = RecipeRecord(
            record.metadata_uri,
            record.track_asset_id,
            record.stem_ids,
            record.stem_weights,
            arc4.Bool(True)
        )
        self.recipes[rid] = new_record

