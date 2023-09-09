#!/usr/bin/env node

'use strict';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { init } from './components/initializer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

init(__dirname);
