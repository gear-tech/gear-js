import * as hooks from 'hooks';

export const useApiMock = (api?: any) => {
  const mock = jest.spyOn(hooks, 'useApi');

  mock.mockReturnValue({
    api,
    isApiReady: Boolean(api),
  });

  return mock;
};
