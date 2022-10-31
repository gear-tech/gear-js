import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, fireEvent, waitFor, getDefaultNormalizer, within } from '@testing-library/react';
import { join } from 'path';
import { readFileSync } from 'fs';
import { decodeHexTypes } from '@gear-js/api';

import { PROGRAM_ID_1, META } from '../../const';
import { useAccountMock, TEST_ACCOUNT_1, useApiMock, TEST_API } from '../../mocks/hooks';
import { renderWithProviders } from '../../utils';

import { routes } from 'routes';
import { FILE_TYPES, ACCOUNT_ERRORS } from 'consts';
import { getPreformattedText } from 'helpers';
import { Meta } from 'pages/Meta/Meta';

const UploadMetaPage = () => (
  <MemoryRouter initialEntries={[`/meta/${PROGRAM_ID_1}`]}>
    <Routes>
      <Route path={routes.meta} element={<Meta />} />
    </Routes>
  </MemoryRouter>
);

jest.mock('@polkadot/extension-dapp', () => ({
  web3FromSource: () =>
    Promise.resolve({
      signer: {
        signRaw: () => Promise.resolve({ signature: '' }),
      },
    }),
}));

describe('test upload meta page', () => {
  const checkMetadataModal = async () => {
    const modal = await screen.findByTestId('modal');

    expect(within(modal).getByText('Upload metadata')).toBeInTheDocument();
    expect(
      within(modal).getByText(
        'Uploading metadata into the backend is necessary for further interaction with the program'
      )
    ).toBeInTheDocument();
    expect(within(modal).getByText('This is a free of charge operation')).toBeInTheDocument();
    expect(within(modal).getByText('Please sign the metadata uploading at the next step')).toBeInTheDocument();

    expect(within(modal).getByText('Submit')).toBeInTheDocument();
    expect(within(modal).getByText('Cancel')).toBeInTheDocument();
  };

  it('test upload metadata logic', async () => {
    useApiMock(TEST_API);
    useAccountMock();

    const { rerender } = renderWithProviders(<UploadMetaPage />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    const elements = await screen.findAllByText('Upload metadata');

    const header = elements[0];
    const uploadMetaBtn = elements[1];

    // initial elements

    expect(header).toBeInTheDocument();
    expect(screen.getByText('NFT')).toBeInTheDocument();

    expect(uploadMetaBtn).toBeDisabled();

    const selectFileBtn = screen.getByText('Select file');
    const metaFileInput = screen.getByTestId('metaFileInput');
    const programNameFiled = screen.getByLabelText('Program name');

    expect(programNameFiled).toBeInTheDocument();
    expect(programNameFiled).toHaveValue('NFT');

    fireEvent.change(programNameFiled, { target: { value: 'TEST' } });
    expect(programNameFiled).toHaveValue('TEST');

    expect(screen.getByText('Metadata file')).toBeInTheDocument();
    expect(metaFileInput).toBeInTheDocument();
    expect(selectFileBtn).toBeInTheDocument();
    expect(selectFileBtn).toBeEnabled();

    // upload meta file

    const fileBuffer = readFileSync(join(__dirname, '../../wasm/nft.meta.wasm'));

    const testFile = new File([fileBuffer], 'nft.meta.wasm', { type: FILE_TYPES.WASM });

    fireEvent.change(metaFileInput, {
      target: { files: [testFile] },
    });

    await waitFor(() => expect(screen.getByText('nft.meta.wasm')).toBeInTheDocument());
    await waitFor(() => expect(uploadMetaBtn).toBeEnabled());

    expect(screen.getByText('init_input')).toBeInTheDocument();
    expect(screen.getByText('InitNFT')).toBeInTheDocument();
    expect(screen.getByText('handle_input')).toBeInTheDocument();
    expect(screen.getByText('NFTAction')).toBeInTheDocument();
    expect(screen.getByText('handle_output')).toBeInTheDocument();
    expect(screen.getByText('Vec<u8>')).toBeInTheDocument();
    expect(screen.getByText('meta_state_input')).toBeInTheDocument();
    expect(screen.getByText('NFTQuery')).toBeInTheDocument();
    expect(screen.getByText('meta_state_output')).toBeInTheDocument();
    expect(screen.getByText('NFTQueryReply')).toBeInTheDocument();

    const decodedTypes = decodeHexTypes(META.types!);

    expect(screen.getByText('types')).toBeInTheDocument();
    expect(
      screen.getByText(getPreformattedText(decodedTypes), {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeInTheDocument();

    // unauthorized submit

    fireEvent.click(uploadMetaBtn);

    await waitFor(() => expect(screen.getByText(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED)).toBeInTheDocument());

    // open modal

    useAccountMock(TEST_ACCOUNT_1);

    rerender(<UploadMetaPage />);

    expect(uploadMetaBtn).toBeEnabled();

    fireEvent.click(uploadMetaBtn);

    await checkMetadataModal();

    expect(uploadMetaBtn).toBeDisabled();

    // close modal

    const modalCancelBtn = screen.getByText('Cancel');

    fireEvent.click(modalCancelBtn);

    expect(uploadMetaBtn).toBeEnabled();

    // authorized submit

    fireEvent.click(uploadMetaBtn);

    await checkMetadataModal();

    const modalSubmitBtn = screen.getByText('Submit');

    fireEvent.click(modalSubmitBtn);

    // reset form

    await waitFor(() => expect(screen.getByText('Metadata saved successfully')).toBeInTheDocument());

    expect(uploadMetaBtn).toBeDisabled();
    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getByText('Select file')).toBeInTheDocument();

    expect(screen.queryByText('nft.meta.wasm')).not.toBeInTheDocument();
    expect(screen.queryByText('init_input')).not.toBeInTheDocument();
    expect(screen.queryByText('InitNFT')).not.toBeInTheDocument();
    expect(screen.queryByText('handle_input')).not.toBeInTheDocument();
    expect(screen.queryByText('NFTAction')).not.toBeInTheDocument();
    expect(screen.queryByText('handle_output')).not.toBeInTheDocument();
    expect(screen.queryByText('Vec<u8>')).not.toBeInTheDocument();
    expect(screen.queryByText('meta_state_input')).not.toBeInTheDocument();
    expect(screen.queryByText('NFTQuery')).not.toBeInTheDocument();
    expect(screen.queryByText('meta_state_output')).not.toBeInTheDocument();
    expect(screen.queryByText('NFTQueryReply')).not.toBeInTheDocument();
  });
});
