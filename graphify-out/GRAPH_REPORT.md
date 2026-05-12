# Graph Report - fupela.github.io  (2026-05-12)

## Corpus Check
- 39 files · ~294,121 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 176 nodes · 229 edges · 17 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `KitPDF` - 12 edges
2. `parse_and_render()` - 10 edges
3. `JsonLdParser` - 7 edges
4. `GET()` - 7 edges
5. `getTools()` - 7 edges
6. `main()` - 6 edges
7. `sync()` - 6 edges
8. `MetadataParser` - 6 edges
9. `NewsletterHandler` - 6 edges
10. `type_message()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getDocumentContent()`  [INFERRED]
  mission-control/src/app/api/workspace/route.ts → mission-control/src/lib/workspace.ts
- `GET()` --calls--> `getAgents()`  [INFERRED]
  mission-control/src/app/api/workspace/route.ts → mission-control/src/lib/workspace.ts
- `GET()` --calls--> `getModelUsage()`  [INFERRED]
  mission-control/src/app/api/workspace/route.ts → mission-control/src/lib/workspace.ts
- `POST()` --calls--> `gmailConfigured()`  [INFERRED]
  mission-control/src/app/api/send-outreach/route.ts → mission-control/src/lib/gmail.ts
- `POST()` --calls--> `sendEmail()`  [INFERRED]
  mission-control/src/app/api/send-outreach/route.ts → mission-control/src/lib/gmail.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.22
Nodes (6): build(), clean(), KitPDF, parse_and_render(), Replace unicode chars that latin-1 can't encode., FPDF

### Community 1 - "Community 1"
Cohesion: 0.26
Nodes (9): GET(), readLocalActivity(), relativeTime(), GET(), readLocalLeads(), getAccessToken(), readSheet(), sheetsConfigured() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.3
Nodes (10): deleteTool(), ensureDataFile(), getTool(), getTools(), saveTool(), updateTool(), DELETE(), GET() (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.36
Nodes (6): hydrateForm(), initCalls(), initProfileForm(), loadJson(), renderCalls(), saveJson()

### Community 4 - "Community 4"
Cohesion: 0.42
Nodes (8): load_config(), load_state(), log(), main(), Load bot token and chat ID from config file., Send message via Telegram Bot API (no external dependencies)., save_state(), send_telegram()

### Community 5 - "Community 5"
Cohesion: 0.47
Nodes (8): blocks_to_md(), fetch_all_pages(), fetch_blocks(), get_page_title(), notion_request(), rich_text_to_md(), safe_filename(), sync()

### Community 6 - "Community 6"
Cohesion: 0.33
Nodes (4): audit(), html_files(), JsonLdParser, main()

### Community 7 - "Community 7"
Cohesion: 0.42
Nodes (7): getActivityEvents(), getAgents(), getDocumentContent(), getDocuments(), getMemoryEntries(), getModelUsage(), GET()

### Community 8 - "Community 8"
Cohesion: 0.39
Nodes (5): exists_as_static_path(), html_files(), LinkParser, main(), normalize_target()

### Community 9 - "Community 9"
Cohesion: 0.32
Nodes (3): audit(), main(), MetadataParser

### Community 10 - "Community 10"
Cohesion: 0.39
Nodes (6): buildRawEmail(), getAccessToken(), gmailConfigured(), sendEmail(), GET(), POST()

### Community 11 - "Community 11"
Cohesion: 0.43
Nodes (1): NewsletterHandler

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (5): frontmost(), log(), osa(), type_message(), write_status()

### Community 13 - "Community 13"
Cohesion: 0.4
Nodes (2): FileTypeTag(), getFileIcon()

### Community 14 - "Community 14"
Cohesion: 0.7
Nodes (4): add_url(), canonical_for(), file_date(), main()

### Community 16 - "Community 16"
Cohesion: 0.6
Nodes (3): handleKey(), rid(), send()

### Community 17 - "Community 17"
Cohesion: 0.83
Nodes (3): assert_contains(), main(), read()

## Knowledge Gaps
- **3 isolated node(s):** `Load bot token and chat ID from config file.`, `Send message via Telegram Bot API (no external dependencies).`, `Replace unicode chars that latin-1 can't encode.`
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 11`** (7 nodes): `newsletter.js`, `NewsletterHandler`, `.constructor()`, `.handleSubmit()`, `.init()`, `.showStatus()`, `.validateEmail()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (6 nodes): `FileTypeTag()`, `formatSize()`, `getFileIcon()`, `handlePreview()`, `timeAgo()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 6 inferred relationships involving `GET()` (e.g. with `getMemoryEntries()` and `getDocuments()`) actually correct?**
  _`GET()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Load bot token and chat ID from config file.`, `Send message via Telegram Bot API (no external dependencies).`, `Replace unicode chars that latin-1 can't encode.` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._