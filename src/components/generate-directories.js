import { mkdirSync } from 'fs';

function generateDirectories(settings) {
  const { directories, siteDirectories, reactDirectories, type, isReact } =
    settings;
  const output = [...directories];

  if (type === 'site') {
    output.push(...siteDirectories);
  }

  if (isReact) {
    output.push(...reactDirectories);
  }

  output.forEach((dir) => {
    //TODO: Make this async.
    mkdirSync(dir, { recursive: true });
  });

  return output;
}

export { generateDirectories };
