# Hero videos — Ring Nepal

## Active hero (used by the site)

| File | Path in code | Why |
|------|--------------|-----|
| **`hero.mp4`** | `/videos/hero.mp4` | **Selected** — gold + diamond lifestyle, rings & bracelets, premium editorial look |
| `hero-poster.jpg` | `/videos/hero-poster.jpg` | Still frame while video loads |

Source file (same content, kept as backup):
`grok-video-86ac671b-d633-4170-bfa3-9e0171cff450.mp4`

## Other options (not wired)

| File | Look | Use when |
|------|------|----------|
| `grok-video-75d4bfb3-….mp4` | Bold **gold** chain + rings, fashion pose | Want stronger pure-gold Nepal vibe |
| `grok-video-1657a078-….mp4` | Silver/diamond rings, soft white studio | Diamond / silver campaign |
| `grok-video-1657a078-…(1).mp4` | Same series as above, alternate angle | Alternate silver hero |

## Switch hero later

```bash
cp "your-file.mp4" hero.mp4
# optional: refresh poster
ffmpeg -y -ss 1.5 -i hero.mp4 -frames:v 1 -q:v 2 hero-poster.jpg
```

Code already points at `/videos/hero.mp4` — no path change needed.
