import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
    {
      input: 'src/configs/',
      outDir: 'dist/configs',
    },
    {
      input: 'src/parser/index',
      name: 'parser',
    },
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    output: {
      exports: 'named',
    },
  },
  failOnWarn: false,
});
