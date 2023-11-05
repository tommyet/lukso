import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '../contexts/GlobalContext';

function Login() {
  const router = useRouter();
  const { setAccount, account } = useContext(GlobalContext);

  // IF the user clicks the LOGIN BUTTON
  async function loginExtension() {
    if (!window.ethereum) {
      alert('Please connect to Universal Profile Extension or MetaMask');
      return;
    }

    try {
      // request access to the extension
      await window.ethereum
        .request({
          method: 'eth_requestAccounts',
        })

        .then(function (accounts) {
          // check if any number of accounts was returned
          // IF go to the dashboard
          if (accounts.length) {
            router.push('/browse');            
            setAccount(accounts[0]);
          } else {
            console.log('User denied access');
          }
        });
    } catch (error) {
      if (error.message === 'User denied access') {
        console.log('User denied access');
      } else {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (account) {
      router.push('/browse');
    }
  }, [account]);

  return (
    <div className="App">
      <h2>you Lukso popular</h2>
      <h3 className="centered">
        Vote, rank, and stake your creations popularity!
      </h3>
      <br />
      <button onClick={loginExtension}>Log in to your browser extension</button>
    </div>
  );
}

export default Login;
