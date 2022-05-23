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

const logger = new Logger('c:/logs', 'Custom Job');

logger.info({ message: 'Job started.' });
logger.warning({ message: 'Something not found.', category: 'Update' });
logger.error({ message: 'This failed!', error: Error('Something went wrong!') });
logger.info({ message: 'Job ended.' });
```

## API

**`new Logger(dir, processName)`** - Initialise the Logger.

* dir - `string` - set the base directory where to store your log files.
* processName - `string` - Optional name to prefix the created log filenames with.

**`logger.error(options)`** - Record an error. For recording your caught errors using this.

**`logger.info(options)`** - Record a information. Useful for recording process information.

**`logger.warning(options)`** - Record a warning. Useful for recording non-critical information.

* options - `object` - Log options.
    * processName - `string` - Optional name to prefix your log files names with.
    * category - `string` - Optional category to apply to your logged message.
    * message - `string` - Optional message to record in the log.
    * error - `Error` - Optional Error.