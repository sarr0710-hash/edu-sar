import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Share2, Eye, Calendar, Building, AlertCircle } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
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

const MyCertificates: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadCertificates();
    }
  }, [isConnected, address, chainId]);

  const loadCertificates = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      // Try to load from blockchain, fallback to mock data for demo
      try {
        const tokenIds = await contractService.getOwnerTokens(address as `0x${string}`, chainId);
        const certs: Certificate[] = [];
        
        for (const tokenId of tokenIds) {
          try {
            const cert = await contractService.getCertificate(tokenId, chainId);
            certs.push(cert as Certificate);
          } catch (error) {
            console.error(`Failed to get certificate ${tokenId}:`, error);
          }
        }
        
        setCertificates(certs);
      } catch (error) {
        console.log('Blockchain query failed, using mock data for demo');
        const mockCertificates = contractService.getMockCertificates();
        setCertificates(mockCertificates);
      }
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareCertificate = (certificate: Certificate) => {
    const shareUrl = `${window.location.origin}/verify`;
    const shareText = `Check out my verified ${certificate.courseName} certificate from ${certificate.institution}! Verify it at ${shareUrl} using token ID: ${certificate.tokenId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Blockchain Credential',
        text: shareText,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Share link copied to clipboard!');
    }
  };

  const viewCertificate = (certificate: Certificate) => {
    const url = ipfsService.getFileUrl(certificate.ipfsCid);
    window.open(url, '_blank');
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
              Connect your wallet to view and manage your blockchain credentials
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            My Certificates
          </h1>
          <p className="text-xl text-slate-400">
            Your verified blockchain credentials portfolio
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <Award className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading your certificates...</span>
            </div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No Certificates Found</h3>
            <p className="text-slate-500 mb-6">
              You don't have any blockchain certificates yet. Complete a course to earn your first credential!
            </p>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="text-blue-400 font-semibold mb-2">Demo Mode:</h4>
              <p className="text-slate-300 text-sm">
                This demo shows mock certificates. In production, your actual NFT certificates would appear here.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((certificate) => (
                <div
                  key={certificate.tokenId.toString()}
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Award className="w-6 h-6 text-purple-400" />
                      <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                        Token #{certificate.tokenId.toString()}
                      </span>
                    </div>
                    {certificate.verified && (
                      <div className="flex items-center space-x-1 text-green-400 text-xs">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                      {certificate.courseName}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">{certificate.institution}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(Number(certificate.issueDate) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => viewCertificate(certificate)}
                      className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    
                    <button
                      onClick={() => shareCertificate(certificate)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>IPFS: {certificate.ipfsCid.slice(0, 8)}...</span>
                      <a
                        href={ipfsService.getFileUrl(certificate.ipfsCid)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 hover:text-purple-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>IPFS</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{certificates.length}</div>
                <div className="text-slate-400 text-sm">Total Certificates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {new Set(certificates.map(c => c.institution)).size}
                </div>
                <div className="text-slate-400 text-sm">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {certificates.filter(c => c.verified).length}
                </div>
                <div className="text-slate-400 text-sm">Verified</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;