# Markdown Notes to Blog Posts

This directory contains your markdown notes that will be automatically published as blog posts.

## Directory Structure

```
notes/
├── drafts/          # Place new markdown files here
├── published/       # Processed files are moved here after publishing
└── README.md        # This file
```

## Markdown File Format

Create your markdown files in the `drafts/` directory with the following frontmatter:

```markdown
---
title: Your Blog Post Title
author: Your Name
tags: javascript, webdev, tutorial
---

# Your Blog Post Title

Your content here in markdown format...

## Headings work great

- Lists are supported
- Bullet points too

**Bold text** and *italic text* work perfectly.

Code blocks:
```javascript
console.log('Hello, BlogChan!');
```
```

## Frontmatter Fields

- `title` (required): The title of your blog post
- `author` (optional): Author name (defaults to your username)
- `tags` (optional): Comma-separated tags

## Publishing Your Notes

### Local Publishing (Recommended)

The easiest way to publish your notes:

1. **Make sure your server is running** (in another terminal):
   ```bash
   npm start
   # or for development:
   npm run dev
   ```

2. **Publish your notes**:
   ```bash
   npm run publish-notes
   ```

3. **View your posts** at `http://localhost:3001/homepage`

Files are automatically moved from `drafts/` to `published/` after successful publishing.

### Publish Specific File

```bash
node scripts/publish-notes.js notes/drafts/my-specific-post.md
```

### Automated Publishing (Advanced)

> **Note**: Only works with hosted deployments (Railway, Render, etc.)

If you deploy BlogChan to a free hosting service with a database, the GitHub Actions workflow can automatically publish notes daily at midnight UTC. See the main README.md for deployment instructions.

## Example Note

See `drafts/example.md` for a template.
