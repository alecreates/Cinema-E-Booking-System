CREATE DATABASE IF NOT EXISTS ces;
USE ces;

DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  synopsis TEXT,
  rating VARCHAR(10),
  poster_url TEXT,
  trailer_url TEXT,
  duration INT,
  genre VARCHAR(255),
  status ENUM('now_showing','coming_soon') NOT NULL,
  show_date DATE
);

INSERT INTO movies (id,title,description,synopsis,rating,poster_url,trailer_url,duration,genre,status,show_date) VALUES
('m1','Interstellar','A team travels through a wormhole...','In the future, Earth is becoming uninhabitable...','PG-13',
 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
 'https://www.youtube.com/embed/zSWdZVtXT7E?si=mRK4qhN6rnr8ABrW',
 169,'Sci-Fi,Drama','now_showing','2026-02-13'),

('m2','Inception','A thief who steals corporate secrets through dream-sharing tech...','Dom Cobb is a skilled thief...','PG-13',
 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
 'https://www.youtube.com/embed/YoHD9XEInc0',
 148,'Sci-Fi,Action,Thriller','now_showing','2026-02-14'),

('m3','The Dark Knight','Batman faces the Joker...','With the help of Lt. Jim Gordon...','PG-13',
 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
 'https://www.youtube.com/embed/EXeTwQWrcwY',
 152,'Action,Crime,Drama','now_showing','2026-02-15'),

('m4','Dune: Part Two','Paul Atreides unites with the Fremen...','Paul Atreides joins forces...','PG-13',
 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
 'https://www.youtube.com/embed/U2Qp5pL3ovA',
 165,'Sci-Fi,Adventure,Drama','coming_soon','2026-03-01'),

('m5','Oppenheimer','The story of J. Robert Oppenheimer.','The theoretical physicist behind the atomic bomb.','R',
 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
 'https://www.youtube.com/embed/uYPbbksJxIg',
 180,'Drama,History','now_showing','2026-02-16'),

('m6','Avengers: Endgame','The Avengers assemble once more.','After Thanos wipes out half the universe...','PG-13',
 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
 'https://www.youtube.com/embed/TcMBFSGVi1c',
 181,'Action,Adventure,Sci-Fi','now_showing','2026-02-17'),

('m7','Spider-Man: No Way Home','Peter Parker faces multiverse chaos.','With his identity revealed...','PG-13',
 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
 'https://www.youtube.com/embed/JfVOs4VSpmA',
 148,'Action,Adventure,Sci-Fi','now_showing','2026-02-18'),

('m8','The Batman','Batman investigates corruption in Gotham.','A sadistic serial killer begins murdering...','PG-13',
 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
 'https://www.youtube.com/embed/mqqft2x_Aa4',
 176,'Action,Crime,Drama','now_showing','2026-02-19'),

('m9','Gladiator II','The sequel to the epic Roman saga.','A new warrior rises in the Colosseum.','R',
 'https://image.tmdb.org/t/p/w500/placeholder.jpg',
 'https://www.youtube.com/embed/ewe4eMZ9bVY',
 160,'Action,Drama','coming_soon','2026-03-15'),

('m10','Mission: Impossible 8','Ethan Hunt returns.','Another impossible global mission.','PG-13',
 'https://image.tmdb.org/t/p/w500/placeholder.jpg',
 'https://www.youtube.com/embed/avz06PDqDbM',
 155,'Action,Thriller','coming_soon','2026-03-20');
