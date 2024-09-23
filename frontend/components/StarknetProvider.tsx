import React from "react";
import { Account, Provider, Contract } from 'starknet'; 
import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { mainnet, sepolia } from "@starknet-react/chains";
import { StarknetConfig, publicProvider } from "@starknet-react/core";
import abi from '../app/(root)/MyContractAbi.json'; // Import ABI

interface StarknetProviderProps {
    children: React.ReactNode;
}

export default function StarknetProvider({children}: StarknetProviderProps) {
    const chains = [
        mainnet, sepolia
    ]
    const connectors = isInArgentMobileAppBrowser() ? [
      ArgentMobileConnector.init({
        options: {
            dappName: "Example dapp",
            projectId: "example-project-id",
            url: ""
        },
        inAppBrowserOptions: {},
      })
    ] : [
        new InjectedConnector({ options: {id: "braavos", name: "Braavos" }}),
        new InjectedConnector({ options: {id: "argentX", name: "Argent X" }}),
        new WebWalletConnector({ url: "https://web.argent.xyz" }),
        ArgentMobileConnector.init({
          options: {
              dappName: "Example dapp",
              projectId: "example-project-id",
              url: ""
          },
          inAppBrowserOptions: {},
        })
    ]

    // // Use the Provider class with the rpc URL
    // const provider = new Provider({
    //   rpc: { nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7' },
    // });
  
    // const privateKey = process.env.ACCOUNT_PRIVKEY;
  
    // const accountAddress = '0x03553b785b4e9a6496118b6341c44700f209c60e50b8db7ef4ba8fb681a05cde';
  
    // // Initialize the account
    // const account = new Account(provider, accountAddress, privateKey);
  
    // // Initialize deployed contract
    // const testAddress = '0x29724d03151eff483f60b7f556593beb1f600bac9b5372240f924bc5b07fe18';
  
    // // Connect the contract
    // const myTestContract = new Contract(abi, testAddress, provider);
  

    return(
        <StarknetConfig
        chains={chains}
        provider={publicProvider()}
        connectors={connectors}
        >
          {children}
        </StarknetConfig>
    )
}