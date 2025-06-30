# Supabase Setup for ChatBooks

This guide will help you set up your Supabase project for the ChatBooks application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com/](https://supabase.com/) and sign up or log in
2. Create a new project and note your project URL and anon key

## 2. Set Up Environment Variables

1. Copy the `.env.example` file to `.env` in the root of your project
2. Fill in your Supabase URL and anon key:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 3. Set Up Database Schema Using Migrations

We use a migration-based approach to set up and maintain the database schema. See the `migrations` directory for detailed instructions.

### Quick Start with Migrations

1. Navigate to the `migrations` directory
2. Apply each migration file in numerical order (00001, 00002, etc.)
3. You can apply migrations using:
   - The Supabase dashboard SQL Editor
   - The Supabase CLI
   - A custom migration tool

Detailed instructions are available in the `migrations/README.md` file.

## 4. Storage Buckets

The migrations will create the following storage buckets:

- `manuscripts`: For storing book files (EPUB, DOCX)
- `audio`: For storing audio narrations
- `covers`: For storing book cover images
- `profiles`: For storing user profile images

Verify that these buckets have been created in the Storage section of your Supabase dashboard after running the migrations.

## 5. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Under Email Auth, make sure "Enable Email Signup" is turned on
3. Optionally, configure additional providers like Google, GitHub, etc.

## 6. Test Your Setup

1. Run the ChatBooks application locally
2. Try to register a new user
3. Verify that the user is created in both Supabase Auth and the `users` table

## Troubleshooting

- If you encounter CORS issues, make sure to add your application URL to the allowed origins in the API settings of your Supabase project
- If authentication isn't working, check that your environment variables are correctly set
- If you're having issues with storage, verify that the RLS policies are correctly configured

## Next Steps

Once your Supabase setup is complete, you can proceed with developing the ChatBooks application. The database schema and authentication are now ready for use.
