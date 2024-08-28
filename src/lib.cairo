use starknet::syscalls::{get_block_timestamp, get_caller_address};
use starknet::ContractAddress;
use starknet::storage::{StorageMap, Storage};

#[starknet::contract]
mod Web3CreditCard {
    use super::*;

    #[storage]
    struct Storage {
        card_owners: StorageMap<ContractAddress, CardInfo>,
        balances: StorageMap<ContractAddress, u128>,
        conversion_rates: StorageMap<felt252, u128>, // Example: "ETH" -> 3000 (ETH to USD)
        total_cards: u128,
    }

    #[derive(Drop, Serde, starknet::Store)]
    pub struct CardInfo {
        card_number: felt252,
        expiry_timestamp: u64,
        active: bool,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        CardIssued: CardIssued,
        PaymentProcessed: PaymentProcessed,
    }

    #[derive(Drop, starknet::Event)]
    struct CardIssued {
        #[key]
        owner: ContractAddress,
        card_number: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct PaymentProcessed {
        #[key]
        owner: ContractAddress,
        amount: u128,
        currency: felt252,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.total_cards.write(0);
    }

    // Issue a new card to the user
    #[external(v0)]
    fn issue_card(ref self: ContractState, card_number: felt252, duration_in_days: u64) {
        let caller = get_caller_address();
        let expiry_timestamp = get_block_timestamp() + duration_in_days * 86400;
        
        let card_info = CardInfo {
            card_number: card_number,
            expiry_timestamp: expiry_timestamp,
            active: true,
        };

        self.card_owners.write(caller, card_info);
        self.total_cards.write(self.total_cards.read() + 1);

        self.emit(CardIssued { owner: caller, card_number: card_number });
    }

    // Set the conversion rate for a given cryptocurrency
    #[external(v0)]
    fn set_conversion_rate(ref self: ContractState, currency: felt252, rate: u128) {
        let caller = get_caller_address();
        // Only allow the contract owner to set conversion rates (basic check)
        if caller != self.get_owner() {
            panic!("Unauthorized");
        }
        self.conversion_rates.write(currency, rate);
    }

    // Process a payment on behalf of the user
    #[external(v0)]
    fn process_payment(ref self: ContractState, currency: felt252, amount: u128) {
        let caller = get_caller_address();
        let rate = self.conversion_rates.read(currency).unwrap();
        let fiat_amount = amount * rate;

        let mut balance = self.balances.read(caller).unwrap_or(0);
        if balance < fiat_amount {
            panic!("Insufficient balance");
        }
        
        balance -= fiat_amount;
        self.balances.write(caller, balance);

        self.emit(PaymentProcessed { owner: caller, amount: fiat_amount, currency: currency });
    }

    // Helper function to check if a card is active
    #[view]
    fn is_card_active(self: @ContractState, address: ContractAddress) -> bool {
        let card_info = self.card_owners.read(address).unwrap();
        return card_info.active && get_block_timestamp() < card_info.expiry_timestamp;
    }

    // Store the contract owner's address
    fn get_owner(self: @ContractState) -> ContractAddress {
        self.card_owners.read(ContractAddress::zero()).unwrap().card_number // Replace with actual owner address management
    }
}
