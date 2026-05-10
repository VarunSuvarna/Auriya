# Auriya Architecture (Algorand-First)

## System Overview

Auriya keeps the existing product UX and routes while strengthening the on-chain and backend wiring.

- Frontend (`Next.js`) handles discovery, upload, recipe creation UX, trading UX, and wallet interactions.
- API layer (`app/api/*`) handles storage, metadata persistence, and transaction orchestration.
- Chain layer (`smart_contracts/*`) enforces ownership, access, and royalty logic on Algorand AVM/ASA using Box storage for scalability.
- Storage layer (Supabase + IPFS-capable helpers) stores media and metadata.

## Contract/App Modules and Chain Choice

### `StemRegistry` - Algorand
Reason: stems are core music assets and map naturally to Algorand ASA + low-fee AVM state.

- **State Model**: `BoxMap[UInt64, StemRecord]`
- **StemRecord**: `{metadata_uri, contributor, royalty_bps, is_active}`
- **Public Methods**:
  - `register_stem(metadata_uri, contributor, royalty_bps) -> stem_id`
  - `get_stem(stem_id) -> StemRecord`
  - `update_stem_metadata(stem_id, metadata_uri)`
  - `set_stem_active(stem_id, is_active)`

### `TrackRecipe` - Algorand
Reason: recipe composition should remain on the same chain as stems for deterministic royalty lineage.

- **State Model**: `BoxMap[UInt64, RecipeRecord]`
- **RecipeRecord**: `{metadata_uri, track_asset_id, stem_ids[], stem_weights[], is_frozen}`
- **Public Methods**:
  - `create_recipe(metadata_uri, track_asset_id, stem_ids, stem_weights) -> recipe_id`
  - `get_recipe(recipe_id) -> RecipeRecord`
  - `update_recipe_metadata(recipe_id, metadata_uri)`
  - `freeze_recipe(recipe_id)`

### `RoyaltyRouter` - Algorand
Reason: simple low-cost split routing in ALGO/ASA is ideal on Algorand.

- **State Model**: `BoxMap[UInt64, SplitConfig]`
- **SplitConfig**: `{wallets[], bps_splits[]}`
- **Public Methods**:
  - `configure_splits(recipe_id, wallets, bps_splits)`
  - `pay_and_split(recipe_id)` - Payable call that triggers inner payment transactions.
  - `update_platform_wallet(wallet)`

### `MarketplaceRouter` - Algorand
Reason: listing + purchase settlement for music assets should remain in Algorand transaction groups.

- **State Model**: `BoxMap[UInt64, ListingRecord]`
- **ListingRecord**: `{seller, asset_id, amount, price_microalgo, is_active}`
- **Public Methods**:
  - `create_listing(asset_id, amount, price_microalgo) -> listing_id`
  - `get_listing(listing_id) -> ListingRecord`
  - `cancel_listing(listing_id)`
  - `buy_listing(listing_id, payment_txn)` - Atomic purchase with asset transfer and payment distribution.

### Why Not Solidity/EVM for Core Modules

No current EVM-only dependency is required for core Auriya flows. Introducing Solidity now would increase operational complexity and fragment liquidity/ownership state. All core music flows remain Algorand-first.

## Data Flow

1. **Upload**: User uploads audio -> API stores in Supabase/IPFS -> User signs `register_stem` call -> Stem ID is recorded.
2. **Recipe Creation**: User selects stems -> API calculates weights -> User signs `create_recipe` call -> Recipe ID is recorded.
3. **Marketplace**: Seller creates listing -> Buyer signs `buy_listing` + Payment group -> Ownership transfers atomically.
4. **Royalties**: Platform/User calls `pay_and_split` -> Inner transactions distribute ALGO to stem owners based on Recipe weights.

## Configuration Separation

- Frontend config: `NEXT_PUBLIC_STEM_REGISTRY_APP_ID`, `NEXT_PUBLIC_TRACK_RECIPE_APP_ID`, etc.
- Backend/API config: Supabase secrets, server-side creator mnemonic (if applicable).
- Chain config: Algod/Indexer endpoints (`testnet-api.algonode.cloud`).
