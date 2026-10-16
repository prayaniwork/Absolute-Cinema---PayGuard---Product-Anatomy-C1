# PayGuard

Freelancers and clients lack a shared, reliable way to connect what was agreed, what was delivered, what was approved, and what is owed. PayGuard keeps each project's scope, deliveries, approvals and payments in one place.

## Prototype

`index.html` is a clickable prototype of the freelancer and client experience. Open it in a browser; no build step or server is needed. Data is stored in your browser, and **Restart** in the bottom bar resets it.

- **Freelancer:** Today, Clients, Calendar, Payments, project pages and planning a new project
- **Client:** invite, checkout, review and approval
- Each stage lists what it includes, and the client agrees to it before funding
- Auto-approval after a no-reply window, issues and refunds, paid extra rounds of changes, reminders by WhatsApp or email
- Styled with [Frappe UI](https://frappe-ui.vercel.app/) design tokens and layout patterns

**Live preview while editing:** run `node dev-server.js`, then open http://127.0.0.1:5173. The page reloads whenever a file changes. Other live-reload tools such as `live-server` also work.

Based on the v1 dashboard by a teammate. Names, amounts and fee rates are placeholders.
