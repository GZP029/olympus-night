# Olympus Night

A Greek theme for the Claude Code desktop app.

- **Dotted bust of Athena**: a halftone bust with a crested helmet, made of thousands of dots, beside the conversation.
- **Night and dawn**: in dark mode a starry sky with the month's constellation, named in Greek. In light mode a marble and Aegean-blue dawn with a distant temple.
- **Greek date** above the message box (for example ΚΔʹ ΝΟΕΜΒΡΙΟΥ · ΤΡΙΤΗ · MMXXVI). When the pointer moves over it, it turns into English letter by letter.
- **Marble and papyrus**: your messages are marble tablets with a Greek key in each corner. Claude's replies are papyrus scrolls between gilded rods. Tool calls are set in gold serif type.
- **Lyre sounds**: a quiet night drone and plucked lyre cues when you send a message and when Claude finishes. Press the speaker in the session's title bar to hear them.
- **`/oraculo [pregunta]`**: a saying from the Greek philosophers.

The backdrop is a still picture, built once and painted once, so it costs almost nothing while you work. Only the date moves, and only while the pointer is over it. The terminal and editor integrations do not draw themes.

## Install

At the prompt of a Claude Code session on your computer:

```
/plugin install olympus-night --marketplace GZP029/olympus-night
```

Answer `y` to add the marketplace, then pick a scope (user scope applies it to every project).

From a shell:

```bash
claude plugin install olympus-night --marketplace GZP029/olympus-night
```

Restart the Claude desktop app afterwards so new sessions pick up the theme.

## Update

```bash
claude plugin marketplace update olympus-night
```

```bash
claude plugin update olympus-night@olympus-night
```
