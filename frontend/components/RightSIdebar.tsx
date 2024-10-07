import * as dotenv from 'dotenv';
import { useStarknetkitConnectModal } from "starknetkit";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core"; // Use useDisconnect for proper disconnection
import Image from 'next/image';
import Link from 'next/link';
import BankCard from './BankCard';
import React, { useState } from 'react';
import abi from '../app/(root)/MyContractAbi.json'; // Import ABI
import { Account, Contract } from 'starknet'; // Note: Using Account instead of Provider
import { RpcProvider } from 'starknet';

dotenv.config();

const RightSidebar = ({ user, banks }) => {
  const [owner, setOwner] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // State for loading indication
  const [cardDetails, setCardDetails] = useState<any>(null); // To store card details after creation

  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any, // Temporary type cast, replace with proper types if needed
  });

  const { address } = useAccount(); // Get address from useAccount
  const { disconnect } = useDisconnect(); // Get the proper disconnect function from useDisconnect

  const DURATION_IN_DAYS = 7; // Fixed duration for all cards

  // Function to format the wallet address to show the first 5 and last 4 characters
  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 5)}...${addr.slice(-4)}` : '';
  };

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

  // Function to issue a new card via Stripe instead of blockchain
  const issueCard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardholderName: 'kenkomu' }), // Fixed cardholder name
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setCardDetails(data.virtualCard);
      console.log('Card created successfully:', data.virtualCard);
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setLoading(false);
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

            {/* Show the first 5 and last 4 characters of the connected address if available */}
            {address && <p>Connected: {formatAddress(address)}</p>}
          </div>

          {/* Issue Card Button */}
          <button onClick={issueCard} disabled={loading}>
            {loading ? 'Issuing...' : 'Issue Card'}
          </button>

          <Link href="/" className="flex gap-2">
            <Image src="/icons/plus.svg" width={20} height={20} alt="plus" />
          </Link>
        </div>

        {cardDetails && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10'>
              {/* Displaying the card details in BankCard component */}
              <BankCard
                key={cardDetails.id}
                account={cardDetails}
                userName={`${user.firstName} ${user.lastName}`}
                cardNumber={cardDetails.last4} // Only last 4 digits for security
                expiration={`${cardDetails.exp_month}/${cardDetails.exp_year}`}
                showBalance={false}
              />
            </div>
          </div>
        )}

        {banks?.length > 0 && !cardDetails && (
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
