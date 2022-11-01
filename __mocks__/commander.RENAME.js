export const commander = jest.genMockFromModule('commander');
const options = {};
commander.program = {
  description: jest.fn(),
  option: jest.fn((key, descriptor, value) => {
    const k = key.split('<').pop().slice(0, -1);
    options[k] = value;
  }),
  configureOutput: jest.fn(),
  parse: () => jest.fn(),
  opts: () => options,
};

export const { program } = commander;
