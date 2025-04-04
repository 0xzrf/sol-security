use anchor_lang::prelude::*;

pub mod error;
pub mod state;
pub mod instructions;

pub use instructions::*;

declare_id!("6yxyBEwKowMWfYkuvUi9USF8coef9r55MqPfYouCmg3w");

#[program]
pub mod trident_one {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>, 
        input1: u8,
        input2: u8,
        name: String,
        symbol: String,
        uri: String
    ) -> Result<()> {
        initialize_ix(ctx, input1, input2, name, symbol, uri)
    }
}

