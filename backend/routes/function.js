
//generating a password
 function generatePassword(length = 8) {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.random() * charset.length;
    const index = Math.floor(randomIndex); 
    const randomCharacter = charset[index]; 
    password += randomCharacter;
  }
  return password;
}
//exporting generate password for web
if (typeof window !== "undefined") {
    window.generatePassword = generatePassword;
  }
  
  // Export generate password for testing
  if (typeof module !== "undefined" && module.exports) {
    module.exports = generatePassword;
  }
    
