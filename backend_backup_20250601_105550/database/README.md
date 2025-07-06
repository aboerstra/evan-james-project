# Database Setup and Management

This directory contains database-related files for the Evan James Official Website backend.

## Database Configuration

The application uses **MySQL** as the database with the following configuration:
- **Database Name**: `evan_james_site`
- **Username**: `strapi`
- **Password**: `strapi`
- **Host**: `localhost`
- **Port**: `3306`

## Files

- `setup.sql` - Initial database and user creation script
- `database_backup.sql` - Complete database backup with all content
- `migrations/` - Strapi database migrations

## Initial Setup

### 1. Install MySQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# macOS with Homebrew
brew install mysql

# Start MySQL service
sudo systemctl start mysql  # Linux
brew services start mysql   # macOS
```

### 2. Create Database and User
```bash
# Login to MySQL as root
mysql -u root -p

# Run the setup script
source setup.sql

# Or manually:
CREATE DATABASE evan_james_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'strapi'@'localhost' IDENTIFIED BY 'strapi';
GRANT ALL PRIVILEGES ON evan_james_site.* TO 'strapi'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Restore Database from Backup
```bash
# Restore the complete database
mysql -u strapi -pstrapi evan_james_site < database_backup.sql
```

## Environment Variables

Create a `.env` file in the backend directory with:
```env
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=evan_james_site
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
```

## Database Content

The database includes:
- **Site Settings**: Logo, headers, background images
- **Bio**: Artist biography, headshot, gallery images
- **Albums**: Music releases with covers and track listings
- **Videos**: Featured videos with thumbnails
- **Tour Dates**: Concert information with venue images
- **Merchandise**: Product catalog with images
- **Photos**: Portfolio and promotional images
- **Press Releases**: Media content
- **Contact Submissions**: Form submissions

## Backup and Restore

### Create Backup
```bash
mysqldump -u strapi -pstrapi --no-tablespaces evan_james_site > database_backup.sql
```

### Restore Backup
```bash
mysql -u strapi -pstrapi evan_james_site < database_backup.sql
```

## Production Considerations

For production deployment:
1. Change default passwords
2. Use environment variables for sensitive data
3. Enable SSL connections
4. Set up regular automated backups
5. Configure proper user permissions
6. Use connection pooling for better performance

## Troubleshooting

### Common Issues

1. **Access Denied Error**
   ```bash
   # Check user permissions
   mysql -u root -p
   SHOW GRANTS FOR 'strapi'@'localhost';
   ```

2. **Connection Refused**
   ```bash
   # Check MySQL service status
   sudo systemctl status mysql
   ```

3. **Character Set Issues**
   ```bash
   # Verify database charset
   mysql -u strapi -pstrapi -e "SELECT @@character_set_database, @@collation_database;"
   ```

## Development

The Strapi backend automatically handles:
- Database migrations
- Schema updates
- Content type changes
- Relationship management

No manual database schema changes should be needed during development. 