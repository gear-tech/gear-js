const getHeading = (stepIndex: number) => {
  switch (stepIndex) {
    case 0:
      return 'Connect your account to start working with the portal';

    case 1:
      return 'This option allows you to upload a program to the network';

    case 2:
      return "This option allows you to upload your program without program's initialization in the network";

    case 3:
      return 'The list of uploaded codes can be found here';

    case 4:
      return 'This option allows you to send a message to a program';

    case 5:
      return 'Explorer';

    case 6:
      return 'Mailbox';

    case 7:
      return 'App examples';

    case 8:
      return 'Network switcher';

    default:
      return '';
  }
};

const getText = (stepIndex: number) => {
  switch (stepIndex) {
    case 0:
      return 'Click here to select a wallet and choose an account';

    case 1:
      return "Select program's .wasm and .meta files, click the “Calculate gas” and “Upload program” buttons. You will be prompted to sign the transaction of the program initialization.";

    case 2:
      return 'It can be used to initialize one or several instances of an identical program later';

    case 3:
      return 'You can select the required code to Create a new program being initialized in the network';

    case 4:
      return "Copy destination program's address where to send a message and provide necessary details in the Payload section, click the “Calculate gas” and “Send message” buttons. You will be prompted to sign the transaction for the message sending.";

    case 5:
      return 'Here you can get details about recent network events, search by block hash or block number or apply filters';

    case 6:
      return 'Here you can check messages sent from programs to currently connected account.';

    case 7:
      return 'If you do not have a program to upload, check a broad library of smart-contract examples created by Gear team and find what best fits your use cases. You can take it as is or adapt to your needs.';

    case 8:
      return "Select the network you're working with, connect to your local test net or localhost Gear node";

    default:
      return '';
  }
};

export { getHeading, getText };
