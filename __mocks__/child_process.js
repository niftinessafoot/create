import { jest } from '@jest/globals';
const child_process = jest.createMockFromModule('child_process');

export const { spawn } = child_process;
