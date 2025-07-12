import React, { useState } from 'react';
import { Upload, Download, Send, CheckCircle, AlertCircle, FileText, Loader, Users } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';
import Papa from 'papaparse';
import { contractService } from '../utils/contract';
import { ipfsService } from '../api/ipfs';

interface BulkCertificateData {
  name: string;
  course: string;
  wallet: string;
  institution: string;
}

interface ProcessingResult {
  success: boolean;
  name: string;
  txHash?: string;
  error?: string;
}

const BulkIssue: React.FC = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<BulkCertificateData[]>([]);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [currentProcessing, setCurrentProcessing] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCsvFile(file);
    setCsvData([]);
    setResults([]);

    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = results.data as BulkCertificateData[];
          setCsvData(data.filter(row => row.name && row.course && row.wallet));
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
        }
      });
    }
  };

  const generateCertificatePDF = async (data: BulkCertificateData): Promise<File> => {
    // In a real implementation, you would generate a proper PDF
    // For demo, we'll create a simple text file
    const content = `
CERTIFICATE OF COMPLETION

This is to certify that

${data.name}

has successfully completed the course

${data.course}

Issued by: ${data.institution}
Date: ${new Date().toLocaleDateString()}
Wallet: ${data.wallet}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    return new File([blob], `${data.name}_${data.course.replace(/\s+/g, '_')}.txt`, { type: 'text/plain' });
  };

  const processBulkIssue = async () => {
    if (!csvData.length) return;

    setProcessing(true);
    setResults([]);

    for (let i = 0; i < csvData.length; i++) {
      const data = csvData[i];
      setCurrentProcessing(`Processing ${data.name} (${i + 1}/${csvData.length})`);

      try {
        // Generate certificate file
        const certificateFile = await generateCertificatePDF(data);
        
        // Upload to IPFS
        const ipfsCid = await ipfsService.uploadFile(certificateFile);
        
        // Create metadata
        const metadata = {
          name: `${data.course} Certificate`,
          description: `Academic credential issued by ${data.institution}`,
          image: ipfsService.getFileUrl(ipfsCid),
          attributes: [
            { trait_type: "Institution", value: data.institution },
            { trait_type: "Course", value: data.course },
            { trait_type: "Recipient", value: data.name },
            { trait_type: "Issue Date", value: new Date().toISOString() }
          ]
        };
        
        const metadataCid = await ipfsService.uploadMetadata(metadata);
        
        // Mint certificate
        const txHash = await contractService.mintCertificate(
          data.wallet as `0x${string}`,
          data.institution,
          data.course,
          metadataCid,
          chainId
        );

        setResults(prev => [...prev, {
          success: true,
          name: data.name,
          txHash
        }]);

      } catch (error) {
        setResults(prev => [...prev, {
          success: false,
          name: data.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        }]);
      }

      // Small delay between transactions
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setProcessing(false);
    setCurrentProcessing('');
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      {
        name: 'John Doe',
        course: 'Blockchain Fundamentals',
        wallet: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b',
        institution: 'MIT'
      },
      {
        name: 'Jane Smith',
        course: 'Advanced Cryptography',
        wallet: '0x123456789abcdef123456789abcdef123456789a',
        institution: 'Stanford'
      }
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_certificates.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
              Please connect your MetaMask wallet to issue certificates in bulk.
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
            Bulk Issue Certificates
          </h1>
          <p className="text-xl text-slate-400">
            Issue multiple certificates at once via CSV upload
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">Wallet Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Upload CSV File</h2>
            
            <div className="space-y-6">
              {/* Sample CSV Download */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">CSV Format Required:</h3>
                <p className="text-slate-300 text-sm mb-3">
                  Your CSV must include: name, course, wallet, institution
                </p>
                <button
                  onClick={downloadSampleCSV}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sample CSV</span>
                </button>
              </div>

              {/* File Upload */}
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-file"
                />
                <label
                  htmlFor="csv-file"
                  className="flex items-center justify-center w-full bg-slate-900 border border-slate-600 border-dashed rounded-lg px-4 py-8 text-slate-400 hover:border-purple-500 hover:text-purple-400 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    {csvFile ? (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-6 h-6 text-green-400" />
                        <span className="text-green-400">{csvFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-sm">Click to upload CSV file</div>
                        <div className="text-xs text-slate-500 mt-1">Supports .csv files only</div>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Data Preview */}
              {csvData.length > 0 && (
                <div>
                  <h3 className="text-white font-semibold mb-3">
                    Preview ({csvData.length} certificates)
                  </h3>
                  <div className="bg-slate-900/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    {csvData.slice(0, 3).map((row, index) => (
                      <div key={index} className="text-sm text-slate-300 mb-2">
                        {row.name} - {row.course} → {row.wallet.slice(0, 6)}...
                      </div>
                    ))}
                    {csvData.length > 3 && (
                      <div className="text-xs text-slate-500">
                        ...and {csvData.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Process Button */}
              <button
                onClick={processBulkIssue}
                disabled={!csvData.length || processing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Issue All Certificates</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Processing Results</h2>
            
            {processing && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-400">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{currentProcessing}</span>
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.success
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div className="flex-1">
                        <div className={`font-medium ${
                          result.success ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {result.name}
                        </div>
                        {result.success && result.txHash && (
                          <div className="text-xs text-slate-400 font-mono">
                            {result.txHash.slice(0, 10)}...{result.txHash.slice(-8)}
                          </div>
                        )}
                        {!result.success && result.error && (
                          <div className="text-xs text-red-300">
                            {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!processing && results.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  Upload a CSV file to start bulk issuing certificates
                </p>
              </div>
            )}

            {results.length > 0 && !processing && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {results.filter(r => r.success).length}
                    </div>
                    <div className="text-slate-400 text-sm">Successful</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">
                      {results.filter(r => !r.success).length}
                    </div>
                    <div className="text-slate-400 text-sm">Failed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkIssue;