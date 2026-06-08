// TanStack Solid Query + sessionStorage persistence — feature parity with Tide's
// built-in sessionStorage hydration. This is the FAIR head-to-head for "instant revisit".
import * as tq from '@tanstack/solid-query'
import * as persist from '@tanstack/solid-query-persist-client'
import * as syncPersister from '@tanstack/query-sync-storage-persister'
;(globalThis as any).__keep = [tq, persist, syncPersister]
