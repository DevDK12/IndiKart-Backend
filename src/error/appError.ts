



class AppError extends Error  {
    public status: string;

    constructor(
        public message: string,
        public statusCode: number,
        public isOperational: boolean = true,
        public stack: string = ''
    ) {
        super(message);
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        if(stack === ''){
            Error.captureStackTrace(this, this.constructor);
        }
    }

}




export default AppError;