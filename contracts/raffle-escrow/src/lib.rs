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
    pub fn ticket_liability_summary(env: Env) -> Summary { Summary {} }
    pub fn draw_release(env: Env) -> Release { Release {} }
}
