---
title: Getting Started with BlogChan
author: BlogChan Team
tags: tutorial, getting-started, blogging
---

# Getting Started with BlogChan

Welcome to BlogChan! This is an example markdown note that demonstrates how to write blog posts using markdown files.

## Why Markdown?

Markdown is a lightweight markup language that's easy to write and read. With BlogChan's automated pipeline, you can:

- Write your thoughts in your favorite markdown editor
- Commit to Git for version control
- Automatically publish to your blog daily

## Formatting Examples

### Text Styling

You can use **bold text**, *italic text*, and even ***bold italic*** for emphasis.

### Lists

Ordered lists:
1. First item
2. Second item
3. Third item

Unordered lists:
- Bullet point one
- Bullet point two
- Bullet point three

### Code

Inline code: `const greeting = 'Hello, World!'`

Code blocks:
```javascript
function publishPost(title, content) {
  return BlogPost.create({
    title,
    content,
    authorId: session.user_id
  });
}
```

### Links and Images

[Visit BlogChan Documentation](https://github.com/JohnM89/Blogchan)

## Conclusion

That's all there is to it! Just write your markdown files in the `notes/drafts/` folder, and they'll be automatically published to your blog.

Happy blogging! 📝
