use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Asset {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub counter: u64
}