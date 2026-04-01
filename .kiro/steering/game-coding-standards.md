---
inclusion: auto
---

# JavaScript Game Coding Standards

## Naming Conventions

- Use `camelCase` for variables, functions, and parameters: `updateGhosty`, `pipeSpeed`, `deltaTime`
- Use `PascalCase` for class names and constructors: `AudioManager`, `ScoreBoard`
- Use `UPPER_SNAKE_CASE` for constants and config values: `GRAVITY`, `PIPE_SPEED`, `MAX_VELOCITY`
- Prefix boolean variables with `is`, `has`, or `should`: `isPlaying`, `hasScored`, `shouldReset`
- Use descriptive names for game entities: `ghosty`, `pipePair`, `cloud` — avoid abbreviations like `g`, `pp`, `c`

## Game Loop Patterns

- Always use `requestAnimationFrame` for the main game loop
- Calculate `deltaTime` from timestamps to ensure frame-rate independent movement
- Separate `update(dt)` and `render(ctx)` phases clearly — never mix logic with drawing
- Keep the game loop function minimal — delegate to update/render helpers

```javascript
// Preferred pattern
function gameLoop(timestamp) {
  const dt = (timestamp - lastTime) / 16.67; // normalize to ~60fps
  lastTime = timestamp;
  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}
```

## Pure Functions for Game Logic

- Write game logic (physics, collision, scoring) as pure functions where possible
- Pure functions take state in, return new state — no side effects
- This makes logic testable without DOM or Canvas dependencies

```javascript
// Good: pure, testable
function applyGravity(velocity, gravity) {
  return velocity + gravity;
}

// Avoid: mutates external state
function applyGravity() {
  ghosty.velocity += GRAVITY;
}
```

## Performance Guidelines

- Minimize object allocation in the game loop — reuse objects, avoid `new` in hot paths
- Use object pools for frequently created/destroyed entities (pipes, clouds)
- Avoid `Array.filter()` or `Array.map()` in the game loop — use in-place mutation or index swapping
- Cache Canvas context properties (`ctx.fillStyle`, `ctx.font`) — only set when changed
- Use `ctx.save()`/`ctx.restore()` sparingly — prefer manual state management
- Batch similar draw calls together (all pipes, then all clouds, then UI)

## Canvas Rendering

- Clear only the necessary region when possible, or full clear with `clearRect`
- Draw background layers first, foreground last (painter's algorithm)
- Use integer pixel coordinates to avoid sub-pixel anti-aliasing blur: `Math.round(x)`
- Pre-render static or complex shapes to offscreen canvases when beneficial

## State Management

- Use a single game state object as the source of truth
- Define game states as string constants or an enum-like object
- Handle state transitions explicitly — avoid implicit state from multiple booleans

## Error Handling in Games

- Wrap asset loading (images, audio) in try-catch or use fallbacks
- Never let an audio `play()` rejection crash the game loop — always `.catch()` it
- Guard `localStorage` access with try-catch for private browsing compatibility
- Validate parsed data (`parseInt`, `JSON.parse`) — check for `NaN` and `null`

## File Organization

- For small games (single-page): keep all code in one `game.js` file with clearly separated sections
- Use comments to delineate sections: `// === PHYSICS ===`, `// === RENDERING ===`
- Export functions for testing using conditional module detection:

```javascript
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { applyGravity, checkCollision, ... };
}
```
