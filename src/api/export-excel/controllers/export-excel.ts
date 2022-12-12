/**
 * A set of functions called "actions" for `export-excel`
 */

import xl from 'excel4node';
import utils from '../utils';
export default {
  exportBoardRegister: async (ctx, next) => {
    try {
      const date_initial =
        new Date(ctx.query.date_initial).getTime() > 0
          ? ctx.query.date_initial
          : '';
      const date_final =
        new Date(ctx.query.date_final).getTime() > 0
          ? ctx.query.date_final
          : '';
      const functionary_name = ctx.query.functionary_name;
      const cost_center_code = ctx.query.cost_center_code;
      const itens = utils.itensBoardRegister;

      const boardRegister = await utils.filtersBoardRegister(
        functionary_name,
        cost_center_code,
        date_initial,
        date_final,
      );
      const wb = new xl.Workbook(utils.defaultFont);

      const ws = wb.addWorksheet('RELATÓRIO');

      const headerCenter = wb.createStyle(utils.headerCenterStyle);

      const headerLeft = wb.createStyle(utils.headerLeftStyle);

      utils.createTitleBoardRegister(ws, headerCenter, headerLeft, itens);

      boardRegister.map((value, keys) => {
        const refuelling_status = value.refuelling_status ? 'Sim' : 'Não';
        const key = 6 + keys;
        ws.cell(key, 1).number(value.id);
        ws.cell(key, 2).number(Number(value.functionary_id.registration));
        ws.cell(key, 3).string(`${value.functionary_id.name}`);
        ws.cell(key, 4).string(`${value.cost_center_id.code}`);
        ws.cell(key, 5).date(new Date(value.createdAt)).style({numberFormat: 'DD/MM/YYYY'});
        ws.cell(key, 6).string(`${value.vehicle_id.code}`);
        ws.cell(key, 7).string(`${value.vehicle_id.plate}`);
        ws.cell(key, 8).number(Number(value.initial_km)).style({numberFormat: '#,##0; (#,##0); -'});
        ws.cell(key, 9).number(Number(value.final_km)).style({numberFormat: '#,##0; (#,##0); -'});
        ws.cell(key, 10).formula(`I${key} - H${key}`).style({numberFormat: '#,##0; (#,##0); -'});
        ws.cell(key, 11).string(`${value.origin}`);
        ws.cell(key, 12).string(`${value.destination}`);
        ws.cell(key, 13).string(`${refuelling_status}`);
        ws.cell(key, 14).number(Number(value.refuel_qty)).style({numberFormat: '#,##0; (#,##0); -'});
        ws.cell(key, 15).number(Number(value.refuel_unit_value)).style({numberFormat: 'R$#,##0.00; (R$#,##0.00); -'});
        ws.cell(key, 16).formula(`N${6 + keys} * O${6 + keys}`).style({numberFormat: 'R$#,##0.00; (R$#,##0.00); -'});
        if(key % 2 === 0){
          ws.cell(key, 1, key, 16).style({fill: { type: 'pattern', patternType: 'solid', bgColor: '9bc2e6', fgColor: 'ddebf7' }})
        }
      });

      ws.row(5).filter({
        firstRow: 1,
        firstColumn: 1,
        lastRow: 900,
        lastColumn: 16,
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

      var buffer = await wb.writeToBuffer();
      ctx.body = buffer;
    } catch (err) {
      ctx.body = err;
    }
  },
};
