import { describe, it, expect } from 'vitest';
import { boxesOverlap, checkCollision, CONFIG } from '../game.js';

describe('boxesOverlap', () => {
    it('returns true for overlapping boxes', () => {
        const a = { x: 0, y: 0, width: 10, height: 10 };
        const b = { x: 5, y: 5, width: 10, height: 10 };
        expect(boxesOverlap(a, b)).toBe(true);
    });

    it('returns true when one box is inside the other', () => {
        const a = { x: 0, y: 0, width: 20, height: 20 };
        const b = { x: 5, y: 5, width: 5, height: 5 };
        expect(boxesOverlap(a, b)).toBe(true);
    });

    it('returns false for non-overlapping boxes (side by side)', () => {
        const a = { x: 0, y: 0, width: 10, height: 10 };
        const b = { x: 20, y: 0, width: 10, height: 10 };
        expect(boxesOverlap(a, b)).toBe(false);
    });

    it('returns false for non-overlapping boxes (above/below)', () => {
        const a = { x: 0, y: 0, width: 10, height: 10 };
        const b = { x: 0, y: 20, width: 10, height: 10 };
        expect(boxesOverlap(a, b)).toBe(false);
    });

    it('returns false for edge-touching boxes (horizontal)', () => {
        const a = { x: 0, y: 0, width: 10, height: 10 };
        const b = { x: 10, y: 0, width: 10, height: 10 };
        expect(boxesOverlap(a, b)).toBe(false);
    });

    it('returns false for edge-touching boxes (vertical)', () => {
        const a = { x: 0, y: 0, width: 10, height: 10 };
        const b = { x: 0, y: 10, width: 10, height: 10 };
        expect(boxesOverlap(a, b)).toBe(false);
    });

    it('returns false when a zero-width box is outside the other', () => {
        const a = { x: 15, y: 5, width: 0, height: 10 };
        const b = { x: 0, y: 0, width: 10, height: 10 };
        expect(boxesOverlap(a, b)).toBe(false);
    });

    it('returns false when a box has zero height', () => {
        const a = { x: 0, y: 0, width: 10, height: 0 };
        const b = { x: 0, y: 0, width: 10, height: 10 };
        expect(boxesOverlap(a, b)).toBe(false);
    });
});

describe('checkCollision', () => {
    const canvasHeight = 600;
    const scoreBarHeight = CONFIG.SCORE_BAR_HEIGHT;

    it('detects floor collision', () => {
        const ghosty = { x: 80, y: canvasHeight - scoreBarHeight - 40, width: 40, height: 40 };
        expect(checkCollision(ghosty, [], canvasHeight, scoreBarHeight)).toBe(true);
    });

    it('detects ceiling collision', () => {
        const ghosty = { x: 80, y: 0, width: 40, height: 40 };
        expect(checkCollision(ghosty, [], canvasHeight, scoreBarHeight)).toBe(true);
    });

    it('detects collision with top pipe', () => {
        const ghosty = { x: 100, y: 30, width: 40, height: 40 };
        const pipe = { x: 110, gapY: 200, gapHeight: 150, width: 60 };
        // Top pipe: { x:110, y:0, width:60, height:125 }
        // Ghosty at y=30, height=40 → overlaps top pipe
        expect(checkCollision(ghosty, [pipe], canvasHeight, scoreBarHeight)).toBe(true);
    });

    it('detects collision with bottom pipe', () => {
        const ghosty = { x: 100, y: 450, width: 40, height: 40 };
        const pipe = { x: 110, gapY: 300, gapHeight: 150, width: 60 };
        // Bottom pipe starts at y = 300 + 75 = 375
        // Ghosty at y=450, height=40 → overlaps bottom pipe
        expect(checkCollision(ghosty, [pipe], canvasHeight, scoreBarHeight)).toBe(true);
    });

    it('returns false when ghosty passes safely through gap', () => {
        const ghosty = { x: 100, y: 250, width: 40, height: 40 };
        const pipe = { x: 110, gapY: 280, gapHeight: 150, width: 60 };
        // Gap from 205 to 355, ghosty from 250 to 290 → safe
        expect(checkCollision(ghosty, [pipe], canvasHeight, scoreBarHeight)).toBe(false);
    });

    it('returns false with no pipes and ghosty in safe position', () => {
        const ghosty = { x: 80, y: 200, width: 40, height: 40 };
        expect(checkCollision(ghosty, [], canvasHeight, scoreBarHeight)).toBe(false);
    });

    it('returns false when ghosty is far from pipe horizontally', () => {
        const ghosty = { x: 10, y: 50, width: 40, height: 40 };
        const pipe = { x: 400, gapY: 300, gapHeight: 150, width: 60 };
        expect(checkCollision(ghosty, [pipe], canvasHeight, scoreBarHeight)).toBe(false);
    });
});
