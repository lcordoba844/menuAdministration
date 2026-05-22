import { Sequelize } from 'sequelize-typescript';

import { environment } from '@/config/environment';

export const sequelize = new Sequelize(environment.databaseUrl, {
  dialect: 'postgres',
  define: {
    underscored: true,
    timestamps: true,
  },
  models: [`${__dirname}/../models/*.model.ts`],
});
