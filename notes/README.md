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

## Automated Publishing

The GitHub Actions workflow runs daily at midnight UTC and:
1. Scans the `drafts/` folder for new `.md` files
2. Converts them to blog posts
3. Publishes them to BlogChan
4. Moves processed files to `published/`

## Manual Publishing

Run the script manually:
```bash
npm run publish-notes
```

Or publish a specific file:
```bash
node scripts/publish-notes.js notes/drafts/my-post.md
```

## Example Note

See `drafts/example.md` for a template.
