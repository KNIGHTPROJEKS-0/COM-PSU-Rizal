# Supabase Port Configuration

## Overview

This document outlines the custom port configuration for Supabase local development to avoid conflicts with other services like Label Studio.

## Port Changes

The default Supabase ports have been changed from the 543xx range to the 555xx range to avoid conflicts:

### Original Ports (Default)
- API: `54321`
- Database: `54322`
- Shadow Database: `54320`
- Connection Pooler: `54329`
- Studio: `54323`
- Inbucket (Email): `54324`

### New Ports (Custom)
- API: `55521`
- Database: `55522`
- Shadow Database: `55520`
- Connection Pooler: `55529`
- Studio: `55523`
- Inbucket (Email): `55524`

## Files Updated

1. **`supabase/config.toml`** - Main Supabase configuration file
2. **`.env.example`** - Environment variables template
3. **`lib/supabaseService.ts`** - Supabase service configuration

## Usage

### Local Development

When running Supabase locally, the services will be available at:

- **Supabase API**: `http://localhost:55521`
- **Supabase Studio**: `http://localhost:55523`
- **Database**: `postgresql://postgres:postgres@localhost:55522/postgres`
- **Email Testing (Inbucket)**: `http://localhost:55524`

### Starting Local Supabase

```bash
# Start Supabase with new port configuration
npm run supabase:start

# Or directly
supabase start
```

### Environment Variables

To use local Supabase, set in your `.env` file:

```env
USE_LOCAL_SUPABASE=true
SUPABASE_URL=http://localhost:55521
```

## Testing Configuration

Run the configuration test to verify everything is working:

```bash
npm run test:supabase
```

## Troubleshooting

### Port Conflicts

If you encounter port conflicts:

1. Check what's running on the ports:
   ```bash
   lsof -i :55521
   lsof -i :55522
   lsof -i :55523
   ```

2. Stop conflicting services or choose different ports in `supabase/config.toml`

### Docker Issues

If Supabase fails to start:

1. Ensure Docker is running
2. Check Docker has sufficient resources
3. Try resetting Supabase:
   ```bash
   supabase stop
   supabase start
   ```

## Benefits

- **No Conflicts**: Avoids conflicts with Label Studio (port 9996) and other services
- **Consistent**: All ports follow the 555xx pattern for easy identification
- **Flexible**: Can easily switch between local and cloud configurations
- **Documented**: Clear documentation for team members

## Notes

- Production always uses cloud Supabase regardless of local configuration
- The port changes only affect local development
- Cloud Supabase configuration remains unchanged
- All existing functionality is preserved