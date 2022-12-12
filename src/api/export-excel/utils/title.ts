export const createTitleBoardRegister = (ws, headerCenter, headerLeft, itens) => {
  ws.cell(2, 1, 2, 16, true).string(`RELATÓRIO DE BORDO`).style(headerCenter);
  ws.cell(3, 1, 3, 2, true).string('PROPRIETÁRIO:').style(headerLeft);
  ws.cell(3, 3, 3, 12, true).string(`Name`).style(headerCenter);
  ws.cell(3, 13, 3, 16, true).date(new Date()).style(headerCenter);
  ws.cell(4, 1, 4, 2, true).string('CÓD VEÍCULO:').style(headerLeft);
  ws.cell(4, 3, 4, 12, true).string('GN000').style(headerCenter);
  ws.cell(4, 13, 4, 16, true).style(headerLeft);

  itens.map((item, key) => {
    ws.cell(5, key + 1)
      .string(`${item}`)
      .style(headerCenter);
  });
  return ws;
};
