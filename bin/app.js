"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const userModel_1 = __importDefault(require("./model/userModel"));
const productModel_1 = require("./model/productModel");
const cartModel_1 = __importDefault(require("./model/cartModel"));
const index_1 = __importDefault(require("./config/index"));
const PORT = "3000";
// dbconnection().sync({ alter: false }).then(() => {
//   console.log("Database connected successfully");
// }).catch(err => {
//   console.log(err);
// });
(0, index_1.default)();
userModel_1.default;
productModel_1.productModel;
cartModel_1.default;
const products_1 = __importDefault(require("./routes/products"));
const users_1 = __importDefault(require("./routes/users"));
const carts_1 = __importDefault(require("./routes/carts"));
const app = (0, express_1.default)();
// view engine setup
app.set('views', path_1.default.join(__dirname, '../views'));
app.set('view engine', 'ejs');
// app.set('port', PORT);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/products', products_1.default);
app.use('/users', users_1.default);
app.use('/carts', carts_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
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
exports.default = app;
