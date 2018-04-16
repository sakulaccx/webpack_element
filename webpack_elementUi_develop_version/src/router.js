import Login from './components/Login.vue'
import Layout from './components/Layout.vue'
import pages_routes from './components/pages/routes'
import member_routes from './components/member/routes'
import analysis_routes from './components/analysis/routes'
import account_routes from './components/account/routes'
import NotFoundPage from './components/404.vue'

const routes = [
    {
        path: 'pages',
        routes: pages_routes
    },
    {
        path: 'account',
        routes: account_routes
    },
    {
        path: 'analysis',
        routes: analysis_routes
    },
    {
        path: 'member',
        routes: member_routes
    },
    {
        path: '*',
        component: NotFoundPage
    }
];

function load_route(routes) {
    let result = [];
    for (let route of routes) {
        if (route.hasOwnProperty('routes') && Array.isArray(route.routes)) {
            for (let sub_route of load_route(route.routes)) {
                sub_route.path = route.path +  '/' + sub_route.path;
                result.push(sub_route)
            }
        } else {
            result.push(route)
        }
    }
    return result
}

export default [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        component: Layout,
        children: load_route(routes)
    }
]