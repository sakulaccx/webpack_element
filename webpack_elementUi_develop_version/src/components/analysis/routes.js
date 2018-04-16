import FavoriteList from './FavoriteList.vue'
import FavoriteAnalysis from './FavoriteAnalysis.vue'
import ClickRate from './ClickRate.vue'
import Device from './Device.vue'
import GenderRate from './SexAnalysis.vue'
import Region from './Region.vue'
import Visit from './Visit.vue'
import Comein from './Comein.vue'
import ClickCTA from './ClickCTA.vue'

export default [
    {
        path: 'favoriteanalysis',
        component: FavoriteAnalysis
    },
    {
        path: 'clickrate',
        component: ClickRate
    },
    {
        path: 'device',
        component: Device
    },
    {
        path: 'gender',
        component: GenderRate
    },
    {
        path: 'region',
        component: Region
    },
    {
        path: 'visit',
        component: Visit
    },
    {
        path: 'comein',
        component: Comein
    },
    {
        path: 'clickcta',
        component: ClickCTA
    }
]
