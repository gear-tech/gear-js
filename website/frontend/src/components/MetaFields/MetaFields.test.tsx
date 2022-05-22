import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MetaFields } from './MetaFields';
import {
  BTreeMap,
  BTreeMapResult,
  BTreeSet,
  BTreeSetResult,
  Primitive,
  PrimitiveResult,
  StructField,
  StructFieldResult,
  StructSet,
  StructSetResult,
  VecField,
  VecFieldResult,
  VecSet,
  VecSetResult,
  Result,
  ResultResult,
  Tuple,
  TupleResult,
  Array,
  ArrayResult,
  Enum,
  EnumResult,
  Option,
  OptionResult,
  FungibleTokenAction,
  FungibleTokenActionResult,
  ResultComplex,
  ResultComplexResult,
  NFT,
  NFTResult,
} from './new-meta-fixtures';
import { MetaFormWrapper } from './NewMetaFiels.stories';

describe('meta fields', () => {
  test('Primitive', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={Primitive}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(PrimitiveResult.__root.__fields.name), 'String');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('String');
    });
  });

  test('BTreeMap', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={BTreeMap}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(
      getByTestId(BTreeMapResult.__root.__fields['BTreeMap<String, u8>'].__fields.value.name),
      'Value'
    );
    await userEvent.type(getByTestId(BTreeMapResult.__root.__fields['BTreeMap<String, u8>'].__fields.key.name), 'Key');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        key: 'Key',
        value: 'Value',
      });
    });
  });

  test('BTreeSet', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={BTreeSet}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(BTreeSetResult.__root.__fields['BTreeSet<u8>'].name), 'Value');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('Value');
    });
  });

  test('StructSet', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={StructSet}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(StructSetResult.__root.__fields.AStruct.__fields.id.name), 'id');
    await userEvent.type(getByTestId(StructSetResult.__root.__fields.AStruct.__fields.online.name), 'online');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        id: 'id',
        online: 'online',
      });
    });
  });

  test('StructField', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={StructField}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(StructFieldResult.__root.__fields.AStruct.name), 'AStruct');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('AStruct');
    });
  });

  test('Vec', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={VecField}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(VecFieldResult.__root.__fields['Vec<u8>'].name), 'Vec');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('Vec');
    });
  });

  test('Vec Set', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={VecSet}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(VecSetResult.__root.__fields['Vec<MessageIn>'].name), 'Vec');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('Vec');
    });
  });

  test('Tuple', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={Tuple}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(TupleResult.__root.__fields['(String, u8)'].__fields.String.name), 'String');
    await userEvent.type(getByTestId(TupleResult.__root.__fields['(String, u8)'].__fields.u8.name), 'u8');
    const submit = getByRole('button');
    await userEvent.click(submit);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ u8: 'u8', String: 'String' });
    });
  });

  test('Array', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={Array}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );
    await userEvent.type(getByTestId(ArrayResult.__root.__fields['__u8;4__'].name), 'Array');
    const submit = getByRole('button');
    await userEvent.click(submit);
  
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith('Array');
    });
  });

  test('Result', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={Result}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    const submit = getByRole('button');

    // Default state
    await userEvent.type(getByTestId(ResultResult.__root.__fields['Result<String, i32>'].__fields.ok.name), 'ok');
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        ok: 'ok',
      });
    });

    // Change state
    await userEvent.selectOptions(getByTestId(ResultResult.__root.__fields['Result<String, i32>'].__path), 'err');
    await userEvent.type(getByTestId(ResultResult.__root.__fields['Result<String, i32>'].__fields.err.name), 'err');
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        err: 'err',
      });
    });
  });

  test('Result Complex', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={ResultComplex}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    const submit = getByRole('button');

    // Default state
    await userEvent.type(
      getByTestId(
        ResultComplexResult.__root.__fields['Result<MessageIn, Id>'].__fields.ok.__fields.id.__fields.decimal.name
      ),
      'decimal'
    );
    await userEvent.type(
      getByTestId(
        ResultComplexResult.__root.__fields['Result<MessageIn, Id>'].__fields.ok.__fields.id.__fields.hex.name
      ),
      'hex'
    );
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        ok: {
          id: {
            decimal: 'decimal',
            hex: 'hex',
          },
        },
      });
    });

    // Change state
    await userEvent.selectOptions(
      getByTestId(ResultComplexResult.__root.__fields['Result<MessageIn, Id>'].__path),
      'err'
    );
    await userEvent.type(
      getByTestId(ResultComplexResult.__root.__fields['Result<MessageIn, Id>'].__fields.err.__fields.decimal.name),
      'decimal'
    );
    await userEvent.type(
      getByTestId(ResultComplexResult.__root.__fields['Result<MessageIn, Id>'].__fields.err.__fields.hex.name),
      'hex'
    );
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        err: {
          decimal: 'decimal',
          hex: 'hex',
        },
      });
    });
  });

  test('Option', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={Option}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    const submit = getByRole('button');

    // Default state
    await userEvent.type(
      getByTestId(OptionResult.__root.__fields['Option<AStruct>'].__fields.AStruct.__fields.id.name),
      'id'
    );
    await userEvent.type(
      getByTestId(OptionResult.__root.__fields['Option<AStruct>'].__fields.AStruct.__fields.online.name),
      'online'
    );
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        AStruct: {
          id: 'id',
          online: 'online',
        },
      });
    });

    // Change state
    await userEvent.selectOptions(getByTestId(OptionResult.__root.__fields['Option<AStruct>'].__path), 'None');
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        None: 'None',
      });
    });
  });

  test('Enum', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={Enum}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    const submit = getByRole('button');

    // Default state
    await userEvent.type(getByTestId(EnumResult.__root.__fields.Action.__fields.AVariant.__fields.id.name), 'id');
    await userEvent.type(getByTestId(EnumResult.__root.__fields.Action.__fields.AVariant.__fields.online.name), 'name');
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        AVariant: {
          id: 'id',
          online: 'name',
        },
      });
    });

    // Change state
    await userEvent.selectOptions(getByTestId(EnumResult.__root.__fields.Action.__path), 'BVar');
    await userEvent.type(
      getByTestId(EnumResult.__root.__fields.Action.__fields.BVar.__fields.CustomStructU8.__fields.field.name),
      'field'
    );
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        BVar: {
          CustomStructU8: {
            field: 'field',
          },
        },
      });
    });

    // Changed Enum Option Field
    await userEvent.selectOptions(getByTestId(EnumResult.__root.__fields.Action.__fields.BVar.__path), 'None');
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        BVar: {
          None: 'None',
        },
      });
    });
  });

  test('Fungible Token', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={FungibleTokenAction}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    const submit = getByRole('button');

    // Default state
    await userEvent.type(
      getByTestId(FungibleTokenActionResult.__root.__fields.FungibleTokenAction.__fields.Mint.name),
      'Mint'
    );
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        Mint: 'Mint',
      });
    });

    // Change state
    await userEvent.selectOptions(
      getByTestId(FungibleTokenActionResult.__root.__fields.FungibleTokenAction.__path),
      'Approve'
    );
    await userEvent.type(
      getByTestId(FungibleTokenActionResult.__root.__fields.FungibleTokenAction.__fields.Approve.__fields.amount.name),
      'amount'
    );
    await userEvent.type(
      getByTestId(FungibleTokenActionResult.__root.__fields.FungibleTokenAction.__fields.Approve.__fields.to.name),
      'to'
    );
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        Approve: {
          to: 'to',
          amount: 'amount',
        },
      });
    });
  });

  test('NFT', async () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByRole } = render(
      <MetaFormWrapper onSubmit={handleSubmit} metaData={NFT}>
        {(meta) => <MetaFields data={meta} />}
      </MetaFormWrapper>
    );

    const submit = getByRole('button');

    // Default state
    await userEvent.type(
      getByTestId(NFTResult.__root.__fields.NftAction.__fields.Mint.__fields.tokenMetadata.__fields.name.name),
      'name'
    );
    await userEvent.type(
      getByTestId(NFTResult.__root.__fields.NftAction.__fields.Mint.__fields.tokenMetadata.__fields.description.name),
      'description'
    );
    await userEvent.type(
      getByTestId(NFTResult.__root.__fields.NftAction.__fields.Mint.__fields.tokenMetadata.__fields.media.name),
      'media'
    );
    await userEvent.type(
      getByTestId(NFTResult.__root.__fields.NftAction.__fields.Mint.__fields.tokenMetadata.__fields.reference.name),
      'reference'
    );
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        Mint: {
          tokenMetadata: {
            name: 'name',
            description: 'description',
            media: 'media',
            reference: 'reference',
          },
        },
      });
    });

    // Change state
    await userEvent.selectOptions(
      getByTestId(NFTResult.__root.__fields.NftAction.__path),
      'Approve'
    );
    await userEvent.type(
      getByTestId(NFTResult.__root.__fields.NftAction.__fields.Approve.__fields.to.name),
      'to'
    );
    await userEvent.type(
      getByTestId(NFTResult.__root.__fields.NftAction.__fields.Approve.__fields.tokenId.name),
      'tokenId'
    );
    await userEvent.click(submit);
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        Approve: {
          to: 'to',
          tokenId: 'tokenId',
        },
      });
    });
  });
});
