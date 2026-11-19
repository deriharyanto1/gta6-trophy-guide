# Leonida Trophy Guide — Grand Theft Auto VI

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/deriharyanto1/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/deriharyanto1/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI — an entry for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **All 55 trophies** with their official name, description and grade as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze), each with a guide written for this entry in its own words, steps, and cited sources (Exophase, PSNProfiles).
- **Roadmap to the platinum** in 5 stages, built from the official descriptions: story, strangers, activities, collectibles, then cleanup and 100%.
- **Missables flagged**: 8 trophies that can be missed — partner moments, one-time story scenes and a retry that must follow its failure at once.
- **Tracker**: check trophies off, progress saved in the browser (localStorage), with a progress bar and per-grade counts, export to a file and import back.
- **Filters**: by kind (story, missable, collectibles, activities, online, platinum), by grade, by earned/unearned, plus search and a spoiler mode that hides story trophy names until earned.

## Run it

Serve `app/` with any static server and open `app/index.html` in desktop Chrome. It works with the network off — it loads nothing from outside its own files.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.
