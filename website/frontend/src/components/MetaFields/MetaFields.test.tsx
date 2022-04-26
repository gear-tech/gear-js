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
  resultEnumSimple,
  resultEnumSimpleResult,
  resultEnumComplex,
  resultEnumComplexResult,
  optionEnumSimple,
  optionEnumSimpleResult,
  optionEnumComplex,
  optionEnumComplexResult,
} from './meta-fixtures';
import { MetaFormWrapper } from './MetaFields.stories';

describe('form generated for meta data', () => {
  // region Fields struct
  test('simple struct submit', async () => {
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

  test('deep struct submit', async () => {
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
  // endregion

  // region Enum
  test('dao enum submit', async () => {
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

  test('dao enum select and submit', async () => {
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
  // endregion

  // region enum Result
  test('simple enum result submit', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={resultEnumSimple}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    await userEvent.type(getByTestId(resultEnumSimpleResult.__root.__fields.exchangeRate.__fields.ok.name), 'ok');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          exchangeRate: {
            ok: 'ok',
          },
        },
      });
    });
  });

  test('simple enum result select and submit', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={resultEnumSimple}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    await userEvent.selectOptions(getByTestId(resultEnumSimpleResult.__root.__fields.exchangeRate.__path), 'err');
    await userEvent.type(getByTestId(resultEnumSimpleResult.__root.__fields.exchangeRate.__fields.err.name), 'err');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          exchangeRate: {
            err: 'err',
          },
        },
      });
    });
  });

  test('complex enum result submit', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={resultEnumComplex}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    await userEvent.type(
      getByTestId(resultEnumComplexResult.__root.__fields.exchangeRate.__fields.ok.__fields.firstName.name),
      'firstName'
    );
    await userEvent.type(
      getByTestId(resultEnumComplexResult.__root.__fields.exchangeRate.__fields.ok.__fields.secondName.name),
      'secondName'
    );
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          exchangeRate: {
            ok: {
              firstName: 'firstName',
              secondName: 'secondName',
            },
          },
        },
      });
    });
  });

  test('complex enum result select and submit', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={resultEnumComplex}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    await userEvent.selectOptions(getByTestId(resultEnumComplexResult.__root.__fields.exchangeRate.__path), 'err');
    await userEvent.type(
      getByTestId(resultEnumComplexResult.__root.__fields.exchangeRate.__fields.err.__fields['__field-0'].name),
      '__field-0'
    );
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          exchangeRate: {
            err: {
              '__field-0': '__field-0',
            },
          },
        },
      });
    });
  });
  // endregion

  // region enum Option
  test('simple enum option submit', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={optionEnumSimple}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    await userEvent.type(getByTestId(optionEnumSimpleResult.__root.__fields['__field-0'].name), '__field-0');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          '__field-0': '__field-0',
        },
      });
    });
  });

  test('simple enum option select and submit', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={optionEnumSimple}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    await userEvent.selectOptions(getByTestId(optionEnumSimpleResult.__root.__path), '__null');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          __null: 'Null',
        },
      });
    });
  });

  test('complex enum option submit', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={optionEnumComplex}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    await userEvent.type(
      getByTestId(optionEnumComplexResult.__root.__fields.res.__fields['__field-0'].__fields.id.__fields.hex.name),
      'hex'
    );
    await userEvent.type(
      getByTestId(optionEnumComplexResult.__root.__fields.res.__fields['__field-0'].__fields.id.__fields.decimal.name),
      'decimal'
    );
    await userEvent.type(
      getByTestId(optionEnumComplexResult.__root.__fields.res.__fields['__field-0'].__fields.person.__fields.name.name),
      'name'
    );
    await userEvent.type(
      getByTestId(
        optionEnumComplexResult.__root.__fields.res.__fields['__field-0'].__fields.person.__fields.surname.name
      ),
      'surname'
    );
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          res: {
            '__field-0': {
              id: {
                decimal: 'decimal',
                hex: 'hex',
              },
              person: {
                surname: 'surname',
                name: 'name',
              },
            },
          },
        },
      });
    });
  });

  test('complex enum option select and submit', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={optionEnumComplex}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    await userEvent.selectOptions(getByTestId(optionEnumComplexResult.__root.__fields.res.__path), '__null');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        __root: {
          res: {
            __null: 'Null',
          },
        },
      });
    });
  });
  // endregion
});
