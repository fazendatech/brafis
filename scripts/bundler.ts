import isolatedDecl from 'bun-plugin-isolated-decl';

const result = await Bun.build({
  entrypoints : ["src/index.ts"],
  outdir: "./dist",
  target: "node",
  plugins: [isolatedDecl({forceGenerate: true})],
});

if(!result.success) {
  console.error(result.logs);
  process.exit(1);
}
