const child_process = jest.genMockFromModule('child_process');

child_process.spawn = jest.fn((command, args, options) => {
  return {
    stdout: [command, args, options],
    stderr: ['error placeholder'],
    on: (evt, listener) => {
      if (typeof listener === 'function') {
        listener.call(null);
      }
    },
  };
});

export const { spawn } = child_process;
