import { describe, it, expect } from 'vitest';
import { createPipe, updatePipes, removeOffscreenPipes, CONFIG } from '../game.js';

describe('createPipe', () => {
    const canvasWidth = 800;
    const canvasHeight = 600;
    const gapHeight = CONFIG.PIPE_GAP;
    const scoreBarHeight = CONFIG.SCORE_BAR_HEIGHT;

    it('sets x to canvasWidth (spawns at right edge)', () => {
        const pipe = createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight);
        expect(pipe.x).toBe(canvasWidth);
    });

    it('sets gapHeight from parameter', () => {
        const pipe = createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight);
        expect(pipe.gapHeight).toBe(gapHeight);
    });

    it('sets width to CONFIG.PIPE_WIDTH', () => {
        const pipe = createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight);
        expect(pipe.width).toBe(CONFIG.PIPE_WIDTH);
    });

    it('sets capWidth to PIPE_WIDTH + 2 * PIPE_CAP_OVERHANG', () => {
        const pipe = createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight);
        expect(pipe.capWidth).toBe(CONFIG.PIPE_WIDTH + 2 * CONFIG.PIPE_CAP_OVERHANG);
    });

    it('sets capHeight to CONFIG.PIPE_CAP_HEIGHT', () => {
        const pipe = createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight);
        expect(pipe.capHeight).toBe(CONFIG.PIPE_CAP_HEIGHT);
    });

    it('sets scored to false', () => {
        const pipe = createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight);
        expect(pipe.scored).toBe(false);
    });

    it('gapY keeps top pipe visible (gapY - gapHeight/2 > 0)', () => {
        for (let i = 0; i < 50; i++) {
            const pipe = createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight);
            expect(pipe.gapY - pipe.gapHeight / 2).toBeGreaterThanOrEqual(0);
        }
    });

    it('gapY keeps bottom pipe visible (gapY + gapHeight/2 < canvasHeight - scoreBarHeight)', () => {
        for (let i = 0; i < 50; i++) {
            const pipe = createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight);
            expect(pipe.gapY + pipe.gapHeight / 2).toBeLessThanOrEqual(canvasHeight - scoreBarHeight);
        }
    });
});

describe('updatePipes', () => {
    it('moves pipes left by speed * deltaTime', () => {
        const pipes = [
            { x: 400, width: 60 },
            { x: 600, width: 60 }
        ];
        updatePipes(pipes, 3, 1);
        expect(pipes[0].x).toBe(397);
        expect(pipes[1].x).toBe(597);
    });

    it('handles deltaTime scaling', () => {
        const pipes = [{ x: 500, width: 60 }];
        updatePipes(pipes, 3, 2);
        expect(pipes[0].x).toBe(494);
    });

    it('does nothing on empty array', () => {
        const pipes = [];
        updatePipes(pipes, 3, 1);
        expect(pipes).toEqual([]);
    });
});

describe('removeOffscreenPipes', () => {
    it('removes pipes that are fully off the left edge', () => {
        const pipes = [
            { x: -61, width: 60 },  // x + width = -1 < 0 → remove
            { x: 200, width: 60 }
        ];
        const result = removeOffscreenPipes(pipes);
        expect(result).toHaveLength(1);
        expect(result[0].x).toBe(200);
    });

    it('keeps pipes that are partially visible', () => {
        const pipes = [
            { x: -59, width: 60 },  // x + width = 1 >= 0 → keep
            { x: 100, width: 60 }
        ];
        const result = removeOffscreenPipes(pipes);
        expect(result).toHaveLength(2);
    });

    it('keeps pipe exactly at boundary (x + width = 0)', () => {
        const pipes = [{ x: -60, width: 60 }]; // x + width = 0 >= 0 → keep
        const result = removeOffscreenPipes(pipes);
        expect(result).toHaveLength(1);
    });

    it('returns new array (does not mutate original)', () => {
        const pipes = [{ x: 100, width: 60 }];
        const result = removeOffscreenPipes(pipes);
        expect(result).not.toBe(pipes);
        expect(result).toEqual(pipes);
    });

    it('returns empty array when all pipes are offscreen', () => {
        const pipes = [
            { x: -100, width: 60 },
            { x: -200, width: 60 }
        ];
        const result = removeOffscreenPipes(pipes);
        expect(result).toHaveLength(0);
    });
});
