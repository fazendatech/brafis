import isolatedDecl from 'bun-plugin-isolated-decl';

const result = await Bun.build({
  entrypoints : ["src/index.ts"],
  outdir: "./dist",
  target: "node",
  plugins: [isolatedDecl()],
  // drop: ["console", "debugger"]
});

if(!result.success) {
  console.error(result.logs);
  process.exit(1);
}
