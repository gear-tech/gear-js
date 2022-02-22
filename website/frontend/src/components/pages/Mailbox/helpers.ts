import { MailsActionTypes } from './context/types';

export const getMails = async (api: any, publicKey: string, dispatch: any) => {
  try {
    await api.mailbox.subscribe(publicKey, (data: any) => {
      const mailsHuman = data.toHuman();
      const mailsArray = [];

      for (const key in mailsHuman) {
        mailsArray.push(mailsHuman[key]);
      }

      dispatch({ type: MailsActionTypes.FETCH_MAILS, payload: mailsArray });
    });
  } catch (error) {
    console.log(error);
  }
};
