import dts from "bun-plugin-dts";

const result = await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "./dist",
  target: "node",
  plugins: [dts()],
});

if (!result.success) {
  console.error(result.logs);
  process.exit(1);
}
