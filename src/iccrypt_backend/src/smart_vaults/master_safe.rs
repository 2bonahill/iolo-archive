use std::collections::BTreeMap;

use candid::{CandidType, Deserialize};

use crate::users::user::{User, UserID};

use super::{secret::Secret, user_safe::UserSafe};

#[derive(Debug, CandidType, Deserialize, Clone)]
pub struct MasterSafe {
    date_created: Option<u64>,
    date_modified: Option<u64>,
    pub user_safes: BTreeMap<UserID, UserSafe>,
}

impl MasterSafe {
    pub fn new() -> Self {
        Self {
            date_created: None,
            date_modified: None,
            user_safes: BTreeMap::new(),
        }
    }

    /// Returns a mutable reference to the user safe
    pub fn get_user_safe(&mut self, user: UserID) -> Option<&mut UserSafe> {
        if let Some(us) = self.user_safes.get_mut(&user) {
            Some(us)
        } else {
            None
        }
    }

    pub fn get_all_user_safes(&self) -> BTreeMap<UserID, UserSafe> {
        self.user_safes.clone()
    }

    pub fn open_new_user_safe(&mut self, user_id: UserID) -> &mut UserSafe {
        // create the user
        let new_user = User::new(user_id.clone());
        let new_user_safe = UserSafe::new(new_user);
        self.user_safes.insert(user_id.clone(), new_user_safe);
        self.get_user_safe(user_id.clone()).unwrap()
    }

    /// Inserts a secret into a user's safe.
    /// If user safe does not exist yet, a new one will be created
    pub fn add_user_secret(&mut self, user_id: UserID, secret: Secret) {
        if let Some(user_safe) = self.get_user_safe(user_id.clone()) {
            // the user already has a safe
            user_safe.add_secret(secret);
        } else {
            // open a new user safe and insert the new secret
            self.open_new_user_safe(user_id.clone()).add_secret(secret);
        }
    }
}