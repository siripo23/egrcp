import riskData from '../mocks/riskData.json'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const fetchRisks = async () => { await delay(500); return riskData }
