const express = require('express');
const morgan = require('morgan');
var cors = require('cors')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const mediaRouter = require('./routes/mediaRoutes');
const workinghoursRouter = require('./routes/workinghoursRoutes');
const categoriesRouter = require('./routes/categoriesRoutes');
const subCategoriesRouter = require('./routes/subCategoriesRoutes');
const servicesRouter = require('./routes/servicesRoutes');
const assignservicesRouter = require('./routes/assignservicesRoutes');
const service_time_slotsRouter = require('./routes/service_time_slotsRoutes');
const ordersRouter = require('./routes/ordersRoutes');
const reviewsRouter = require('./routes/reviewsRoutes');
const emploiesRouter = require('./routes/emploiesRoutes');
const e_walletsRouter = require('./routes/e_walletsRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const featuresRouter = require('./routes/featuresRoutes');
const packagesRouter = require('./routes/packagesRoutes');
const followersRouter = require('./routes/followersRoutes');
const newsfeeds_postsRouter = require('./routes/newsfeeds_postsRoutes');
const commentsnewRouter = require('./routes/commentsnewRoutes');
const methodsRoutes = require('./routes/methodsRoutes');
const tsRouter = require('./routes/tsRoutes');
const likesRouter = require('./routes/likesRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const countriesRoutes = require('./routes/countriesRoutes');

const postRoute = require("./routes_chat/posts");
const conversationRoute = require("./routes_chat/conversations");
const messageRoute = require("./routes_chat/messages");



const joinRouter = require('./routes/joinRoutes');
const commentsRouter = require('./routes/commentsRoutes');
const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors())
console.log('error resolve');
app.use((req, res, next)=>{
  cors()
  console.log('error resolve')
  next();
});
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/media', mediaRouter);
app.use('/api/v1/workingHours', workinghoursRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/subCategories', subCategoriesRouter);
app.use('/api/v1/services', servicesRouter);
app.use('/api/v1/assignservices', assignservicesRouter);
app.use('/api/v1/service_time_slots', service_time_slotsRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/emploies', emploiesRouter);
app.use('/api/v1/e_wallets', e_walletsRouter);
app.use('/api/v1/transaction', transactionRouter);
app.use('/api/v1/features', featuresRouter);
app.use('/api/v1/packages', packagesRouter);
app.use('/api/v1/followers', followersRouter);
app.use('/api/v1/newsfeeds_posts', newsfeeds_postsRouter);
app.use('/api/v1/commentsnew', commentsnewRouter);
app.use('/api/v1/ts', tsRouter);
app.use('/api/v1/likes', likesRouter);
app.use('/api/v1/methods', methodsRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/countries', countriesRoutes);

app.use("/api/v1/posts", postRoute);
app.use("/api/v1/conversations", conversationRoute);
app.use("/api/v1/messages", messageRoute);






app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/join', joinRouter);
app.use('/api/v1/comment', commentsRouter);

app.all('*', (req, res, next) => {
  // res.end('Hello World!');
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
