---
description: 'Add activities, teams, users, workouts, and leaderboard entries via the frontend React app.'
---

Update the React frontend to allow users to add new activities, teams, users, workouts, and leaderboard entries:
- Add Bootstrap modal forms to each component (Activities.js, Teams.js, Users.js, Workouts.js, Leaderboard.js).
- Each form should include all required fields for the entity (e.g., name, description, user, type, duration, date, points, etc.).
- On submit, POST the form data to the corresponding backend REST API endpoint (e.g., `/api/activities/`, `/api/teams/`, etc.).
- Show feedback for success or error, and update the table after adding.
- Use Bootstrap for consistent styling (tables, buttons, headings, forms, modals).
- Log the REST API endpoint and the fetched/created data in the console for debugging.
