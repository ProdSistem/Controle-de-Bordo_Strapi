/**
 * A set of functions called "actions" for `export-excel`
 */

import xl from 'excel4node';
import utils from '../utils';
export default {
  exportBoardRegister: async (ctx, next) => {
    try {
      const date_initial = ctx.query.date_initial;
      const date_final = ctx.query.date_final;
      const functionary_name = ctx.query.functionary_name;
      const cost_center_code = ctx.query.cost_center_code;
      const plateVehicle = ctx.query.plateVehicle;
      const itens = utils.itensBoardRegister;

      const boardRegister = await utils.filtersBoardRegister(
        functionary_name,
        cost_center_code,
        date_initial,
        date_final,
        plateVehicle,
      );
      const wb = new xl.Workbook(utils.defaultFont);

      const ws = wb.addWorksheet('RELATÓRIO');

      utils.createTitleBoardRegister(
        ws,
        itens,
        functionary_name,
        cost_center_code,
        date_initial,
        date_final,
        plateVehicle,
      );

      await boardRegister.map((value, keys) => {
        const refuelling_status = value.refuelling_status ? 'Sim' : 'Não';
        const key = 5 + keys;
        ws.cell(key, 1).number(value.id);
        ws.cell(key, 2).string(`${value.functionary_id?.registration}`);
        ws.cell(key, 3).string(`${value.functionary_id?.name}`);
        ws.cell(key, 4).string(`${value.cost_center_id?.code}`);
        ws.cell(key, 5)
          .date(new Date(value.createdAt))
          .style({ numberFormat: 'DD/MM/YYYY' });
        ws.cell(key, 6).string(`${value.vehicle_id?.code}`);
        ws.cell(key, 7).string(`${value.vehicle_id?.plate}`);
        ws.cell(key, 8)
          .number(Number(value.initial_km))
          .style({ numberFormat: '#,##0; (#,##0); -' });
        ws.cell(key, 9)
          .number(Number(value.final_km))
          .style({ numberFormat: '#,##0; (#,##0); -' });
        ws.cell(key, 10)
          .formula(`I${key} - H${key}`)
          .style({ numberFormat: '#,##0; (#,##0); -' });
        ws.cell(key, 11).string(`${value.origin}`);
        ws.cell(key, 12).string(`${value.destination}`);
        ws.cell(key, 13)
          .date(new Date(value.date_register))
          .style({ numberFormat: 'DD/MM/YYYY' });
        ws.cell(key, 14).string(`${refuelling_status}`);
        ws.cell(key, 15)
          .number(Number(value.refuel_qty))
          .style({ numberFormat: '#,##0; (#,##0); -' });
        ws.cell(key, 16)
          .number(Number(value.refuel_unit_value))
          .style({ numberFormat: 'R$#,##0.00; (R$#,##0.00); -' });
        ws.cell(key, 17)
          .formula(`N${6 + keys} * O${6 + keys}`)
          .style({ numberFormat: 'R$#,##0.00; (R$#,##0.00); -' });
        if (key % 2 === 0) {
          ws.cell(key, 1, key, 17).style({
            fill: {
              type: 'pattern',
              patternType: 'solid',
              bgColor: '9bc2e6',
              fgColor: 'ddebf7',
            },
          });
        }
      });

      ws.row(4).filter({
        firstRow: 1,
        firstColumn: 1,
        lastRow: 900,
        lastColumn: 17,
      });

      ws.column(1).setWidth(11);
      ws.column(2).setWidth(13);
      ws.column(3).setWidth(50);
      ws.column(4).setWidth(14);
      ws.column(5).setWidth(14);
      ws.column(6).setWidth(16);
      ws.column(7).setWidth(12);
      ws.column(8).setWidth(14);
      ws.column(9).setWidth(14);
      ws.column(10).setWidth(15);
      ws.column(11).setWidth(15);
      ws.column(12).setWidth(15);
      ws.column(13).setWidth(19);
      ws.column(14).setWidth(16);
      ws.column(15).setWidth(12);
      ws.column(16).setWidth(12);
      ws.column(17).setWidth(12);

      const buffer = await wb.writeToBuffer();
      ctx.body = buffer;
    } catch (err) {
      ctx.body = err;
    }
  },

  exportFunctionary: async (ctx, next) => {
    const registration = ctx.query.registration;
    const name = ctx.query.name;
    const active = ctx.query.active;
    const itens = utils.itensFunctionary;

    try {
      const wb = new xl.Workbook(utils.defaultFont);

      const ws = wb.addWorksheet('RELATÓRIO');
      const functionary = await utils.filtersFunctionary(
        registration,
        name,
        active,
      );

      utils.createTitleFunctionary(ws, itens, registration, name, active);

      functionary.map((value, keys) => {
        const status = value.status ? 'Ativo' : 'Desativado';
        const function_id = value.function_id ? value.function_id.name : '';
        const cnh = value.cnh ? value.cnh : '';
        const key = 6 + keys;

        ws.cell(key, 1).string(`${value.registration}`);
        ws.cell(key, 2).string(`${value.name}`);
        ws.cell(key, 3).string(`${value.cpf}`);
        ws.cell(key, 4).string(`${value.email}`);
        ws.cell(key, 5)
          .date(new Date(value.admission_date))
          .style({ numberFormat: 'DD/MM/YYYY' });
        ws.cell(key, 6).string(`${function_id}`);
        ws.cell(key, 7).string(`${value.phone_number}`);
        ws.cell(key, 8).string(`${cnh}`);
        ws.cell(key, 9).string(`${value.category_cnh}`);
        ws.cell(key, 10)
          .date(new Date(value.expiration_date_cnh))
          .style({ numberFormat: 'DD/MM/YYYY' });
        ws.cell(key, 11).string(`${status}`);
        ws.cell(key, 12).string(`${value.street}`);
        ws.cell(key, 13).string(`${value.number}`);
        ws.cell(key, 14).string(`${value.district}`);
        ws.cell(key, 15).string(`${value.city}`);
        ws.cell(key, 16).string(`${value.state}`);
        ws.cell(key, 17).string(`${value.zip_code}`);
        ws.cell(key, 18).string(`${value.complement}`);

        if (key % 2 === 0) {
          ws.cell(key, 1, key, 18).style({
            fill: {
              type: 'pattern',
              patternType: 'solid',
              bgColor: '9bc2e6',
              fgColor: 'ddebf7',
            },
          });
        }
      });

      ws.row(5).filter({
        firstRow: 1,
        firstColumn: 1,
        lastRow: 900,
        lastColumn: 18,
      });

      ws.column(1).setWidth(9);
      ws.column(2).setWidth(35);
      ws.column(3).setWidth(13);
      ws.column(4).setWidth(38);
      ws.column(5).setWidth(11);
      ws.column(6).setWidth(13);
      ws.column(7).setWidth(13);
      ws.column(8).setWidth(11);
      ws.column(9).setWidth(11);
      ws.column(10).setWidth(11);
      ws.column(11).setWidth(11);
      ws.column(12).setWidth(22);
      ws.column(13).setWidth(8);
      ws.column(14).setWidth(11);
      ws.column(15).setWidth(25);
      ws.column(16).setWidth(15);
      ws.column(17).setWidth(11);
      ws.column(18).setWidth(40);

      const buffer = await wb.writeToBuffer();
      ctx.body = buffer;
    } catch (err) {
      ctx.body = err;
    }
  },

  exportVehicle: async (ctx, next) => {
    const code = ctx.query.code;
    const plate = ctx.query.plate;
    const brand = ctx.query.brand;
    const vehicleName = ctx.query.vehicleName;
    const proprietaryType = ctx.query.proprietaryType;
    const itens = utils.itensVehicles;

    try {
      const wb = new xl.Workbook(utils.defaultFont);

      const ws = wb.addWorksheet('RELATÓRIO');

      utils.createTitleVehicle(
        ws,
        itens,
        code,
        plate,
        brand,
        vehicleName,
        proprietaryType,
      );

      const vehicles = await utils.filtersVehicles(
        code,
        plate,
        brand,
        vehicleName,
        proprietaryType,
      );

      vehicles.map((value, keys) => {
        let proprietaryType;

        if (value.proprietary_Type === 1 || value.proprietary_Type === '1') {
          proprietaryType = 'Próprio';
        } else if (
          value.proprietary_Type === 2 ||
          value.proprietary_Type === '2'
        ) {
          proprietaryType = 'Terceiros';
        } else {
          proprietaryType = '';
        }

        const status = value.status ? 'Ativo' : 'Desativado';
        const created_for = value.created_for?.name
          ? value.created_for.name
          : '';
        const updated_for = value.updated_for?.name
          ? value.updated_for.name
          : '';
        const key = 5 + keys;

        ws.cell(key, 1).string(`${value.code}`);
        ws.cell(key, 2).string(`${value.equipment_name}`);
        ws.cell(key, 3).string(`${value.patrimony_code}`);
        ws.cell(key, 4).string(`${value.brand}`);
        ws.cell(key, 5).string(`${value.model}`);
        ws.cell(key, 6).string(`${value.potency}`);
        ws.cell(key, 7).string(`${value.capacity}`);
        ws.cell(key, 8).string(`${value.year}`);
        ws.cell(key, 9).string(`${value.gearshift_type}`);
        ws.cell(key, 10).string(`${value.fuel}`);
        ws.cell(key, 11).string(`${value.color}`);
        ws.cell(key, 12).string(`${value.plate}`);
        ws.cell(key, 13).string(`${proprietaryType}`);
        ws.cell(key, 14).string(`${value.owner_name}`);
        ws.cell(key, 15).string(`${created_for}`);
        ws.cell(key, 16)
          .date(new Date(value.createdAt))
          .style({ numberFormat: 'DD/MM/YYYY' });
        ws.cell(key, 17).string(`${updated_for}`);
        ws.cell(key, 18)
          .date(new Date(value.updatedAt))
          .style({ numberFormat: 'DD/MM/YYYY' });
        ws.cell(key, 19).string(`${status}`);

        if (key % 2 === 0) {
          ws.cell(key, 1, key, 19).style({
            fill: {
              type: 'pattern',
              patternType: 'solid',
              bgColor: '9bc2e6',
              fgColor: 'ddebf7',
            },
          });
        }
      });

      ws.row(4).filter({
        firstRow: 1,
        firstColumn: 1,
        lastRow: 900,
        lastColumn: 19,
      });

      ws.column(1).setWidth(9);
      ws.column(2).setWidth(18);
      ws.column(3).setWidth(14);
      ws.column(4).setWidth(19);
      ws.column(5).setWidth(40);
      ws.column(6).setWidth(10);
      ws.column(7).setWidth(12);
      ws.column(8).setWidth(10);
      ws.column(9).setWidth(12);
      ws.column(10).setWidth(14);
      ws.column(11).setWidth(10);
      ws.column(12).setWidth(10);
      ws.column(13).setWidth(13);
      ws.column(14).setWidth(31);
      ws.column(15).setWidth(31);
      ws.column(16).setWidth(11);
      ws.column(17).setWidth(31);
      ws.column(18).setWidth(11);
      ws.column(18).setWidth(8);

      const buffer = await wb.writeToBuffer();
      ctx.body = buffer;
    } catch (err) {
      ctx.body = err;
    }
  },
};
