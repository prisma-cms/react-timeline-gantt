## Based on https://github.com/guiqui/react-timeline-gantt

## Tests module for [@prisma-cms](https://github.com/prisma-cms/boilerplate)

### Run tests
1. Start @prisma-cms/server
2. Start @prisma-cms/front
3. `yarn test --testURL=http://localhost:3000`

### Test with serviceWorker
`TEST_WORKERS=true yarn test --testURL=http://localhost:3000`

### Test coverage
`yarn test --testURL=http://localhost:3000 --coverage`
More jest arguments see [jest docs](https://jestjs.io/docs/en/cli.html).

### Compatibility
