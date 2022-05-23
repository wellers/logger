const { Logger } = require('@wellers/logger');

async function boot() {
	const logger = new Logger({ 
		dir: 'c:/logs', 
		processName: 'Custom Job', 
		maxLogfileSize: 10
	});

	await logger.info({ message: 'Job started.' });
	await logger.warning({ message: 'Something not found.', category: 'Update' });
	await logger.error({ message: 'This failed!', error: Error('Something went wrong!') });
	await logger.info({ message: 'Job ended.' });
}
boot();