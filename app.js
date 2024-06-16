const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 } // 30 minutes
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));


const interessados = [];
const pets = [];
const adocoes = [];

// Routes
const indexRouter = require('./rotas/index')(interessados, pets, adocoes);
const interessadosRouter = require('./rotas/interessados')(interessados);
const petsRouter = require('./rotas/pets')(pets);
const adocaoRouter = require('./rotas/adocao')(interessados, pets, adocoes);

app.use('/', indexRouter);
app.use('/interessados', interessadosRouter);
app.use('/pets', petsRouter);
app.use('/adocao', adocaoRouter);

app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost:${PORT}`);
});
