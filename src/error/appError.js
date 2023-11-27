export class AppError extends Error {
    constructor(message, statusCode = 400) {
      super();
      this.message = { message };
      this.statusCode = statusCode;
    }
};
  
export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
};

export class CarCreateError extends AppError {
  constructor(messsage = "Car already exist"){
    super(messsage, 400);
  }
};

export class CarNotFoundError extends AppError{
  constructor(message = "Car not found"){
    super(message, 404);
  }
};

export class DriverCreateError extends AppError {
  constructor(message = "Motorista already exist") {
    super(message, 501);
  }
};

export class DriverAlreadyUsingError extends AppError {
  constructor(message = "The driver is already using another car") {
    super(message, 400);
  }
};

export const handleAppError = (error, request, response, next) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json(error.message);
    }
    return response.status(500).json({
      message: "internal server error",
    });
};
  