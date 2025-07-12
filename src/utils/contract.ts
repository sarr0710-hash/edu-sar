import { createPublicClient, createWalletClient, custom, http, parseEther } from 'viem';
import { sepolia, polygonMumbai } from 'viem/chains';
import { EDUCRED_ABI } from '../abi/EduCredABI';

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b',
  [polygonMumbai.id]: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b'
} as const;

export class ContractService {
  private getContractAddress(chainId: number): `0x${string}` {
    const address = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    if (!address) {
      throw new Error(`Contract not deployed on chain ${chainId}`);
    }
    return address as `0x${string}`;
  }

  private getPublicClient(chainId: number) {
    const chain = chainId === sepolia.id ? sepolia : polygonMumbai;
    return createPublicClient({
      chain,
      transport: http()
    });
  }

  private getWalletClient(chainId: number) {
    const chain = chainId === sepolia.id ? sepolia : polygonMumbai;
    return createWalletClient({
      chain,
      transport: custom(window.ethereum!)
    });
  }

  async mintCertificate(
    recipientAddress: `0x${string}`,
    institution: string,
    courseName: string,
    ipfsCid: string,
    chainId: number
  ): Promise<string> {
    try {
      const contractAddress = this.getContractAddress(chainId);
      const walletClient = this.getWalletClient(chainId);
      
      const [account] = await walletClient.getAddresses();
      
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: EDUCRED_ABI,
        functionName: 'mintCertificate',
        args: [recipientAddress, institution, courseName, ipfsCid],
        account
      });

      return hash;
    } catch (error) {
      console.error('Failed to mint certificate:', error);
      throw new Error('Failed to mint certificate on blockchain');
    }
  }

  async getCertificate(tokenId: bigint, chainId: number) {
    try {
      const contractAddress = this.getContractAddress(chainId);
      const publicClient = this.getPublicClient(chainId);

      const result = await publicClient.readContract({
        address: contractAddress,
        abi: EDUCRED_ABI,
        functionName: 'getCertificate',
        args: [tokenId]
      });

      return result;
    } catch (error) {
      console.error('Failed to get certificate:', error);
      throw error;
    }
  }

  async getOwnerTokens(ownerAddress: `0x${string}`, chainId: number): Promise<bigint[]> {
    try {
      const contractAddress = this.getContractAddress(chainId);
      const publicClient = this.getPublicClient(chainId);

      const balance = await publicClient.readContract({
        address: contractAddress,
        abi: EDUCRED_ABI,
        functionName: 'balanceOf',
        args: [ownerAddress]
      }) as bigint;

      const tokens: bigint[] = [];
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await publicClient.readContract({
          address: contractAddress,
          abi: EDUCRED_ABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [ownerAddress, BigInt(i)]
        }) as bigint;
        tokens.push(tokenId);
      }

      return tokens;
    } catch (error) {
      console.error('Failed to get owner tokens:', error);
      return [];
    }
  }

  async getTokenURI(tokenId: bigint, chainId: number): Promise<string> {
    try {
      const contractAddress = this.getContractAddress(chainId);
      const publicClient = this.getPublicClient(chainId);

      const uri = await publicClient.readContract({
        address: contractAddress,
        abi: EDUCRED_ABI,
        functionName: 'tokenURI',
        args: [tokenId]
      }) as string;

      return uri;
    } catch (error) {
      console.error('Failed to get token URI:', error);
      throw error;
    }
  }

  // Mock data for demo when contract is not available
  getMockCertificates() {
    return [
      {
        tokenId: 1n,
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b',
        institution: 'MIT',
        courseName: 'Blockchain Fundamentals',
        issueDate: BigInt(Math.floor(Date.now() / 1000)),
        ipfsCid: 'bafybeiexample1',
        verified: true
      },
      {
        tokenId: 2n,
        recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b',
        institution: 'Stanford University',
        courseName: 'Advanced Cryptography',
        issueDate: BigInt(Math.floor(Date.now() / 1000)),
        ipfsCid: 'bafybeiexample2',
        verified: true
      }
    ];
  }
}

export const contractService = new ContractService();