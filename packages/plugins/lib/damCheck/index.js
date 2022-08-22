'use strict';

import reducers from './reducers';
import routes from './routes';
import actions from './actions';
import { getNavItem } from './nav-item';

export default {
    key: 'damCheck',
    name: '巡视检查',
    reducers: reducers,
    routes: routes,
    actions: actions,
    getNavItem: getNavItem
};