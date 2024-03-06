import winston from 'winston';
// import Logsene from 'winston-logsene'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
  logsene: {
    token: process.env.LOGS_TOKEN,
    level: 'debug',
    type: 'app_logs',
    url: 'https://logsene-receiver.sematext.com/_bulk',
  },
};

// process logging
const logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
    // winston.format.colorize({ all: true }),
    winston.format.splat(), // Necessary to produce the 'meta' property
    // errorStackTracerFormat(),
    winston.format.printf(({
      // eslint-disable-next-line no-shadow, no-unused-vars
      level, message, timestamp, stack,
    }) => {
      if (stack) {
        // print log trace
        // eslint-disable-next-line no-console
        console.log('print stack');
        return `${timestamp}: ${message} - ${stack}`;
      }
      return `${timestamp} : ${message}`;
    }),
    // winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
    // new Logsene(options.logsene)
  ],
  exitOnError: false,
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

if (process.env.NODE_ENV !== 'production') {
  // logger.add(new winston.transports.Console({
  // format: winston.format.simple(),
  // }));
}

export default logger;
