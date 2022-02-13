//! This contract implements simple counter backed by storage on blockchain.
//!
//! The contract provides methods to [increment] / [decrement] counter and
//! [get it's current value][get_num] or [reset].
//!
//! [increment]: struct.Counter.html#method.increment
//! [decrement]: struct.Counter.html#method.decrement
//! [get_num]: struct.Counter.html#method.get_num
//! [reset]: struct.Counter.html#method.reset

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, PanicOnDefault,};
use near_sdk::collections::{UnorderedMap};
 

use near_sdk::serde::{Deserialize, Serialize};
near_sdk::setup_alloc!();
use serde_json::{ Value};

// add the following attributes to prepare your code for serialization and invocation on the blockchain
// More built-in Rust attributes here: https://doc.rust-lang.org/reference/attributes.html#built-in-attributes-index

#[derive( BorshDeserialize, BorshSerialize,Deserialize,Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Profile {
   pub owner:String,
   pub expiration:u32,
   pub premium:bool,
   pub displayname: String,
   pub avatarid: String,
   pub description: String,
   pub attributelist:String,
}

pub struct Attribute{
    pub id:String,
    pub tyep:String,
    pub source:String,
    pub value:String,
    // pub extends:HashMap<String,String>
}

#[near_bindgen]
#[derive( BorshDeserialize, BorshSerialize,PanicOnDefault)]
pub struct Records {
   pub records: UnorderedMap<String, Profile>,
}
 
#[near_bindgen]
impl Records {
    #[init]
    pub fn new() -> Self {
        // Initializing `status_updates` with unique key prefix.
        Self {
            records: UnorderedMap::new(b"s".to_vec()),
        }
    }
   pub fn  get_record_by_owner(&self,owner:String)->Option<Profile>{
          return  self.records.get(&owner);
   }
   pub fn del_record_by_owner(& mut self,owner:String){
       self.records.remove(&owner);
   }
   pub fn set_record_by_owner(& mut self,
     displayname: String,
      avatar: String,
    description: String,
    records: String,){
     let owner = env::signer_account_id();
     
    
     let profile =  Profile { 
        owner:owner.clone(), 
        expiration:0, 
        premium:false,
        displayname:displayname,
        avatarid:avatar,
        description:description,
        attributelist:records };
     self.records.insert(&owner,  &profile);
}

pub fn update_avatar_by_owner(& mut self,avatar:String)->u8{
    let owner = env::signer_account_id();
    let user_info = self.records.get(&owner);
    match user_info{
        Some(mut user_profile)=>{
            user_profile.avatarid = avatar;
            self.records.insert(&owner,  &user_profile);
            return 0;
        }
        None=>{ return  1;}
    }
   }
pub fn upsert_asset_by_owner(& mut self,asset_id:String,asset_attr:String)->u8{
    let owner = env::signer_account_id();
    let user_info = self.records.get(&owner);
    match user_info{
        Some(mut user_profile)=>{
           let attrs =  user_profile.attributelist;
           let mut v: Value = serde_json::from_str(&attrs).unwrap();
           v[&asset_id] = Value::String(asset_attr);
           env::log(v["owner"].to_string().as_bytes());
           user_profile.attributelist = v.to_string();
           self.records.insert(&owner,  &user_profile);
           return 0;
        }
        None=>{ return  1;}
    }
}
}
