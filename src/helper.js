import kinderData from './data/kindergartners_in_full_day_program.js'
import { ENETDOWN } from 'constants';
import { networkInterfaces } from 'os';

export default class DistrictRepository {
  constructor() {
    this.stats = kinderData.reduce((stats, stat) => {
      if (stat.Data === 'N/A') {
        stat.Data = 0
      }
      const statObj = { [stat.TimeFrame] : Number(parseFloat(stat.Data).toFixed(3)) }
        if (!stats[stat.Location]) {
          stats[stat.Location] = statObj
        } 
      stats[stat.Location] = { ...statObj, ...stats[stat.Location]}
      return stats
      }, {})
  }

  findByName = (search) => {
    let districtArray = {}
    if (!search) {
      return;
    }
    const statsKeys = Object.keys(this.stats);
    const districtData = statsKeys.reduce((districtData, stat) => {
      if (stat.toUpperCase().includes(search.toUpperCase())) {
         districtData = {
          [stat]: this.stats[stat]
        };
        Object.assign(districtArray, districtData)
      }
      return districtData;
    }, {});
      return districtArray;
  }

  findAverage = (district) => {
    const distObj = this.findByName(district)
    const statsVals = Object.values(distObj[district]);
    const totalVal = statsVals.reduce((sum, num) => {
      return sum += num
    }, 0)
    return Number(parseFloat(totalVal/statsVals.length).toFixed(3))
  }

  findAllMatches = (search) => {
    if(!search){
      return [Object.values(this.stats)]
    }
    return Object.keys(this.stats).filter(stat => stat.toUpperCase().includes(search.toUpperCase()));
  }
}
