# Task Completion Checklist

When completing a coding task, follow these steps:

## 1. Code Quality
- [ ] Code follows Prettier config (4-space tabs, no semicolons, single quotes)
- [ ] Uses Svelte 5 runes appropriately ($state, $effect, $derived)
- [ ] No console.log statements left in production code

## 2. Testing
```bash
npm test
```
- [ ] Run tests and ensure all pass
- [ ] Add new tests for new functionality (place in `src/lib/tests/`)

## 3. Build Verification
```bash
npm run build:firefox
npm run build:chrome
```
- [ ] Both builds complete without errors

## 4. Manual Testing (if applicable)
```bash
npm run dev
```
- [ ] Test the feature in browser at localhost:5173
- [ ] Check for console errors in browser DevTools

## 5. Git
- [ ] Stage relevant changes
- [ ] Write clear, descriptive commit message
- [ ] Commit changes

## Notes
- No linting command configured (rely on Prettier)
- No TypeScript, so no type checking step
- Extension works in both Firefox and Chrome - test in target browser if possible
