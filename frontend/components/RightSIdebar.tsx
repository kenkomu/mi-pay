import * as dotenv from 'dotenv';
import { useStarknetkitConnectModal } from "starknetkit";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core"; // Use useDisconnect for proper disconnection
import Image from 'next/image';
import Link from 'next/link';
import BankCard from './BankCard';
import React, { useState, useEffect } from 'react';
import abi from '../app/(root)/MyContractAbi.json'; // Import ABI
import { Account, Contract } from 'starknet'; // Note: Using Account instead of Provider
import { RpcProvider } from 'starknet';

dotenv.config();

const RightSidebar = ({ user, banks }) => {
  const [owner, setOwner] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState<number>(0);  // Auto-incrementing card number
  const [loading, setLoading] = useState<boolean>(false);    // State for loading indication

  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any, // Temporary type cast, replace with proper types if needed
  });

  const { address } = useAccount(); // Get address from useAccount
  const { disconnect } = useDisconnect(); // Get the proper disconnect function from useDisconnect

  const DURATION_IN_DAYS = 7; // Fixed duration for all cards

  // Function to handle wallet connection using the modal
  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal(); // Opens the modal for users to select a connector
    if (connector) {
      await connect({ connector });
    }
  };

  // Function to disconnect the wallet using useDisconnect
  const disconnectWallet = () => {
    disconnect(); // This will properly disconnect the wallet
  };

  // Function to format the wallet address to show the first 5 characters
  const formatAddress = (addr: string | any[]) => {
    return addr ? `${addr.slice(0, 5)}...` : '';
  };

  // Public Blast node rpc 0.7.0 for Sepolia Testnet (0_6 also available)
  const provider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
  });

  // Initialize existing account
  const privateKey = process.env.PRIVKEY;
  const accountAddress = '0x03553b785b4e9a6496118b6341c44700f209c60e50b8db7ef4ba8fb681a05cde';

  // Initialize the account (use Account instead of provider)
  const account = new Account(provider, accountAddress, privateKey);

  // Initialize deployed contract
  const testAddress = '0x41139dd1781e2769a16b9fdb7a074dbb4257aa418d3b22d1a5d66ff59b6b9b1';

  // Connect the contract using the account, not just the provider
  const myTestContract = new Contract(abi, testAddress, account);

  // Fetch the next card number (auto-increment) from the contract
  const fetchCardNumber = async () => {
    try {
      const totalCardsIssued = await myTestContract.total_cards(); // Assume you have a total_cards function
      setCardNumber(parseInt(totalCardsIssued) + 1); // Increment by 1 for the new card number
    } catch (error) {
      console.error('Error fetching total cards:', error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchCardNumber(); // Fetch the card number when the wallet is connected
    }
  }, [address]);

  // Function to issue a new card
  const issueCard = async () => {
    if (!cardNumber || !address) {
      alert('Please ensure you are connected to a wallet and card number is available.');
      return;
    }
    setLoading(true);  // Set loading state when issuing the card
    try {
      // Call issue_card function with auto-incremented card number and fixed duration
      const transaction = await myTestContract.issue_card(cardNumber, DURATION_IN_DAYS);
      await transaction.wait();  // Wait for the transaction to be mined
      console.log('Card issued successfully');
    } catch (error) {
      console.error('Error issuing card:', error);
    } finally {
      setLoading(false);  // Stop loading state
    }
  };

  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">{user.firstName[0]}</span>
          </div>
          <div className="profile-details">
            <h1 className='profile-name'>
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email">
              {user.email}
            </p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between">
          <div>
            {/* If a wallet is connected, show "Disconnect Wallet" */}
            {!address ? (
              <button onClick={connectWallet}>
                Connect Wallet
              </button>
            ) : (
              <button onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            )}

            {/* Show the first 5 characters of the connected address if available */}
            {address && <p>Connected: {formatAddress(address)}</p>}
          </div>

          {/* Show the next card number and duration */}
          {/* <p>Card Number: {cardNumber}</p>
          <p>Duration: {DURATION_IN_DAYS} days</p> */}

          {/* Issue Card Button */}
          <button onClick={issueCard} disabled={!account || loading}>
            {loading ? 'Issuing...' : 'Issue Card'}
          </button>

          <Link href="/" className="flex gap-2">
            <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10'>
              <BankCard
                key={banks[0].$id}
                account={banks[0]}
                userName={`${user.firstName} ${user.lastName}`}
                showBalance={false}
              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${user.firstName} ${user.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
