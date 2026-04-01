import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { CONFIG, GameState } from '../game.js';

describe('Test infrastructure', () => {
    it('should import CONFIG from game.js', () => {
        expect(CONFIG).toBeDefined();
        expect(CONFIG.GRAVITY).toBe(0.5);
        expect(CONFIG.FLAP_STRENGTH).toBe(-8);
    });

    it('should import GameState from game.js', () => {
        expect(GameState).toBeDefined();
        expect(GameState.IDLE).toBe('idle');
        expect(GameState.PLAYING).toBe('playing');
        expect(GameState.GAME_OVER).toBe('gameOver');
    });

    it('should run a basic fast-check property', () => {
        fc.assert(
            fc.property(fc.integer(), (n) => {
                return typeof n === 'number';
            })
        );
    });
});
