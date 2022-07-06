import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  screen,
  render,
  fireEvent,
  waitFor,
  getDefaultNormalizer,
  SelectorMatcherOptions,
} from '@testing-library/react';

import { READED_STATE } from './inputData';
import { useApiMock, TEST_API } from '../../mocks/hooks';
import { PROGRAM_ID_1, PROGRAM_ID_2, META_FILE } from '../../const';

import { routes } from 'routes';
import { getPreformattedText } from 'helpers';
import { ApiProvider } from 'context/api';
import { getSubmitPayload } from 'components/common/Form/FormPayload/helpers';
import { State } from 'pages/State';
import { FormValues } from 'pages/State/children/StateForm/types';

type Props = {
  programId: string;
};

const StatePage = ({ programId }: Props) => (
  <ApiProvider>
    <MemoryRouter initialEntries={[`/state/${programId}`]}>
      <Routes>
        <Route path={routes.state} element={<State />} />
      </Routes>
    </MemoryRouter>
  </ApiProvider>
);

describe('test state page', () => {
  const preformattedState = getPreformattedText(READED_STATE);

  const selectorOptions: SelectorMatcherOptions = {
    normalizer: getDefaultNormalizer({ collapseWhitespace: false }),
  };

  it('reads program state with meta_state_input metadata prop', async () => {
    useApiMock(TEST_API);

    TEST_API.programState.read.mockResolvedValue({
      toHuman: () => READED_STATE,
    });

    render(<StatePage programId={PROGRAM_ID_1} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    const elements = await screen.findAllByText('Read state');

    expect(elements).toHaveLength(2);

    const readStateBtn = elements[1];

    expect(readStateBtn).toBeEnabled();

    expect(screen.getByText(PROGRAM_ID_1)).toBeInTheDocument();
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

    expect(TEST_API.programState.read).toBeCalledTimes(1);
    expect(TEST_API.programState.read).toBeCalledWith(
      PROGRAM_ID_1,
      Buffer.from(META_FILE, 'base64'),
      getSubmitPayload(formValues.payload)
    );

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();

    expect(screen.getByText('Statedata')).toBeInTheDocument();

    expect(screen.getByText(getPreformattedText(READED_STATE), selectorOptions)).toBeInTheDocument();

    expect(readStateBtn).toBeInTheDocument();

    // read state again

    fireEvent.click(readStateBtn);

    await waitFor(() => {
      expect(screen.queryByText(preformattedState, selectorOptions)).not.toBeInTheDocument();
      expect(screen.queryByText('Statedata')).not.toBeInTheDocument();
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    expect(screen.getByText('Statedata')).toBeInTheDocument();
    expect(screen.getByText(preformattedState, selectorOptions)).toBeInTheDocument();
  });

  it('reads program state without meta_state_input metadata prop', async () => {
    useApiMock(TEST_API);

    TEST_API.programState.read.mockReset();
    TEST_API.programState.read.mockResolvedValue({
      toHuman: () => READED_STATE,
    });

    render(<StatePage programId={PROGRAM_ID_2} />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    const header = await screen.findByText('Read state');

    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('H2');

    expect(TEST_API.programState.read).toBeCalledTimes(1);
    expect(TEST_API.programState.read).toBeCalledWith(PROGRAM_ID_2, Buffer.from(META_FILE, 'base64'), undefined);

    expect(screen.getByText(PROGRAM_ID_2)).toBeInTheDocument();
    expect(screen.getByText('Program Id')).toBeInTheDocument();

    expect(screen.queryByText('NftQuery')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.queryByText('Input Parameters')).not.toBeInTheDocument();

    expect(screen.getByText('Statedata')).toBeInTheDocument();
    expect(screen.getByText(preformattedState, selectorOptions)).toBeInTheDocument();
  });
});
