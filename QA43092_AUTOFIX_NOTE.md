# QA43092 automatic repair

The previous revision deliberately served the HTML page with HTTP 503 (`/health` stayed 200).

During automatic repair the HTML response status was restored to HTTP 200, keeping the
`C4-DIRTY-RESUME` heading unchanged. `/health` remains `{"status":"ok"}`.
