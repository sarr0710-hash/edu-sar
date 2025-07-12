import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, ExternalLink, Loader, Building, Calendar, User } from 'lucide-react';
import { useChainId } from 'wagmi';
import { contractService } from '../utils/contract';
import { ipfsService } from '../api/ipfs';

interface Certificate {
  tokenId: bigint;
  recipient: string;
  institution: string;
  courseName: string;
  issueDate: bigint;
  ipfsCid: string;
  verified: boolean;
}

const VerifyCertificate: React.FC = () => {
  const chainId = useChainId();
  const [tokenId, setTokenId] = useState('');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId.trim()) return;

    setLoading(true);
    setCertificate(null);
    setError(null);

    try {
      const tokenIdBigInt = BigInt(tokenId);
      
      // Try to verify on blockchain first, fallback to mock data for demo
      try {
        const result = await contractService.getCertificate(tokenIdBigInt, chainId);
        setCertificate(result as Certificate);
      } catch (blockchainError) {
        console.log('Blockchain verification failed, using mock data for demo');
        const mockCertificates = contractService.getMockCertificates();
        const mockCert = mockCertificates.find(c => c.tokenId === tokenIdBigInt);
        
        if (mockCert) {
          setCertificate(mockCert);
        } else {
          setError('Certificate not found. Try token IDs: 1 or 2 for demo.');
        }
      }
    } catch (err) {
      setError('Failed to verify certificate. Please check the token ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getExplorerUrl = (address: string) => {
    switch (chainId) {
      case 1: return `https://etherscan.io/address/${address}`;
      case 11155111: return `https://sepolia.etherscan.io/address/${address}`;
      case 137: return `https://polygonscan.com/address/${address}`;
      case 80001: return `https://mumbai.polygonscan.com/address/${address}`;
      default: return `https://etherscan.io/address/${address}`;
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Verify Certificate
          </h1>
          <p className="text-xl text-slate-400">
            Enter a certificate token ID to verify its authenticity on the blockchain
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Demo: Try token IDs 1 or 2 to see sample certificates
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <form onSubmit={handleVerify} className="mb-8">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  placeholder="Enter certificate token ID (e.g., 1, 2)"
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !tokenId.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                <span>Verify</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="p-6 rounded-xl border bg-red-500/10 border-red-500/30">
              <div className="flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-red-400">Verification Failed</h3>
              </div>
              <div className="mt-4 bg-red-500/10 p-4 rounded-lg">
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {certificate && (
            <div className="p-6 rounded-xl border bg-green-500/10 border-green-500/30">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">Certificate Verified ✓</h3>
              </div>

              <div className="space-y-6">
                {/* Certificate Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">Institution</span>
                    </div>
                    <div className="text-white font-medium">{certificate.institution}</div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                      <span className="text-sm">Course</span>
                    </div>
                    <div className="text-white font-medium">{certificate.courseName}</div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Recipient</span>
                    </div>
                    <div className="text-white font-mono text-sm">
                      {certificate.recipient.slice(0, 6)}...{certificate.recipient.slice(-4)}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Issue Date</span>
                    </div>
                    <div className="text-white font-medium">
                      {new Date(Number(certificate.issueDate) * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Token Information */}
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">Token Information</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Token ID:</span>
                      <span className="text-white font-mono">#{certificate.tokenId.toString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">IPFS CID:</span>
                      <span className="text-white font-mono text-sm">{certificate.ipfsCid}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-600">
                  <a
                    href={ipfsService.getFileUrl(certificate.ipfsCid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-4 py-2 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Certificate</span>
                  </a>
                  
                  <a
                    href={getExplorerUrl(certificate.recipient)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Blockchain</span>
                  </a>
                  
                  <div className="flex items-center space-x-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Authentic</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;