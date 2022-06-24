import { decodeHexTypes } from '@gear-js/api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, render, fireEvent, waitFor, getDefaultNormalizer } from '@testing-library/react';

import { PROGRAM_ID, META, META_FILE, READED_STATE } from './inputData';
import { useApiMock } from '../../mocks/hooks';

import { routes } from 'routes';
import { ApiProvider } from 'context';
import * as services from 'services/index';
import { getPreformattedText } from 'helpers';
import { getSubmitPayload } from 'components/common/Form/FormPayload/helpers';
import { State } from 'components/pages/State';
import { FormValues } from 'components/pages/State/children/StateForm/types';

const StatePage = () => (
  <ApiProvider>
    <MemoryRouter initialEntries={[`/state/${PROGRAM_ID}`]}>
      <Routes>
        <Route path={routes.state} element={<State />} />
      </Routes>
    </MemoryRouter>
  </ApiProvider>
);

describe('test state page', () => {
  const readMock = jest.fn();

  const testApi = {
    programState: {
      read: readMock,
    },
  };

  it('test form with meta_state_input prop', async () => {
    const getMetadataMock = jest.spyOn(services, 'getMetadata').mockResolvedValue({
      result: {
        meta: JSON.stringify(META),
        program: '',
        metaFile: META_FILE,
      },
    });

    useApiMock(testApi);

    readMock.mockResolvedValue({
      toHuman: () => READED_STATE,
    });

    render(<StatePage />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    expect(getMetadataMock).toBeCalledTimes(1);
    expect(getMetadataMock).toBeCalledWith(PROGRAM_ID);

    const elements = await screen.findAllByText('Read state');

    expect(elements).toHaveLength(2);

    const readStateBtn = elements[1];

    expect(readStateBtn).toBeEnabled();

    expect(screen.getByText(PROGRAM_ID)).toBeInTheDocument();
    expect(screen.getByText('Program Id')).toBeInTheDocument();
    expect(screen.getByText('Input Parameters')).toBeInTheDocument();
    expect(screen.getByText('NftQuery')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    const metaField = screen.getByLabelText('Null');

    expect(metaField).toBeInTheDocument();
    fireEvent.change(metaField, { target: { value: 'null' } });
    expect(metaField).toHaveValue('null');

    // read state

    fireEvent.click(readStateBtn);

    await waitFor(() => expect(screen.getByTestId('spinner')).toBeInTheDocument());

    const formValues: FormValues = {
      payload: {
        NFTInfo: 'null',
      },
    };

    expect(readMock).toBeCalledTimes(1);
    expect(readMock).toBeCalledWith(PROGRAM_ID, Buffer.from(META_FILE, 'base64'), getSubmitPayload(formValues.payload));

    expect(screen.queryByTestId('spinner')).toBeNull();

    expect(screen.getByText('Statedata')).toBeInTheDocument();

    expect(
      screen.getByText(getPreformattedText(READED_STATE), {
        normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
      })
    ).toBeInTheDocument();

    expect(readStateBtn).toBeInTheDocument();

    // read state again

    fireEvent.click(readStateBtn);

    await waitFor(() => {
      expect(screen.queryByText(/NFTInfo/)).toBeNull();
      expect(screen.queryByText('Statedata')).toBeNull();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    expect(screen.getByText('Statedata')).toBeInTheDocument();
    expect(screen.getByText(/NFTInfo/).innerHTML).toBe(getPreformattedText(READED_STATE));
  });

  it('test form without meta_state_input prop', async () => {
    const getMetadataMock = jest.spyOn(services, 'getMetadata').mockResolvedValue({
      result: {
        program: '',
        metaFile: META_FILE,
        meta: JSON.stringify({
          ...META,
          meta_state_input: '',
        }),
      },
    });

    useApiMock(testApi);

    readMock.mockReset();
    readMock.mockResolvedValue({
      toHuman: () => READED_STATE,
    });

    render(<StatePage />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    expect(getMetadataMock).toBeCalledTimes(1);
    expect(getMetadataMock).toBeCalledWith(PROGRAM_ID);

    const header = await screen.findByText('Read state');

    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('H2');

    expect(readMock).toBeCalledTimes(1);
    expect(readMock).toBeCalledWith(PROGRAM_ID, Buffer.from(META_FILE, 'base64'), undefined);

    expect(screen.getByText(PROGRAM_ID)).toBeInTheDocument();
    expect(screen.getByText('Program Id')).toBeInTheDocument();

    expect(screen.queryByText('NftQuery')).toBeNull();
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByText('Input Parameters')).toBeNull();

    expect(screen.getByText('Statedata')).toBeInTheDocument();
    expect(screen.getByText(/NFTInfo/).innerHTML).toBe(getPreformattedText(READED_STATE));
  });
});
