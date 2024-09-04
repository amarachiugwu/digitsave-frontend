import Web3 from 'web3';
import { type Config, getClient } from '@wagmi/core';
import type { Client, Chain, Transport } from 'viem';

export function clientToWeb3Provider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;

  // Determine the provider URL based on transport type
  let providerUrl;

  // Handling fallback transports
  if (transport.type === 'fallback') {
    const fallbackTransport = (transport.transports as ReturnType<Transport>[]);
    providerUrl = fallbackTransport[0]?.value?.url; // Use the first URL for simplicity, or handle multiple as needed
  } else {
    providerUrl = transport.url;
  }

  if (!providerUrl) {
    throw new Error('No provider URL found for the transport.');
  }

  // Initialize Web3 with the provider URL
  const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
  return web3;
}

/** Action to convert a viem Public Client to a web3.js Provider. */
export function getWeb3Provider(config: Config, { chainId }: { chainId?: number } = {}) {
  const client = getClient(config, { chainId });
  if (!client) return;
  return clientToWeb3Provider(client);
}
