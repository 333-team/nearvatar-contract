# nearvatar-contract
nearvatar contract
1、compile
    rustup target add wasm32-unknown-unknown
    cargo build --target wasm32-unknown-unknown --release
2、deploy
   near dev-deploy  -f ./target/wasm32-unknown-unknown/release/near_avatar.wasm  new
3、invoke
 near call    dev-1644761008317-80770699190791  new   --accountId  kjyang.testnet
  near call  {contract-addr}  set_record_by_owner '{\"displayname\":\"tom\",\"avatar\":\"1.jpg\",\"description\":\"11\",\"records\":\"{"a":"b"}\"}' --accountId  XXX
  near view   dev-1644761008317-80770699190791 get_record_by_owner '{\"owner\":\"lansane.testnet\"}' --accountId  lansane.testnet
near call   dev-1644758372179-56137985120076  update_avatar_by_owner "{\"avatar\":\"2222\"}" --accountId  lansane.testnet
near call    dev-1644761008317-80770699190791  upsert_asset_by_owner "{\"asset_id\":mintbase-999\"asset_attr\":\"333\"}" --accountId  lansane.testnet


前端


