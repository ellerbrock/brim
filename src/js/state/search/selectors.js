/* @flow */
import {createSelector} from "reselect"

import type {DateTuple} from "../../lib/TimeWindow"
import {type Finding, getCurrentFinding} from "../reducers/investigation"
import type {SpanArgs} from "./types"
import type {State} from "../types"
import brim, {type Span} from "../../brim"

function getSpan(state: State) {
  return state.search.span
}

function getSpanFocus(state: State) {
  return state.search.spanFocus
}

function getSpanArgs(state: State) {
  return state.search.spanArgs
}

const getComputedSpan = createSelector<State, void, Span, SpanArgs>(
  getSpanArgs,
  (args) => {
    return brim.span(args).toSpan()
  }
)

const getSpanAsDates = createSelector<State, void, DateTuple, Span>(
  getSpan,
  (span) => brim.span(span).toDateTuple()
)

const getSpanFocusAsDates = createSelector<State, void, ?DateTuple, ?Span>(
  getSpanFocus,
  (focus) => {
    if (focus) {
      let [from, to] = focus
      return [brim.time(from).toDate(), brim.time(to).toDate()]
    } else {
      return null
    }
  }
)

const getPrevSpanArgs = createSelector<State, void, ?SpanArgs, ?Finding>(
  getCurrentFinding,
  (finding) => {
    if (finding) {
      return finding.search.spanArgs
    } else {
      return null
    }
  }
)

export default {
  getSpan,
  getSpanAsDates,
  getSpanFocus,
  getSpanFocusAsDates,
  getSpanArgs,
  getPrevSpanArgs,
  getComputedSpan
}
