# Manual Verification

Run `npm run build` before this checklist. Serve the site under its production
path prefix when URL or navigation code changes.

## Direct loads

- Open every root page directly.
- Open at least three individual posts directly, including one decorated post.
- Open the generated 404 page.
- Disable JavaScript and confirm pages remain readable and navigation works.

## Navigation and persistent shell

- Start music, then navigate through every page without interrupting playback.
- Use an in-content internal link and confirm music continues.
- Use browser Back and Forward and confirm content, title, active navigation,
  metadata, and scroll behavior remain usable.

## Random encounter

- Open, reroll, and close the random-post modal from Home, Links, and Archive.
- Confirm Escape closes it and focus returns to the trigger.
- On Smooth, apply a filter and confirm the modal draws only visible entries.
- Simulate a failed post request and confirm the selected post URL remains
  reachable through the fallback.

## Story player

- Open the Infinite Monkey Paradox story from its post, Home, and a random
  encounter. Confirm all 11 beats render in order.
- Verify Back, Next, Space, arrow keys, Page Up/Down, Home/End, and Escape.
- Confirm focus stays inside the story and returns to its exact launch button.
- Open the story over a random encounter. Escape must close only the story,
  leaving the random encounter open beneath it.
- Navigate with PJAX while the story is open and confirm the dialog closes.
- At 375 px, verify the story fills the viewport without horizontal overflow.
- With reduced motion enabled, verify story transitions are disabled while all
  content and controls remain available.

## Interactive pages

- Visit Tao Thao through PJAX three times and verify arrows, keyboard controls,
  swipe, thumbnails, and card flipping do not double-fire.
- Open a Millennium Item card on Games, navigate Back while it is open, and
  confirm arrow keys no longer control detached content.
- Verify quote and Reddington search after repeated PJAX navigation.

## Responsive and accessibility

- Check Home, Archive, one post, Games, and Smooth at 375 px width.
- Confirm no horizontal overflow or covered controls.
- Enable reduced motion and verify decorative animations stop without hiding
  information.
- Navigate the random modal and custom controls using only the keyboard.
