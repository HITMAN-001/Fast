"""
Migration script to add new tables for Tournament and News features.
Run this script to update your database schema.
"""

from app.database import engine
from sqlalchemy import text

def run_migrations():
    # Add new tables to the database
    with engine.connect() as connection:
        try:
            # Create tournament_images table
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS tournament_images (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR NOT NULL,
                    image_path VARCHAR NOT NULL,
                    description VARCHAR,
                    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE
                );
            """))

            # Create tournament_schedules table
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS tournament_schedules (
                    id SERIAL PRIMARY KEY,
                    date DATE NOT NULL,
                    time VARCHAR NOT NULL,
                    category VARCHAR NOT NULL,
                    round VARCHAR NOT NULL,
                    court VARCHAR NOT NULL,
                    players VARCHAR NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Create tournaments table
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS tournaments (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL,
                    location VARCHAR NOT NULL,
                    description TEXT,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Create tournament_results table
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS tournament_results (
                    id SERIAL PRIMARY KEY,
                    tournament_id INTEGER REFERENCES tournaments(id),
                    category VARCHAR NOT NULL,
                    winner VARCHAR NOT NULL,
                    runner_up VARCHAR NOT NULL,
                    score VARCHAR NOT NULL,
                    date DATE NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Create news_articles table
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS news_articles (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR NOT NULL,
                    content TEXT NOT NULL,
                    summary VARCHAR,
                    image_path VARCHAR,
                    category VARCHAR NOT NULL,
                    author VARCHAR NOT NULL,
                    is_featured BOOLEAN DEFAULT FALSE,
                    publication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Create newsletter_subscribers table
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    email VARCHAR NOT NULL UNIQUE,
                    player_category VARCHAR,
                    interests VARCHAR,
                    is_active BOOLEAN DEFAULT TRUE,
                    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))

            # Add sample data for tournament images
            connection.execute(text("""
                INSERT INTO tournament_images (title, image_path, description, is_active)
                VALUES 
                ('Tournament Match', 'tournament_images/sample1.jpg', 'Players in action during the tournament', TRUE),
                ('Award Ceremony', 'tournament_images/sample2.jpg', 'Winners receiving trophies', TRUE),
                ('Junior Finals', 'tournament_images/sample3.jpg', 'Junior players competing in finals', TRUE),
                ('Doubles Match', 'tournament_images/sample4.jpg', 'Exciting doubles match', TRUE),
                ('Senior Tournament', 'tournament_images/sample5.jpg', 'Senior players showcase their skills', TRUE),
                ('Training Session', 'tournament_images/sample6.jpg', 'Players during training session', TRUE),
                ('Championship Match', 'tournament_images/sample7.jpg', 'Final championship match', TRUE)
                ON CONFLICT DO NOTHING;
            """))

            # Add sample data for tournament schedules
            connection.execute(text("""
                INSERT INTO tournament_schedules (date, time, category, round, court, players)
                VALUES 
                ('2025-06-10', '9:00 AM', 'Under 12', 'Qualifying Round', 'Court 1', 'Group A'),
                ('2025-06-10', '11:00 AM', 'Under 16', 'Qualifying Round', 'Court 2', 'Group B'),
                ('2025-06-11', '9:00 AM', 'Open', 'Quarter Finals', 'Center Court', 'TBD'),
                ('2025-06-11', '2:00 PM', 'Under 12', 'Semi Finals', 'Court 1', 'TBD'),
                ('2025-06-12', '10:00 AM', 'Under 16', 'Semi Finals', 'Court 2', 'TBD'),
                ('2025-06-12', '3:00 PM', 'Open', 'Semi Finals', 'Center Court', 'TBD'),
                ('2025-06-13', '11:00 AM', 'Under 12', 'Finals', 'Court 1', 'TBD'),
                ('2025-06-13', '2:00 PM', 'Under 16', 'Finals', 'Court 2', 'TBD'),
                ('2025-06-14', '10:00 AM', 'Open', 'Finals', 'Center Court', 'TBD'),
                ('2025-06-14', '4:00 PM', 'All', 'Award Ceremony', 'Center Court', 'All Finalists')
                ON CONFLICT DO NOTHING;
            """))

            # Add sample data for tournaments
            connection.execute(text("""
                INSERT INTO tournaments (name, start_date, end_date, location, description, is_active)
                VALUES 
                ('Summer Open 2025', '2025-05-15', '2025-05-16', 'Manoj Kusalkar Tennis Academy', 'Annual summer tournament for all age categories', TRUE),
                ('Spring Challenge 2025', '2025-03-20', '2025-03-21', 'Manoj Kusalkar Tennis Academy', 'Spring tournament featuring singles matches', TRUE),
                ('Winter Cup 2024', '2024-12-15', '2024-12-16', 'Manoj Kusalkar Tennis Academy', 'Winter tournament with exciting matches', TRUE)
                ON CONFLICT DO NOTHING;
            """))

            # Add sample data for tournament results
            connection.execute(text("""
                INSERT INTO tournament_results (tournament_id, category, winner, runner_up, score, date)
                VALUES 
                (1, 'Under 12 Singles', 'Arjun Mehta', 'Rohan Singh', '6-4, 7-5', '2025-05-15'),
                (1, 'Under 16 Singles', 'Vikram Rathore', 'Ajay Kumar', '6-2, 6-3', '2025-05-15'),
                (1, 'Open Singles', 'Rahul Sharma', 'Karan Patel', '7-6, 6-4', '2025-05-16'),
                (1, 'Under 12 Doubles', 'Arjun Mehta / Rohan Singh', 'Aditya Verma / Nikhil Joshi', '6-3, 7-5', '2025-05-16'),
                (2, 'Under 12 Singles', 'Rohan Singh', 'Nikhil Joshi', '6-2, 6-4', '2025-03-20'),
                (2, 'Under 16 Singles', 'Ajay Kumar', 'Vikram Rathore', '3-6, 6-4, 6-3', '2025-03-20'),
                (2, 'Open Singles', 'Karan Patel', 'Rahul Sharma', '6-4, 7-6', '2025-03-21'),
                (3, 'Under 12 Singles', 'Arjun Mehta', 'Aditya Verma', '7-5, 6-3', '2024-12-15'),
                (3, 'Under 16 Singles', 'Vikram Rathore', 'Rohit Kapoor', '6-1, 6-2', '2024-12-15'),
                (3, 'Open Singles', 'Rahul Sharma', 'Sunil Nair', '6-3, 7-6', '2024-12-16')
                ON CONFLICT DO NOTHING;
            """))

            # Add sample data for news articles
            connection.execute(text("""
                INSERT INTO news_articles (title, content, summary, category, author, is_featured, publication_date)
                VALUES 
                ('Manoj Kusalkar Tennis Academy Announces Summer Camp 2025', 
                'We are excited to announce our annual Summer Tennis Camp starting June 15, 2025. This intensive 4-week program is designed for players of all levels, from beginners to advanced competitors. The camp will feature specialized training sessions, fitness programs, and mini-tournaments.',
                'Annual summer camp registration now open for all age groups',
                'Programs', 'Coach Manoj Kusalkar', TRUE, CURRENT_TIMESTAMP),
                
                ('Academy Students Shine at State Championship', 
                'Our academy students brought home 5 trophies from the State Tennis Championship held last weekend. Arjun Mehta and Vikram Rathore secured gold medals in their respective categories.',
                'Academy students win multiple medals at state level',
                'Achievements', 'Admin', FALSE, CURRENT_TIMESTAMP - INTERVAL '4 days'),
                
                ('New Advanced Training Program Launched', 
                'We are proud to introduce our new Advanced Player Development Program, designed specifically for competitive players looking to take their game to the next level.',
                'New program focuses on advanced techniques for competitive players',
                'Programs', 'Coach Rahul Singh', FALSE, CURRENT_TIMESTAMP - INTERVAL '7 days'),
                
                ('Tennis Equipment Drive a Huge Success', 
                'Thanks to the generosity of our community, we collected over 50 rackets and numerous tennis accessories for underprivileged children interested in learning tennis.',
                'Community donates equipment to help underprivileged children',
                'Community', 'Admin', FALSE, CURRENT_TIMESTAMP - INTERVAL '13 days'),
                
                ('Coach Rahul Joins Our Training Team', 
                'We are delighted to welcome Coach Rahul Singh to our coaching team. Coach Rahul brings 15 years of experience and has trained several national-level players.',
                'Experienced coach joins the academy staff',
                'Staff', 'Manoj Kusalkar', FALSE, CURRENT_TIMESTAMP - INTERVAL '20 days')
                ON CONFLICT DO NOTHING;
            """))

            connection.commit()
            print("Migration completed successfully!")
        except Exception as e:
            print(f"Error during migration: {e}")
            raise

if __name__ == "__main__":
    run_migrations()
