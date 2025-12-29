# Suggested Commands

## Development
```bash
npm run dev            # Start dev server at localhost:5173
npm run watch          # Build + watch for Firefox (use with web-ext run)
```

## Building
```bash
npm run build:firefox  # Build for Firefox → dist/firefox
npm run build:chrome   # Build for Chrome → dist/chrome
npm run build          # Same as build:firefox
```

## Testing
```bash
npm test               # Run vitest tests (vitest run)
```

## System Utilities (macOS/Darwin)
```bash
git status             # Check git status
git add <file>         # Stage changes
git commit -m "msg"    # Commit changes
ls -la                 # List files with details
find . -name "*.js"    # Find files by pattern
grep -r "pattern" .    # Search in files
```

## Preview/Debug
```bash
npm run preview        # Vite preview (after build)
```
