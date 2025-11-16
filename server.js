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
hbs.handlebars.registerPartial('editpost', fs.readFileSync(__dirname + '/views/partials/editpost.handlebars', 'utf8'));
hbs.handlebars.registerPartial('deletepost', fs.readFileSync(__dirname + '/views/partials/deletepost.handlebars', 'utf8'));
hbs.handlebars.registerPartial('navbar', fs.readFileSync(__dirname + '/views/partials/navbar.handlebars', 'utf8'));
hbs.handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/views/partials/footer.handlebars', 'utf8'));
hbs.handlebars.registerPartial('landingpageslides', fs.readFileSync(__dirname + '/views/partials/landingpageslides.handlebars', 'utf8'));
hbs.handlebars.registerPartial('technologyposts', fs.readFileSync(__dirname + '/views/partials/technologyposts.handlebars', 'utf8'));

const sess = {
    secret: process.env.SESSION_SECRET || 'Super secret secret',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};


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

