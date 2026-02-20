# Optional: Full-Text Search — PantyHub

> **Feature Type:** OPTIONAL
> **Complexity:** Medium
> **Dependencies:** Database (pg_trgm extension)
> **Goal:** Fast full-text search across all entities

---

## Tasks

### Task SR.1: Database Setup

Enable trigram extension and create indexes:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index on searchable columns for each entity
-- CREATE INDEX idx_user_search ON users USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_listing_search ON listings USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_review_search ON reviews USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_shop_search ON shops USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_order_search ON orders USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_payment_search ON payments USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_subscription_search ON subscriptions USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_upload_search ON uploads USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_channel_search ON channels USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_notification_search ON notifications USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_conversation_search ON conversations USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_message_search ON messages USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_globalsearchfeature_search ON globalsearchfeatures USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_safetransactions_search ON safetransactions USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_ownshopsystem_search ON ownshopsystems USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_setyourownprices_search ON setyourownprices USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_notransactionfees_search ON notransactionfees USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_messagesandchatsystem_search ON messagesandchatsystems USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_classifiedadmarket_search ON classifiedadmarkets USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_memberreviews_search ON memberreviews USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_privacyfunctions_search ON privacyfunctions USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_mediacloud_search ON mediaclouds USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_userblockingsystem_search ON userblockingsystems USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_humanoperatedfakecheck_search ON humanoperatedfakechecks USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_memberreviewsandratings_search ON memberreviewsandratings USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_fullfeaturedprofiles_search ON fullfeaturedprofiles USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_sellerratingsandbuyerreviews_search ON sellerratingsandbuyerreviews USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_userrankinglist_search ON userrankinglists USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_friendsandfanssystem_search ON friendsandfanssystems USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_customvideoclips_search ON customvideoclips USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_privatephotosets_search ON privatephotosets USING GIN (name gin_trgm_ops);
-- CREATE INDEX idx_whatsappandskypechats_search ON whatsappandskypechats USING GIN (name gin_trgm_ops);
```

### Task SR.2: Search Hook

Create `hooks/use-search.ts`:
- `useSearch(query: string, entityType?: string)`
- Debounce 300ms
- Calls `GET /api/search?q=query&type=entityType`
- Returns `{ results, isLoading }`

### Task SR.3: Search API

Create `app/api/search/route.ts`:
- Accepts `q` (query) and optional `type` (entity type) params
- Uses `ILIKE` or `similarity()` with pg_trgm
- Searches across name/title fields of all entities
- Returns unified results with entity_type + entity_id + display fields
- Limit 20 results, auth required

### Task SR.4: Search UI

Create `components/search-bar.tsx`:
- Command palette style (Cmd+K shortcut)
- Real-time results as you type
- Results grouped by entity type
- Click result → navigate to entity detail page

---

## Checkpoint

- [ ] Cmd+K opens search
- [ ] Results appear while typing (debounced)
- [ ] Results link to correct entity pages
- [ ] Empty state when no results
- [ ] Search is auth-protected (user sees only own data)
- [ ] `npm run build` passes


---

> **🎨 Design:** Follow `docs/DESIGN_SYSTEM.md` for colors, typography, component patterns, and hover states. NEVER hardcode colors — use CSS variables.
