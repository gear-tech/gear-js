const CreateType = require('create-type');

export async function fromBytes(type: string, data: any) {
  try {
    const result = await CreateType.fromBytes(
      process.env.WS_PROVIDER,
      type,
      data,
    );
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function toBytes(type: string, data: any) {
  try {
    const bytes = await CreateType.toBytes(process.env.WS_PROVIDER, type, data);
    return bytes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
