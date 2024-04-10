require('dotenv').config();

import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import User   from './model/userModel';
import { productModel } from './model/productModel';
import cartModel from './model/cartModel';
import dbconnection from './config/index';
const PORT = "3000";

// dbconnection().sync({ alter: false }).then(() => {
//   console.log("Database connected successfully");
// }).catch(err => {
//   console.log(err);
// });
dbconnection()
User
productModel
cartModel

import productsRouter from './routes/products';
import usersRouter from './routes/users';
import cartRouter from './routes/carts'

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
// app.set('port', PORT);


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/carts', cartRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;