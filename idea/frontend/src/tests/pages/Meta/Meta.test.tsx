import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, fireEvent, waitFor, getDefaultNormalizer } from '@testing-library/react';
import { join } from 'path';
import { readFileSync } from 'fs';
import { decodeHexTypes } from '@gear-js/api';

import { PROGRAM_ID_1, META } from '../../const';
import { useAccountMock, TEST_ACCOUNT_1, useApiMock } from '../../mocks/hooks';
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

describe('test uplaod meta page', () => {
  it('test upload metadata logic', async () => {
    useApiMock();
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

    // expect(addMetadataMock).not.toBeCalled();

    // authorized submit

    useAccountMock(TEST_ACCOUNT_1);

    rerender(<UploadMetaPage />);

    fireEvent.click(uploadMetaBtn);

    // await waitFor(() => {
    //  expect(addMetadataMock).toBeCalledTimes(1);
    //  expect(addMetadataMock).toBeCalledWith(
    //    META,
    //    Buffer.from(new Uint8Array(fileBuffer)).toString('base64'),
    //    TEST_ACCOUNT_1,
    //    PROGRAM_ID_1,
    //    'TEST',
    //    expect.any(Object)
    //  );
    // });

    // reset form

    await waitFor(expect(screen.getByText('Select file')).toBeInTheDocument);

    expect(uploadMetaBtn).toBeDisabled();

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
