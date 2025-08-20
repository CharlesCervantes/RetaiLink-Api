import mysql from 'mysql2/promise';

jest.mock('mysql2/promise');

const mockedMysql = mysql as jest.Mocked<typeof mysql>;

describe('Database Connection Tests', () => {
  let mockPool: any;
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      release: jest.fn(),
    };

    mockPool = {
      getConnection: jest.fn(),
    };

    mockedMysql.createPool.mockReturnValue(mockPool);
    
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('testConnection', () => {
    it('should successfully establish database connection', async () => {
      mockPool.getConnection.mockResolvedValue(mockConnection);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const { testConnection } = require('../config/database');
      await expect(testConnection()).resolves.toBeUndefined();

      expect(mockPool.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('Conexión a la base de datos establecida correctamente');

      consoleSpy.mockRestore();
    });

    it('should handle connection errors properly', async () => {
      const connectionError = new Error('Connection failed');
      mockPool.getConnection.mockRejectedValue(connectionError);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { testConnection } = require('../config/database');
      await expect(testConnection()).rejects.toThrow('Connection failed');

      expect(mockPool.getConnection).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al conectar a la base de datos:', connectionError);

      consoleErrorSpy.mockRestore();
    });

    it('should handle MySQL specific errors', async () => {
      const mysqlError = {
        code: 'ER_ACCESS_DENIED_ERROR',
        message: 'Access denied for user',
        errno: 1045,
        sqlState: '28000',
      };
      mockPool.getConnection.mockRejectedValue(mysqlError);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { testConnection } = require('../config/database');
      await expect(testConnection()).rejects.toMatchObject({
        code: 'ER_ACCESS_DENIED_ERROR',
        message: 'Access denied for user',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al conectar a la base de datos:', mysqlError);

      consoleErrorSpy.mockRestore();
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Connection timeout');
      timeoutError.name = 'TimeoutError';
      mockPool.getConnection.mockRejectedValue(timeoutError);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const { testConnection } = require('../config/database');
      await expect(testConnection()).rejects.toThrow('Connection timeout');

      expect(mockPool.getConnection).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al conectar a la base de datos:', timeoutError);

      consoleErrorSpy.mockRestore();
    });
  });
});