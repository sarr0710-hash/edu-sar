// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EduCred
 * @dev NFT contract for educational credentials
 */
contract EduCred is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct Certificate {
        address recipient;
        string institution;
        string courseName;
        uint256 issueDate;
        string ipfsCid;
        bool verified;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;

    event CertificateMinted(
        address indexed to,
        uint256 indexed tokenId,
        string institution,
        string courseName
    );

    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);

    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == owner(),
            "Not authorized to issue certificates"
        );
        _;
    }

    constructor() ERC721("EduCred", "EDUCRED") {
        authorizedIssuers[msg.sender] = true;
    }

    /**
     * @dev Mint a new certificate NFT
     */
    function mintCertificate(
        address to,
        string memory institution,
        string memory courseName,
        string memory ipfsCid
    ) public onlyAuthorizedIssuer returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsCid);

        certificates[tokenId] = Certificate({
            recipient: to,
            institution: institution,
            courseName: courseName,
            issueDate: block.timestamp,
            ipfsCid: ipfsCid,
            verified: true
        });

        emit CertificateMinted(to, tokenId, institution, courseName);
        return tokenId;
    }

    /**
     * @dev Get certificate details
     */
    function getCertificate(uint256 tokenId) public view returns (Certificate memory) {
        require(_exists(tokenId), "Certificate does not exist");
        return certificates[tokenId];
    }

    /**
     * @dev Authorize an address to issue certificates
     */
    function authorizeIssuer(address issuer) public onlyOwner {
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    /**
     * @dev Revoke issuer authorization
     */
    function revokeIssuer(address issuer) public onlyOwner {
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    /**
     * @dev Get all token IDs owned by an address
     */
    function getTokensByOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        
        return tokenIds;
    }

    // Override required functions
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}