/**
 * ============================================================================
 * ASTROCADE LIBRARY (lib) - API REFERENCE
 * ============================================================================
 *
 * The lib object is automatically available in your game code via "lib"
 * This is READ-ONLY reference documentation - lib code is owned by Astrocade.
 *
 * Your game's entry point:
 *
 *   function run(mode) {
 *     // mode is 'edit' or 'play'
 *     // window.gameConfig is already set up before run() is called
 *   }
 *
 * If you remove this function the game will not run.
 */


/* ============================================================================
 * TYPE DEFINITIONS
 * ============================================================================ */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {string} username - The player's username
 * @property {string|null} profilePicture - URL to profile picture, or null
 * @property {number} score - The player's score
 */

/**
 * @typedef {Object} LeaderboardResponse
 * @property {LeaderboardEntry[]} entries - Array of leaderboard entries
 * @property {number|null} userRank - Current user's rank, or null if not ranked
 * @property {boolean} [success] - Whether the operation succeeded
 */

/**
 * @typedef {Object} UserGameStateResponse
 * @property {string} userId - The user's ID
 * @property {string} gameId - The game's ID
 * @property {Object|null} state - The saved state, or null if none exists
 * @property {boolean} [success] - Whether the operation succeeded
 */


/* ============================================================================
 * GLOBALS
 * ============================================================================ */

/**
 * The game's configuration state.
 * Automatically available before run() is called.
 * In edit mode, changes are tracked for undo/redo.
 *
 * @type {Object}
 */
var gameConfig = window.gameConfig;

/**
 * Current game mode. Use to conditionally enable editor features.
 *
 * @type {'edit' | 'play'}
 */
var mode = window.mode;


/* ============================================================================
 * CORE FUNCTIONS
 * ============================================================================ */

/**
 * Retrieves an asset by its ID from the asset map.
 *
 * @param {string} id - The asset ID
 * @returns {Object|undefined} The asset object with these properties, or undefined if not found:
 *   - url: CDN URL for the asset
 *   - type: "image", "audio", or "animation"
 *   - aspect_ratio: [width, height] ratio (e.g., [1536, 1024]) - images only
 *   - size_hint: suggested display size - images only
 *   - view: perspective hint (e.g., "top-down", "side-view", "front-view") - images only
 *   - outline: collision/selection shape - images only
 *     - box: { type: "box", center: [x, y], size: [w, h] }
 *     - circle: { type: "circle", center: [x, y], radius: r }
 *     - polygon: { type: "polygon", points: [[x, y], ...] }
 *   - loop: "true" or "false" - whether audio should repeat - audio only
 *   - duration_secs: duration in seconds - audio only
 */
lib.getAsset = function(id) {};

/**
 * Debug logging. Messages are forwarded to the host environment console.
 *
 * @param {string} message - The message to log
 */
lib.log = function(message) {};

/**
 * Displays a game-wide settings panel in the host UI.
 * Call once in run() to register persistent game parameters.
 *
 * @param {Object} options
 * @param {string} options.name - Display name for the settings panel
 * @param {Object} options.params - Map of display names to parameter configs
 *   Each param config has:
 *   - key: path into gameConfig (e.g., 'settings.difficulty')
 *   - type: 'slider' | 'dropdown' | 'color' | 'checkbox' | 'string' | 'number'
 *   - min, max, step: for 'slider' type
 *   - options: [{label, value}] for 'dropdown' type
 *   - onChange(value): optional callback; if omitted, auto-updates gameConfig at key
 */
lib.showGameParameters = function(options) {};


/* ============================================================================
 * LEADERBOARD
 * ============================================================================ */

/**
 * Submits the current player's score to the game's leaderboard.
 * Throws if game is not saved or user is not authenticated.
 *
 * @param {number} score - The player's score
 * @param {number} [numEntries] - Optional: number of top entries to return
 * @returns {Promise<LeaderboardResponse>}
 */
lib.addPlayerScoreToLeaderboard = async function(score, numEntries) {};

/**
 * Retrieves the top N entries from the game's leaderboard.
 *
 * @param {number} [numEntries] - Optional: number of entries to retrieve
 * @returns {Promise<LeaderboardResponse>}
 */
lib.getTopNEntriesFromLeaderboard = async function(numEntries) {};


/* ============================================================================
 * USER GAME STATE (Save/Load)
 * ============================================================================ */

/**
 * Persists the user's game progress to the server.
 * State must be JSON-serializable (no functions, circular refs, etc).
 * Each user has one save slot per game; always pass the full latest state
 * (the slot is overwritten, not merged).
 *
 * Call whenever meaningful state changes — level complete, item earned,
 * settings changed, or a short settle after the player stops interacting.
 * Keep state compact and bounded — store what's needed to resume, and never let
 * a saved array (inventory, history, gallery) grow without a cap.
 *
 * @param {Object} state - The full game state to save
 * @returns {Promise<UserGameStateResponse>}
 */
lib.saveUserGameState = async function(state) {};

/**
 * Retrieves the user's previously saved game state.
 *
 * @returns {Promise<UserGameStateResponse>}
 */
lib.getUserGameState = async function() {};

/**
 * Deletes the user's saved game state.
 * Use for "New Game" or reset functionality.
 *
 * @returns {Promise<{success: boolean}>}
 */
lib.deleteUserGameState = async function() {};


/* ============================================================================
 * DEVICE DETECTION
 * ============================================================================ */

/**
 * Detects whether touch controls should be used.
 * Returns true on mobile/tablet devices (coarse pointer or no hover).
 *
 * @returns {boolean} true if touch controls are appropriate
 */
lib.shouldUseTouchControls = function() {};


/* ============================================================================
 * ANIMATION
 * ============================================================================ */

/**
 * @typedef {Object} AnimationPlayer
 * @property {function(number): void} update - Advances animation based on timestamp
 * @property {function(CanvasRenderingContext2D, number, number, number, number): void} draw - Draws current frame
 * @property {function(): {index: number, frame: {x: number, y: number, w: number, h: number}|undefined, total: number}} getCurrentFrame - Gets current frame info
 * @property {function(): void} reset - Resets animation to first frame
 */

/**
 * Creates an animation player for sprite sheet animations.
 * The assetId should reference an asset with animation data.
 *
 * @param {string} assetId - The animation asset ID
 * @returns {AnimationPlayer|null} The animation player, or null if not found
 *
 * @example
 * const anim = lib.getAnimationPlayer('player_run');
 * function gameLoop(timestamp) {
 *   anim.update(timestamp);
 *   anim.draw(ctx, x, y, 64, 64);
 *   requestAnimationFrame(gameLoop);
 * }
 */
lib.getAnimationPlayer = function(assetId) {};

/**
 * Preloads an animation's sprite sheet for smoother playback.
 * Call during initialization to avoid loading delays.
 *
 * @param {string} assetId - The animation asset ID
 * @returns {Promise<void>}
 */
lib.preloadAnimation = async function(assetId) {};


/* ============================================================================
 * LLM (Chat Completions)
 * ============================================================================ */

/**
 * @typedef {Object} LlmMessage
 * @property {'user' | 'assistant'} role - Speaker for this turn
 * @property {string} content - Message text
 */

/**
 * @typedef {Object} LlmConfig
 * @property {number} [temperature] - 0..2
 * @property {number} [maxOutputTokens] - 1..4,096
 */

/**
 * Calls a chat-completion LLM with the given conversation. Only use when output
 * depends on runtime state that couldn't be authored upfront (free-form player
 * input, accumulated in-session choices). Fixed dialogue, flavor text, and
 * canned hints belong in code or gameConfig — don't fetch what you could author.
 *
 * Don't use for game logic, scoring, physics, per-frame work, or anything
 * requiring determinism.
 *
 * Async; can throw on rate limit, network failure, timeout, or all-empty
 * messages. Wrap in try/catch with a non-LLM fallback so the game keeps working
 * when the call fails. Empty/whitespace-only messages are silently dropped
 * before sending — safe to feed a running chat history without sanitizing.
 *
 * Rate-limited server-side. Debounce user-triggered calls, cache repeated
 * prompts, never call per frame.
 *
 * result.text is a string. For structured output, instruct the model in
 * systemPrompt to reply with JSON and parse defensively (JSON.parse inside
 * try/catch with a non-LLM fallback).
 *
 * Caps: 100 messages, 50,000 chars/message, 200,000 chars aggregate, 10,000
 * chars systemPrompt.
 *
 * @param {Object} options
 * @param {LlmMessage[]} options.messages - Conversation so far
 * @param {string} [options.systemPrompt] - Persona / instructions
 * @param {LlmConfig} [options.config] - Sampling controls
 * @returns {Promise<{text: string}>}
 *
 * @example
 * try {
 *   const reply = await lib.llm({
 *     messages: [{ role: 'user', content: 'Greet the player as a grumpy wizard.' }],
 *     systemPrompt: 'You are a wizard NPC. Reply in one short sentence.',
 *     config: { temperature: 0.8, maxOutputTokens: 60 },
 *   });
 *   showDialogue(reply.text);
 * } catch (err) {
 *   showDialogue('The wizard grumbles incoherently.');
 * }
 */
lib.llm = async function(options) {};
