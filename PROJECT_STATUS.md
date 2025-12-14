# PROJECT STATUS & ARCHITECTURE REPORT
**Date:** 2025-12-14
**Version:** 1.0.0 (Sync)

## 1. Project Structure
Visual overview of the key directories.

```text
/
├── app/                  # Next.js App Router
│   ├── (corporate)/      # Static pages (about, privacy, etc.)
│   ├── admin/            # Admin Panel (Users, Settings)
│   ├── auth/             # Auth Pages (Login, Callback)
│   ├── chat/             # Real-time Messaging System
│   ├── item/             # Product Detail Pages ([id])
│   ├── maintenance/      # Maintenance Mode Landing
│   ├── profile/          # User Profiles & Listings
│   ├── sell/             # Item Listing/Upload Flow
│   ├── actions.ts        # Server Actions (Global)
│   └── layout.tsx        # Root Layout (Hydration fix applied)
├── components/           # Shared UI Components
│   ├── navbar.tsx        # Main Navigation (Client Component)
│   ├── footer.tsx        # Global Footer
│   ├── item-actions.tsx  # Chat/Offer Buttons
│   └── ... (ui/ shadcn)
├── lib/                  # Utilities & Constants
│   ├── master-data.ts    # Category Definitions
│   └── ...
└── utils/                # Supabase Integration
    └── supabase/
        ├── client.ts     # Client-side Supabase
        ├── server.ts     # Server-side Supabase
        ├── middleware.ts # Session Management
        └── url-helper.ts # Image URL Builder (Global)
```

## 2. Database Schema (Inferred)
The code operates assuming the following schema structure. Note the critical transitions in the `items` table.

### `items`
*Core product table.*
- `id` (uuid)
- `title`, `description`, `price`
- `category` (string, mapped from `master-data.ts`)
- `status` (enum: 'active', 'inactive', 'sold')
- `image_urls` (text array)
- **`owner_id`** (uuid) - **PRIMARY OWNERSHIP FIELD**
- *Legacy/Alias fields observed:* `seller_id`, `user_id` (Being deprecated/migrated)

### `profiles`
*User data.*
- `id` (uuid, matches Auth ID)
- `username`
- `full_name`
- `avatar_url`
- `role` (enum: 'admin', 'moderator', 'user')
- `is_maintenance_mode` (boolean) - *User-specific lockout?*

### `conversations`
*Chat sessions.*
- `id` (uuid)
- `item_id` (FK -> items)
- `user1_id` / `user2_id` (Participants)
- `updated_at`

### `platform_settings`
*Global config.*
- `id` (int, usually 1)
- `is_maintenance_mode` (boolean)
- `is_registration_open` (boolean)

## 3. Critical Logic Map

### Authentication & Security
- **Middleware (`middleware.ts`):** 
  - Refreshes Supabase session.
  - Checks `platform_settings.is_maintenance_mode`.
  - **Redirects:** Non-admins -> `/maintenance` (if active).
  - **Protected Routes:** `/admin`, `/profile`, `/sell`, `/messages`.

### Image Handling
- **Upload:** Occurs in `/sell` (Client -> Server Action).
- **Display:** Uses `utils/supabase/url-helper.ts`.
  - Function: `getStorageUrl(path)`
  - Logic: Appends Supabase Storage URL to paths. Handles Full URLs gracefully.

### Chat System
- **Entry Point:** `components/item-actions.tsx`
  - Logic: Checks for existing conversation via `.or()` query.
  - Creates new if missing.
- **Interface:** `app/chat/page.tsx`
  - Real-time: Uses `supabase.channel` for `direct_messages`.
  - Optimistic UI: used for message sending.

## 4. Inconsistency Report (Action Items)
The system is currently straddling a migration from `user_id` to `owner_id`.

**⚠️ Critical Mixed Usage:**
Files handling specific fallback logic to survive the migration:

1.  **`app/item/[id]/page.tsx`**
    - Logic: `const ownerId = item.owner_id || item.seller_id || item.user_id;`
    - Status: **Patched (Safe)**

2.  **`app/admin/users/[id]/page.tsx`**
    - Logic: Explicit fallback warning `console.warn(...)` and re-fetch using `user_id` if `owner_id` fails.
    - Status: **Patched (Safe)**

3.  **`app/profile/[username]/page.tsx`**
    - Logic: Strictly uses `owner_id`.
    - Status: **Patched (Safe)**

4.  **`app/actions.ts` (Global Actions)**
    - ⚠️ **Potential Risk:** Grep search indicates `user_id` usage.
    - **Action:** verify if this refers to `items.user_id` or `favorites/likes.user_id`. (Favorites typically use `user_id` correctly).

**Recommendation:** Continue enforcing `owner_id` for Item ownership in all new code. Refactor `actions.ts` if it touches Item creation/updates.
