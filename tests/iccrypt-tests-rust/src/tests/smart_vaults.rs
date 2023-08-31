use anyhow::Result;
use candid::{CandidType, Deserialize, Principal};
use colored::Colorize;
use ic_agent::{identity::BasicIdentity, Agent, Identity};

use crate::{
    types::{
        secret::{CreateSecretArgs, Secret, SecretCategory, SecretDecryptionMaterial},
        smart_vault_err::SmartVaultErr,
        user::User,
    },
    utils::{
        agent::{create_identity, get_dfx_agent_with_identity, make_call_with_agent, CallType},
        vetkd::{
            aes_gcm_encrypt, get_aes_256_gcm_key_for_caller, get_local_random_aes_256_gcm_key,
        },
    },
};

#[derive(CandidType, Deserialize)]
struct CreateUserArg {
    user_id: Principal,
}

#[derive(CandidType, Deserialize)]
struct ExampleArgSet {
    canister_id: Principal,
    controllers: Option<Vec<Principal>>,
    amount: Option<candid::Nat>,
}

pub async fn test_smart_vaults() -> Result<()> {
    println!("\n{}", "Testing smart vaults".yellow().bold());
    test_user_lifecycle().await?;
    // test_mass_user_creation().await?;
    Ok(())
}

async fn test_user_lifecycle() -> anyhow::Result<()> {
    // create identities (keypairs) and the corresponding senders (principals)
    let i1: BasicIdentity = create_identity();
    let p1: Principal = i1.sender().unwrap();
    let a1: Agent = get_dfx_agent_with_identity(i1).await?;
    let i2: BasicIdentity = create_identity();
    let _p2: Principal = i2.sender().unwrap();
    let _a2: Agent = get_dfx_agent_with_identity(i2).await?;

    // let's create a new ic crypt user
    let new_user_1 = create_user(&a1).await?;
    assert_eq!(&new_user_1.id, &p1);
    println!("   {}{:?}", "New user created: ", new_user_1.id);

    // Let's create a secret
    let username = "Tobias";
    let password = "123";
    let notes = "My Notes";

    // Get local random aes gcm 256 key to encrypt the secret fields
    let secret_encryption_key = get_local_random_aes_256_gcm_key().await.unwrap();

    // Encrypt secret fields
    let (encrypted_username, username_decryption_nonce) =
        aes_gcm_encrypt(username.as_bytes(), &secret_encryption_key)
            .await
            .unwrap();

    let (encrypted_password, password_decryption_nonce) =
        aes_gcm_encrypt(password.as_bytes(), &secret_encryption_key)
            .await
            .unwrap();

    let (encrypted_notes, notes_decryption_nonce) =
        aes_gcm_encrypt(notes.as_bytes(), &secret_encryption_key)
            .await
            .unwrap();

    // Encrypt the encryption key
    let key_encryption_key = get_aes_256_gcm_key_for_caller().await.unwrap();
    let (encrypted_secret_decryption_key, nonce_encrypted_secret_decryption_key) =
        aes_gcm_encrypt(&secret_encryption_key, &key_encryption_key)
            .await
            .unwrap();

    let decryption_material: SecretDecryptionMaterial = SecretDecryptionMaterial {
        encrypted_decryption_key: encrypted_secret_decryption_key,
        iv: nonce_encrypted_secret_decryption_key.to_vec(),
        username_decryption_nonce: Some(username_decryption_nonce.to_vec()),
        password_decryption_nonce: Some(password_decryption_nonce.to_vec()),
        notes_decryption_nonce: Some(notes_decryption_nonce.to_vec()),
    };

    // let's add a secret
    let create_secret_args = CreateSecretArgs {
        category: SecretCategory::Password,
        name: "Goolge".to_string(),
        username: Some(encrypted_username),
        password: Some(encrypted_password),
        url: Some("www.google.com".to_string()),
        notes: Some(encrypted_notes),
        decryption_material,
    };

    dbg!("okay, probably not: ");

    let s = add_user_secret(&a1, &create_secret_args).await;
    dbg!(&s);

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // so let's delete the user 1
    delete_user(&a1, new_user_1.id).await?;
    println!("   User successfully deleted");

    // let's delete the user 1 again -> this must fail, because it has been deleted alreay
    let del = delete_user(&a1, new_user_1.id).await;
    if del.is_err() {
        assert_eq!(
            del.err().unwrap(),
            SmartVaultErr::UserDoesNotExist(new_user_1.id.to_string())
        );
    } else {
        panic!(
            "Error. The following user was deleted, even thouh it should not have existed: {}",
            new_user_1.id.to_string()
        );
    }

    Ok(())
}

async fn delete_user(agent: &Agent, u: Principal) -> anyhow::Result<(), SmartVaultErr> {
    let r: Result<(), SmartVaultErr> = make_call_with_agent(
        agent,
        CallType::Update("delete_user".into()),
        Some(u.as_slice()),
    )
    .await
    .unwrap();

    r
}

async fn create_user(agent: &Agent) -> anyhow::Result<User, SmartVaultErr> {
    let user: Result<User, SmartVaultErr> = make_call_with_agent(
        agent,
        CallType::Update("create_user".into()),
        Option::<Vec<u8>>::None,
    )
    .await
    .unwrap();

    user
}

async fn add_user_secret(
    agent: &Agent,
    args: &CreateSecretArgs,
) -> anyhow::Result<Secret, SmartVaultErr> {
    let s: Result<Secret, SmartVaultErr> = make_call_with_agent(
        agent,
        CallType::Update("add_user_secret".into()),
        Some(args),
    )
    .await
    .unwrap();

    s
}
