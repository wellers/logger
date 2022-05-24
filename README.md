## Overview

Use Logger to centralise all of your projects logging. 

Logger will create separate log files for:
* Warnings, 
* Information 
* and Errors

Log files are created on a rolling-date system - a new file will be created (if one doesn't exist already) and either written or appended to when a message is logged.

Log files filenames will follow the following formats: 
* `{processName}-WARN-{yyyy-MM-dd}.txt`
* `{processName}-INFO-{yyyy-MM-dd}.txt`
* `{processName}-ERROR-{yyyy-MM-dd}.txt`

## Example

```js
const { Logger } = require('@wellers/logger');

async function boot() {
	const logger = new Logger('c:/logs', 'Custom Job');

	await logger.info({ message: 'Job started.' });
	await logger.warning({ message: 'Something not found.', category: 'Update' });
	await logger.error({ message: 'This failed!', error: Error('Something went wrong!') });
	await logger.info({ message: 'Job ended.' });
}
boot();
```

## API

**`new Logger(dir, processName)`** - Initialise the Logger.

* dir - `string` - Set the base directory where to write your log files.
* processName - `string` - Optional name to prefix the log filenames with.
* maxLogFileSizeInBytes - `number` - Optional maximum file size in bytes a log file can be. Once this value has been exceeded, a new log file will be created with the former file being retained and renamed.

**`logger.error(options)`** - For logging caught errors.
* options - `object` - Log options.
    * processName - `string` - Optional name to prefix the log filenames with.
    * category - `string` - Optional category to apply to your logged message.
    * message - `string` - Optional message to record in the log.
    * error - `Error` - Optional Error.
* Returns: `Promise<void>`

**`logger.info(options)`** - Useful for logging process information.
* options - `object` - Log options.
    * processName - `string` - Optional name to prefix the log filenames with.
    * category - `string` - Optional category to apply to your logged message.
    * message - `string` - Optional message to record in the log.
    * error - `Error` - Optional Error.
* Returns: `Promise<void>`

**`logger.warning(options)`** - Useful for recording non-critical exceptions.
* options - `object` - Log options.
    * processName - `string` - Optional name to prefix the log filenames with.
    * category - `string` - Optional category to apply to your logged message.
    * message - `string` - Optional message to record in the log.
    * error - `Error` - Optional Error.
* Returns: `Promise<void>`