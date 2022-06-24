import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, render, fireEvent, waitFor, getDefaultNormalizer } from '@testing-library/react';
import { decodeHexTypes } from '@gear-js/api';
import { join } from 'path';
import { readFileSync } from 'fs';

import { TEST_ACCOUNT } from '../../const';
import { PROGRAM_ID, PROGRAM, META } from './inputData';
import { useAccountMock, useProgramMock } from '../../mocks/hooks';

import { routes } from 'routes';
import { FILE_TYPES } from 'consts';
import { getPreformattedText } from 'helpers';
import { AlertProvider, AccountProvider } from 'context';
import * as ApiServiceModule from 'services/ApiService';
import { Meta } from 'components/pages/Meta/Meta';

const UploadMetaPage = () => (
  <AccountProvider>
    <AlertProvider>
      <MemoryRouter initialEntries={[`/meta/${PROGRAM_ID}`]}>
        <Routes>
          <Route path={routes.meta} element={<Meta />} />
        </Routes>
      </MemoryRouter>
    </AlertProvider>
  </AccountProvider>
);

describe('test uplaod meta page', () => {
  it('should show loader', () => {
    const mockProgram = useProgramMock();

    render(<UploadMetaPage />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    expect(mockProgram).toBeCalledTimes(1);
    expect(mockProgram).toBeCalledWith(PROGRAM_ID);
  });

  it('should show loader', async () => {
    const mockProgram = useProgramMock(PROGRAM);

    const addMetadataMock = jest.spyOn(ApiServiceModule, 'addMetadata').mockResolvedValue();

    const { rerender } = render(<UploadMetaPage />);

    expect(mockProgram).toBeCalledTimes(1);
    expect(mockProgram).toBeCalledWith(PROGRAM_ID);

    const elements = screen.getAllByText('Upload metadata');
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

    await waitFor(() => expect(screen.getByText('Wallet not connected')).toBeInTheDocument());

    expect(addMetadataMock).not.toBeCalled();

    // authorized submit

    useAccountMock(TEST_ACCOUNT);

    rerender(<UploadMetaPage />);

    fireEvent.click(uploadMetaBtn);

    await waitFor(() => {
      expect(addMetadataMock).toBeCalledTimes(1);
      expect(addMetadataMock).toBeCalledWith(
        META,
        Buffer.from(new Uint8Array(fileBuffer)).toString('base64'),
        TEST_ACCOUNT,
        PROGRAM_ID,
        'TEST',
        expect.any(Object)
      );
    });

    // TODO: add tests after will refactor form logic

    await (() => expect(programNameFiled).toHaveValue('NFT'));

    expect(uploadMetaBtn).toBeDisabled();
  });
});
