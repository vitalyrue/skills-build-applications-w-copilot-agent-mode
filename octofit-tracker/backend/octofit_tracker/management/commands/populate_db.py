from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team

class Command(BaseCommand):
    help = 'Populate the database with superhero users and teams'

    def handle(self, *args, **options):
        marvel = Team.objects.get_or_create(name='Marvel', defaults={'description': 'Marvel Superheroes'})[0]
        dc = Team.objects.get_or_create(name='DC', defaults={'description': 'DC Superheroes'})[0]

        users = [
            {'email': 'tony@stark.com', 'name': 'Iron Man', 'is_superhero': True, 'team': marvel.name},
            {'email': 'steve@rogers.com', 'name': 'Captain America', 'is_superhero': True, 'team': marvel.name},
            {'email': 'clark@kent.com', 'name': 'Superman', 'is_superhero': True, 'team': dc.name},
            {'email': 'bruce@wayne.com', 'name': 'Batman', 'is_superhero': True, 'team': dc.name},
        ]

        for u in users:
            User.objects.get_or_create(email=u['email'], defaults=u)

        self.stdout.write(self.style.SUCCESS('Database populated with sample superheroes and teams.'))
