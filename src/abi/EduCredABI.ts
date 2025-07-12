export const EDUCRED_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string", "name": "institution", "type": "string"},
      {"internalType": "string", "name": "courseName", "type": "string"},
      {"internalType": "string", "name": "ipfsCid", "type": "string"}
    ],
    "name": "mintCertificate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getCertificate",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "recipient", "type": "address"},
          {"internalType": "string", "name": "institution", "type": "string"},
          {"internalType": "string", "name": "courseName", "type": "string"},
          {"internalType": "uint256", "name": "issueDate", "type": "uint256"},
          {"internalType": "string", "name": "ipfsCid", "type": "string"},
          {"internalType": "bool", "name": "verified", "type": "bool"}
        ],
        "internalType": "struct EduCred.Certificate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "index", "type": "uint256"}
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "institution", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "courseName", "type": "string"}
    ],
    "name": "CertificateMinted",
    "type": "event"
  }
] as const;