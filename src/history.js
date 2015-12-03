import {createHashHistory, useQueries} from "history"

export default useQueries(createHashHistory)({
  queryKey: false
});