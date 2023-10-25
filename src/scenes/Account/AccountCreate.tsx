import React, { useCallback, useEffect, useState } from 'react';
import { generateAccount } from '../../utils/AccountUtils';
import { Account } from '../../models/Account';
import AccountDetail from './AccountDetail';

const recoveryPhraseKeyName = 'recoveryPhrase';



function AccountCreate() {
  const [seedphrase, setSeedphrase] = useState('');
  console.log(seedphrase);
  const [account, setAccount] = useState<Account | null>(null);
  console.log(account)

  const [showRecoverInput, setShowRecoverInput] = useState(false);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSeedphrase(event.target.value);
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      recoverAccount(seedphrase);
    }
  }

  const recoverAccount = useCallback(
    async (recoveryPhrase: string) => {

      const result = await generateAccount(recoveryPhrase);

      setAccount(result.account);

      if (localStorage.getItem(recoveryPhraseKeyName) !== recoveryPhrase) {
        localStorage.setItem(recoveryPhraseKeyName, recoveryPhrase);
      }

    }, []
  );

  useEffect(() => {

    const localStorageRecoveryPhrase = localStorage.getItem(recoveryPhraseKeyName)
    if (localStorageRecoveryPhrase) {
      setSeedphrase(localStorageRecoveryPhrase);
      recoverAccount(localStorageRecoveryPhrase);
    }
  }, [recoverAccount])

  async function createAccount() {
    // Call the generateAccount function with no arguments
    const result = await generateAccount();

    // Update the account state with the newly created account
    setAccount(result.account);
  }
  async function page() {
    window.open("srcecommerce.html")
  }

  return (
    <div className='AccountCreate p-5 m-3 card shadow'>
      <h1>
        Aqua Wallet
      </h1>
      <form onSubmit={event => event.preventDefault()}>
        <button type="button" className="btn btn-primary" onClick={createAccount}>
          Create Account
        </button>
        <button type="button" className="btn btn-outline-primary ml-3"
          onClick={() => showRecoverInput ? recoverAccount(seedphrase) : setShowRecoverInput(true)}
          // if the recoveryinput is showing but there is no seedphrase, disable the ability to recover account
          disabled={showRecoverInput && !seedphrase}
        >
          Recover account
        </button>
        {showRecoverInput && (
          <div className="form-group mt-3">
            <input type="text" placeholder='Seedphrase or private key for recovery' className="form-control"
              value={seedphrase} onChange={handleChange} onKeyDown={handleKeyDown} />
          </div>
        )}
      </form>
      {account &&
        <>
          <hr />
          <AccountDetail account={account} />
        </>
      }

      
      
      
    </div>
  )

}
export default AccountCreate;