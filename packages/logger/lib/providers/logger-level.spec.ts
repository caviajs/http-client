import { LOGGER_LEVEL, LoggerLevel, LoggerLevelProvider } from '../../index';

describe('LoggerLevelProvider', () => {
  it('should have the appropriate token', () => {
    expect(LoggerLevelProvider.provide).toEqual(LOGGER_LEVEL);
  });

  it('should have all levels enabled by default', () => {
    expect(LoggerLevelProvider.useValue).toEqual(LoggerLevel.ALL);
  });
});