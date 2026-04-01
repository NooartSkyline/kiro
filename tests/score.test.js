import { describe, it, expect, beforeEach } from 'vitest';
import {
    createScoreBoard,
    incrementScore,
    updateHighScore,
    resetScore,
    saveHighScore,
    loadHighScore,
    CONFIG
} from '../game.js';

// localStorage mock for Node/Vitest
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
global.localStorage = localStorageMock;

beforeEach(() => {
    localStorage.clear();
});

describe('incrementScore', () => {
    it('increases score by 1', () => {
        const sb = { score: 0, highScore: 0 };
        incrementScore(sb);
        expect(sb.score).toBe(1);
    });

    it('increases score from non-zero value', () => {
        const sb = { score: 5, highScore: 10 };
        incrementScore(sb);
        expect(sb.score).toBe(6);
    });
});

describe('updateHighScore', () => {
    it('sets highScore when score is higher', () => {
        const sb = { score: 10, highScore: 5 };
        updateHighScore(sb);
        expect(sb.highScore).toBe(10);
    });

    it('keeps highScore when score is lower', () => {
        const sb = { score: 3, highScore: 8 };
        updateHighScore(sb);
        expect(sb.highScore).toBe(8);
    });

    it('keeps highScore when score equals highScore', () => {
        const sb = { score: 7, highScore: 7 };
        updateHighScore(sb);
        expect(sb.highScore).toBe(7);
    });
});

describe('saveHighScore + loadHighScore', () => {
    it('round trips a high score through localStorage', () => {
        saveHighScore(42);
        expect(loadHighScore()).toBe(42);
    });

    it('round trips zero', () => {
        saveHighScore(0);
        expect(loadHighScore()).toBe(0);
    });
});

describe('loadHighScore', () => {
    it('returns 0 when nothing stored', () => {
        expect(loadHighScore()).toBe(0);
    });

    it('returns 0 for corrupted (non-numeric) data', () => {
        localStorage.setItem(CONFIG.HIGH_SCORE_KEY, 'not-a-number');
        expect(loadHighScore()).toBe(0);
    });

    it('returns 0 for empty string', () => {
        localStorage.setItem(CONFIG.HIGH_SCORE_KEY, '');
        expect(loadHighScore()).toBe(0);
    });
});

describe('resetScore', () => {
    it('sets score to 0 and keeps highScore', () => {
        const sb = { score: 15, highScore: 20 };
        resetScore(sb);
        expect(sb.score).toBe(0);
        expect(sb.highScore).toBe(20);
    });

    it('works when score is already 0', () => {
        const sb = { score: 0, highScore: 5 };
        resetScore(sb);
        expect(sb.score).toBe(0);
        expect(sb.highScore).toBe(5);
    });
});

describe('createScoreBoard', () => {
    it('returns score 0 and loads highScore from localStorage', () => {
        saveHighScore(99);
        const sb = createScoreBoard();
        expect(sb.score).toBe(0);
        expect(sb.highScore).toBe(99);
    });

    it('returns score 0 and highScore 0 when nothing stored', () => {
        const sb = createScoreBoard();
        expect(sb.score).toBe(0);
        expect(sb.highScore).toBe(0);
    });
});
