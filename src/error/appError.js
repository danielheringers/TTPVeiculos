export class AppError extends Error {
    constructor(message, statusCode = 400) {
      super();
      this.message = { message };
      this.statusCode = statusCode;
    }
  }
  
export class NotFoundError extends AppError {
  constructor(message = "Não encontrado") {
    super(message, 404);
  }
}

export class CarCreateError extends AppError {
  constructor(messsage = "Carro já cadastrado"){
    super(messsage, 400);
  }
}

export class CarDontExistError extends AppError{
  constructor(message = "Carro não existe"){
    super(message, 404);
  }
}

export class DriverCreateError extends AppError {
  constructor(message = "Motorista já cadastrado") {
    super(message, 501);
  }
}

export const handleAppError = (error, request, response, next) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json(error.message);
    }
    return response.status(500).json({
      message: "internal server error",
    });
  };
  