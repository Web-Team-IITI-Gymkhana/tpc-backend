//20230609200000-add-initial-data.ts (seeder file name)
import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkInsert(
    'company',
    [
      {
        name: 'TPC',
        // Additional columns and values for the initial data
      },
      // Additional objects representing more data entries
    ],
    {},
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('company', null, {});
}
