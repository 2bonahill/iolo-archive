use anyhow::Result;
use candid::Principal;
use ic_agent::Agent;
use xshell::{cmd, Shell};

const URL: &str = "http://localhost:4943/";
const ICCRYPT_BACKEND_CANISTER_ID: &str = "rrkah-fqaaa-aaaaa-aaaaq-cai";

pub fn get_dfx_agent() -> Result<Agent> {
    let agent = Agent::builder()
        .with_transport(
            ic_agent::agent::http_transport::ReqwestHttpReplicaV2Transport::create(URL)?,
        )
        .build()?;

    Ok(agent)
}

pub fn get_iccrypt_backend_canister() -> Principal {
    Principal::from_text(ICCRYPT_BACKEND_CANISTER_ID).expect("Could not decode the principal.")
}

#[allow(dead_code)]
pub fn setup() -> anyhow::Result<()> {
    let sh = Shell::new()?;
    // let manifest = sh.read_file("Cargo.toml")?;
    // dbg!("hi");
    sh.change_dir("../../");
    cmd!(sh, "dfx build iccrypt_backend")
        .run()
        .unwrap_or_else(|_| {});
    cmd!(sh, "dfx canister install iccrypt_backend --mode upgrade")
        .run()
        .unwrap_or_else(|_| {});

    // cmd!(sh, "./deploy.sh local").run().unwrap_or_else(|_| {});

    // assert_eq!(1, 2);

    Ok(())
}

#[allow(dead_code)]
pub fn cleanup() -> anyhow::Result<()> {
    // let sh = Shell::new()?;
    // let manifest = sh.read_file("Cargo.toml")?;
    // cmd!(sh, "dfx start").run().unwrap_or_else(|_| {});
    // cmd!(sh, "dfx stop").run().unwrap_or_else(|_| {});

    // assert_eq!(1, 2);

    Ok(())
}
