# Dependency security UI evidence

Owner: Paul / portfolio maintenance
Reviewed: 2026-10-22

The four PNGs compare the actual baseline and final testimonial implementations using the real application styles and Swiper settings. Desktop viewport: 1280 by 800. Phone viewport: 375 by 812. Both captures start at scroll zero and the first slide. Text children are replaced by identical synthetic headings, testimonial copy and reviewer names. No private or customer content appears.

The isolated capture page is recorded in capture-harness.txt. For reproduction, place it at pages/security-preview.js in private copies of each source tree, install their normal locked dependencies and use the Node22 development server. It is excluded from the production build and committed application routes. The visible Next development indicator is browser preview tooling. These captures do not establish a deployed revision or a complete-site review.

Native production builds passed for the baseline and final source. The final generated-page and vendored-asset contracts pass, and npm audit has zero findings. The exact Bootstrap3 CSS and font bytes match the official package integrity recorded beside the assets; Bootstrap JavaScript is absent.

Browser checks verified three clickable pagination items, exactly one visible testimonial after navigation, unchanged themed pagination dimensions/colors, and automatic advancement after the existing eight-second interval without overlapping content. Source hashes and viewport/state details are in source-evidence.json. The final component preserves the legacy sliding transition and horizontal theme hook.
