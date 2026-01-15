
import { getDbConnection, sql } from '../lib/db';
import { Vehicle } from '../types';

// Mock wrapper for serverless environment simulation
export const handleVehiclesRequest = async (method: string, query: any, body: any, companyId: string) => {
  const pool = await getDbConnection();

  if (!pool) {
    throw new Error('DB_CONNECTION_FAILED'); // Triggers frontend fallback
  }

  if (method === 'GET') {
    const { vin, search } = query;
    const request = pool.request();
    request.input('companyId', sql.VarChar, companyId);

    let q = `SELECT * FROM Vehicles WHERE companyId = @companyId`;

    if (vin) {
      request.input('vin', sql.VarChar, vin);
      q += ` AND vin = @vin`;
    } else if (search) {
      request.input('search', sql.VarChar, `%${search}%`);
      q += ` AND (vin LIKE @search OR plate LIKE @search OR model LIKE @search)`;
    }

    const result = await request.query(q);
    return result.recordset;
  }

  if (method === 'PUT') {
    // PDI Update example
    const { vin, pdiComment, preDeliveryConfirmed } = body;
    const request = pool.request();
    request.input('vin', sql.VarChar, vin);
    request.input('pdiComment', sql.VarChar, pdiComment);
    request.input('preDeliveryConfirmed', sql.Bit, preDeliveryConfirmed ? 1 : 0);
    request.input('companyId', sql.VarChar, companyId);

    await request.query(`
      UPDATE Vehicles 
      SET pdiComment = @pdiComment, 
          preDeliveryConfirmed = @preDeliveryConfirmed,
          preDeliveryDate = GETDATE()
      WHERE vin = @vin AND companyId = @companyId
    `);
    return { success: true };
  }
};
