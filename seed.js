require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./Movies');

const seedMovies = [
    {
        title: 'Parasite',
        releaseDate: 2019,
        genre: 'Thriller',
        actors: [
            { actorName: 'Song Kang-ho', characterName: 'Kim Ki-taek' },
            { actorName: 'Choi Woo-shik', characterName: 'Kim Ki-woo' },
            { actorName: 'Park So-dam', characterName: 'Kim Ki-jung' }
        ],
        imageUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'
    },
    {
        title: 'Train to Busan',
        releaseDate: 2016,
        genre: 'Action',
        actors: [
            { actorName: 'Gong Yoo', characterName: 'Seok-woo' },
            { actorName: 'Ma Dong-seok', characterName: 'Sang-hwa' },
            { actorName: 'Jung Yu-mi', characterName: 'Sung-kyung' }
        ],
        imageUrl: 'https://image.tmdb.org/t/p/w500/6CjuBdUMFxntGybLpxqiVyXRm4g.jpg'
    },
    {
        title: 'Your Name',
        releaseDate: 2016,
        genre: 'Fantasy',
        actors: [
            { actorName: 'Ryunosuke Kamiki', characterName: 'Taki Tachibana' },
            { actorName: 'Mone Kamishiraishi', characterName: 'Mitsuha Miyamizu' },
            { actorName: 'Masami Nagasawa', characterName: 'Miki Okudera' }
        ],
        imageUrl: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg'
    },
    {
        title: 'Crazy Rich Asians',
        releaseDate: 2018,
        genre: 'Comedy',
        actors: [
            { actorName: 'Constance Wu', characterName: 'Rachel Chu' },
            { actorName: 'Henry Golding', characterName: 'Nick Young' },
            { actorName: 'Michelle Yeoh', characterName: 'Eleanor Young' }
        ],
        imageUrl: 'https://image.tmdb.org/t/p/w500/1XxL4LJ5WHdrcYcihEZUCgNCpAW.jpg'
    },
    {
        title: 'Spider-Man: Across the Spider-Verse',
        releaseDate: 2023,
        genre: 'Action',
        actors: [
            { actorName: 'Shameik Moore', characterName: 'Miles Morales' },
            { actorName: 'Hailee Steinfeld', characterName: 'Gwen Stacy' },
            { actorName: 'Oscar Isaac', characterName: 'Miguel O\'Hara' }
        ],
        imageUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.DB);
        console.log('Connected to MongoDB');

        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        const result = await Movie.insertMany(seedMovies);
        console.log(`Successfully inserted ${result.length} movies`);

        mongoose.connection.close();
        console.log('Done! Database connection closed');
    }
    catch (err) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();