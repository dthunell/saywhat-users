export class SayWhatError {
  message: string
  statusCode: number

  constructor(message: string, statusCode: string | number) {
    this.message = message
    if (typeof statusCode === 'number') {
      this.statusCode = statusCode
    } else {
      this.statusCode = parseInt(statusCode, 10)
    }
  }
}