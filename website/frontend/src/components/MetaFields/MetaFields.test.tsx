import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MetaFields } from './MetaFields';
import {
  simpleStruct,
  simpleStructResult,
  simpleDeepStruct,
  simpleDeepStructResult,
  daoMeta,
  daoMetaResult,
} from './meta-fixtures';
import { MetaFormWrapper } from './MetaFields.stories';

describe('form generated for meta data', () => {
  test('renders and submits simple struct form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={simpleStruct}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(simpleStructResult.__root.__fields.amount.name), 'amount');
    await userEvent.type(getByTestId(simpleStructResult.__root.__fields.currency.name), 'currency');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ __root: { amount: 'amount', currency: 'currency' } });
    });
  });

  test('renders and submits nested deep struct form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={simpleDeepStruct}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(simpleDeepStructResult.__root.__fields.AddMessage.__fields.msg.name), 'msg');
    await userEvent.type(getByTestId(simpleDeepStructResult.__root.__fields.AddMessage.__fields.author.name), 'author');
    await userEvent.type(
      getByTestId(simpleDeepStructResult.__root.__fields.AddMessage.__fields.To.__fields.name.name),
      'name'
    );
    await userEvent.type(
      getByTestId(simpleDeepStructResult.__root.__fields.AddMessage.__fields.To.__fields.from.name),
      'from'
    );
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          AddMessage: {
            author: 'author',
            msg: 'msg',
            To: {
              from: 'from',
              name: 'name',
            },
          },
        },
      });
    });
  });

  test('render and submit dao enum form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={daoMeta}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(daoMetaResult.__root.__fields.RequestForMembership.name), 'RequestForMembership');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          RequestForMembership: 'RequestForMembership',
        },
      });
    });
  });

  test('enum selecting and submit dao enum form', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={daoMeta}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.selectOptions(
      getByTestId(daoMetaResult.__root.__path),
      daoMetaResult.__root.__fields.SubmitVote.__name
    );

    await userEvent.selectOptions(getByTestId(daoMetaResult.__root.__fields.SubmitVote.__fields.vote.__path), '1');
    await userEvent.type(getByTestId(daoMetaResult.__root.__fields.SubmitVote.__fields.vote.__fields['1'].name), 'No');

    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          SubmitVote: {
            proposalId: '',
            vote: {
              '1': 'No',
            },
          },
        },
      });
    });
  });
});
