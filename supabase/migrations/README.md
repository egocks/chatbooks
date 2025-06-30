# Supabase Migration Workflow for ChatBooks

This directory contains SQL migration files for setting up the ChatBooks database schema in Supabase.

## Migration Files

The migrations are numbered in the order they should be applied:

1. `00001_create_users_table.sql` - Creates the users table that extends Supabase auth.users
2. `00002_create_books_table.sql` - Creates the books table for storing book information
3. `00003_create_chapters_table.sql` - Creates the chapters table for storing book chapters
4. `00004_create_bookmarks_table.sql` - Creates the bookmarks table for storing user bookmarks
5. `00005_create_chat_messages_table.sql` - Creates the chat_messages table for storing user-book character interactions
6. `00006_create_reading_sessions_table.sql` - Creates the reading_sessions table for tracking user reading progress
7. `00007_create_book_tags_table.sql` - Creates the book_tags table for categorizing books
8. `00008_create_storage_buckets.sql` - Creates storage buckets for manuscripts, audio, covers, and profiles

## How to Apply Migrations

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. For each migration file, in order:
   - Open the file in a text editor
   - Copy the contents
   - Create a new query in the SQL Editor
   - Paste the contents
   - Run the query

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can use it to apply migrations:

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply migrations:
   ```bash
   supabase db push
   ```

### Option 3: Using a Migration Tool

You can also use a migration tool like [node-pg-migrate](https://github.com/salsita/node-pg-migrate) or [Prisma Migrate](https://www.prisma.io/migrate) to apply these migrations programmatically.

## Rollback

Each migration file includes a "Down Migration" section that can be used to roll back the changes if needed. To roll back, execute the SQL statements in the "Down Migration" section in reverse order (from the last migration to the first).

## Best Practices

- Always back up your database before applying migrations
- Apply migrations in order, from lowest number to highest
- Test migrations in a development environment before applying to production
- Keep track of which migrations have been applied to each environment

## Adding New Migrations

When adding new migrations:

1. Create a new file with the next sequential number
2. Include both "Up Migration" and "Down Migration" sections
3. Test the migration thoroughly before applying to production
