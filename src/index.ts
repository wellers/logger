import fs from 'fs';
import path from 'path';
// @ts-ignore
import format from 'date-format';
import Validator from 'fastest-validator';
// @ts-ignore
import sanitize from 'sanitize-filename';

const optionsSchema = {
	processName: { type: "string", optional: true },
	category: { type: "string", optional: true },
	message: { type: "string", optional: true },
	error: { type: "any", optional: true },
	$$strict: true
}

const validator = new Validator();
const validate = validator.compile(optionsSchema);


interface LogOptions {
	processName?: string,
	category?: string,
	message?: string,
	error?: Error,
}

class Logger {
	private dir: string;
	private processName?: string;	

	constructor(dir: string, processName?: string) {
		if (typeof dir !== 'string') {
			throw new Error('dir must be of type string.');
		}

		if (processName && typeof processName !== 'string') {
			throw new Error('processName must be of type string.');
		}				
		
		this.dir = dir;
		this.processName = processName;
	}

	error(options: LogOptions) {
		this.logMessage(options, 'ERROR');
	}

	info(options: LogOptions) {
		this.logMessage(options, 'INFO');
	}

	warning(options: LogOptions) {
		this.logMessage(options, 'WARN');
	}

	private async logMessage(options: LogOptions, logType: string) {
		if (typeof logType !== 'string') {
			throw new Error('logType must be of type string.');
		}

		Logger.validateOptions(options);

		const { processName, category, message, error } = options;

		const filePath = await this.getFilePath(logType, processName);

		let logMessage = message;

		if (category) {
			logMessage = `${category} - ${logMessage}`;
		}

		if (error instanceof Error) {
			logMessage = `${logMessage} - ${error.message}`;
		}

		const date = format.asString();

		await fs.promises.appendFile(filePath, `${date}: ${logMessage}\n`);
	}

	private async getFilePath(logType: string, processName?: string) {
		await fs.promises.access(this.dir);

		const date = format('yyyy-MM-dd', new Date());

		let filename = `${logType}-${date}.txt`;

		processName = processName ?? this.processName;

		if (typeof processName === 'string') {
			filename = `${processName}-${filename}`
		}

		filename = sanitize(filename);

		return path.join(this.dir, filename);
	}

	private static validateOptions(options: LogOptions) {
		const results = validate(options);

		if (Array.isArray(results)) {
			const message = results.map(result => result.message).join('\r\n');

			throw Error(message);
		}
	}
}

export { Logger }