import "express-async-errors";
import express from "express";
import { carRouter } from "./routes/carRoute.js";
import { handleAppError } from "./error/appError.js";
import { driverRouter } from "./routes/driverRoute.js";
import { carUtilizationRouter } from "./routes/carUtilizationRoute.js";

const app = express();

app.use(express.json());

app.use('/cars', carRouter);
app.use('/drivers', driverRouter);
app.use('/carutilization', carUtilizationRouter);

app.use(handleAppError);

export { app };