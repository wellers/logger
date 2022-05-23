import { testArray, Test } from "@wellers/testarray";
import { strictEqual } from "assert";
import { Logger } from "../src/index.js";

const tests: Test[] = [
	{
		name: 'given dir is not a string, should throw an Error.',
		args: {
			// @ts-ignore
			query: () => new Logger({ dir: 1 }),
			error: 'dir must be of type string.'
		}
	},
	{
		name: 'given processName is not a string, should throw an Error.',
		args: {
			// @ts-ignore
			query: () => new Logger({ dir: 'c:/logs', processName: 1 }),
			error: 'processName must be of type string.'
		}
	},
	{
		name: 'given maxLogFileSizeInBytes is not a number, should throw an Error.',
		args: {
			// @ts-ignore
			query: () => new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 'hello, world!' }),
			error: 'maxLogfileSize must be of type number.'
		}
	},
	{
		name: 'given maxLogFileSizeInBytes is negative, should throw an Error.',
		args: {
			query: () => new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: -1 }),
			error: 'maxLogfileSize must a positive integer.'
		}
	},
	{
		name: 'given error is called with non-string processName, should throw an Error.',		
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.error({ processName: -1 })
			},
			error: "The 'processName' field must be a string."
		}
	},
	{
		name: 'given error is called with non-string category, should throw an Error.',		
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.error({ processName: 'My process', category: -1 })
			},
			error: "The 'category' field must be a string."
		}
	},
	{
		name: 'given error is called with non-string message, should throw an Error.',		
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.error({ processName: 'My process', message: -1 })
			},
			error: "The 'message' field must be a string."
		}
	},
	{
		name: 'given info is called with non-string processName, should throw an Error.',		
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.info({ processName: -1 })
			},
			error: "The 'processName' field must be a string."
		}
	},
	{
		name: 'given info is called with non-string category, should throw an Error.',
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.info({ processName: 'My process', category: -1 })
			},
			error: "The 'category' field must be a string."
		}
	},
	{
		name: 'given info is called with non-string message, should throw an Error.',		
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.info({ processName: 'My process', message: -1 })
			},
			error: "The 'message' field must be a string."
		}
	},
	{
		name: 'given warning is called with non-string processName, should throw an Error.',
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.warning({ processName: -1 })
			},
			error: "The 'processName' field must be a string."
		}
	},
	{
		name: 'given warning is called with non-string category, should throw an Error.',		
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.warning({ processName: 'My process', category: -1 })
			},
			error: "The 'category' field must be a string."
		}
	},
	{
		name: 'given warning is called with non-string message, should throw an Error.',
		args: {
			query: async () => {
				const logger = new Logger({ dir: 'c:/logs', processName: 'My process', maxLogFileSizeInBytes: 10 });
				// @ts-ignore
				await logger.warning({ processName: 'My process', message: -1 })
			},
			error: "The 'message' field must be a string."
		}
	}
];

type TestArguments = {
	query: Function,
	result: any,
	error: string
}

testArray(tests, async ({ query, result, error }: TestArguments) => {
	let actual;
	try {
		actual = await query();
	}
	catch ({ message }) {
		strictEqual(message, error);
		return;
	}
	strictEqual(actual, result);
})