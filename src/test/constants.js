import path from 'path';

const ROOT = path.resolve(__dirname, '../../');

const config = {
  root: ROOT,
  examples: path.join(ROOT, 'examples/')
}

export default Object.freeze(config);
