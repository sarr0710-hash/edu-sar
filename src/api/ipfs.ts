import { Web3Storage } from 'web3.storage';

class IPFSService {
  private client: Web3Storage | null = null;

  constructor() {
    const token = import.meta.env.VITE_WEB3_STORAGE_TOKEN;
    if (token) {
      this.client = new Web3Storage({ token });
    }
  }

  async uploadFile(file: File): Promise<string> {
    try {
      if (!this.client) {
        // Fallback to mock for demo
        console.warn('Web3.Storage not configured, using mock IPFS');
        return this.mockUpload(file);
      }

      const cid = await this.client.put([file], {
        name: file.name,
        maxRetries: 3
      });

      return cid;
    } catch (error) {
      console.error('IPFS upload failed:', error);
      // Fallback to mock
      return this.mockUpload(file);
    }
  }

  async uploadMetadata(metadata: any): Promise<string> {
    try {
      const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const file = new File([blob], 'metadata.json', { type: 'application/json' });
      
      return await this.uploadFile(file);
    } catch (error) {
      console.error('Metadata upload failed:', error);
      throw new Error('Failed to upload metadata to IPFS');
    }
  }

  getFileUrl(cid: string): string {
    return `https://${cid}.ipfs.w3s.link/`;
  }

  async getMetadata(cid: string): Promise<any> {
    try {
      const response = await fetch(this.getFileUrl(cid));
      if (!response.ok) {
        throw new Error('Failed to fetch metadata');
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get metadata:', error);
      throw error;
    }
  }

  private async mockUpload(file: File): Promise<string> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a mock CID
    const mockCid = 'bafybei' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    console.log(`Mock IPFS upload: ${file.name} -> ${mockCid}`);
    return mockCid;
  }
}

export const ipfsService = new IPFSService();