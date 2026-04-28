# Image Optimization Script Design

## Summary

Add a small repo-local Node script that optimizes source images for the frontend. The script will:

- read images from `public/images/**` if that directory exists
- also include image files currently placed directly in `public/`
- convert supported source images to WebP
- generate three output sizes while preserving aspect ratio
- write outputs into `public/images/optimized/`
- run through a single npm script

This is intentionally a build-time utility only. It does not change frontend components, image loading logic, or any backend files.

## Goals

- Provide a repeatable way to optimize public images for the site
- Support both the current repo layout and a cleaner future `public/images/` layout
- Keep original source files untouched
- Generate predictable derivative file paths that the frontend can adopt later
- Keep implementation minimal and production-safe

## Non-Goals

- No automatic rewiring of frontend image usage
- No deletion, renaming, or mutation of original image files
- No AVIF output in this phase
- No image metadata database or manifest file
- No change to Vite config, Tailwind config, or deployment setup

## Source Scope

The script will process images from two places:

1. `public/images/**`
   - recursive scan if the directory exists
2. direct image files in `public/`
   - only files directly in `public/`
   - not recursive beyond the `public/images` subtree

The script must skip:

- anything already inside `public/images/optimized/`
- non-image files
- directories

## Supported Input Types

The first version will support:

- `.png`
- `.jpg`
- `.jpeg`
- `.webp`

This is enough for the current repo and avoids overextending the script.

## Output Structure

All generated files will be written under:

`public/images/optimized/`

Each source image gets its own folder derived from its original relative path and basename.

Examples:

- source: `public/ssr-group-civil-logo.png`
  - output:
    - `public/images/optimized/ssr-group-civil-logo/thumbnail.webp`
    - `public/images/optimized/ssr-group-civil-logo/medium.webp`
    - `public/images/optimized/ssr-group-civil-logo/large.webp`

- source: `public/images/services/villa.jpg`
  - output:
    - `public/images/optimized/services/villa/thumbnail.webp`
    - `public/images/optimized/services/villa/medium.webp`
    - `public/images/optimized/services/villa/large.webp`

This structure avoids filename collisions and stays easy to understand by humans.

## Size Presets

The script will generate exactly three WebP variants:

- `thumbnail`: width `300`
- `medium`: width `640`
- `large`: width `1440`

Design decisions:

- widths are fixed by preset name
- aspect ratio is preserved automatically
- `withoutEnlargement: true` will be used so small source images are not upscaled

## Quality and Encoding

Use `sharp` with WebP output.

Initial encoding settings:

- format: `webp`
- quality: `82`

This is a practical middle ground for web delivery without introducing extra configuration complexity.

## Script Behavior

### Entry Point

Create:

- `scripts/optimize-images.mjs`

Use ESM because the repo already uses `"type": "module"`.

### Processing Flow

For each discovered image:

1. determine whether it is eligible
2. compute its output directory under `public/images/optimized/`
3. create the output directory if needed
4. generate:
   - `thumbnail.webp`
   - `medium.webp`
   - `large.webp`
5. log the processed result

### Logging

The script should print concise status output:

- processed file path
- skipped file path and reason when relevant
- final summary count

Example summary:

- `Processed 6 images`
- `Generated 18 WebP files`

### Missing Directory Handling

If `public/images/` does not exist:

- do not fail
- continue processing root-level `public/*` image files

If no source images are found at all:

- exit successfully
- print a short message such as `No source images found`

## npm Integration

Add one script to `package.json`:

- `images:optimize`

Command:

- `node scripts/optimize-images.mjs`

This keeps the workflow explicit and avoids coupling it to `build`.

## Dependencies

Add:

- `sharp`

No other dependency is required for the first version.

## Error Handling

The script should:

- fail clearly if `sharp` cannot read a specific source file
- identify which file caused the error
- exit with a non-zero code on unexpected processing errors

It should not silently swallow failures.

## File Safety

The script must never:

- overwrite original source files
- write outside `public/images/optimized/`
- recursively reprocess generated output

## Testing and Verification

Verification for this change should include:

1. run `npm run images:optimize`
2. confirm `public/images/optimized/` is created
3. confirm root-level public images are processed
4. if `public/images/` exists, confirm nested images are processed recursively
5. confirm aspect ratio is preserved visually by checking image dimensions
6. confirm originals remain untouched

## Files Expected To Change

- `package.json`
- `scripts/optimize-images.mjs`

No frontend component changes are required for this task.

## Open Decisions Resolved

- Include current root-level `public/` images: yes
- Use a minimal single-purpose script instead of a CLI framework: yes
- Output only WebP derivatives in this phase: yes
- Keep original files unchanged: yes
