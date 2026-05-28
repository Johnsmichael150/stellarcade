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
    pub fn pending_disbursement_summary(env: Env) -> Summary { Summary {} }
    pub fn release_band(env: Env) -> Band { Band {} }
}
