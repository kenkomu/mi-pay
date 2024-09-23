import * as dotenv from 'dotenv';
import { useStarknetkitConnectModal } from "starknetkit";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core"; // Use useDisconnect for proper disconnection
import Image from 'next/image';
import Link from 'next/link';
import BankCard from './BankCard';
import React, { useState } from 'react';
import abi from '../app/(root)/MyContractAbi.json'; // Import ABI
import { Account, Provider, Contract } from 'starknet'; // Note: Using Provider here
import { RpcProvider } from 'starknet';

dotenv.config();

const RightSidebar = ({ user, banks }) => {
  const [owner, setOwner] = useState<string | null>(null);

  const { connect, connectors } = useConnect();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any, // Temporary type cast, replace with proper types if needed
  });

  const { address } = useAccount(); // Get address from useAccount
  const { disconnect } = useDisconnect(); // Get the proper disconnect function from useDisconnect

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

  // Public Blast node rpc 0.7.0 for Sepolia Testnet (0_6 also available) :
  const provider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
  });
  // initialize existing account
  const privateKey = process.env.PRIVKEY;
  const accountAddress = '0x03553b785b4e9a6496118b6341c44700f209c60e50b8db7ef4ba8fb681a05cde';

  // Initialize the account
  const account = new Account(provider, accountAddress, privateKey);

  // Initialize deployed contract
  const testAddress = '0x29724d03151eff483f60b7f556593beb1f600bac9b5372240f924bc5b07fe18';

  // Connect the contract
  const myTestContract = new Contract(abi, testAddress, provider);

  // Function to call get_owner on the contract
  const issueCard = async () => {
    try {
      const ownerAddress = await myTestContract.get_owner(); // Call the contract's get_owner function
      setOwner(ownerAddress); // Store the owner address in state
      console.log('Owner address:', ownerAddress); // Log the result
    } catch (error) {
      console.error('Error fetching owner:', error);
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
          <button onClick={issueCard} disabled={!account}>
            Issue Card
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
        <button onClick={issueCard} disabled={!account}>
            IsCardActive
          </button>
      </section>
    </aside>
  );
};

export default RightSidebar;
