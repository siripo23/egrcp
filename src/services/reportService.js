import reportsData from '../mocks/reports.json'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const fetchReports = async () => { await delay(500); return reportsData }
