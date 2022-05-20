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
	private processName: string;
	private dir: string;

	constructor(processName: string, dir: string) {
		fs.promises.access(dir);

		this.processName = processName;
		this.dir = dir;
	}

	error(options: LogOptions) {
		this.logMessage(options, 'Error');
	}

	info(options: LogOptions) {
		this.logMessage(options, 'INFO');
	}

	warning(options: LogOptions) {
		this.logMessage(options, 'WARN');
	}

	private async logMessage(options: LogOptions, logType: string) {
		Logger.validateOptions(options);

		const { processName, category, message, error } = options;

		const filePath = this.getFilePath(logType, processName);

		let logMessage = message;

		if (typeof category !== 'undefined') {
			logMessage = `${category} - ${logMessage}`;
		}

		if (error instanceof Error) {
			logMessage = `${logMessage} - ${error.message}`;
		}

		const date = format.asString();

		await fs.promises.appendFile(filePath, `${date}: ${logMessage}\n`);
	}

	private getFilePath(logType: string, processName?: string) {
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