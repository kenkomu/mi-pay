"use client"

// import { useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import RightSidebar from "@/components/RightSIdebar";
import TotalBalanceBox from '@/components/TotalBalanceBox';
import TransactionHistory from "@/components/transaction_history";
import { Account, Contract } from 'starknet'; // Note: Using Provider here
import abi from './MyContractAbi.json'; // Import ABI
import * as dotenv from 'dotenv';
import StarknetProvider from '../../components/StarknetProvider'; // Import StarknetProvider component
import { RpcProvider } from 'starknet';


dotenv.config();

const Home = () => {
  // const [owner, setOwner] = useState<string | null>(null);

  // Use the Provider class with the rpc URL
  const provider = new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7',
  });

  const privateKey = process.env.ACCOUNT_PRIVKEY;

  const accountAddress = '0x03553b785b4e9a6496118b6341c44700f209c60e50b8db7ef4ba8fb681a05cde';

  // Initialize the account
  // const account = new Account(provider, accountAddress, privateKey);

  // Initialize deployed contract
  const testAddress = '0x29724d03151eff483f60b7f556593beb1f600bac9b5372240f924bc5b07fe18';

  // Connect the contract
  const myTestContract = new Contract(abi, testAddress, provider);

  // Function to call get_owner on the contract
  // const issueCard = async () => {
  //   try {
  //     const ownerAddress = await myTestContract.get_owner(); // Call the contract's get_owner function
  //     setOwner(ownerAddress); // Store the owner address in state
  //     console.log('Owner address:', ownerAddress); // Log the result
  //   } catch (error) {
  //     console.error('Error fetching owner:', error);
  //   }
  // };

  const loggedIn = { firstName: 'ken', lastName: 'Komu', email: 'contact@kenkomu.pro' };

  return (
    <StarknetProvider> {/* Wrap the content with StarknetProvider */}
      <section className="home">
        <div className="home-content">
{/*           
          <button onClick={issueCard} disabled={!account}>
            Issue Card
          </button> */}

          
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={loggedIn?.firstName || 'Guest'}
              subtext="Access and manage your account and transactions efficiently."
            />

            <TotalBalanceBox
              accounts={[]}
              totalBanks={1}
              totalCurrentBalance={1250.35}
            />
          </header>

          <div>
            <TransactionHistory />
          </div>

        </div>

        <RightSidebar
          user={loggedIn}
          banks={[{ currentBalance: 123.50 }, { currentBalance: 500.50 }]}
        />
      </section>
    </StarknetProvider>
  );
};

export default Home;
