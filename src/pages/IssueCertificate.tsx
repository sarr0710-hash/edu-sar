import React, { useState } from 'react';
import { Upload, Send, CheckCircle, AlertCircle, FileText, Loader, ExternalLink } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import { contractService } from '../utils/contract';
import { ipfsService } from '../api/ipfs';

const IssueCertificate: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [formData, setFormData] = useState({
    recipientAddress: '',
    institution: '',
    courseName: '',
    certificateFile: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; txHash?: string; ipfsCid?: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, certificateFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setResult({ success: false, message: 'Please connect your wallet first' });
      return;
    }

    if (!formData.certificateFile) {
      setResult({ success: false, message: 'Please select a certificate file' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Step 1: Upload certificate file to IPFS
      setResult({ success: true, message: 'Uploading certificate to IPFS...' });
      const ipfsCid = await ipfsService.uploadFile(formData.certificateFile);
      
      // Step 2: Create and upload metadata
      const metadata = {
        name: `${formData.courseName} Certificate`,
        description: `Academic credential issued by ${formData.institution}`,
        image: ipfsService.getFileUrl(ipfsCid),
        attributes: [
          { trait_type: "Institution", value: formData.institution },
          { trait_type: "Course", value: formData.courseName },
          { trait_type: "Issue Date", value: new Date().toISOString() },
          { trait_type: "Certificate CID", value: ipfsCid }
        ]
      };
      
      const metadataCid = await ipfsService.uploadMetadata(metadata);
      
      // Step 3: Mint the NFT on blockchain
      setResult({ success: true, message: 'Minting certificate on blockchain...' });
      const txHash = await contractService.mintCertificate(
        formData.recipientAddress as `0x${string}`,
        formData.institution,
        formData.courseName,
        metadataCid,
        chainId
      );

      setResult({
        success: true,
        message: 'Certificate successfully minted on blockchain!',
        txHash,
        ipfsCid
      });

      // Reset form
      setFormData({
        recipientAddress: '',
        institution: '',
        courseName: '',
        certificateFile: null
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to mint certificate'
      });
    } finally {
      setLoading(false);
    }
  };

  const getExplorerUrl = (txHash: string) => {
    switch (chainId) {
      case 1: return `https://etherscan.io/tx/${txHash}`;
      case 11155111: return `https://sepolia.etherscan.io/tx/${txHash}`;
      case 137: return `https://polygonscan.com/tx/${txHash}`;
      case 80001: return `https://mumbai.polygonscan.com/tx/${txHash}`;
      default: return `https://etherscan.io/tx/${txHash}`;
    }
  };

  if (!isConnected) {
    return (
      <div className="pt-16 min-h-screen bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Wallet Connection Required
            </h2>
            <p className="text-slate-400 mb-8">
              Please connect your MetaMask wallet to issue certificates on the blockchain.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Issue Certificate
          </h1>
          <p className="text-xl text-slate-400">
            Create and mint blockchain certificates as NFTs
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Recipient Wallet Address *
              </label>
              <input
                type="text"
                name="recipientAddress"
                value={formData.recipientAddress}
                onChange={handleInputChange}
                placeholder="0x..."
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <p className="text-xs text-slate-500 mt-1">The Ethereum address that will receive the certificate NFT</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Institution Name *
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="e.g., MIT, Stanford University, NPTEL"
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="e.g., Blockchain Fundamentals, Machine Learning"
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Certificate File (PDF/Image) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  id="certificate-file"
                  required
                />
                <label
                  htmlFor="certificate-file"
                  className="flex items-center justify-center w-full bg-slate-900 border border-slate-600 border-dashed rounded-lg px-4 py-8 text-slate-400 hover:border-purple-500 hover:text-purple-400 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    {formData.certificateFile ? (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-6 h-6 text-green-400" />
                        <span className="text-green-400">{formData.certificateFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Click to upload certificate</div>
                        <div className="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG (max 10MB)</div>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Issue Certificate</span>
                </>
              )}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-6 rounded-lg border ${
              result.success 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start space-x-3">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className={`font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    {result.message}
                  </div>
                  {result.txHash && (
                    <div className="mt-2 space-y-2">
                      <div className="text-sm text-slate-400">
                        Transaction Hash: 
                        <span className="font-mono ml-2">{result.txHash.slice(0, 10)}...{result.txHash.slice(-8)}</span>
                      </div>
                      {result.ipfsCid && (
                        <div className="text-sm text-slate-400">
                          IPFS CID: 
                          <span className="font-mono ml-2">{result.ipfsCid}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <a
                          href={getExplorerUrl(result.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm bg-purple-500/10 px-3 py-1 rounded-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View on Blockchain</span>
                        </a>
                        {result.ipfsCid && (
                          <a
                            href={ipfsService.getFileUrl(result.ipfsCid)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm bg-blue-500/10 px-3 py-1 rounded-lg"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View on IPFS</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;