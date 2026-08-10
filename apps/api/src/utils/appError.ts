export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number, name = "ApiError") {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}
