import { describe, it, expect, vi } from 'vitest';
import { handleInput, GameState } from '../game.js';

function makeCallbacks() {
    return {
        flapGhosty: vi.fn(),
        playJumpSound: vi.fn(),
        resetGame: vi.fn()
    };
}

describe('handleInput', () => {
    describe('Idle → Playing', () => {
        it('transitions state from IDLE to PLAYING', () => {
            const gs = { state: GameState.IDLE };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(gs.state).toBe(GameState.PLAYING);
        });

        it('calls flapGhosty and playJumpSound on IDLE', () => {
            const gs = { state: GameState.IDLE };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(cb.flapGhosty).toHaveBeenCalledOnce();
            expect(cb.playJumpSound).toHaveBeenCalledOnce();
        });

        it('does not call resetGame on IDLE', () => {
            const gs = { state: GameState.IDLE };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(cb.resetGame).not.toHaveBeenCalled();
        });
    });

    describe('Playing → flap (stays Playing)', () => {
        it('keeps state as PLAYING', () => {
            const gs = { state: GameState.PLAYING };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(gs.state).toBe(GameState.PLAYING);
        });

        it('calls flapGhosty and playJumpSound on PLAYING', () => {
            const gs = { state: GameState.PLAYING };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(cb.flapGhosty).toHaveBeenCalledOnce();
            expect(cb.playJumpSound).toHaveBeenCalledOnce();
        });

        it('does not call resetGame on PLAYING', () => {
            const gs = { state: GameState.PLAYING };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(cb.resetGame).not.toHaveBeenCalled();
        });
    });

    describe('GameOver → Playing (reset)', () => {
        it('transitions state from GAME_OVER to PLAYING', () => {
            const gs = { state: GameState.GAME_OVER };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(gs.state).toBe(GameState.PLAYING);
        });

        it('calls resetGame on GAME_OVER', () => {
            const gs = { state: GameState.GAME_OVER };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(cb.resetGame).toHaveBeenCalledOnce();
        });

        it('does not call flapGhosty or playJumpSound on GAME_OVER', () => {
            const gs = { state: GameState.GAME_OVER };
            const cb = makeCallbacks();
            handleInput(gs, cb);
            expect(cb.flapGhosty).not.toHaveBeenCalled();
            expect(cb.playJumpSound).not.toHaveBeenCalled();
        });
    });
});
