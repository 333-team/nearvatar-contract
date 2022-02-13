import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";
import getConfig from "./config";
import { stringifyJsonOrBytes } from "near-api-js/lib/transaction";
const nearConfig = getConfig(process.env.NODE_ENV || "development");

async function connect(nearConfig) {
  debugger
  console.log(new nearAPI.keyStores.BrowserLocalStorageKeyStore())
  // Connects to NEAR and provides `near`, `walletAccount` and `contract` objects in `window` scope
  // Initializing connection to the NEAR node.
  window.near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
    },
    ...nearConfig
  });

  // Needed to access wallet login
  window.walletConnection = new nearAPI.WalletConnection(window.near);

  // Initializing our contract APIs by contract name and configuration.
  window.contract = await new nearAPI.Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read-only – they don't modify the state, but usually return some value
    viewMethods: ['get_record_by_owner'],
    // Change methods can modify the state, but you don't receive the returned value when called
    changeMethods: ['del_record_by_owner', 'set_record_by_owner','update_avatar_by_owner','upsert_asset_by_owner'],
    // Sender is the account ID to initialize transactions.
    // getAccountId() will return empty string if user is still unauthorized
    sender: window.walletConnection.getAccountId()
  });
}

function errorHelper(err) {
  // if there's a cryptic error, provide more helpful feedback and instructions here
  // TODO: as soon as we get the error codes propagating back, use those
  if (err.message.includes('Cannot deserialize the contract state')) {
    console.warn('NEAR Warning: the contract/account seems to have state that is not (or no longer) compatible.\n' +
        'This may require deleting and recreating the NEAR account as shown here:\n' +
        'https://stackoverflow.com/a/60767144/711863');
  }
  if (err.message.includes('Cannot deserialize the contract state')) {
    console.warn('NEAR Warning: the contract/account seems to have state that is not (or no longer) compatible.\n' +
        'This may require deleting and recreating the NEAR account as shown here:\n' +
        'https://stackoverflow.com/a/60767144/711863');
  }
  console.error(err);
}

function updateUI() {
  if (!window.walletConnection.getAccountId()) {
    Array.from(document.querySelectorAll('.sign-in')).map(it => it.style = 'display: block;');
  } else {

    document.querySelector('.my-account').innerText=window.walletConnection.getAccountId();
    contract.get_record_by_owner({'owner':window.walletConnection.getAccountId()}).then(a=>{
      const displayname = a.displayname
      const description =a.description
      const avatar = a.avatarid
      const records = a.attributelist
      const recordsJson = JSON.parse(records);
      var avatarInfo=""
      if(avatar.indexOf("jpg")>0){
         avatarInfo =avatar;
      }else{
        avatarInfo = recordsJson[avatar]
      }

      // document.querySelector('.my-account').innerText="11"
      document.querySelector('.displayname').innerText=displayname ;
      document.querySelector('.avatar').innerText= JSON.stringify(avatarInfo) ;
      document.querySelector('.assets').innerText= JSON.stringify(recordsJson) ;
      
    })


    // Array.from(document.querySelectorAll('.after-sign-in')).map(it => it.style = 'display: block;');
    // contract.get_num().then(count => {
    //   document.querySelector('#show').classList.replace('loader','number');
    //   document.querySelector('#show').innerText = count === undefined ? 'calculating...' : count;
    //   document.querySelector('#left').classList.toggle('eye');
      // document.querySelectorAll('button').forEach(button => button.disabled = false);
    //   if (count >= 0) {
    //     document.querySelector('.mouth').classList.replace('cry','smile');
    //   } else {
    //     document.querySelector('.mouth').classList.replace('smile','cry');
    //   }
    //   if (count > 20 || count < -20) {
    //     document.querySelector('.tongue').style.display = 'block';
    //   } else {
    //     document.querySelector('.tongue').style.display = 'none';
    //   }
    // }).catch(err => errorHelper(err));
  }
}
document.querySelector('.new').addEventListener('click', () => {
   
const avatar = {
  'displayname':'tom',
  'avatar':'mintbase-999',
  'description':'i am  tom',
  'records':JSON.stringify({'mintbase-999':{
     'id':'mintbase-999',
     'type':'nft',
     'attr':[
       {
         'url':'1.jpg'
      },
      { 
        'key':'parent',
       'value':'nftid.222@near',
      },
       { 
         'key':'ancestors',
         'value':'333',
      }, 
      ]
  },
  })
}
contract.set_record_by_owner(avatar)
})

document.querySelector('.modify-avatar').addEventListener('click', () => {
   contract.update_avatar_by_owner({"avatar":"www.11/1.jpg"})
  
  
  })
  document.querySelector('.new-asset').addEventListener('click', () => {
    
    contract.upsert_asset_by_owner({
      "asset_id":"11@github",
      "asset_attr":JSON.stringify({
        "id":"11@github",
        "type":"github",
        "attr":[{
          "key":"mail",
          "value":"xx@163.com"
        }]
      })
    })
  
  })
// document.querySelector('#plus').addEventListener('click', () => {
//   debugger
//   document.querySelectorAll('button').forEach(button => button.disabled = true);
//   document.querySelector('#show').classList.replace('number','loader');
//   document.querySelector('#show').innerText = '';
//   contract.increment().then(updateUI);
// });
// document.querySelector('#minus').addEventListener('click', () => {
//   document.querySelectorAll('button').forEach(button => button.disabled = true);
//   document.querySelector('#show').classList.replace('number','loader');
//   document.querySelector('#show').innerText = '';
//   contract.decrement().then(updateUI);
// });
// document.querySelector('#a').addEventListener('click', () => {
//   document.querySelectorAll('button').forEach(button => button.disabled = true);
//   document.querySelector('#show').classList.replace('number','loader');
//   document.querySelector('#show').innerText = '';
//   contract.reset().then(updateUI);
// });
// document.querySelector('#c').addEventListener('click', () => {
//   document.querySelector('#left').classList.toggle('eye');
// });
// document.querySelector('#b').addEventListener('click', () => {
//   document.querySelector('#right').classList.toggle('eye');
// });
// document.querySelector('#d').addEventListener('click', () => {
//   document.querySelector('.dot').classList.toggle('on');
// });

// Log in user using NEAR Wallet on "Sign In" button click
document.querySelector('.sign-in .btn').addEventListener('click', () => {
  walletConnection.requestSignIn(nearConfig.contractName, 'Rust Counter Example');
});

document.querySelector('.sign-out .btn').addEventListener('click', () => {
  walletConnection.signOut();
  // TODO: Move redirect to .signOut() ^^^
  window.location.replace(window.location.origin + window.location.pathname);
});

window.nearInitPromise = connect(nearConfig)
    .then(updateUI)
    .catch(console.error);
