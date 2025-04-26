export const UserLastSeen = class {
  id: string;
  timestamp: Date;

  constructor(id: string) {
    this.id = id;
    this.timestamp = new Date();
  }
};

const saveMock = jest.fn().mockImplementation((data) => {});
const findOneMock = jest.fn();
const findMock = jest.fn();
const updateMock = jest.fn();

export const AppDataSource = {
  getRepository: jest.fn().mockReturnValue({
    save: saveMock,
    findOne: findOneMock,
    find: findMock,
    update: updateMock,
  }),
};

export const __mocks__ = {
  saveMock,
  findOneMock,
  findMock,
  updateMock,
};
