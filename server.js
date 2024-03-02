const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { seedDatabase } = require('./seeds/seed');
const fs = require('fs');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });
hbs.handlebars.registerPartial('blogpost', fs.readFileSync(__dirname + '/views/partials/blogpost.handlebars', 'utf8'));
hbs.handlebars.registerPartial('comment', fs.readFileSync(__dirname + '/views/partials/comment.handlebars', 'utf8'));
hbs.handlebars.registerPartial('editcomment', fs.readFileSync(__dirname + '/views/partials/editcomment.handlebars', 'utf8'));
hbs.handlebars.registerPartial('editpost', fs.readFileSync(__dirname + '/views/partials/editpost.handlebars', 'utf8'));
hbs.handlebars.registerPartial('newpost', fs.readFileSync(__dirname + '/views/partials/newpost.handlebars', 'utf8'));


const sess = {
    secret: 'Super secret secret',
    cookie: {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

// async function main() {
//     // automated seeding!
//     if (process.env.SEED_DB === 'true') {
//         try {
//             await seedDatabase();
//         } catch (error) {
//             console.error('Error during database seeding:', error);
//         }
//     }

//     init();
// }


// sequelize.sync({ force: true }).then(async () => {
//     if (process.env.SEED_DB === 'true') {
//         await seedDatabase();
//         console.log('Database seeding completed!');
//     }
// });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));
app.use(methodOverride('_method'));


app.use(routes);

sequelize.sync({ force: false }).then(async () => {
    if (process.env.SEED_DB === 'true') {
        await seedDatabase();
        console.log('Database seeding completed!');
    }
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}).catch(err => console.error('Error syncing database:', err));

