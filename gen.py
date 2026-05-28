import os

contracts = [
    {
        "name": "treasury-streams",
        "methods": "pub fn stream_liability_summary(env: Env) -> Summary { Summary {} }\n    pub fn pause_impact(env: Env) -> Impact { Impact {} }"
    },
    {
        "name": "sponsor-payouts",
        "methods": "pub fn pending_disbursement_summary(env: Env) -> Summary { Summary {} }\n    pub fn release_band(env: Env) -> Band { Band {} }"
    },
    {
        "name": "raffle-escrow",
        "methods": "pub fn ticket_liability_summary(env: Env) -> Summary { Summary {} }\n    pub fn draw_release(env: Env) -> Release { Release {} }"
    },
    {
        "name": "badge-ledger",
        "methods": "pub fn issuance_coverage_snapshot(env: Env) -> Snapshot { Snapshot {} }\n    pub fn revocation_window(env: Env) -> Window { Window {} }"
    }
]

for c in contracts:
    base = f"contracts/{c['name']}"
    os.makedirs(f"{base}/src", exist_ok=True)
    
    with open(f"{base}/Cargo.toml", "w") as f:
        f.write(f'''[package]
name = "{c['name']}"
version = "0.1.0"
edition = "2021"

[dependencies]
soroban-sdk = "20.0.0"

[features]
testutils = ["soroban-sdk/testutils"]
''')

    with open(f"{base}/src/lib.rs", "w") as f:
        f.write(f'''#![no_std]
use soroban_sdk::{{contract, contractimpl, Env}};
mod storage;
mod types;
#[cfg(test)]
mod test;

use types::*;

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {{
    {c['methods']}
}}
''')

    with open(f"{base}/src/storage.rs", "w") as f:
        f.write('''use soroban_sdk::contracttype;

#[contracttype]
pub enum DataKey {
    State,
}
''')

    with open(f"{base}/src/types.rs", "w") as f:
        if c['name'] == 'treasury-streams':
            types = "pub struct Summary {}\n#[soroban_sdk::contracttype]\npub struct Impact {}"
        elif c['name'] == 'sponsor-payouts':
            types = "pub struct Summary {}\n#[soroban_sdk::contracttype]\npub struct Band {}"
        elif c['name'] == 'raffle-escrow':
            types = "pub struct Summary {}\n#[soroban_sdk::contracttype]\npub struct Release {}"
        else:
            types = "pub struct Snapshot {}\n#[soroban_sdk::contracttype]\npub struct Window {}"
            
        f.write(f'''use soroban_sdk::contracttype;

#[contracttype]
{types}
''')

    with open(f"{base}/src/test.rs", "w") as f:
        f.write('''#![cfg(test)]
use super::*;
use soroban_sdk::Env;

#[test]
fn test_success_path() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    // Success path logic
}

#[test]
fn test_empty_state_path() {
    let env = Env::default();
    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);
    // Empty state logic
}
''')
