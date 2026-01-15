
import { getDbConnection, sql } from '../lib/db';
import { Movement } from '../types';

export const handleMovementsRequest = async (method: string, body: any, companyId: string) => {
  const pool = await getDbConnection();
  if (!pool) throw new Error('DB_CONNECTION_FAILED');

  if (method === 'POST') {
    // Create Movement
    const m = body as Movement;
    const request = pool.request();
    
    request.input('id', sql.VarChar, m.id);
    request.input('date', sql.DateTime, new Date(m.date));
    request.input('originId', sql.VarChar, m.originId);
    request.input('destinationId', sql.VarChar, m.destinationId);
    request.input('transporter', sql.VarChar, m.transporter);
    request.input('driverName', sql.VarChar, m.driverName || '');
    request.input('vehicleVins', sql.NVarChar, JSON.stringify(m.vehicleVins));
    request.input('status', sql.VarChar, 'PENDING');
    request.input('companyId', sql.VarChar, companyId);
    request.input('observations', sql.VarChar, m.observations || '');

    // Transaction for atomic operation (Insert Movement + Update Vehicles)
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      await transaction.request()
        .input('id', sql.VarChar, m.id)
        .input('date', sql.DateTime, new Date(m.date))
        .input('originId', sql.VarChar, m.originId)
        .input('destinationId', sql.VarChar, m.destinationId)
        .input('transporter', sql.VarChar, m.transporter)
        .input('driverName', sql.VarChar, m.driverName || '')
        .input('vehicleVins', sql.NVarChar, JSON.stringify(m.vehicleVins))
        .input('status', sql.VarChar, 'PENDING')
        .input('companyId', sql.VarChar, companyId)
        .input('observations', sql.VarChar, m.observations || '')
        .query(`
          INSERT INTO Movements (id, date, originId, destinationId, transporter, driverName, vehicleVins, status, companyId, observations)
          VALUES (@id, @date, @originId, @destinationId, @transporter, @driverName, @vehicleVins, @status, @companyId, @observations)
        `);

      // Update vehicles status
      for (const vin of m.vehicleVins) {
        await transaction.request()
          .input('vin', sql.VarChar, vin)
          .input('reason', sql.VarChar, `REMITO_${m.id}`)
          .query(`UPDATE Vehicles SET status = 'IN_TRANSIT', isLocked = 1, lockReason = @reason WHERE vin = @vin`);
      }

      await transaction.commit();
      return { success: true, id: m.id };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  if (method === 'PUT') {
    // Cancel Movement
    const { ids, reason, username } = body;
    // Implementation for cancellation...
    return { success: true };
  }
};
