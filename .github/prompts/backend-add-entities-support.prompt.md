---
description: 'Backend requirements to support frontend entity creation.'
---

To support frontend creation of activities, teams, users, workouts, and leaderboard entries, ensure the backend provides:

1. REST API endpoints for POST (create) actions for each entity (using DRF ModelViewSet).
2. Validation and error handling in Django models and serializers (e.g., required fields, unique constraints).
3. CORS enabled for frontend-backend communication.
4. Return the newly created object in the response after a successful POST.
5. (Optional) Authentication and permissions if you want to restrict access.
6. Support for GET (list) and PUT/PATCH (edit) endpoints for full CRUD functionality.

No additional backend changes are needed if DRF viewsets and serializers are set up correctly. Add custom validation or permissions as needed for your business logic.
