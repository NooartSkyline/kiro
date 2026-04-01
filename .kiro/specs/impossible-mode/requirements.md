# Requirements Document — Impossible Mode

## Introduction

Impossible Mode is a new gameplay mechanic for Flappy Kiro that introduces gravity reversal. A special red-colored gate occasionally appears in place of a normal green pipe pair. When Ghosty flies through the red gate, gravity reverses for 10 seconds, making Ghosty float upward instead of falling. A countdown timer is displayed in the top-left corner while reverse gravity is active. After the timer expires, gravity returns to normal.

## Glossary

- **Game_Engine**: The core system managing the game loop, state updates, and rendering on the HTML5 Canvas.
- **Ghosty**: The ghost character controlled by the player.
- **Pipe_Pair**: A pair of green pipes (top and bottom) with a gap in the middle for Ghosty to fly through.
- **Red_Gate**: A special pipe pair rendered in red that triggers gravity reversal when Ghosty passes through it. It replaces a normal Pipe_Pair at a configured probability.
- **Gravity_Controller**: The subsystem responsible for tracking the current gravity direction (normal or reversed) and managing the reversal timer.
- **Countdown_Timer**: A visual 10-second countdown displayed in the top-left corner of the Canvas while reverse gravity is active.
- **Score_Board**: The score bar at the bottom of the Canvas showing current score and high score.
- **Collision_Detector**: The system that detects collisions between Ghosty and obstacles.

## Requirements

### Requirement 1: Red Gate Spawning

**User Story:** As a player, I want a red-colored gate to occasionally appear instead of a normal pipe pair, so that I have the opportunity to trigger Impossible Mode.

#### Acceptance Criteria

1. THE Game_Engine SHALL occasionally spawn a Red_Gate in place of a normal Pipe_Pair, using a configurable spawn probability.
2. THE Game_Engine SHALL render the Red_Gate with a red color scheme that is visually distinct from the green Pipe_Pair.
3. THE Game_Engine SHALL ensure that the Red_Gate has the same gap size and movement speed as a normal Pipe_Pair.
4. THE Game_Engine SHALL ensure that the Red_Gate gap position falls within the same playable vertical bounds as a normal Pipe_Pair.
5. WHILE reverse gravity is already active, THE Game_Engine SHALL continue to spawn Red_Gates at the configured probability without restriction.

### Requirement 2: Gravity Reversal Activation

**User Story:** As a player, I want gravity to reverse when Ghosty flies through a red gate, so that I experience a challenging change in gameplay.

#### Acceptance Criteria

1. WHEN Ghosty passes through a Red_Gate, THE Gravity_Controller SHALL reverse the direction of gravity so that Ghosty is pulled upward instead of downward.
2. WHEN Ghosty passes through a Red_Gate while reverse gravity is already active, THE Gravity_Controller SHALL reset the countdown timer to 10 seconds, extending the duration of reverse gravity.
3. WHILE reverse gravity is active, THE Game_Engine SHALL apply a negative gravity value to Ghosty so that Ghosty accelerates upward each frame.
4. WHILE reverse gravity is active, THE Game_Engine SHALL invert the flap direction so that player input pushes Ghosty downward instead of upward.

### Requirement 3: Countdown Timer Display

**User Story:** As a player, I want to see a countdown timer in the top-left corner while reverse gravity is active, so that I know how much time remains before gravity returns to normal.

#### Acceptance Criteria

1. WHEN reverse gravity activates, THE Game_Engine SHALL display the Countdown_Timer in the top-left corner of the Canvas showing 10 seconds.
2. WHILE reverse gravity is active, THE Countdown_Timer SHALL decrement each frame based on elapsed time and display the remaining seconds rounded up to the nearest whole number.
3. THE Countdown_Timer SHALL use a clearly visible font color and size that does not obstruct gameplay.
4. WHEN the Countdown_Timer reaches zero, THE Game_Engine SHALL hide the Countdown_Timer from the display.

### Requirement 4: Gravity Restoration

**User Story:** As a player, I want gravity to return to normal after 10 seconds, so that the Impossible Mode is a temporary challenge rather than permanent.

#### Acceptance Criteria

1. WHEN the Countdown_Timer reaches zero, THE Gravity_Controller SHALL restore gravity to the normal downward direction.
2. WHEN gravity is restored to normal, THE Game_Engine SHALL apply the original positive gravity value to Ghosty.
3. WHEN gravity is restored to normal, THE Game_Engine SHALL restore the flap direction so that player input pushes Ghosty upward.

### Requirement 5: Gameplay During Reverse Gravity

**User Story:** As a player, I want the game to remain fully playable during reverse gravity, so that I can still navigate through pipes and score points.

#### Acceptance Criteria

1. WHILE reverse gravity is active, THE Collision_Detector SHALL continue to detect collisions between Ghosty and Pipe_Pair or Red_Gate using the same bounding box logic.
2. WHILE reverse gravity is active, THE Collision_Detector SHALL continue to detect collisions with the ceiling and floor boundaries.
3. WHILE reverse gravity is active, THE Score_Board SHALL continue to increment the score when Ghosty passes through a Pipe_Pair or Red_Gate.
4. WHILE reverse gravity is active, THE Game_Engine SHALL continue to clamp Ghosty within the playable area of the Canvas.
5. WHILE reverse gravity is active, THE Game_Engine SHALL continue to spawn and move Pipe_Pairs and Red_Gates at the normal rate and speed.

### Requirement 6: Game Reset Behavior

**User Story:** As a player, I want the gravity state to reset when the game restarts, so that each new game starts with normal gravity.

#### Acceptance Criteria

1. WHEN the game resets after Game Over, THE Gravity_Controller SHALL restore gravity to the normal downward direction.
2. WHEN the game resets after Game Over, THE Countdown_Timer SHALL be hidden and its value reset.
3. WHEN the game transitions from Idle to Playing, THE Gravity_Controller SHALL start with normal downward gravity.

### Requirement 7: Error Handling

**User Story:** As a player, I want the game to handle edge cases gracefully during Impossible Mode, so that the game does not break or behave unexpectedly.

#### Acceptance Criteria

1. IF the Countdown_Timer value becomes negative due to a large delta time, THEN THE Gravity_Controller SHALL clamp the timer to zero and restore normal gravity.
2. IF Ghosty is at the ceiling when gravity reverses to normal, THEN THE Game_Engine SHALL clamp Ghosty within the playable area without triggering an immediate collision.
