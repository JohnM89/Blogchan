#!/usr/bin/env node

/**
 * Markdown Notes to Blog Posts Publisher
 *
 * This script automatically converts markdown files from notes/drafts/
 * into BlogChan blog posts and moves them to notes/published/
 */

const fs = require('fs');
const path = require('path');
const { BlogPost, User } = require('../models');
const sequelize = require('../config/connection');

// Simple frontmatter parser
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: content };
  }

  const [, frontmatter, markdownContent] = match;
  const metadata = {};

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      metadata[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { metadata, content: markdownContent.trim() };
}

// Simple markdown to HTML converter (basic support)
function markdownToHtml(markdown) {
  let html = markdown;

  // Headers (must come before other replacements)
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/gs, match => {
    return `<ul>\n${match}</ul>\n`;
  });

  // Paragraphs (wrap non-tag lines)
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (!para) return '';
    if (para.startsWith('<')) return para;
    return `<p>${para}</p>`;
  }).join('\n');

  return html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

async function publishNote(filePath, userId) {
  try {
    console.log(`📝 Processing: ${path.basename(filePath)}`);

    // Read the markdown file
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse frontmatter and content
    const { metadata, content: markdownContent } = parseFrontmatter(content);

    // Extract title from frontmatter or use filename
    const title = metadata.title || path.basename(filePath, '.md');

    // Convert markdown to HTML
    const htmlContent = markdownToHtml(markdownContent);

    console.log(`   Title: ${title}`);
    console.log(`   Author ID: ${userId}`);

    // Create the blog post
    const post = await BlogPost.create({
      title,
      content: htmlContent,
      authorId: userId,
      upVotes: 0,
      downVotes: 0
    });

    console.log(`✅ Published: "${title}" (ID: ${post.id})`);

    // Move file to published directory
    const publishedPath = filePath.replace('/drafts/', '/published/');
    fs.renameSync(filePath, publishedPath);
    console.log(`📁 Moved to: ${path.basename(publishedPath)}`);

    return post;
  } catch (error) {
    console.error(`❌ Error publishing ${path.basename(filePath)}:`, error.message);
    throw error;
  }
}

async function publishAllNotes() {
  try {
    console.log('🚀 Starting BlogChan Notes Publisher...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get the automation user (or first user)
    const user = await User.findOne({
      where: { username: process.env.BLOG_AUTHOR_USERNAME || 'admin' }
    });

    if (!user) {
      const firstUser = await User.findOne();
      if (!firstUser) {
        throw new Error('No users found in database. Please create a user first.');
      }
      console.log(`⚠️  Using first available user: ${firstUser.username}\n`);
      var authorId = firstUser.id;
    } else {
      console.log(`👤 Publishing as: ${user.username}\n`);
      var authorId = user.id;
    }

    // Get all markdown files from drafts folder
    const draftsDir = path.join(__dirname, '../notes/drafts');
    const files = fs.readdirSync(draftsDir)
      .filter(file => file.endsWith('.md') && file !== 'example.md');

    if (files.length === 0) {
      console.log('📭 No new notes to publish.');
      console.log(`   Place .md files in: ${draftsDir}\n`);
      return;
    }

    console.log(`📚 Found ${files.length} note(s) to publish:\n`);

    // Publish each note
    const results = [];
    for (const file of files) {
      const filePath = path.join(draftsDir, file);
      try {
        const post = await publishNote(filePath, authorId);
        results.push({ success: true, file, post });
      } catch (error) {
        results.push({ success: false, file, error: error.message });
      }
      console.log(''); // Empty line between files
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('═══════════════════════════════════════');
    console.log(`✨ Publishing Complete!`);
    console.log(`   Published: ${successful}`);
    if (failed > 0) {
      console.log(`   Failed: ${failed}`);
    }
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Check if specific file was provided as argument
const specificFile = process.argv[2];

if (specificFile) {
  // Publish specific file
  if (!fs.existsSync(specificFile)) {
    console.error(`❌ File not found: ${specificFile}`);
    process.exit(1);
  }

  sequelize.authenticate()
    .then(async () => {
      const user = await User.findOne();
      if (!user) {
        throw new Error('No users found in database');
      }
      return publishNote(specificFile, user.id);
    })
    .then(() => {
      console.log('\n✨ Done!');
      sequelize.close();
    })
    .catch(error => {
      console.error('❌ Error:', error);
      sequelize.close();
      process.exit(1);
    });
} else {
  // Publish all notes in drafts folder
  publishAllNotes();
}
