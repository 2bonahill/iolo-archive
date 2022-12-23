use std::cell::RefCell;
use std::collections::BTreeMap;
use std::vec;

use candid::candid_method;

use crate::users::user::{User, UserID};

use super::master_safe::MasterSafe;
use super::secret::Secret;
use super::user_safe::UserSafe;

thread_local! {
    static MASTERSAFE: RefCell<MasterSafe> = RefCell::new(MasterSafe::new());
}

#[ic_cdk_macros::query]
#[candid_method(query)]
pub fn get_user_safe(user: UserID) -> UserSafe {
    let user_vaults: BTreeMap<UserID, UserSafe> =
        MASTERSAFE.with(|mv: &RefCell<MasterSafe>| mv.borrow().get_all_user_safes().clone());

    if let Some(uv) = user_vaults.get(&user) {
        uv.clone()
    } else {
        UserSafe::new(User::new(user))
    }
}

#[ic_cdk_macros::update]
#[candid_method(update)]
pub fn add_user_secret(user: UserID, secret: Secret) {
    MASTERSAFE.with(|ms: &RefCell<MasterSafe>| {
        let master_safe = &mut ms.borrow_mut();
        master_safe.add_user_secret(user, secret);
    });
}

#[ic_cdk_macros::query]
#[candid_method(query)]
fn say_hi() -> String {
    let x = ic_cdk::api::time();
    x.to_string()
}

candid::export_service!();

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn get_candid() {
        println!("####### Candid START #######");
        println!("");
        std::println!("{}", __export_service());
        println!("");
        println!("####### Candid END #######");
    }
}