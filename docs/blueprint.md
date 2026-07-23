# Friendly Chat Assistant — Bot specification

**Archetype:** custom

**Voice:** friendly and concise — write every user-facing message, button label, error, and empty state in this voice.

A general-purpose Telegram chatbot that provides casual conversation, Q&A, text summarization, and simple text editing. Maintains short-term context (last 20 messages) for natural flow while enforcing rate limits to prevent abuse. Delivers friendly, concise responses with safe-content filtering.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- casual Telegram users
- people seeking quick assistance
- entertainment seekers

## Success criteria

- Daily active user count > 1000
- Average session duration > 3 minutes
- Error rate < 2% during peak hours

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open the main menu with greeting and usage examples
- **/help** (command, actor: user, command: /help) — Show available features and command list
- **/examples** (command, actor: user, command: /examples) — Display sample interactions
- **/clear** (command, actor: user, command: /clear) — Reset conversation history
  - outputs: Confirmation message
- **/summary** (command, actor: user, command: /summary) — Request text summarization
  - inputs: Text to summarize
  - outputs: Generated summary

## Flows

### Start Flow
_Trigger:_ /start

1. Send greeting message
2. Display usage examples
3. Offer conversation initiation

_Data touched:_ User

### Chat Flow
_Trigger:_ User message

1. Receive user input
2. Process with context window
3. Generate response
4. Send reply

_Data touched:_ Conversation session, Message, Usage record

### Rate Limit Flow
_Trigger:_ Usage record threshold exceeded

1. Detect limit breach
2. Send ephemeral error message
3. Temporarily block further messages

_Data touched:_ Usage record

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **User** _(retention: persistent)_ — Telegram account identifier and basic metadata
  - fields: Telegram ID, First use timestamp
- **Conversation session** _(retention: session)_ — Short-term message history for context preservation
  - fields: Message sequence, Timestamps, Context window size (20)
- **Message** _(retention: session)_ — Individual user prompts and bot responses
  - fields: Content, Timestamp, Message type
- **Usage record** _(retention: persistent)_ — Analytics and rate-limiting metrics
  - fields: Message count, Token usage, Timestamp

## Integrations

- **Telegram** (required) — Bot API messaging and notifications
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Configure admin chat ID for daily usage reports
- Adjust rate-limit thresholds (messages/hour)

## Notifications

- Daily usage summary to owner's Telegram chat

## Permissions & privacy

- Only stores Telegram ID and anonymized usage metrics
- No personal data retained beyond 24 hours
- Conversation history limited to last 20 messages

## Edge cases

- User sends non-text messages (handle with fallback response)
- Multiple simultaneous /clear commands (ensure atomic session reset)
- Context window overflow (truncate oldest messages)

## Required tests

- Verify greeting message on /start
- Test session persistence across 20 messages
- Validate rate-limit error handling
- Confirm daily analytics report delivery

## Assumptions

- Context window size of 20 messages is sufficient for casual conversations
- Rate limit of 60 messages/hour balances usability and abuse prevention
- Users will not request sensitive data storage
