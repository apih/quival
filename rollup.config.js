import fs from 'fs';
import path from 'path';
import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import prettier from 'rollup-plugin-prettier';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const banner = `/*!
 * ${pkg.name} v${pkg.version} (${pkg.repository.url})
 * (c) 2023 ${pkg.author}
 * Released under the MIT License.
 */`;

const options = [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/quival.js',
        format: 'iife',
        name: 'quival',
        banner,
        plugins: [prettier(JSON.parse(fs.readFileSync('.prettierrc.json')))],
      },
      {
        file: 'dist/quival.min.js',
        format: 'iife',
        name: 'quival',
        banner,
        plugins: [terser()],
      },
    ],
    plugins: [
      resolve(),
      swc({
        swc: {
          env: {
            targets: 'last 1 year',
            mode: 'entry',
            coreJs: '3.22',
          },
        },
        exclude: 'node_modules/**',
      }),
    ],
  },
];

const srcLocales = 'src/locales';
const distLocales = 'dist/locales';
const filenames = fs.readdirSync(srcLocales).filter((filename) => path.extname(filename) === '.js');

for (const filename of filenames) {
  const basename = path.basename(filename, '.js');
  const format = 'iife';
  const name = `quival.locales.${basename}`;

  const normal = {
    file: path.join(distLocales, `${basename}.js`),
    format,
    name,
    banner,
  };

  const minified = Object.assign({}, normal, {
    file: path.join(distLocales, `${basename}.min.js`),
    plugins: [terser()],
  });

  options.push({
    input: path.join(srcLocales, filename),
    output: [normal, minified],
  });
}

export default options;
