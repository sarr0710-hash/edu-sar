interface VoiceResponse {
  message: string;
  action?: () => void;
}

class VoiceAgent {
  processCommand(command: string): Promise<VoiceResponse> {
    return new Promise((resolve) => {
      const lowerCommand = command.toLowerCase();
      
      // Certificate viewing commands
      if (lowerCommand.includes('show') && (lowerCommand.includes('certificate') || lowerCommand.includes('credential'))) {
        resolve({
          message: "I'll show you your certificates. Navigating to your certificate portfolio now.",
          action: () => window.location.href = '/my-certificates'
        });
        return;
      }
      
      // Certificate verification commands
      if (lowerCommand.includes('verify') && lowerCommand.includes('certificate')) {
        const tokenMatch = lowerCommand.match(/token\s+(\d+)/);
        if (tokenMatch) {
          const tokenId = tokenMatch[1];
          resolve({
            message: `I'll verify certificate token ${tokenId} for you. Navigating to the verification page.`,
            action: () => {
              window.location.href = '/verify';
              // In a real implementation, you could pre-fill the token ID
            }
          });
        } else {
          resolve({
            message: "I'll take you to the certificate verification page where you can enter a token ID.",
            action: () => window.location.href = '/verify'
          });
        }
        return;
      }
      
      // Certificate issuance commands
      if (lowerCommand.includes('issue') && (lowerCommand.includes('certificate') || lowerCommand.includes('credential'))) {
        resolve({
          message: "I'll help you issue a new certificate. Taking you to the certificate issuance page.",
          action: () => window.location.href = '/issue'
        });
        return;
      }
      
      // Bulk issuance commands
      if (lowerCommand.includes('bulk') && lowerCommand.includes('issue')) {
        resolve({
          message: "I'll take you to the bulk certificate issuance page where you can upload a CSV file.",
          action: () => window.location.href = '/bulk-issue'
        });
        return;
      }
      
      // Navigation commands
      if (lowerCommand.includes('home') || lowerCommand.includes('dashboard')) {
        resolve({
          message: "Taking you to the home page.",
          action: () => window.location.href = '/'
        });
        return;
      }
      
      if (lowerCommand.includes('admin')) {
        resolve({
          message: "Navigating to the admin dashboard.",
          action: () => window.location.href = '/admin'
        });
        return;
      }
      
      // Help commands
      if (lowerCommand.includes('help') || lowerCommand.includes('guide') || lowerCommand.includes('how')) {
        resolve({
          message: "I can help you with certificate management on EduCred. You can ask me to show your certificates, verify a certificate by token ID, issue new certificates, or navigate to different sections of the platform. What would you like to do?"
        });
        return;
      }
      
      // Greeting commands
      if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('hey')) {
        resolve({
          message: "Hello! I'm your EduCred voice assistant. I can help you manage certificates, verify credentials, and navigate the platform. What would you like to do today?"
        });
        return;
      }
      
      // Default response
      resolve({
        message: "I'm not sure I understood that command. You can ask me to show your certificates, verify a certificate, issue new certificates, or get help with navigation. What would you like to do?"
      });
    });
  }
}

export const voiceAgent = new VoiceAgent();