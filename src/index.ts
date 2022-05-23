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

interface LoggerOptions {
	dir: string,
	processName?: string,
	maxLogFileSizeInBytes?: number
}

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

class Logger {
	private dir: string;
	private processName?: string;
	private maxLogFileSizeInBytes?: number

	constructor({ dir, processName, maxLogFileSizeInBytes }: LoggerOptions) {
		if (typeof dir !== 'string') {
			throw new Error('dir must be of type string.');
		}

		if (processName && typeof processName !== 'string') {
			throw new Error('processName must be of type string.');
		}

		if (maxLogFileSizeInBytes) {
			if (isNaN(maxLogFileSizeInBytes)) {
				throw new Error('maxLogfileSize must be of type number.');
			}

			if (maxLogFileSizeInBytes <= 0) {
				throw new Error('maxLogfileSize must a positive integer.');
			}
		}

		this.dir = dir;
		this.processName = processName;
		this.maxLogFileSizeInBytes = maxLogFileSizeInBytes;
	}

	async error(options: LogOptions) {
		await this.logMessage(options, 'ERROR');
	}

	async info(options: LogOptions) {
		await this.logMessage(options, 'INFO');
	}

	async warning(options: LogOptions) {
		await this.logMessage(options, 'WARN');
	}

	private async logMessage(options: LogOptions, logType: string) {
		if (typeof logType !== 'string') {
			throw new Error('logType must be of type string.');
		}

		this.validateOptions(options);

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

		let filename = `${logType}-${date}`;

		processName = processName ?? this.processName;

		if (typeof processName === 'string') {
			filename = `${processName}-${filename}`
		}

		filename = sanitize(filename);
		let filePath = path.join(this.dir, `${filename}.txt`);

		if (typeof this.maxLogFileSizeInBytes !== 'undefined') {
			let fileSizeInBytes = 0;

			try {
				const { size } = await fs.promises.stat(filePath);

				fileSizeInBytes = size;
			} 
			catch {
				// if filePath doesn't exist, log file can be created from filePath
				return filePath;
			}

			if (fileSizeInBytes >= this.maxLogFileSizeInBytes) {
				const files = await fs.promises.readdir(this.dir)

				const index = files.filter(file => file.startsWith(filename)).length;				
				const paddedIndex = zeroPad(index, 2);

				let newFilename = `${filename}.txt${paddedIndex}`;
				newFilename = sanitize(newFilename);

				const newPath = path.join(this.dir, newFilename);

				await fs.promises.rename(filePath, newPath);
			}
		}

		return filePath;
	}

	private validateOptions(options: LogOptions) {
		const results = validate(options);

		if (Array.isArray(results)) {
			const message = results.map(result => result.message).join('\r\n');

			throw Error(message);
		}
	}
}

export { Logger }