import { getQuery } from 'h3'
import { api } from '../../utils/api'
import { getDatabase } from '../../db/client'
import { filtersSchema } from '../../domain/validation'
import { dashboardSummary } from '../../domain/dashboard'
export default api(event => dashboardSummary(getDatabase(), filtersSchema.parse(getQuery(event))))
