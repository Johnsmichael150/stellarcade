#![no_std]
use soroban_sdk::{contract, contractimpl, Env};
mod storage;
mod types;
#[cfg(test)]
mod test;

use types::*;

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn issuance_coverage_snapshot(env: Env) -> Snapshot { Snapshot {} }
    pub fn revocation_window(env: Env) -> Window { Window {} }
}
