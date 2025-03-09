
//generating a password
function generatePassword(length = 8) {
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    const randomValues = new Uint32Array(length);
    
    // Generate random values
    window.crypto.getRandomValues(randomValues);
  
    for (let i = 0; i < length; i++) {
      const index = randomValues[i] % charset.length; 
      password += charset[index];
    }
    
    return password;
  }
//exporting generate password for web
if (typeof window !== "undefined") {
    window.generatePassword = generatePassword;
  }
  
  
    
