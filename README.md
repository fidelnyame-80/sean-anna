# Sean & Anna wedding site

A responsive wedding page inspired by the supplied reference. It includes an interactive ten-question quiz and an RSVP draft form.

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:3000. Build the static site with `bun run build`.

## Add the photos and details

Put photos in `public/photos/`, then set the paths in [`app/site-content.ts`](app/site-content.ts). The five keys map to the hero, our day, venue, RSVP, and closing photo areas. For example, use `"/photos/hero.jpg"` for a file at `public/photos/hero.jpg`.

The same file holds the wedding date, RSVP deadline, venue, directions URL, and RSVP email address. The current “Date to follow” and venue text are placeholders. Until an RSVP email is provided, the form saves a draft in the guest's browser and clearly says it has **not** been sent. Once an address is provided, it prepares an email for the guest to send. No RSVP data is stored on a server.

Quiz questions are in [`app/components/Quiz.tsx`](app/components/Quiz.tsx). They are playful guesses and have no right-answer scoring, since the couple's answers have not been supplied.
