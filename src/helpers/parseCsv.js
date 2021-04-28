import Papa from 'papaparse'

async function parseCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => {
        return value.trim()
      },
      complete: (results) => {
        return resolve(results)
      },
      error: (error) => {
        return reject(error)
      },
    })
  })
}

async function downloadTableCsv(data) {
  var newData = data.map((e) => {
    var parsedModuleValues = ''
    return {
      name: e.name,
      id: e.sid,
      level: e.level,
      modules: (function () {
        for (const k in e.modules) {
          parsedModuleValues += k + ' ' + e.modules[k] + '%| '
        }
        return parsedModuleValues
      })(),
    }
  })
  var csv = Papa.unparse(newData)
  var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  var csvURL = null
  if (navigator.msSaveBlob) {
    csvURL = navigator.msSaveBlob(csvData, 'download.csv')
  } else {
    csvURL = window.URL.createObjectURL(csvData)
  }
  var tempLink = document.createElement('a')
  tempLink.href = csvURL
  tempLink.setAttribute('download', 'download.csv')
  tempLink.click()
}

export { parseCsv, downloadTableCsv }
