# Pstack statechart compiler

Vendored unchanged from `cursor/plugins`, pstack `0.15.36`, at
`4dd1d05818d19792e7cd6e818f1667f95f7e1dbe`.
Source: https://github.com/cursor/plugins/tree/4dd1d05818d19792e7cd6e818f1667f95f7e1dbe/pstack/skills/statechart

The scripts and render reference are unchanged. The MIT license and upstream
tests/fixtures are retained. `upstream.json` records each original file and
SHA-256 so local changes remain visible. Field Lab's wrapper stays outside
these upstream files.

After updating the upstream files, license, and manifest together, run from the
Field Lab root:

```sh
node --test scripts/statechart.test.js
scripts/check-statechart-container
scripts/check-tla-container
```

The container control builds the runtime image. The upstream signal tests need
full procps (`ps -o ppid= -p PID`), so use the separate test image to run the
dependency-free projection and CLI replay suites:

```sh
docker build --tag field-lab-statechart-tests:local \
  --file tools/tla/tests.Dockerfile tools/tla
docker run --rm --init --network none --entrypoint node field-lab-statechart-tests:local \
  --disable-warning=ExperimentalWarning --test \
  /opt/field-lab/statechart/scripts/test/pipeline.test.ts \
  /opt/field-lab/statechart/scripts/test/chart.test.ts \
  /opt/field-lab/statechart/scripts/test/messages.test.ts \
  /opt/field-lab/statechart/scripts/test/cli.test.ts
```

Pass `--build-arg TLC_IMAGE=your-image-tag` when building the test image if
`FIELD_LAB_TLC_IMAGE` overrides the default runtime tag. The
remaining upstream suites include live TLC, generated differential checks,
and renderer package installation; they are retained, not silently folded
into the offline smoke command.

Do not patch generated charts or parser expectations to conceal a counterexample.
