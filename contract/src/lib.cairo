use core::starknet::ContractAddress;

#[starknet::interface]
pub trait IWeb3CreditCard<TContractState> {
    fn issue_card(ref self: TContractState);
    fn set_conversion_rate(ref self: TContractState, currency: felt252, rate: u128);
    fn process_payment(ref self: TContractState, currency: felt252, amount: u128);
    fn is_card_active(self: @TContractState, address: ContractAddress) -> bool;
    fn get_owner(self: @TContractState) -> ContractAddress;
    fn get_total_cards(self: @TContractState) -> u128;
}

#[starknet::contract]
mod Web3CreditCard {
    use core::starknet::{get_block_timestamp, get_caller_address};
    use core::starknet::ContractAddress;

    #[storage]
    struct Storage {
        card_owners: LegacyMap::<ContractAddress, CardInfo>,
        balances: LegacyMap::<ContractAddress, u128>,
        conversion_rates: LegacyMap::<felt252, u128>, // Example: "ETH" -> 3000 (ETH to USD)
        total_cards: u128,
        owner: ContractAddress,
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
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
        self.total_cards.write(0);
    }

    #[abi(embed_v0)]
    impl IWeb3CreditCard of super::IWeb3CreditCard<ContractState> {
        //issues a new credit card to the caller
        fn issue_card(ref self: ContractState) {
            let caller = get_caller_address();
            let expiry_timestamp = get_block_timestamp() + 7 * 86400; // Default 7 days

            let card_number = self.total_cards.read() + 1; // Auto-increment card number
            
            let card_info = CardInfo {
                card_number: card_number.into(), // convert u128 to felt252
                expiry_timestamp: expiry_timestamp,
                active: true,
            };

            self.card_owners.write(caller, card_info); // store to card owners
            self.total_cards.write(card_number); // update total cards

            self.emit(CardIssued { owner: caller, card_number: card_number.into() }); // event
        }

        //sets the conversion rate
        fn set_conversion_rate(ref self: ContractState, currency: felt252, rate: u128) {
            let caller = get_caller_address();
            if caller != self.owner.read() {
                panic!("Unauthorized");
            }
            self.conversion_rates.write(currency, rate);
        }

        //stores a payment for specific currency
        fn process_payment(ref self: ContractState, currency: felt252, amount: u128) {
            let caller = get_caller_address();
            let rate = self.conversion_rates.read(currency);
            if rate == 0 {
                panic!("Invalid currency");
            }
            let fiat_amount = amount * rate;

            let balance = self.balances.read(caller);
            if balance < fiat_amount {
                panic!("Insufficient balance");
            }
            
            self.balances.write(caller, balance - fiat_amount);

            self.emit(PaymentProcessed { owner: caller, amount: fiat_amount, currency: currency });
        }

        fn is_card_active(self: @ContractState, address: ContractAddress) -> bool {
            let card_info = self.card_owners.read(address);
            card_info.active && get_block_timestamp() < card_info.expiry_timestamp
        }

        // retrieves the address of the contract owner
        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        // retrieves the total number of cards issued
        fn get_total_cards(self: @ContractState) -> u128 {
            self.total_cards.read()
        }
    }
}
