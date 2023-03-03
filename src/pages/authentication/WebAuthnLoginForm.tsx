import useHttpRequest, { RequestDataType } from '@src/hooks/useHttpRequest';
import { coerceToArrayBuffer, coerceToBase64Url } from '@src/utils/site';

interface IRegisterOptions {
  rp: {
    id: string;
    name: string;
  };
  user: {
    name: string;
    id: string;
    displayName: string;
  };
  challenge: string;
  pubKeyCredParams: [
    {
      type: string;
      alg: number;
    }
  ];
  timeout: number;
  attestation: string;
  authenticatorSelection: {
    requireResidentKey: boolean;
    userVerification: string;
  };
  excludeCredentials: [];
  status: string;
  errorMessage: string;
}
export const WebAuthnLoginForm = () => {
  const httpRequestFormData = useHttpRequest(RequestDataType.formData);
  let credentialOptions: any;

  async function handleRegisterSubmit(event: any) {
    event.preventDefault();
    // send to server for registering
    try {
      credentialOptions = await fetchMakeCredentialOptions();
    } catch (e) {
      console.error(e);
      alert('Something went really wrong');
      return;
    }
    if (credentialOptions.status !== 'ok') {
      alert(credentialOptions.errorMessage);
      return;
    }

    // Turn the challenge back into the accepted format of padded base64
    credentialOptions.challenge = coerceToArrayBuffer(credentialOptions.challenge);
    credentialOptions.user.id = coerceToArrayBuffer(credentialOptions.user.id);

    credentialOptions.excludeCredentials = credentialOptions.excludeCredentials.map((c: any) => {
      c.id = coerceToArrayBuffer(c.id);
      return c;
    });

    if (credentialOptions.authenticatorSelection.authenticatorAttachment === null) {
      credentialOptions.authenticatorSelection.authenticatorAttachment = undefined;
    }

    let newCredential;
    try {
      debugger;
      newCredential = await navigator.credentials.create({
        publicKey: credentialOptions,
      });
    } catch (e) {
      alert('Could not create credentials in browser.');
      return;
    }

    try {
      await registerNewCredential(newCredential);
      debugger;
      // Navigate('https://test.looksfile.com/Identity/Account/login');
    } catch (e) {
      alert('Could not register new credentials on server');
    }
  }

  async function fetchMakeCredentialOptions() {
    // possible values: none, direct, indirect
    let attestationType = 'none';
    // possible values: <empty>, platform, cross-platform
    let authenticatorAttachment = '';

    // possible values: preferred, required, discouraged
    let userVerification = 'preferred';

    // possible values: true,false
    let requireResidentKey = 'false';

    const formData = { username: 'Rasool6500', firstName: 'Rasool', lastName: 'aghajani' };

    // let response = await fetch('https://localhost:7255/api/Account/RegisterOptions', {
    // let response = await fetch('https://test.looksfile.com/api/Account/RegisterOptions', {
    let response = await fetch('https://Biometric.radnikapp.ir/api/Account/RegisterOptions', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    let data = await response.json();
    return data;
  }

  // This should be used to verify the auth data with the server
  async function registerNewCredential(newCredential: any) {
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);

    const data = {
      id: newCredential.id,
      rawId: coerceToBase64Url(rawId),
      type: newCredential.type,
      extensions: newCredential.getClientExtensionResults(),
      response: {
        AttestationObject: coerceToBase64Url(attestationObject),
        clientDataJson: coerceToBase64Url(clientDataJSON),
      },
    };

    let response;
    try {
      response = await registerCredentialWithServer(data);
    } catch (e) {
      alert(e);
      return;
    }

    // show error
    if (response.status !== 'ok') {
      alert(response.errorMessage);
      return;
    }

    alert("You've registered successfully. You will now be redirected to sign in page");
  }

  async function registerCredentialWithServer(formData: any) {
    let response = await fetch('https://biometric.radnikapp.ir/api/Account/Register', {
      // let response = await fetch('https://test.looksfile.com/api/Account/Register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    let data = await response.json();

    return data;
  }

  //! login whit finger print

  async function handleSignInSubmit(event: any) {
    event.preventDefault();

    let username = '09126197621',
      data = { username: username },
      publicKeyOptions;
    try {
      var res = await fetch('https://biometric.radnikapp.ir/api/Account/LoginOptions', {
        // var res = await fetch('https://test.looksfile.com/api/Account/LoginOptions', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      publicKeyOptions = await res.json();
    } catch (e) {
      alert('Request to server failed');
      return;
    }

    if (publicKeyOptions.status !== 'ok') {
      alert(publicKeyOptions.errorMessage);
      return;
    }

    const challenge = publicKeyOptions.challenge.replace(/-/g, '+').replace(/_/g, '/');
    publicKeyOptions.challenge = Uint8Array.from(atob(challenge), (c) => c.charCodeAt(0));

    publicKeyOptions.allowCredentials.forEach(function (listItem: any) {
      var fixedId = listItem.id.replace(/\_/g, '/').replace(/\-/g, '+');
      listItem.id = Uint8Array.from(atob(fixedId), (c) => c.charCodeAt(0));
    });

    // ask browser for credentials (browser will ask connected authenticators)
    let credential;
    try {
      credential = await navigator.credentials.get({ publicKey: publicKeyOptions });

      try {
        await verifyAssertionWithServer(credential);
      } catch (e) {
        alert('Could not verify assertion');
      }
    } catch (err: any) {
      alert(err.message ? err.message : err);
    }
  }

  async function verifyAssertionWithServer(assertedCredential: any) {
    let authData = new Uint8Array(assertedCredential.response.authenticatorData);
    let clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
    let rawId = new Uint8Array(assertedCredential.rawId);
    let sig = new Uint8Array(assertedCredential.response.signature);
    const data = {
      id: assertedCredential.id,
      rawId: coerceToBase64Url(rawId),
      type: assertedCredential.type,
      extensions: assertedCredential.getClientExtensionResults(),
      response: {
        authenticatorData: coerceToBase64Url(authData),
        clientDataJson: coerceToBase64Url(clientDataJSON),
        signature: coerceToBase64Url(sig),
      },
    };

    let response;
    try {
      let res = await fetch('https://biometric.radnikapp.ir/api/Account/Login', {
        // let res = await fetch('https://test.looksfile.com/api/Account/Account/Login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      response = await res.json();
    } catch (e: any) {
      // alert('Request to server failed', e);
      alert('Request to server failed');
      throw e;
    }

    if (response.status !== 'ok') {
      alert(response.errorMessage);
      return;
    }

    //todo window.location.replace("@(Url.Page("/Index"))");
  }

  return (
    <div>
      <div>
        <button onClick={handleRegisterSubmit}>register</button>
        <button onClick={handleSignInSubmit}>login</button>
      </div>
      {/* <p>{message}</p> */}
    </div>
  );
};

export default WebAuthnLoginForm;
