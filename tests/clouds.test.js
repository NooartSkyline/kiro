import { describe, it, expect } from 'vitest';
import { createCloud, updateClouds, CONFIG } from '../game.js';

describe('createCloud', () => {
    const canvasWidth = 800;
    const canvasHeight = 600;

    it('returns an object with all required properties', () => {
        const cloud = createCloud(canvasWidth, canvasHeight);
        expect(cloud).toHaveProperty('x');
        expect(cloud).toHaveProperty('y');
        expect(cloud).toHaveProperty('width');
        expect(cloud).toHaveProperty('height');
        expect(cloud).toHaveProperty('speed');
        expect(cloud).toHaveProperty('opacity');
    });

    it('width is between 60 and 150', () => {
        for (let i = 0; i < 50; i++) {
            const cloud = createCloud(canvasWidth, canvasHeight);
            expect(cloud.width).toBeGreaterThanOrEqual(60);
            expect(cloud.width).toBeLessThanOrEqual(150);
        }
    });

    it('height is between 30 and 60', () => {
        for (let i = 0; i < 50; i++) {
            const cloud = createCloud(canvasWidth, canvasHeight);
            expect(cloud.height).toBeGreaterThanOrEqual(30);
            expect(cloud.height).toBeLessThanOrEqual(60);
        }
    });

    it('speed is between CLOUD_MIN_SPEED and CLOUD_MAX_SPEED', () => {
        for (let i = 0; i < 50; i++) {
            const cloud = createCloud(canvasWidth, canvasHeight);
            expect(cloud.speed).toBeGreaterThanOrEqual(CONFIG.CLOUD_MIN_SPEED);
            expect(cloud.speed).toBeLessThanOrEqual(CONFIG.CLOUD_MAX_SPEED);
        }
    });

    it('speed is always less than PIPE_SPEED', () => {
        for (let i = 0; i < 50; i++) {
            const cloud = createCloud(canvasWidth, canvasHeight);
            expect(cloud.speed).toBeLessThan(CONFIG.PIPE_SPEED);
        }
    });

    it('opacity is between CLOUD_MIN_OPACITY and CLOUD_MAX_OPACITY', () => {
        for (let i = 0; i < 50; i++) {
            const cloud = createCloud(canvasWidth, canvasHeight);
            expect(cloud.opacity).toBeGreaterThanOrEqual(CONFIG.CLOUD_MIN_OPACITY);
            expect(cloud.opacity).toBeLessThanOrEqual(CONFIG.CLOUD_MAX_OPACITY);
        }
    });

    it('opacity is always less than 1.0', () => {
        for (let i = 0; i < 50; i++) {
            const cloud = createCloud(canvasWidth, canvasHeight);
            expect(cloud.opacity).toBeLessThan(1.0);
        }
    });

    it('opacity is proportional to speed (slower = lower opacity)', () => {
        // Create many clouds and verify the linear relationship
        for (let i = 0; i < 50; i++) {
            const cloud = createCloud(canvasWidth, canvasHeight);
            const expectedOpacity = CONFIG.CLOUD_MIN_OPACITY +
                (cloud.speed - CONFIG.CLOUD_MIN_SPEED) / (CONFIG.CLOUD_MAX_SPEED - CONFIG.CLOUD_MIN_SPEED) *
                (CONFIG.CLOUD_MAX_OPACITY - CONFIG.CLOUD_MIN_OPACITY);
            expect(cloud.opacity).toBeCloseTo(expectedOpacity, 10);
        }
    });

    it('y is in upper portion of canvas', () => {
        for (let i = 0; i < 50; i++) {
            const cloud = createCloud(canvasWidth, canvasHeight);
            expect(cloud.y).toBeGreaterThanOrEqual(0);
            expect(cloud.y).toBeLessThanOrEqual(canvasHeight * 0.6);
        }
    });
});

describe('updateClouds', () => {
    const canvasWidth = 800;
    const canvasHeight = 600;

    it('moves clouds left by speed * deltaTime', () => {
        const clouds = [
            { x: 400, y: 100, width: 100, height: 40, speed: 0.5, opacity: 0.3 },
            { x: 600, y: 200, width: 80, height: 35, speed: 1.0, opacity: 0.4 }
        ];
        updateClouds(clouds, 1, canvasWidth, canvasHeight);
        expect(clouds[0].x).toBeCloseTo(399.5);
        expect(clouds[1].x).toBeCloseTo(599);
    });

    it('replaces offscreen clouds with new ones at right edge', () => {
        const clouds = [
            { x: -101, y: 100, width: 100, height: 40, speed: 0.5, opacity: 0.3 }
        ];
        updateClouds(clouds, 1, canvasWidth, canvasHeight);
        // Cloud was offscreen (x + width < 0), should be replaced
        expect(clouds[0].x).toBeGreaterThanOrEqual(canvasWidth);
    });

    it('keeps cloud count constant after update', () => {
        const clouds = [];
        for (let i = 0; i < CONFIG.CLOUD_COUNT; i++) {
            clouds.push(createCloud(canvasWidth, canvasHeight));
        }
        const countBefore = clouds.length;
        updateClouds(clouds, 1, canvasWidth, canvasHeight);
        expect(clouds.length).toBe(countBefore);
    });

    it('does nothing on empty array', () => {
        const clouds = [];
        updateClouds(clouds, 1, canvasWidth, canvasHeight);
        expect(clouds).toEqual([]);
    });

    it('handles large deltaTime without losing clouds', () => {
        const clouds = [];
        for (let i = 0; i < 3; i++) {
            clouds.push({ x: 100, y: 50, width: 80, height: 40, speed: 1.0, opacity: 0.4 });
        }
        // Large deltaTime pushes all clouds offscreen
        updateClouds(clouds, 10000, canvasWidth, canvasHeight);
        expect(clouds.length).toBe(3);
        // All replaced clouds should be at right edge
        for (const cloud of clouds) {
            expect(cloud.x).toBeGreaterThanOrEqual(canvasWidth);
        }
    });
});
