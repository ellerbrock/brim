/* @flow */

import type {CHART_CLEAR, CHART_RECORDS, CHART_STATUS} from "./types"
import type {RecordData} from "../../types/records"
import type {SearchStatus} from "../../types/searches"
import {isString} from "../../lib/is"
import MergeHash from "../../models/MergeHash"
import UniqArray from "../../models/UniqArray"

export default {
  setStatus: (tabId: string, status: SearchStatus): CHART_STATUS => ({
    type: "CHART_STATUS",
    status,
    tabId
  }),
  appendRecords: (tabId: string, records: RecordData[]): CHART_RECORDS => ({
    type: "CHART_RECORDS",
    data: histogramFormat(records),
    tabId
  }),
  clear: (tabId: string): CHART_CLEAR => ({type: "CHART_CLEAR", tabId})
}

function histogramFormat(records) {
  let paths = new UniqArray()
  let table = new MergeHash()

  records.forEach((r) => {
    let [ts, path, count] = r.map((f) => f.value)

    if (isString(ts) && isString(path) && isString(count)) {
      let key = new Date(+ts * 1000).getTime()
      let value = {[path]: parseInt(count)}

      table.merge(key, value)
      paths.push(path)
    }
  })

  return {
    table: table.toJSON(),
    keys: paths.toArray()
  }
}
