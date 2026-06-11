import fs from 'fs';
import logger from '../util/logger';

export const parseJSON = <T = unknown>(filePath: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    let rawData = '';

    const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });

    readStream.on('data', (chunk: string) => {
      rawData += chunk;
    });

    readStream.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData) as T;
        resolve(parsedData);
      } catch (error) {
        logger.error("Error while parsing JSON file %s, %o", filePath, error);
        reject(error);
      }
    });

    readStream.on('error', (error) => {
      logger.error("Error while reading the stream of file %s, %o", filePath, error);
      reject(error);
    });
  });
};
