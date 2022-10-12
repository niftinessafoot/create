const fs = jest.genMockFromModule('fs');

export const { mkdirSync, existsSync, writeFileSync, readFileSync } = fs;
