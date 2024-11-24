import * as dotenv from 'dotenv';
import { useStarknetkitConnectModal } from "starknetkit";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import Image from 'next/image';
import Link from 'next/link';
import BankCard from './BankCard';
import React, { useState } from 'react';

dotenv.config();

// Define interfaces for your data structures
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Bank {
  $id: string;
  // Add other bank properties as needed
}

interface CardDetails {
  id: string;
  last4: string;
  exp_month: string;
  exp_year: string;
}

interface RightSidebarProps {
  user: User; // Changed from string to User interface
  banks: Bank[]; // Changed from string to Bank[] array
}

const RightSidebar: React.FC<RightSidebarProps> = ({ user, banks }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);

  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any,
  });

  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 5)}...${addr.slice(-4)}` : '';
  };

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    if (connector) {
      await connect({ connector });
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const issueCard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardholderName: 'kenkomu' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCardDetails(data.virtualCard);
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
            {!address ? (
              <button onClick={connectWallet}>
                Connect Wallet
              </button>
            ) : (
              <button onClick={disconnectWallet}>
                Disconnect Wallet
              </button>
            )}
            {address && <p>Connected: {formatAddress(address)}</p>}
          </div>
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
              <BankCard
                userName={`${user.firstName} ${user.lastName}`}
                cardNumber={cardDetails.last4}
                expiration={`${cardDetails.exp_month}/${cardDetails.exp_year}`}
              />
            </div>
          </div>
        )}

        {banks?.length > 0 && !cardDetails && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            <div className='relative z-10'>
              <BankCard
                userName={`${user.firstName} ${user.lastName}`}
                cardNumber="****" expiration={''}              />
            </div>
            {banks[1] && (
              <div className="absolute right-0 top-8 z-0 w-[90%]">
                <BankCard
                  userName={`${user.firstName} ${user.lastName}`}
                  cardNumber="****" expiration={''}                />
              </div>
            )}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;