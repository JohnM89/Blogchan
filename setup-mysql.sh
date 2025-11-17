#!/bin/bash

# BlogChan MySQL Setup Script for Arch Linux
# This script starts MySQL/MariaDB and creates the database

set -e  # Exit on error

echo "🔧 BlogChan MySQL Setup for Arch Linux"
echo "========================================"
echo ""

# Check if MariaDB/MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL/MariaDB not found!"
    echo ""
    echo "Install it with:"
    echo "  sudo pacman -S mariadb"
    echo ""
    exit 1
fi

# Check if MariaDB is initialized
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "📦 MariaDB not initialized. Initializing now..."
    sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
    echo "✅ MariaDB initialized"
    echo ""
fi

# Start MariaDB service
echo "🚀 Starting MariaDB service..."
if sudo systemctl is-active --quiet mariadb; then
    echo "✅ MariaDB is already running"
else
    sudo systemctl start mariadb
    echo "✅ MariaDB started"
fi

# Enable MariaDB to start on boot (optional)
if ! sudo systemctl is-enabled --quiet mariadb; then
    echo "📌 Enabling MariaDB to start on boot..."
    sudo systemctl enable mariadb
fi

echo ""
echo "🔍 Checking MariaDB status..."
sudo systemctl status mariadb --no-pager | head -3

echo ""
echo "📊 Creating BlogChan database..."

# Read database config from .env or use defaults
DB_NAME=${DB_NAME:-blogchan_db}
DB_USER=${DB_USER:-root}
DB_PASSWORD=${DB_PASSWORD:-}

# Create database if it doesn't exist
if [ -z "$DB_PASSWORD" ]; then
    # No password (fresh install)
    mysql -u"$DB_USER" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null && \
        echo "✅ Database '$DB_NAME' ready" || \
        echo "ℹ️  Database already exists or check credentials"
else
    # With password
    mysql -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null && \
        echo "✅ Database '$DB_NAME' ready" || \
        echo "ℹ️  Database already exists or check credentials"
fi

echo ""
echo "✨ MySQL setup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env: cp .env.example .env"
echo "  2. Update .env with your database credentials"
echo "  3. Run: npm install"
echo "  4. Run: npm start"
echo ""
echo "Database connection:"
echo "  Host: localhost"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# If first time, suggest running mysql_secure_installation
if [ -z "$DB_PASSWORD" ]; then
    echo "⚠️  SECURITY: No root password set!"
    echo "   Run: sudo mysql_secure_installation"
    echo ""
fi
