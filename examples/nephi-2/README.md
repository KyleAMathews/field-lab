# 2 Nephi 2: an executable reading

This example separates the chapter's narrative transitions from its argument
about what makes choice possible. The viewer can play three concrete paths
found by TLC. The verse mapping and assumptions are open to revision.

Run the local preview with Node 22.12 or later:

```sh
npm ci
npm run dev
```

Open the URL Vite prints. The example uses a checked-in chart and trace snapshot,
so viewing it does not require Docker or Java.

To regenerate the snapshot, run this command from this directory with Docker
available:

```sh
node generate-evidence.mjs
```

The script runs the full baseline check, checks that both deliberately wrong
models fail as expected, and captures three reachability witnesses. A
reachability run negates its target to make TLC return a path to it.
All checks use the same copy of the model, configuration, and view. The script
replaces `evidence.json` only after every run gives the expected result.
Review that diff before committing it. The preview offers downloads of the
generated chart, checker report, and raw traces from the saved run.
