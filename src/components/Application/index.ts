import { withInstall } from '@/utils'

import headerTop from './src/HeaderTop.vue'
import appProvider from './src/AppProvider.vue'

export const AppProvider = withInstall(appProvider)
export const HeaderTop = withInstall(headerTop)
