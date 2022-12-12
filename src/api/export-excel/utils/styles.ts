export const defaultFont = {
  defaultFont: {
    size: 11,
    name: 'Calibri',
  }
}

export const headerCenterStyle = {
  font: { color: 'FFFFFF' },
  alignment: { wrapText: true, horizontal: 'center', shrinkToFit: false, vertical: 'center'},
  height: '100pt',
  width: '160pt',
  border: {
    left: { style: 'none' },
    right: { style: 'none' },
    top: { style: 'thin', color: '9bc2e6' },
    bottom: { style: 'thin', color: '9bc2e6' },
    outline: true
  },
  fill: { type: 'pattern', patternType: 'solid', bgColor: '9bc2e6', fgColor: '5b9bd5' },
  numberFormat: 'mm-yyyy',
  sheetFormat:{ 'baseColWidth': 20 }
}

export const headerLeftStyle = {
  font: {
    color: 'FFFFFF',
    bold: true
  },
  alignment: {
    wrapText: false,
    horizontal: 'left',
    shrinkToFit: false,
  },
  border: {
    left: { style: 'none' },
    right: { style: 'none' },
    top: { style: 'thin', color: '9bc2e6' },
    bottom: { style: 'thin', color: '9bc2e6' },
    outline: true
  },
  fill: {  type: 'pattern', patternType: 'solid', bgColor: '9bc2e6', fgColor: '5b9bd5' },
  size:{ width: 90 }
}

