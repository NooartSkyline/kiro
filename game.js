// ============================================================
// Flappy Kiro — Game Constants & State
// ============================================================

const CONFIG = {
    // ฟิสิกส์
    GRAVITY: 0.5,
    FLAP_STRENGTH: -8,

    // ท่อ
    PIPE_WIDTH: 60,
    PIPE_GAP: 150,
    PIPE_SPEED: 3,
    PIPE_SPAWN_INTERVAL: 1500,
    PIPE_CAP_HEIGHT: 20,
    PIPE_CAP_OVERHANG: 5,

    // เมฆ
    CLOUD_MIN_SPEED: 0.3,
    CLOUD_MAX_SPEED: 1.2,
    CLOUD_MIN_OPACITY: 0.15,
    CLOUD_MAX_OPACITY: 0.5,
    CLOUD_COUNT: 5,

    // กระดานคะแนน
    SCORE_BAR_HEIGHT: 40,
    HIGH_SCORE_KEY: 'flappyKiroHighScore',

    // สี
    BG_COLOR: '#87CEEB',
    PIPE_COLOR: '#2E8B57',
    PIPE_CAP_COLOR: '#3CB371',
    SCORE_BAR_BG: 'rgba(0, 0, 0, 0.7)',

    // Red Gate (Impossible Mode)
    RED_GATE_PROBABILITY: 0.15,
    REVERSE_GRAVITY_DURATION: 10,
    RED_GATE_COLOR: '#B22222',
    RED_GATE_CAP_COLOR: '#DC143C',

    // Countdown Timer
    TIMER_FONT_SIZE: 28,
    TIMER_COLOR: '#FF4444',
    TIMER_X: 16,
    TIMER_Y: 36
};

const GameState = {
    IDLE: 'idle',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver'
};

// ============================================================
// Ghosty Physics
// ============================================================

function updateGhosty(ghosty, gravity) {
    ghosty.velocity += gravity;
    ghosty.y += ghosty.velocity;
}

function flapGhosty(ghosty, flapStrength) {
    ghosty.velocity = flapStrength;
}

function clampGhosty(ghosty, canvasHeight, scoreBarHeight) {
    const minY = 0;
    const maxY = canvasHeight - scoreBarHeight - ghosty.height;
    if (ghosty.y < minY) {
        ghosty.y = minY;
    } else if (ghosty.y > maxY) {
        ghosty.y = maxY;
    }
}

// ============================================================
// Gravity Controller (Impossible Mode)
// ============================================================

function createGravityController() {
    return { reversed: false, timer: 0 };
}

function activateReverseGravity(gc, duration) {
    gc.reversed = true;
    gc.timer = duration;
}

function updateGravityController(gc, deltaTime) {
    if (gc.timer > 0) {
        gc.timer -= deltaTime;
        if (gc.timer <= 0) {
            gc.timer = 0;
            gc.reversed = false;
        }
    }
}

function resetGravityController(gc) {
    gc.reversed = false;
    gc.timer = 0;
}

function getEffectiveGravity(gc, baseGravity) {
    return gc.reversed ? -baseGravity : baseGravity;
}

function getEffectiveFlapStrength(gc, baseFlapStrength) {
    return gc.reversed ? -baseFlapStrength : baseFlapStrength;
}

function getTimerDisplay(gc) {
    return gc.timer > 0 ? Math.ceil(gc.timer) : 0;
}

// ============================================================
// Pipe System
// ============================================================

function createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight) {
    const minGapY = gapHeight / 2;
    const maxGapY = canvasHeight - scoreBarHeight - gapHeight / 2;
    const gapY = minGapY + Math.random() * (maxGapY - minGapY);

    return {
        x: canvasWidth,
        gapY: gapY,
        gapHeight: gapHeight,
        width: CONFIG.PIPE_WIDTH,
        capWidth: CONFIG.PIPE_WIDTH + 2 * CONFIG.PIPE_CAP_OVERHANG,
        capHeight: CONFIG.PIPE_CAP_HEIGHT,
        scored: false
    };
}

function createRedGate(canvasWidth, canvasHeight, gapHeight, scoreBarHeight) {
    return { ...createPipe(canvasWidth, canvasHeight, gapHeight, scoreBarHeight), isRedGate: true };
}

function shouldSpawnRedGate(probability) {
    return Math.random() < probability;
}

function updatePipes(pipes, speed, deltaTime) {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= speed * deltaTime;
    }
}

function removeOffscreenPipes(pipes) {
    return pipes.filter(pipe => pipe.x + pipe.width >= 0);
}

// ============================================================
// Collision Detection
// ============================================================

function boxesOverlap(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function checkCollision(ghosty, pipes, canvasHeight, scoreBarHeight) {
    // Floor collision
    if (ghosty.y + ghosty.height >= canvasHeight - scoreBarHeight) {
        return true;
    }
    // Ceiling collision
    if (ghosty.y <= 0) {
        return true;
    }
    // Pipe collision
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        const topPipe = {
            x: pipe.x,
            y: 0,
            width: pipe.width,
            height: pipe.gapY - pipe.gapHeight / 2
        };
        const bottomPipe = {
            x: pipe.x,
            y: pipe.gapY + pipe.gapHeight / 2,
            width: pipe.width,
            height: canvasHeight - scoreBarHeight - (pipe.gapY + pipe.gapHeight / 2)
        };
        if (boxesOverlap(ghosty, topPipe) || boxesOverlap(ghosty, bottomPipe)) {
            return true;
        }
    }
    return false;
}

// ============================================================
// Score System
// ============================================================

function loadHighScore() {
    try {
        const stored = localStorage.getItem(CONFIG.HIGH_SCORE_KEY);
        if (stored === null) return 0;
        const parsed = parseInt(stored, 10);
        return isNaN(parsed) ? 0 : parsed;
    } catch (e) {
        return 0;
    }
}

function saveHighScore(highScore) {
    try {
        localStorage.setItem(CONFIG.HIGH_SCORE_KEY, String(highScore));
    } catch (e) {
        // localStorage unavailable (e.g. private browsing) — silently ignore
    }
}

function createScoreBoard() {
    return {
        score: 0,
        highScore: loadHighScore()
    };
}

function incrementScore(scoreBoard) {
    scoreBoard.score += 1;
}

function updateHighScore(scoreBoard) {
    scoreBoard.highScore = Math.max(scoreBoard.score, scoreBoard.highScore);
}

function resetScore(scoreBoard) {
    scoreBoard.score = 0;
}

// ============================================================
// Cloud System
// ============================================================

function createCloud(canvasWidth, canvasHeight) {
    const width = 60 + Math.random() * 90;   // 60-150
    const height = 30 + Math.random() * 30;  // 30-60
    const x = Math.random() * canvasWidth;
    const y = Math.random() * (canvasHeight * 0.6); // upper portion
    const speed = CONFIG.CLOUD_MIN_SPEED + Math.random() * (CONFIG.CLOUD_MAX_SPEED - CONFIG.CLOUD_MIN_SPEED);
    const opacity = CONFIG.CLOUD_MIN_OPACITY + (speed - CONFIG.CLOUD_MIN_SPEED) / (CONFIG.CLOUD_MAX_SPEED - CONFIG.CLOUD_MIN_SPEED) * (CONFIG.CLOUD_MAX_OPACITY - CONFIG.CLOUD_MIN_OPACITY);

    return { x, y, width, height, speed, opacity };
}

function updateClouds(clouds, deltaTime, canvasWidth, canvasHeight) {
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].x -= clouds[i].speed * deltaTime;
        if (clouds[i].x + clouds[i].width < 0) {
            const newCloud = createCloud(canvasWidth, canvasHeight);
            newCloud.x = canvasWidth + Math.random() * 100;
            clouds[i] = newCloud;
        }
    }
}

function renderCloud(ctx, cloud) {
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    ctx.fillStyle = '#FFFFFF';
    const radius = Math.min(cloud.width, cloud.height) / 2;
    ctx.beginPath();
    ctx.moveTo(cloud.x + radius, cloud.y);
    ctx.lineTo(cloud.x + cloud.width - radius, cloud.y);
    ctx.arcTo(cloud.x + cloud.width, cloud.y, cloud.x + cloud.width, cloud.y + radius, radius);
    ctx.lineTo(cloud.x + cloud.width, cloud.y + cloud.height - radius);
    ctx.arcTo(cloud.x + cloud.width, cloud.y + cloud.height, cloud.x + cloud.width - radius, cloud.y + cloud.height, radius);
    ctx.lineTo(cloud.x + radius, cloud.y + cloud.height);
    ctx.arcTo(cloud.x, cloud.y + cloud.height, cloud.x, cloud.y + cloud.height - radius, radius);
    ctx.lineTo(cloud.x, cloud.y + radius);
    ctx.arcTo(cloud.x, cloud.y, cloud.x + radius, cloud.y, radius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// ============================================================
// State Machine — Input Handler
// ============================================================

function handleInput(gameState, callbacks) {
    const { flapGhosty: flap, playJumpSound, resetGame } = callbacks;

    if (gameState.state === GameState.IDLE) {
        gameState.state = GameState.PLAYING;
        flap();
        playJumpSound();
    } else if (gameState.state === GameState.PLAYING) {
        flap();
        playJumpSound();
    } else if (gameState.state === GameState.GAME_OVER) {
        resetGame();
        gameState.state = GameState.PLAYING;
    }
}

function setupInputHandlers(canvas, onInput) {
    canvas.addEventListener('mousedown', function (e) {
        e.preventDefault();
        onInput();
    });
    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        onInput();
    });
    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space') {
            e.preventDefault();
            onInput();
        }
    });
}

// ============================================================
// Audio Manager
// ============================================================

function createAudioManager() {
    var manager = { jumpSound: null, gameOverSound: null };
    try {
        manager.jumpSound = new Audio('assets/jump.wav');
        manager.gameOverSound = new Audio('assets/game_over.wav');
    } catch (e) {
        // Audio not available — game continues without sound
    }
    return manager;
}

function playJumpSound(audioManager) {
    if (audioManager.jumpSound) {
        try {
            audioManager.jumpSound.currentTime = 0;
            audioManager.jumpSound.play().catch(function () { });
        } catch (e) { }
    }
}

function playGameOverSound(audioManager) {
    if (audioManager.gameOverSound) {
        try {
            audioManager.gameOverSound.currentTime = 0;
            audioManager.gameOverSound.play().catch(function () { });
        } catch (e) { }
    }
}

// ============================================================
// Rendering
// ============================================================

function renderBackground(ctx, canvasWidth, canvasHeight) {
    ctx.fillStyle = CONFIG.BG_COLOR;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function renderPipe(ctx, pipe, canvasHeight, scoreBarHeight) {
    var pipeColor = pipe.isRedGate ? CONFIG.RED_GATE_COLOR : CONFIG.PIPE_COLOR;
    var capColor = pipe.isRedGate ? CONFIG.RED_GATE_CAP_COLOR : CONFIG.PIPE_CAP_COLOR;
    var topPipeBottom = pipe.gapY - pipe.gapHeight / 2;
    var bottomPipeTop = pipe.gapY + pipe.gapHeight / 2;
    var playAreaBottom = canvasHeight - scoreBarHeight;

    // Top pipe body
    ctx.fillStyle = pipeColor;
    ctx.fillRect(pipe.x, 0, pipe.width, topPipeBottom);

    // Top pipe cap
    ctx.fillStyle = capColor;
    ctx.fillRect(
        pipe.x - CONFIG.PIPE_CAP_OVERHANG,
        topPipeBottom - CONFIG.PIPE_CAP_HEIGHT,
        pipe.capWidth,
        CONFIG.PIPE_CAP_HEIGHT
    );

    // Bottom pipe body
    ctx.fillStyle = pipeColor;
    ctx.fillRect(pipe.x, bottomPipeTop, pipe.width, playAreaBottom - bottomPipeTop);

    // Bottom pipe cap
    ctx.fillStyle = capColor;
    ctx.fillRect(
        pipe.x - CONFIG.PIPE_CAP_OVERHANG,
        bottomPipeTop,
        pipe.capWidth,
        CONFIG.PIPE_CAP_HEIGHT
    );
}

function renderGhosty(ctx, ghosty) {
    if (ghosty.image && ghosty.image.complete) {
        ctx.drawImage(ghosty.image, ghosty.x, ghosty.y, ghosty.width, ghosty.height);
    } else {
        // Fallback: white circle
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(ghosty.x + ghosty.width / 2, ghosty.y + ghosty.height / 2, ghosty.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function renderScoreBoard(ctx, scoreBoard, canvasWidth, canvasHeight) {
    var barY = canvasHeight - CONFIG.SCORE_BAR_HEIGHT;

    // Background bar
    ctx.fillStyle = CONFIG.SCORE_BAR_BG;
    ctx.fillRect(0, barY, canvasWidth, CONFIG.SCORE_BAR_HEIGHT);

    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px monospace';
    ctx.textBaseline = 'middle';
    var textY = barY + CONFIG.SCORE_BAR_HEIGHT / 2;

    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + scoreBoard.score, 12, textY);

    ctx.textAlign = 'right';
    ctx.fillText('High: ' + scoreBoard.highScore, canvasWidth - 12, textY);
}

function renderIdleScreen(ctx, canvasWidth, canvasHeight) {
    // Semi-transparent dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Flappy Kiro', canvasWidth / 2, canvasHeight / 2 - 40);

    // Instruction
    ctx.font = '20px monospace';
    ctx.fillText('Click / Tap / Space to Start', canvasWidth / 2, canvasHeight / 2 + 20);
}

function renderGameOverScreen(ctx, canvasWidth, canvasHeight, score) {
    // Semi-transparent dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Game Over text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', canvasWidth / 2, canvasHeight / 2 - 50);

    // Score display
    ctx.font = '28px monospace';
    ctx.fillText('Score: ' + score, canvasWidth / 2, canvasHeight / 2 + 10);

    // Restart instruction
    ctx.font = '20px monospace';
    ctx.fillText('Click / Tap / Space to Restart', canvasWidth / 2, canvasHeight / 2 + 60);
}

function renderCountdownTimer(ctx, gravityController) {
    if (!gravityController.reversed) return;
    var display = getTimerDisplay(gravityController);
    if (display <= 0) return;
    ctx.fillStyle = CONFIG.TIMER_COLOR;
    ctx.font = CONFIG.TIMER_FONT_SIZE + 'px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('\u23F1 ' + display + 's', CONFIG.TIMER_X, CONFIG.TIMER_Y);
}

function render(ctx, gameState, canvasWidth, canvasHeight) {
    renderBackground(ctx, canvasWidth, canvasHeight);

    for (var i = 0; i < gameState.clouds.length; i++) {
        renderCloud(ctx, gameState.clouds[i]);
    }

    for (var j = 0; j < gameState.pipes.length; j++) {
        renderPipe(ctx, gameState.pipes[j], canvasHeight, CONFIG.SCORE_BAR_HEIGHT);
    }

    renderGhosty(ctx, gameState.ghosty);
    renderScoreBoard(ctx, gameState.scoreBoard, canvasWidth, canvasHeight);

    if (gameState.gravityController) {
        renderCountdownTimer(ctx, gameState.gravityController);
    }

    if (gameState.state === GameState.IDLE) {
        renderIdleScreen(ctx, canvasWidth, canvasHeight);
    } else if (gameState.state === GameState.GAME_OVER) {
        renderGameOverScreen(ctx, canvasWidth, canvasHeight, gameState.scoreBoard.score);
    }
}

// ============================================================
// Game Update — ประสานทุก system ในแต่ละเฟรม
// ============================================================

function update(game, deltaTime, canvasWidth, canvasHeight, lastPipeSpawn, timestamp) {
    // 1. Update Ghosty physics — use effective gravity (reversed when Impossible Mode active)
    var effectiveGravity = game.gravityController
        ? getEffectiveGravity(game.gravityController, CONFIG.GRAVITY)
        : CONFIG.GRAVITY;
    updateGhosty(game.ghosty, effectiveGravity * deltaTime);
    clampGhosty(game.ghosty, canvasHeight, CONFIG.SCORE_BAR_HEIGHT);

    // 2. Spawn new pipes based on interval
    if (timestamp - lastPipeSpawn > CONFIG.PIPE_SPAWN_INTERVAL) {
        if (shouldSpawnRedGate(CONFIG.RED_GATE_PROBABILITY)) {
            game.pipes.push(createRedGate(canvasWidth, canvasHeight, CONFIG.PIPE_GAP, CONFIG.SCORE_BAR_HEIGHT));
        } else {
            game.pipes.push(createPipe(canvasWidth, canvasHeight, CONFIG.PIPE_GAP, CONFIG.SCORE_BAR_HEIGHT));
        }
        game._lastPipeSpawn = timestamp;
    }

    // 3. Move pipes
    updatePipes(game.pipes, CONFIG.PIPE_SPEED, deltaTime);

    // 4. Remove offscreen pipes
    game.pipes = removeOffscreenPipes(game.pipes);

    // 5. Check collision → Game Over
    if (checkCollision(game.ghosty, game.pipes, canvasHeight, CONFIG.SCORE_BAR_HEIGHT)) {
        game.state = GameState.GAME_OVER;
        playGameOverSound(game.audioManager);
        updateHighScore(game.scoreBoard);
        saveHighScore(game.scoreBoard.highScore);
        return;
    }

    // 6. Check scoring — Ghosty passed a pipe
    for (var i = 0; i < game.pipes.length; i++) {
        var pipe = game.pipes[i];
        if (!pipe.scored && pipe.x + pipe.width < game.ghosty.x) {
            pipe.scored = true;
            incrementScore(game.scoreBoard);

            // Red Gate passage → activate reverse gravity
            if (pipe.isRedGate && game.gravityController) {
                activateReverseGravity(game.gravityController, CONFIG.REVERSE_GRAVITY_DURATION);
            }
        }
    }

    // 7. Update gravity controller timer
    if (game.gravityController) {
        updateGravityController(game.gravityController, deltaTime);
    }
}

// ============================================================
// Game Initialization & Loop
// ============================================================

function initGame() {
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) {
        document.body.textContent = 'Your browser does not support Canvas.';
        return;
    }

    // Resize canvas to fill window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load Ghosty image
    var ghostyImage = new Image();
    ghostyImage.src = 'assets/ghosty.png';

    // Create initial game state
    var game = {
        state: GameState.IDLE,
        ghosty: {
            x: 80,
            y: canvas.height / 2 - 20,
            width: 40,
            height: 40,
            velocity: 0,
            image: ghostyImage
        },
        pipes: [],
        clouds: [],
        scoreBoard: createScoreBoard(),
        audioManager: createAudioManager(),
        gravityController: createGravityController()
    };

    // Initialize clouds
    for (var i = 0; i < CONFIG.CLOUD_COUNT; i++) {
        game.clouds.push(createCloud(canvas.width, canvas.height));
    }

    var lastTimestamp = 0;
    var lastPipeSpawn = 0;

    // Reset game function
    function resetGame() {
        game.ghosty.y = canvas.height / 2 - 20;
        game.ghosty.velocity = 0;
        game.pipes = [];
        updateHighScore(game.scoreBoard);
        saveHighScore(game.scoreBoard.highScore);
        resetScore(game.scoreBoard);
        lastPipeSpawn = 0;
        if (game.gravityController) {
            resetGravityController(game.gravityController);
        }
    }

    // Setup input
    setupInputHandlers(canvas, function () {
        handleInput(game, {
            flapGhosty: function () { flapGhosty(game.ghosty, game.gravityController ? getEffectiveFlapStrength(game.gravityController, CONFIG.FLAP_STRENGTH) : CONFIG.FLAP_STRENGTH); },
            playJumpSound: function () { playJumpSound(game.audioManager); },
            resetGame: resetGame
        });
    });

    // Game loop
    function gameLoop(timestamp) {
        if (lastTimestamp === 0) lastTimestamp = timestamp;
        var deltaTime = (timestamp - lastTimestamp) / 16.67; // normalize to ~60fps
        lastTimestamp = timestamp;

        // Cap deltaTime to prevent huge jumps
        if (deltaTime > 3) deltaTime = 3;

        if (game.state === GameState.PLAYING) {
            update(game, deltaTime, canvas.width, canvas.height, lastPipeSpawn, timestamp);
            lastPipeSpawn = game._lastPipeSpawn || lastPipeSpawn;
        }

        // Always update clouds for visual effect
        updateClouds(game.clouds, deltaTime, canvas.width, canvas.height);

        render(ctx, game, canvas.width, canvas.height);
        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
}

// Auto-start when loaded in browser
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initGame);
}

// Conditional export for Node/Vitest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, GameState, updateGhosty, flapGhosty, clampGhosty, createPipe, updatePipes, removeOffscreenPipes, boxesOverlap, checkCollision, createScoreBoard, incrementScore, updateHighScore, resetScore, saveHighScore, loadHighScore, createCloud, updateClouds, handleInput, createGravityController, activateReverseGravity, updateGravityController, resetGravityController, getEffectiveGravity, getEffectiveFlapStrength, getTimerDisplay, createRedGate, shouldSpawnRedGate };
}
