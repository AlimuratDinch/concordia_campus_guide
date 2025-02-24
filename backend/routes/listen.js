
// Create user when the button is clicked
document.getElementById('createUser').addEventListener('click', async () => {
      const userData = {
        netname: 'zidane_2796',
        name: 'zizou',
        email: 'zidane67@gmail.com',
        password: generatePassword()    //Look in the web console for password. 
      };
      console.log(userData);
      try {
        // Send POST request 
        await fetch('http://localhost:3000/user/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // JSON data
          },
          body: JSON.stringify(userData) 
        });

        
        console.log('User created successfully!');
      } catch (error) {
        
        console.error('Error creating user:', error);
      }
    });


    ////

// Sign in user
    document.getElementById('signin').addEventListener('submit', async (event) => {
        event.preventDefault();  
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        try {
          const response = await fetch('/user/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
  
          const data = await response.json();
          if (response.ok) {
            alert('Login successful: ' + data.message);
          } else {
            alert('Login failed: ' + data.message);
          }
        } catch (error) {
          console.error('Error during login:', error);
          alert('Login failed: ' + error.message);
        }
      });
