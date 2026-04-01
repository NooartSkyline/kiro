import { describe, it, expect } from 'vitest';
import { updateGhosty, flapGhosty, clampGhosty, CONFIG } from '../game.js';

// Helper to create a ghosty object
function makeGhosty(overrides = {}) {
    return { x: 80, y: 200, width: 40, height: 40, velocity: 0, ...overrides };
}

describe('updateGhosty', () => {
    it('adds gravity to velocity and velocity to y', () => {
        const g = makeGhosty({ y: 100, velocity: 2 });
        updateGhosty(g, CONFIG.GRAVITY);
        expect(g.velocity).toBe(2.5);
        expect(g.y).toBe(102.5);
    });

    it('works with zero velocity', () => {
        const g = makeGhosty({ y: 50, velocity: 0 });
        updateGhosty(g, CONFIG.GRAVITY);
        expect(g.velocity).toBe(0.5);
        expect(g.y).toBe(50.5);
    });

    it('works with negative velocity (going up)', () => {
        const g = makeGhosty({ y: 100, velocity: -5 });
        updateGhosty(g, CONFIG.GRAVITY);
        expect(g.velocity).toBe(-4.5);
        expect(g.y).toBe(95.5);
    });
});

describe('flapGhosty', () => {
    it('sets velocity to flapStrength', () => {
        const g = makeGhosty({ velocity: 5 });
        flapGhosty(g, CONFIG.FLAP_STRENGTH);
        expect(g.velocity).toBe(-8);
    });

    it('overrides any existing velocity', () => {
        const g = makeGhosty({ velocity: -3 });
        flapGhosty(g, -10);
        expect(g.velocity).toBe(-10);
    });
});

describe('clampGhosty', () => {
    it('clamps y to 0 when above canvas', () => {
        const g = makeGhosty({ y: -20 });
        clampGhosty(g, 600, CONFIG.SCORE_BAR_HEIGHT);
        expect(g.y).toBe(0);
    });

    it('clamps y to max when below playable area', () => {
        const g = makeGhosty({ y: 999 });
        clampGhosty(g, 600, CONFIG.SCORE_BAR_HEIGHT);
        // maxY = 600 - 40 - 40 = 520
        expect(g.y).toBe(520);
    });

    it('does not change y when within bounds', () => {
        const g = makeGhosty({ y: 250 });
        clampGhosty(g, 600, CONFIG.SCORE_BAR_HEIGHT);
        expect(g.y).toBe(250);
    });

    it('allows y exactly at 0', () => {
        const g = makeGhosty({ y: 0 });
        clampGhosty(g, 600, CONFIG.SCORE_BAR_HEIGHT);
        expect(g.y).toBe(0);
    });

    it('allows y exactly at max boundary', () => {
        const g = makeGhosty({ y: 520 });
        clampGhosty(g, 600, CONFIG.SCORE_BAR_HEIGHT);
        expect(g.y).toBe(520);
    });
});
