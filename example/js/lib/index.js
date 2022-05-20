const { Logger } = require('@wellers/logger');

const logger = new Logger('Custom Job', 'c:/logs');

logger.info({ message: 'Job started.' });
logger.warning({ message: 'Something not found.', category: 'Update' });
logger.error({ message: 'This failed!', error: Error('Something went wrong!') });
logger.info({ message: 'Job ended.' });